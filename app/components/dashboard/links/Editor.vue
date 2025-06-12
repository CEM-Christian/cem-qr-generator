<script setup lang="ts">
import { LinkSchema, nanoid } from '@@/schemas/link'
import { toTypedSchema } from '@vee-validate/zod'
import { BarChart3, Copy, Shuffle, Sparkles } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

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
const topGradientOpacity = ref(0)
const bottomGradientOpacity = ref(0)

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

// Editor-specific schema with nested UTM structure for form rendering
const EditorFormSchema = z.object({
  name: LinkSchema.shape.name,
  url: LinkSchema.shape.url,
  slug: LinkSchema.shape.slug,
  utm: z.object({
    source: LinkSchema.shape.utm_source,
    medium: LinkSchema.shape.utm_medium,
    campaign: LinkSchema.shape.utm_campaign,
    id: LinkSchema.shape.utm_id,
  }).optional(),
  optional: z.object({
    comment: LinkSchema.shape.comment,
    expiration: z.coerce.date().optional(),
  }).optional(),
})

// Data mapping functions
function flatToNested(linkData: any) {
  return {
    name: linkData.name,
    url: linkData.url,
    slug: linkData.slug,
    utm: {
      source: linkData.utm_source,
      medium: linkData.utm_medium,
      campaign: linkData.utm_campaign,
      id: linkData.utm_id,
    },
    optional: {
      comment: linkData.comment,
      expiration: linkData.expiration,
    },
  }
}

function nestedToFlat(formData: any) {
  return {
    name: formData.name,
    url: formData.url,
    slug: formData.slug,
    utm_source: formData.utm?.source,
    utm_medium: formData.utm?.medium,
    utm_campaign: formData.utm?.campaign,
    utm_id: formData.utm?.id,
    comment: formData.optional?.comment,
    expiration: formData.optional?.expiration,
  }
}

