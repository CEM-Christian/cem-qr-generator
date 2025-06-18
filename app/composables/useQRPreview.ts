import type { QRStyleOptions } from '@/types/qr-style-editor'
import { useDebounceFn } from '@vueuse/core'
import QRCodeStyling from 'qr-code-styling'
import { ref } from 'vue'

export function useQRPreview() {
  const previewContainer = ref<HTMLElement | null>(null)
  let qrCodePreview: QRCodeStyling | null = null

  function createQRCodeOptions(
    data: string,
    image: string,
    styleOptions: QRStyleOptions,
    effectiveColors: {
      dotsColor: string
      dotsType: string
      cornerSquareColor: string
      cornerSquareType: string
      cornerDotColor: string
      cornerDotType: string
    },
  ) {
    // Determine the image to use based on logo selection
    let imageUrl: string | undefined = image // Default to favicon

    if (styleOptions.logoSelection.logoType === 'none') {
      imageUrl = undefined // No image for QR code
    }
    else if (styleOptions.logoSelection.logoType === 'organization' && styleOptions.logoSelection.selectedLogoId) {
      const { getLogoUrl } = useLogoSelection()
      imageUrl = getLogoUrl(styleOptions.logoSelection.selectedLogoId)
    }

    return {
      width: 256,
      height: 256,
      data,
      margin: 10,
      qrOptions: {
        typeNumber: 0 as any,
        mode: 'Byte' as const,
        errorCorrectionLevel: 'Q' as const,
      },
      image: imageUrl,
      dotsOptions: {
        color: effectiveColors.dotsColor,
        type: effectiveColors.dotsType as any,
        roundSize: styleOptions.dotsOptions.roundSize,
      },
      cornersSquareOptions: {
        color: effectiveColors.cornerSquareColor,
        type: effectiveColors.cornerSquareType as any,
      },
      cornersDotOptions: {
        color: effectiveColors.cornerDotColor,
        type: effectiveColors.cornerDotType as any,
      },
      backgroundOptions: {
        color: styleOptions.backgroundOptions.color,
      },
      imageOptions: {
        ...styleOptions.imageOptions,
        crossOrigin: 'anonymous',
      },
    }
  }

  function updatePreview(
    data: string,
    image: string,
    styleOptions: QRStyleOptions,
    effectiveColors: {
      dotsColor: string
      dotsType: string
      cornerSquareColor: string
      cornerSquareType: string
      cornerDotColor: string
      cornerDotType: string
    },
  ): void {
    if (!previewContainer.value || !qrCodePreview)
      return

    try {
      const options = createQRCodeOptions(data, image, styleOptions, effectiveColors)
      qrCodePreview.update(options)
    }
    catch (error) {
      console.error('Failed to update QR code preview:', error)
    }
  }

  function initializePreview(
    data: string,
    image: string,
    styleOptions: QRStyleOptions,
    effectiveColors: {
      dotsColor: string
      dotsType: string
      cornerSquareColor: string
      cornerSquareType: string
      cornerDotColor: string
      cornerDotType: string
    },
  ): void {
    if (!previewContainer.value)
      return

    try {
      const options = createQRCodeOptions(data, image, styleOptions, effectiveColors)
      qrCodePreview = new QRCodeStyling(options)

      // Clear previous content
      previewContainer.value.innerHTML = ''

      // Append new QR code
      qrCodePreview.append(previewContainer.value)
    }
    catch (error) {
      console.error('Failed to initialize QR code preview:', error)
    }
  }

  // Debounced update function
  const debouncedUpdatePreview = useDebounceFn((
    data: string,
    image: string,
    styleOptions: QRStyleOptions,
    effectiveColors: {
      dotsColor: string
      dotsType: string
      cornerSquareColor: string
      cornerSquareType: string
      cornerDotColor: string
      cornerDotType: string
    },
  ) => {
    updatePreview(data, image, styleOptions, effectiveColors)
  }, 300)

  return {
    previewContainer,
    initializePreview,
    updatePreview,
    debouncedUpdatePreview,
  }
}
