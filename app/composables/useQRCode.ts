import QRCodeStyling from 'qr-code-styling'
import { useLogoSelection } from './useLogoSelection'

interface QRCodeOptions {
  data: string
  image?: string
  link?: Record<string, any>
  size?: number
}

export function useQRCode() {
  // Create QR code instance without rendering to DOM
  function createQRCodeInstance(options: QRCodeOptions) {
    const { data, image, link, size = 256 } = options

    // Default QR style options
    const defaultStyleOptions = {
      dotsOptions: { type: 'square', color: '#000000' },
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: { type: 'square', color: '#000000' },
      cornersDotOptions: { type: 'square', color: '#000000' },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 2 },
    }

    // Get current style options from link or use defaults
    const currentStyleOptions = link?.qr_style_options || defaultStyleOptions

    // Get the image URL based on logo selection
    let imageUrl = image

    const logoSelection = currentStyleOptions.logoSelection
    if (logoSelection && logoSelection.logoType === 'none') {
      imageUrl = undefined // No image for QR code
    }
    else if (logoSelection && logoSelection.logoType === 'organization' && logoSelection.selectedLogoId) {
      const { getLogoUrl } = useLogoSelection()
      imageUrl = getLogoUrl(logoSelection.selectedLogoId)
    }

    // Create QR code options
    const qrOptions = {
      width: size,
      height: size,
      data,
      margin: 10,
      qrOptions: {
        typeNumber: 0 as any,
        mode: 'Byte' as const,
        errorCorrectionLevel: 'Q' as const,
      },
      imageOptions: {
        ...currentStyleOptions.imageOptions,
        crossOrigin: 'anonymous',
      },
      dotsOptions: currentStyleOptions.dotsOptions,
      backgroundOptions: currentStyleOptions.backgroundOptions,
      cornersSquareOptions: currentStyleOptions.cornersSquareOptions,
      cornersDotOptions: currentStyleOptions.cornersDotOptions,
      image: imageUrl,
    }

    return new QRCodeStyling(qrOptions)
  }

  // Download QR code without showing it
  async function downloadQRCode(options: QRCodeOptions & {
    format?: 'png' | 'jpeg' | 'webp' | 'svg'
    filename?: string
    resolution?: number
  }) {
    const { format = 'png', filename, resolution } = options

    const qrInstance = createQRCodeInstance({
      ...options,
      size: resolution || options.size || 256,
    })

    // Generate filename
    const slug = options.data.split('/').pop()
    const resolutionSuffix = resolution ? `_${resolution}` : ''
    const downloadName = filename || `qr_${slug}${resolutionSuffix}`

    // Download QR code
    return qrInstance.download({
      extension: format,
      name: downloadName,
    })
  }

  // Open style editor with background QR instance
  function openStyleEditor(options: QRCodeOptions & {
    onSave?: (updatedLink: any) => void
  }) {
    // We'll need to create a way to open the style editor
    // For now, return the QR instance that can be used
    return createQRCodeInstance(options)
  }

  return {
    createQRCodeInstance,
    downloadQRCode,
    openStyleEditor,
  }
}
