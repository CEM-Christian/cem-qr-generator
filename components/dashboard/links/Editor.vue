<script setup>
import { DependencyType } from '@/components/ui/auto-form/interface'
import { LinkSchema, nanoid } from '@/schemas/link'
import { toTypedSchema } from '@vee-validate/zod'
import { Shuffle, Sparkles } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

const props = defineProps({
  link: {
    type: Object,
    default: () => ({}),
  },
})

// Emits an event to update the link in the parent component when saved
const emit = defineEmits(['update:link'])

const { t } = useI18n()
const link = ref(props.link)
const dialogOpen = ref(false)

// Edit (or create) mode is determined by whether the link has an ID
const isEdit = !!props.link.id

// Defines the UTM fields with their options and explanations
const utmFieldsData = [
  {
    key: 'utm_source',
    question: 'UTM Source',
    explanation: 'Identifies where traffic is coming from (e.g. QR-Code, Facebook).',
    options: ['QR-code', 'PDF', 'email', 'website', 'Facebook', 'Instagram'],
    component: 'select',
  },
  {
    key: 'utm_medium',
    question: 'UTM Medium',
    explanation: 'Describes how the user arrived (e.g. Flyer, Email, Digital-Advert).',
    options: ['flyer', 'A4-poster', 'A5-flyer', 'email', 'printed-advert', 'digital-advert'],
    component: 'select',
  },
  {
    key: 'utm_campaign',
    question: 'UTM Campaign Name',
    explanation: 'Differentiates promotions (e.g. Kindy-Open-Day).',
    component: 'input',
  },
  {
    key: 'utm_id',
    question: 'UTM Campaign ID',
    explanation: 'Unique campaign identifier (e.g. Kindy-Open-Day-02-02-2025).',
    component: 'input',
  },
]

// Helper function to create UTM field schema
function createUtmFieldSchema(key) {
  const fieldData = utmFieldsData.find(f => f.key === key)
  const explanation = fieldData?.explanation || ''

  if (fieldData?.options?.length > 0) {
    // Ensure options are valid for z.enum (non-empty array of strings)
    const validOptions = fieldData.options.filter(opt => typeof opt === 'string' && opt.length > 0)
    if (validOptions.length === 0) {
      // Fallback or error if no valid options for enum
      return z.string().trim().max(255).optional().describe(`${explanation} (Configuration error: No valid options for enum)`)
    }
    return z.enum(validOptions).optional().describe(explanation)
  }
  return z.string().trim().max(255).optional().describe(explanation)
}

//
const EditLinkSchema = LinkSchema.pick({
  url: true,
  slug: true,
}).extend({
  // Use the helper function for each UTM field
  utm_source: createUtmFieldSchema('utm_source'),
  utm_medium: createUtmFieldSchema('utm_medium'),
  utm_campaign: createUtmFieldSchema('utm_campaign'),
  utm_id: createUtmFieldSchema('utm_id'),
  // 'optional' group for other optional fields
  optional: LinkSchema.omit({
    id: true,
    url: true, // already included in the main schema
    slug: true, // already included in the main schema
    createdAt: true,
    updatedAt: true,
    title: true,
    description: true,
    image: true,
    // Omit UTM fields from this group as they are defined above
    utm_source: true,
    utm_medium: true,
    utm_campaign: true,
    utm_id: true,
  }).extend({
    // Optional fields within the 'optional' group
    expiration: z.coerce.date().optional(),
    comment: LinkSchema.shape.comment,
  }).optional(),
})

const baseFieldConfigOptional = {
  comment: {
    component: 'textarea',
  },
  // Add configuration for expiration if needed, e.g.,
  // expiration: { label: 'Expiration Date' }
}

utmFieldsData.forEach((field) => {
  baseFieldConfigOptional[field.key] = {
    label: field.question,
    // Pass options for combobox items, AutoForm should handle string array.
    // If AutoFormCombobox expects { label, value } objects, this might need mapping.
    ...(field.component === 'combobox' && { component: 'combobox', items: field.options }),
    // For 'input' types (campaign, id), AutoForm defaults to input for z.string, which is fine.
    // If field.component is 'input', we don't need to specify it here as it's the default for z.string.
  }
})

const fieldConfig = {
  slug: {
    disabled: isEdit,
  },
  optional: baseFieldConfigOptional,
}
// Add UTM field configurations directly to fieldConfig
utmFieldsData.forEach((field) => {
  fieldConfig[field.key] = {
    label: field.question,
  }
  // AutoForm should infer component type (select/input) from Zod schema (enum/string)
})

const dependencies = [
  {
    sourceField: 'slug',
    type: DependencyType.DISABLES,
    targetField: 'slug',
    when: () => isEdit,
  },
]

const form = useForm({
  validationSchema: toTypedSchema(EditLinkSchema),
  initialValues: {
    slug: link.value.slug,
    url: link.value.url,
    // UTM initial values are now top-level
    utm_source: link.value.utm_source,
    utm_medium: link.value.utm_medium,
    utm_campaign: link.value.utm_campaign,
    utm_id: link.value.utm_id,
    optional: {
      comment: link.value.comment,
      expiration: link.value.expiration ? unix2date(link.value.expiration) : undefined,
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
    })
    form.setFieldValue('slug', slug)
  }
  catch (error) {
    console.log(error)
  }
  aiSlugPending.value = false
}

onMounted(() => {
  // if (link.value.expiration) {
  //   form.setFieldValue('optional.expiration', unix2date(link.value.expiration))
  // }
  // Expiration is already handled in initialValues by converting unix to date.
  // If props.link changes, form might need to be reset or values updated.
  // For now, initialValues handles the first load.
})

async function onSubmit(formData) {
  const payload = {
    ...(isEdit ? { id: props.link.id } : {}),
    url: formData.url,
    slug: formData.slug,
    // Access UTM fields directly from formData
    utm_source: formData.utm_source,
    utm_medium: formData.utm_medium,
    utm_campaign: formData.utm_campaign,
    utm_id: formData.utm_id,
    // Optional fields remain under formData.optional
    comment: formData.optional?.comment,
    expiration: formData.optional?.expiration ? date2unix(formData.optional.expiration, 'end') : undefined,
  }

  const { link: newLink } = await useAPI(isEdit ? '/api/link/edit' : '/api/link/create', {
    method: isEdit ? 'PUT' : 'POST',
    body: payload,
  })
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
      </DialogHeader>
      <p
        v-if="previewMode"
        class="text-sm text-muted-foreground"
      >
        {{ $t('links.preview_mode_tip') }}
      </p>
      <AutoForm
        class="px-2 space-y-2 overflow-y-auto"
        :schema="EditLinkSchema"
        :form="form"
        :field-config="fieldConfig"
        :dependencies="dependencies"
        @submit="onSubmit"
      >
        <template #slug="slotProps">
          <div
            v-if="!isEdit"
            class="relative"
          >
            <div class="absolute right-0 flex space-x-3 top-1">
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
          <AutoFormField
            v-else
            v-bind="slotProps"
          />
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
