<script setup>
import { LinkSchema, nanoid } from '@@/schemas/link'
import { toTypedSchema } from '@vee-validate/zod'
import { Shuffle, Sparkles } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { DependencyType } from '@/components/ui/auto-form/interface'

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
    disabled: isEdit,
  },
  utm_medium: {
    label: 'UTM Medium',
    description: 'The medium the user arrived from e.g. poster, flyer, email, social, e-guide, referral.',
    options: ['poster', 'flyer', 'social', 'email', 'e-guide', 'referral'],
  },
  utm_source: {
    label: 'UTM Source',
    description: 'Where traffic is coming from e.g. Facebook, Instagram, Google, QR-Code, PDF, website.',
    options: ['QR-Code', 'PDF', 'Google', 'website', 'Facebook', 'Instagram', 'Mailchimp'],
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
}))

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
    name: link.value.name,
    slug: link.value.slug,
    url: link.value.url,
    utm_source: link.value.utm_source,
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
    })
    form.setFieldValue('slug', slug)
  }
  catch (error) {
    console.log(error)
  }
  aiSlugPending.value = false
}

onMounted(() => {
  if (link.value.expiration) {
    form.setFieldValue('optional.expiration', unix2date(link.value.expiration))
  }
})

async function onSubmit(formData) {
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
  }
  const { link: newLink } = await useAPI(isEdit ? '/api/link/edit' : '/api/link/create', {
    method: isEdit ? 'PUT' : 'POST',
    body: link,
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
        class="overflow-y-auto px-2 space-y-2"
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
