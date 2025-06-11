<script setup lang="ts">
import { LinkSchema, nanoid } from '@@/schemas/link'
import { toTypedSchema } from '@vee-validate/zod'
import { Shuffle, Sparkles } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import LinkPreview from './LinkPreview.vue'

interface SelectOption {
  value: string
  label: string
}

const props = defineProps({
  link: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:link'])

const { t } = useI18n()
const link = ref(props.link)
const dialogOpen = ref(false)
const autoFormRef = ref()

// Scroll indicator state
const scrollContainer = ref<HTMLElement>()
const showTopGradient = ref(false)
const showBottomGradient = ref(false)

const isEdit = !!props.link.id

// UTM options configuration
const utmSourceOptions: SelectOption[] = [
  { value: 'qr-code', label: 'QR Code' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'google', label: 'Google Search' },
  { value: 'bing', label: 'Bing Search' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'email', label: 'Email' },
]

const utmMediumOptions: SelectOption[] = [
  { value: 'flyer', label: 'Flyer' },
  { value: 'poster', label: 'Poster' },
  { value: 'banner', label: 'Banner' },
  { value: 'e-guide', label: 'E-Guide' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'website', label: 'Website' },
]

const EditLinkSchema = LinkSchema.pick({
  name: true,
  url: true,
  slug: true,
  utm_source: true,
  utm_medium: true,
  utm_campaign: true,
  utm_id: true,
}).extend({
  optional: LinkSchema.omit({
    id: true,
    name: true,
    url: true,
    slug: true,
    utm_source: true,
    utm_medium: true,
    utm_campaign: true,
    utm_id: true,
    createdAt: true,
    updatedAt: true,
    title: true,
    description: true,
    image: true,
    qr_style_options: true,
  }).extend({
    expiration: z.coerce.date().optional(),
  }).optional(),
})

const fieldConfig = computed(() => ({
  name: {
    label: t('links.name'),
    description: t('links.name_description'),
    inputProps: {
      placeholder: t('links.name_placeholder'),
    },
  },
  slug: {
    inputProps: {
      disabled: isEdit,
    },
  },
  utm_source: {
    label: 'UTM Source',
    description: 'Where user is coming from',
  },
  utm_medium: {
    label: 'UTM Medium',
    description: 'The medium of the source',
  },
  utm_campaign: {
    label: 'UTM Campaign',
    description: 'A promotion or strategic campaign e.g. Excelencia-Live-25, Kindy-Open-Day, Principals-Tour',
    options: ['Excelencia-Live', 'Kindy-Open-Day', 'Principals-Tour'],
  },
  utm_id: {
    label: 'UTM ID',
    description: 'Specific instance of a campaign (usually just copy-paste the campaign name)',
    options: ['Excelencia-Live-07-25', 'Kindy-Open-Day-11-24', 'Principals-Tour-01-25'],
  },
  optional: {
    comment: {
      component: 'textarea',
    },
  },
} as any))

// const dependencies = [
//   {
//     sourceField: 'slug',
//     type: DependencyType.DISABLES,
//     targetField: 'slug',
//     when: () => isEdit,
//   },
// ]
// Remove dependencies to avoid TypeScript issues for now

const form = useForm({
  validationSchema: toTypedSchema(EditLinkSchema),
  initialValues: {
    name: link.value.name,
    slug: link.value.slug,
    url: link.value.url,
    utm_source: link.value.utm_source || 'QR-Code',
    utm_medium: link.value.utm_medium,
    utm_campaign: link.value.utm_campaign,
    utm_id: link.value.utm_id,
    optional: {
      comment: link.value.comment,
    },
  },
  validateOnMount: isEdit,
  keepValuesOnUnmount: isEdit,
})

function randomSlug() {
  form.setFieldValue('slug', nanoid()())
}

const aiSlugPending = ref(false)
async function aiSlug() {
  if (!form.values.url)
    return

  aiSlugPending.value = true
  try {
    const { slug } = await useAPI('/api/link/ai', {
      query: {
        url: form.values.url,
      },
    }) as { slug: string }
    form.setFieldValue('slug', slug)
  }
  catch (error) {
    console.log(error)
  }
  aiSlugPending.value = false
}

onMounted(() => {
  if (link.value.expiration) {
    form.setFieldValue('optional.expiration', unix2date(link.value.expiration).toDate(getTimeZone()))
  }
  // Initialize scroll indicators
  nextTick(() => {
    updateScrollIndicators()
  })
})

// Scroll indicator functionality
function updateScrollIndicators() {
  if (!scrollContainer.value)
    return

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value

  // Show top gradient if scrolled down
  showTopGradient.value = scrollTop > 0

  // Show bottom gradient if not at bottom
  showBottomGradient.value = scrollTop < scrollHeight - clientHeight - 1
}

// Watch for content changes that might affect scroll
watch([() => form.values, dialogOpen], () => {
  nextTick(() => {
    updateScrollIndicators()
  })
}, { deep: true })

async function onSubmit(formData: any) {
  const link = {
    name: formData.name,
    url: formData.url,
    slug: formData.slug,
    utm_source: formData.utm_source,
    utm_medium: formData.utm_medium,
    utm_campaign: formData.utm_campaign,
    utm_id: formData.utm_id,
    ...(formData.optional || []),
    expiration: formData.optional?.expiration ? date2unix(formData.optional?.expiration, 'end') : undefined,
    // Preserve existing QR style options when editing
    ...(isEdit && props.link.qr_style_options && { qr_style_options: props.link.qr_style_options }),
  }
  const { link: newLink } = await useAPI(isEdit ? '/api/link/edit' : '/api/link/create', {
    method: isEdit ? 'PUT' : 'POST',
    body: link,
  }) as { link: any }
  dialogOpen.value = false
  emit('update:link', newLink, isEdit ? 'edit' : 'create')
  if (isEdit) {
    toast(t('links.update_success'))
  }
  else {
    toast(t('links.create_success'))
  }
}

// Function to trigger form submission from external button
function handleExternalSubmit() {
  // Trigger form validation and submission
  form.handleSubmit(onSubmit)()
}

const { previewMode } = useRuntimeConfig().public

// Composable for UTM parameter building
const { buildUtmParams } = useUtmBuilder()

// Computed properties for link preview
const baseUrl = computed(() => {
  if (import.meta.server)
    return ''
  return window.location.origin
})

const utmParams = computed(() => {
  return buildUtmParams({
    utm_source: form.values.utm_source,
    utm_medium: form.values.utm_medium,
    utm_campaign: form.values.utm_campaign,
    utm_id: form.values.utm_id,
  })
})
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <slot>
        <Button
          class="ml-2"
          variant="outline"
          @click="randomSlug"
        >
          {{ $t('links.create') }}
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>{{ link.id ? $t('links.edit') : $t('links.create') }}</DialogTitle>
        <DialogDescription>
          {{ link.id ? $t('links.edit_description') : $t('links.create_description') }}
        </DialogDescription>
        <!-- Link Preview Section -->
        <LinkPreview
          :slug="form.values.slug"
          :url="form.values.url"
          :utm-params="utmParams"
          :base-url="baseUrl"
          class="mt-2 mb-2"
        />
      </DialogHeader>

      <!-- Scrollable content area with gradient indicators -->
      <div class="relative">
        <!-- Top gradient indicator -->
        <div
          v-if="showTopGradient"
          class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background to-transparent pointer-events-none z-10"
        />

        <!-- Scrollable content -->
        <div
          ref="scrollContainer"
          class="overflow-y-auto px-1 space-y-4 max-h-full"
          @scroll="updateScrollIndicators"
        >
          <p
            v-if="previewMode"
            class="text-sm text-muted-foreground px-1"
          >
            {{ $t('links.preview_mode_tip') }}
          </p>

          <!-- Form Content -->
          <div class="px-1">
            <AutoForm
              ref="autoFormRef"
              class="space-y-2"
              :schema="EditLinkSchema"
              :form="form"
              :field-config="fieldConfig"
              @submit="onSubmit"
            >
              <template #slug="slotProps">
                <div
                  v-if="!isEdit"
                  class="relative"
                >
                  <div class="flex absolute right-0 top-1 space-x-3">
                    <Shuffle
                      class="w-4 h-4 cursor-pointer"
                      @click="randomSlug"
                    />
                    <Sparkles
                      class="w-4 h-4 cursor-pointer"
                      :class="{ 'animate-bounce': aiSlugPending }"
                      @click="aiSlug"
                    />
                  </div>
                  <AutoFormField
                    v-bind="slotProps"
                  />
                </div>
              </template>

              <!-- UTM Source custom slot -->
              <template #utm_source="slotProps">
                <FormField v-slot="fieldSlotProps" :name="slotProps.fieldName">
                  <FormItem>
                    <FormLabel>{{ slotProps.config?.label || 'UTM Source' }}</FormLabel>
                    <FormDescription v-if="slotProps.config?.description">
                      {{ slotProps.config.description }}
                    </FormDescription>
                    <Select
                      :model-value="fieldSlotProps.componentField.modelValue"
                      @update:model-value="fieldSlotProps.componentField['onUpdate:modelValue']"
                    >
                      <SelectTrigger>
                        <SelectValue :placeholder="$t('links.utm_source_placeholder')" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="option in utmSourceOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </template>

              <!-- UTM Medium custom slot -->
              <template #utm_medium="slotProps">
                <FormField v-slot="fieldSlotProps" :name="slotProps.fieldName">
                  <FormItem>
                    <FormLabel>{{ slotProps.config?.label || 'UTM Medium' }}</FormLabel>
                    <FormDescription v-if="slotProps.config?.description">
                      {{ slotProps.config.description }}
                    </FormDescription>
                    <Select
                      :model-value="fieldSlotProps.componentField.modelValue"
                      @update:model-value="fieldSlotProps.componentField['onUpdate:modelValue']"
                    >
                      <SelectTrigger>
                        <SelectValue :placeholder="$t('links.utm_medium_placeholder')" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="option in utmMediumOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </template>
            </AutoForm>
          </div>
        </div>

        <!-- Bottom gradient indicator -->
        <div
          v-if="showBottomGradient"
          class="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-background to-transparent pointer-events-none z-10"
        />
      </div>

      <!-- Footer outside scrollable area -->
      <DialogFooter>
        <DialogClose as-child>
          <Button
            type="button"
            variant="secondary"
            class="mt-2 sm:mt-0"
          >
            {{ $t('common.close') }}
          </Button>
        </DialogClose>
        <Button
          type="button"
          @click="handleExternalSubmit"
        >
          {{ $t('common.save') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
