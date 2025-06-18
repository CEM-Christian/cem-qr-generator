import type { QRStyleOptions } from '@/types/qr-style-editor'
import { toast } from 'vue-sonner'

export function useQRStyleSaver() {
  const { t } = useI18n()

  async function saveStyleOptions(
    link: Record<string, any>,
    cleanStyleOptions: QRStyleOptions,
  ): Promise<{ success: boolean, data?: any }> {
    try {
      // Build the update payload with only defined fields
      const updatedLink: Record<string, any> = {
        id: link.id,
        url: link.url,
        slug: link.slug,
        qr_style_options: cleanStyleOptions,
      }

      // Add optional fields only if they exist
      if (link.name !== undefined)
        updatedLink.name = link.name
      if (link.comment !== undefined)
        updatedLink.comment = link.comment
      if (link.expiration !== undefined)
        updatedLink.expiration = link.expiration
      if (link.title !== undefined)
        updatedLink.title = link.title
      if (link.description !== undefined)
        updatedLink.description = link.description
      if (link.image !== undefined)
        updatedLink.image = link.image
      if (link.utm_source !== undefined)
        updatedLink.utm_source = link.utm_source
      if (link.utm_medium !== undefined)
        updatedLink.utm_medium = link.utm_medium
      if (link.utm_campaign !== undefined)
        updatedLink.utm_campaign = link.utm_campaign
      if (link.utm_id !== undefined)
        updatedLink.utm_id = link.utm_id

      const response = await useAPI('/api/link/edit', {
        method: 'PUT',
        body: updatedLink,
      }) as { link: any }

      return { success: true, data: response.link }
    }
    catch (error) {
      console.error('Failed to save QR style options:', error)
      toast.error(t('qr_style_editor.save_error'))
      return { success: false }
    }
  }

  async function saveAndNotify(
    link: Record<string, any>,
    cleanStyleOptions: QRStyleOptions,
    onSave: (data: any) => void,
    onClose?: () => void,
  ): Promise<boolean> {
    const result = await saveStyleOptions(link, cleanStyleOptions)

    if (result.success) {
      toast.success(t('qr_style_editor.save_success'))
      onSave(result.data)
      onClose?.()
      return true
    }

    return false
  }

  return {
    saveStyleOptions,
    saveAndNotify,
  }
}
