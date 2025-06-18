import type { Link } from '@@/schemas/link'
import type { DownloadOptions, LinkUpdateType } from '@@/schemas/link-display'
import { nanoid } from '@@/schemas/link'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { useQRCode } from '~/composables/useQRCode'

/**
 * Composable for link card actions (copy, duplicate, QR operations)
 */
export function useLinkActions(
  link: Ref<Link>,
  shortLink: Ref<string>,
  linkIcon: Ref<string>,
  emit: (event: 'update:link', link: Link, type?: LinkUpdateType) => void,
) {
  const { t } = useI18n()
  const { downloadQRCode } = useQRCode()

  // Clipboard functionality
  const { copy, copied } = useClipboard({ source: shortLink.value, copiedDuring: 400 })

  // Modal states
  const showDownloadModal = ref(false)
  const showStyleEditor = ref(false)

  /**
   * Copy short link to clipboard
   */
  function copyLink() {
    copy(shortLink.value)
    toast(t('links.copy_success'))
  }

  /**
   * Update link and emit to parent
   */
  function updateLink(updatedLink: Link, type?: LinkUpdateType) {
    emit('update:link', updatedLink, type)
  }

  /**
   * Handle QR code download
   */
  function handleQRDownload() {
    showDownloadModal.value = true
  }

  /**
   * Handle QR style editing
   */
  function handleQRStyleEdit() {
    showStyleEditor.value = true
  }

  /**
   * Handle download confirmation from modal
   */
  function handleDownloadConfirm(downloadOptions: DownloadOptions) {
    try {
      downloadQRCode({
        data: shortLink.value,
        image: linkIcon.value,
        link: link.value,
        format: downloadOptions.format,
        resolution: downloadOptions.resolution,
      })
    }
    catch (error) {
      console.error('Failed to download QR code:', error)
      toast.error(t('qr_style_editor.save_error'))
    }
  }

  /**
   * Handle style save from editor
   */
  function handleStyleSave(updatedLink: Link) {
    updateLink(updatedLink, 'edit')
  }

  /**
   * Create a duplicate of the current link
   */
  function handleDuplicateLink() {
    const duplicateData: Link = {
      ...link.value,
      slug: nanoid()(), // Generate new slug
      name: link.value.name ? `${link.value.name} (Copy)` : undefined,
      // Keep ID and timestamps as these will be overridden on server
      createdAt: Date.now() / 1000,
      updatedAt: Date.now() / 1000,
    }

    // Emit as a create event to add to the list
    emit('update:link', duplicateData, 'create')
    toast(t('links.messages.create_success'))
  }

  return {
    // States
    copied,
    showDownloadModal,
    showStyleEditor,

    // Actions
    copyLink,
    updateLink,
    handleQRDownload,
    handleQRStyleEdit,
    handleDownloadConfirm,
    handleStyleSave,
    handleDuplicateLink,
  }
}