const fieldConfig = computed(() => ({
  name: {
    label: t('links.form.name.label'),
    inputProps: {
      placeholder: t('links.form.name.placeholder'),
    },
  },
  url: {
    label: t('links.form.destination_url.label'),
    inputProps: {
      placeholder: t('links.form.destination_url.placeholder'),
    },
  },
  slug: {
    label: t('links.form.slug.label'),
    description: t('links.form.slug.description'),
    inputProps: {
      disabled: isEdit,
      placeholder: t('links.form.slug.placeholder'),
    },
  },
  utm: {
    source: {
      label: t('links.form.utm.source.label'),
      // description: t('links.form.utm.source.description'),
    },
    medium: {
      label: t('links.form.utm.medium.label'),
      // description: t('links.form.utm.medium.description'),
    },
    campaign: {
      label: t('links.form.utm.campaign.label'),
      description: t('links.form.utm.campaign.description'),
      options: ['Excelencia-Live', 'Kindy-Open-Day', 'Principals-Tour'],
    },
    id: {
      label: t('links.form.utm.id.label'),
      description: t('links.form.utm.id.description'),
      options: ['Excelencia-Live-07-25', 'Kindy-Open-Day-11-24', 'Principals-Tour-01-25'],
    },
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
  validationSchema: toTypedSchema(EditorFormSchema),
  initialValues: flatToNested({
    name: link.value.name,
    slug: link.value.slug,
    url: link.value.url,
    utm_source: link.value.utm_source || 'qr-code',
    utm_medium: link.value.utm_medium,
    utm_campaign: link.value.utm_campaign,
    utm_id: link.value.utm_id,
    comment: link.value.comment,
  }),
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
  const maxScrollTop = scrollHeight - clientHeight

  // Height of the gradient indicators in pixels
  const indicatorHeight = 16 // h-4 = 16px

  // Calculate top gradient opacity based on scroll distance
  if (scrollTop > 0) {
    showTopGradient.value = true
    // Fade in over the indicator height distance
    topGradientOpacity.value = Math.min(scrollTop / (indicatorHeight * 2), 1)
  }
  else {
    showTopGradient.value = false
    topGradientOpacity.value = 0
  }

  // Calculate bottom gradient opacity based on remaining scroll distance
  const remainingScroll = maxScrollTop - scrollTop
  if (remainingScroll > 0) {
    showBottomGradient.value = true
    // Fade in over the indicator height distance
    bottomGradientOpacity.value = Math.min(remainingScroll / indicatorHeight, 1)
  }
  else {
    showBottomGradient.value = false
    bottomGradientOpacity.value = 0
  }
}

// Watch for content changes that might affect scroll
watch([() => form.values, dialogOpen], () => {
  nextTick(() => {
    updateScrollIndicators()
  })
}, { deep: true })

async function onSubmit(formData: any) {
  // Convert nested form data back to flat structure for API
  const flatData = nestedToFlat(formData)

  const link = {
    name: flatData.name,
    url: flatData.url,
    slug: flatData.slug,
    utm_source: flatData.utm_source,
    utm_medium: flatData.utm_medium,
    utm_campaign: flatData.utm_campaign,
    utm_id: flatData.utm_id,
    comment: flatData.comment,
    expiration: flatData.expiration ? date2unix(flatData.expiration, 'end') : undefined,
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
    toast(t('links.messages.update_success'))
  }
  else {
    toast(t('links.messages.create_success'))
  }
}

// Function to trigger form submission from external button
function handleExternalSubmit() {
  // Trigger form validation and submission
  form.handleSubmit(onSubmit)()
}

const { previewMode } = useRuntimeConfig().public

// Computed properties for link preview
const baseUrl = computed(() => {
  if (import.meta.server)
    return ''
  return window.location.origin
})

// Computed properties for inline preview
const shortUrl = computed(() => {
  if (!form.values.slug || !baseUrl.value)
    return ''
  return `${baseUrl.value}/${form.values.slug}`
})

async function copyShortUrl() {
  if (!shortUrl.value)
    return

  try {
    await navigator.clipboard.writeText(shortUrl.value)
    toast.success(t('common.copied_to_clipboard'))
  }
  catch (error) {
    console.error('Failed to copy to clipboard:', error)
    toast.error(t('common.copy_failed'))
  }
}

// Computed styles for gradient indicators with dynamic opacity
const topGradientStyle = computed(() => ({
  opacity: topGradientOpacity.value,
}))

const bottomGradientStyle = computed(() => ({
  opacity: bottomGradientOpacity.value,
}))
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <slot>
        <Button
          class="sm:ml-2"
          variant="outline"
          @click="randomSlug"
        >
          {{ $t('links.actions.create') }}
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-2xl grid grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>{{ link.id ? $t('links.actions.edit') : $t('links.actions.create') }}</DialogTitle>
        <DialogDescription>
          {{ link.id ? $t('links.messages.edit_description') : $t('links.messages.create_description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Scrollable content area with shadow indicators -->
      <div class="relative">
        <!-- Top gradient indicator -->
        <div
          v-if="showTopGradient"
          class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/20 via-black/10 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent pointer-events-none z-10"
          :style="topGradientStyle"
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
              :schema="EditorFormSchema"
              :form="form"
              :field-config="fieldConfig"
              @submit="onSubmit"
            >
              <template #slug="slotProps">
                <FormField v-slot="fieldSlotProps" :name="slotProps.fieldName">
                  <FormItem>
                    <FormLabel>{{ slotProps.config?.label || $t('links.slug') }}</FormLabel>
                    <div class="relative">
                      <div
                        v-if="!isEdit"
                        class="flex absolute right-3 top-3 space-x-3 z-10"
                      >
                        <Shuffle
                          class="w-4 h-4 cursor-pointer"
                          :title="$t('links.generate_random_slug')"
                          @click="randomSlug"
                        />
                        <Sparkles
                          class="w-4 h-4 cursor-pointer"
                          :class="{ 'animate-bounce': aiSlugPending }"
                          :title="$t('links.generate_ai_slug')"
                          @click="aiSlug"
                        />
                      </div>
                      <FormControl>
                        <Input
                          v-bind="fieldSlotProps.componentField"
                          :placeholder="slotProps.config?.inputProps?.placeholder || $t('links.slug_placeholder')"
                          :disabled="slotProps.config?.inputProps?.disabled || false"
                        />
                      </FormControl>
                    </div>

                    <!-- Short URL Preview in Description -->
                    <FormDescription v-if="shortUrl" class="flex items-center text-xs gap-2">
                      <span class="pl-1 break-all">{{ shortUrl }}</span>
                      <div class="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          class="h-6 w-6 p-0"
                          :title="$t('common.copy')"
                          @click="copyShortUrl"
                        >
                          <Copy class="h-3 w-3" />
                        </Button>
                      </div>
                    </FormDescription>
                    <FormDescription v-else>
                      {{ slotProps.config?.description || $t('links.slug_description') }}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </template>

              <!-- Custom UTM slot with styled container -->
              <template #utm>
                <div class="bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-md rounded-lg p-4 lg:p-6">
                  <div class="flex items-center mb-4">
                    <BarChart3 class="w-5 h-5 mr-2" />
                    <h3 class="text-lg font-semibold">
                      {{ $t('links.form.utm.section_title') }}
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- UTM Source -->
                    <FormField v-slot="sourceSlotProps" name="utm.source">
                      <FormItem>
                        <FormLabel>{{ fieldConfig.utm.source.label }}</FormLabel>
                        <FormDescription v-if="fieldConfig.utm.source.description">
                          {{ fieldConfig.utm.source.description }}
                        </FormDescription>
                        <FormControl>
                          <Select
                            :model-value="sourceSlotProps.componentField.modelValue"
                            @update:model-value="sourceSlotProps.componentField['onUpdate:modelValue']"
                          >
                            <SelectTrigger>
                              <SelectValue :placeholder="$t('links.form.utm.source.placeholder')" />
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <!-- UTM Medium -->
                    <FormField v-slot="mediumSlotProps" name="utm.medium">
                      <FormItem>
                        <FormLabel>{{ fieldConfig.utm.medium.label }}</FormLabel>
                        <FormDescription v-if="fieldConfig.utm.medium.description">
                          {{ fieldConfig.utm.medium.description }}
                        </FormDescription>
                        <FormControl>
                          <Select
                            :model-value="mediumSlotProps.componentField.modelValue"
                            @update:model-value="mediumSlotProps.componentField['onUpdate:modelValue']"
                          >
                            <SelectTrigger>
                              <SelectValue :placeholder="$t('links.form.utm.medium.placeholder')" />
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <!-- UTM Campaign -->
                    <FormField v-slot="campaignSlotProps" name="utm.campaign">
                      <FormItem>
                        <FormLabel>{{ fieldConfig.utm.campaign.label }}</FormLabel>
                        <FormControl>
                          <Input
                            v-bind="campaignSlotProps.componentField"
                            placeholder="Enter campaign name"
                          />
                        </FormControl>
                        <FormDescription v-if="fieldConfig.utm.campaign.description" class="pl-1">
                          {{ fieldConfig.utm.campaign.description }}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <!-- UTM ID -->
                    <FormField v-slot="idSlotProps" name="utm.id">
                      <FormItem>
                        <FormLabel>{{ fieldConfig.utm.id.label }}</FormLabel>
                        <FormControl>
                          <Input
                            v-bind="idSlotProps.componentField"
                            placeholder="Enter campaign ID"
                          />
                        </FormControl>
                        <FormDescription v-if="fieldConfig.utm.id.description" class="pl-1">
                          {{ fieldConfig.utm.id.description }}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                </div>
              </template>
            </AutoForm>
          </div>
        </div>

        <!-- Bottom gradient indicator -->
        <div
          v-if="showBottomGradient"
          class="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/20 via-black/10 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent pointer-events-none z-10"
          :style="bottomGradientStyle"
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
