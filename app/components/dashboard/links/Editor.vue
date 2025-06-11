<script setup lang="ts">
import { LinkSchema, nanoid } from '@@/schemas/link'
import { toTypedSchema } from '@vee-validate/zod'
import { Shuffle, Sparkles } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import CustomSelect from '@/components/ui/CustomSelect.vue'

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

const isEdit = !!props.link.id

// UTM options configuration
const utmSourceOptions: SelectOption[] = [
  { value: 'QR-Code', label: 'QR Code' },
  { value: 'PDF', label: 'PDF Document' },
  { value: 'Google', label: 'Google Search' },
  { value: 'website', label: 'Website' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Instagram', label: 'Instagram' },
]

const utmMediumOptions: SelectOption[] = [
  { value: 'poster', label: 'Poster' },
  { value: 'flyer', label: 'Flyer' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'e-guide', label: 'E-Guide' },
  { value: 'referral', label: 'Referral Link' },
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
  utm_medium: {
    label: 'UTM Medium',
    description: 'The medium the user arrived from e.g. poster, flyer, email, social, e-guide, referral.',
  },
  utm_source: {
    label: 'UTM Source',
    description: 'Where traffic is coming from e.g. Facebook, Instagram, Google, QR-Code, PDF, website.',
  },
  utm_campaign: {
    label: 'UTM Campaign',
    description: 'A product promotion or strategic campaign e.g. Excelencia-Live-25, Kindy-Open-Day, Principals-Tour',
    options: ['Excelencia-Live', 'Kindy-Open-Day', 'Principals-Tour'],
  },
  utm_id: {
    label: 'UTM ID',
    description: 'Specific instance of an ads campaign (usually just copy-paste the campaign name)',
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
})

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

const { previewMode } = useRuntimeConfig().public
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
    <DialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>{{ link.id ? $t('links.edit') : $t('links.create') }}</DialogTitle>
        <DialogDescription>
          {{ link.id ? $t('links.edit_description') : $t('links.create_description') }}
        </DialogDescription>
      </DialogHeader>
      <p
        v-if="previewMode"
        class="text-sm text-muted-foreground"
      >
        {{ $t('links.preview_mode_tip') }}
      </p>
      <AutoForm
        class="overflow-y-auto px-2 space-y-2"
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
              <CustomSelect
                :model-value="fieldSlotProps.componentField.modelValue"
                :options="utmSourceOptions"
                :label="slotProps.config?.label || 'UTM Source'"
                :description="slotProps.config?.description"
                :placeholder="$t('links.utm_source_placeholder')"
                :error="fieldSlotProps.errorMessage"
                @update:model-value="fieldSlotProps.componentField['onUpdate:modelValue']"
              />
            </FormItem>
          </FormField>
        </template>

        <!-- UTM Medium custom slot -->
        <template #utm_medium="slotProps">
          <FormField v-slot="fieldSlotProps" :name="slotProps.fieldName">
            <FormItem>
              <CustomSelect
                :model-value="fieldSlotProps.componentField.modelValue"
                :options="utmMediumOptions"
                :label="slotProps.config?.label || 'UTM Medium'"
                :description="slotProps.config?.description"
                :placeholder="$t('links.utm_medium_placeholder')"
                :error="fieldSlotProps.errorMessage"
                @update:model-value="fieldSlotProps.componentField['onUpdate:modelValue']"
              />
            </FormItem>
          </FormField>
        </template>

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
          <Button type="submit">
            {{ $t('common.save') }}
          </Button>
        </DialogFooter>
      </AutoForm>
    </DialogContent>
  </Dialog>
</template>
