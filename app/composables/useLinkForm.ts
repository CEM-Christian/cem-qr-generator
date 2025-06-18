import { nanoid } from '@@/schemas/link'
import { LinkEditorFormSchema } from '@@/schemas/link-editor'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { linkFlatToNested, linkNestedToFlat } from '@/utils/link-data-transformer'

interface UseLinkFormOptions {
  link: any
  isEdit: boolean
  onSubmit: (link: any, action: 'create' | 'edit') => void
}

/**
 * Composable for managing link form state and operations
 */
export function useLinkForm({ link, isEdit, onSubmit }: UseLinkFormOptions) {
  const { t } = useI18n()

  // Initialize form with nested data structure
  const form = useForm({
    validationSchema: toTypedSchema(LinkEditorFormSchema),
    initialValues: linkFlatToNested({
      name: link.name,
      slug: link.slug,
      url: link.url,
      organization: link.organization,
      utm_source: link.utm_source || 'qr-code',
      utm_medium: link.utm_medium,
      utm_campaign: link.utm_campaign,
      utm_id: link.utm_id,
      comment: link.comment,
    }),
    validateOnMount: isEdit,
    keepValuesOnUnmount: isEdit,
  })

  // Field configuration
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
    organization: {
      label: t('links.form.organization.label'),
      description: t('links.form.organization.description'),
      inputProps: {
        placeholder: t('links.form.organization.placeholder'),
      },
    },
    optional: {
      comment: {
        component: 'textarea',
      },
    },
  } as any))

  // Form submission handler
  async function handleSubmit(formData: any) {
    try {
      // Convert nested form data back to flat structure for API
      const flatData = linkNestedToFlat(formData)

      const linkPayload = {
        name: flatData.name,
        url: flatData.url,
        slug: flatData.slug,
        organization: flatData.organization,
        utm_source: flatData.utm_source,
        utm_medium: flatData.utm_medium,
        utm_campaign: flatData.utm_campaign,
        utm_id: flatData.utm_id,
        comment: flatData.comment,
        expiration: flatData.expiration ? date2unix(flatData.expiration, 'end') : undefined,
        // Preserve existing QR style options when editing
        ...(isEdit && link.qr_style_options && { qr_style_options: link.qr_style_options }),
      }

      const { link: newLink } = await useAPI(isEdit ? '/api/link/edit' : '/api/link/create', {
        method: isEdit ? 'PUT' : 'POST',
        body: linkPayload,
      }) as { link: any }

      onSubmit(newLink, isEdit ? 'edit' : 'create')

      // Show success message
      const message = isEdit
        ? t('links.messages.update_success')
        : t('links.messages.create_success')
      toast(message)
    }
    catch (error) {
      console.error('Form submission error:', error)
      const message = isEdit
        ? t('links.messages.update_error')
        : t('links.messages.create_error')
      toast.error(message)
    }
  }

  // Slug generation functions
  function generateRandomSlug() {
    form.setFieldValue('slug', nanoid()())
  }

  const aiSlugPending = ref(false)
  async function generateAiSlug() {
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
      console.error('AI slug generation error:', error)
    }
    finally {
      aiSlugPending.value = false
    }
  }

  // URL preview
  const baseUrl = computed(() => {
    if (import.meta.server)
      return ''
    return window.location.origin
  })

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

  // Initialize expiration date if exists
  onMounted(() => {
    if (link.expiration)
      form.setFieldValue('optional.expiration', unix2date(link.expiration).toDate(getTimeZone()))
  })

  return {
    form,
    fieldConfig,
    handleSubmit,
    generateRandomSlug,
    generateAiSlug,
    aiSlugPending,
    shortUrl,
    copyShortUrl,
  }
}
