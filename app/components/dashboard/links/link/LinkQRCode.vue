<script setup lang="ts">
import { Download, Edit3 } from 'lucide-vue-next'
import QRCodeStyling from 'qr-code-styling'
import { DownloadOptionsModal } from '../../../ui/download-options-modal'
import QRStyleEditor from '../../../ui/qr-style-editor/QRStyleEditor.vue'

interface Props {
  data: string
  image?: string
  link?: Record<string, any>
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  buttonMode?: 'full' | 'icon' | 'hidden'
  elementType?: 'canvas' | 'svg'
}

const props = withDefaults(defineProps<Props>(), {
  image: '',
  link: () => ({}),
  size: 'md',
  buttonMode: 'full',
  elementType: 'canvas',
})

const emit = defineEmits<{
  'update:link': [link: any, type?: 'edit' | 'delete' | 'create']
  'download': []
  'editStyle': []
}>()

// Default QR style options based on current implementation
const defaultOptions = {
  dotsOptions: { type: 'square', color: '#000000', gradient: null },
  backgroundOptions: { color: '#ffffff', gradient: null },
  cornersSquareOptions: { type: 'square', color: '#000000' },
  cornersDotOptions: { type: 'square', color: '#000000' },
  imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 2 },
}

// Get current style options from link or use defaults
const currentStyleOptions = computed(() => {
  return props.link?.qr_style_options || defaultOptions
})

// Get the image URL based on logo selection
const imageUrl = computed(() => {
  const logoSelection = currentStyleOptions.value.logoSelection

  if (logoSelection && logoSelection.logoType === 'none') {
    return undefined // No image for QR code
  }

  if (logoSelection && logoSelection.logoType === 'organization' && logoSelection.selectedLogoId) {
    const { getLogoUrl } = useLogoSelection()
    return getLogoUrl(logoSelection.selectedLogoId)
  }

  // Default to favicon
  return props.image
})

// QR code dimensions based on size prop
const qrDimensions = computed(() => {
  if (typeof props.size === 'number') {
    return props.size
  }
  const sizeMap = {
    sm: 128,
    md: 256,
    lg: 320,
    xl: 512,
  }
  return sizeMap[props.size]
})

const options = computed(() => ({
  width: qrDimensions.value,
  height: qrDimensions.value,
  data: props.data,
  type: props.elementType,
  margin: 10,
  qrOptions: { typeNumber: 0 as any, mode: 'Byte' as const, errorCorrectionLevel: 'Q' as const },
  imageOptions: {
    ...currentStyleOptions.value.imageOptions,
    crossOrigin: 'anonymous',
  },
  dotsOptions: currentStyleOptions.value.dotsOptions,
  backgroundOptions: currentStyleOptions.value.backgroundOptions,
  cornersSquareOptions: currentStyleOptions.value.cornersSquareOptions,
  cornersDotOptions: currentStyleOptions.value.cornersDotOptions,
  image: imageUrl.value,
  dotsOptionsHelper: {
    colorType: { single: true, gradient: false },
    gradient: {
      linear: true,
      radial: false,
      color1: '#6a1a4c',
      color2: '#6a1a4c',
      rotation: '0',
    },
  },
  cornersSquareOptionsHelper: {
    colorType: { single: true, gradient: false },
    gradient: {
      linear: true,
      radial: false,
      color1: '#000000',
      color2: '#000000',
      rotation: '0',
    },
  },
  cornersDotOptionsHelper: {
    colorType: { single: true, gradient: false },
    gradient: {
      linear: true,
      radial: false,
      color1: '#000000',
      color2: '#000000',
      rotation: '0',
    },
  },
  backgroundOptionsHelper: {
    colorType: { single: true, gradient: false },
    gradient: {
      linear: true,
      radial: false,
      color1: '#ffffff',
      color2: '#ffffff',
      rotation: '0',
    },
  },
}))

const qrCode = new QRCodeStyling(options.value)
const qrCodeEl = ref(null)
const showStyleEditor = ref(false)
const showDownloadModal = ref(false)

// Watch for changes in style options and update QR code
watch(() => currentStyleOptions.value, (newOptions) => {
  const updatedOptions = {
    dotsOptions: newOptions.dotsOptions,
    backgroundOptions: newOptions.backgroundOptions,
    cornersSquareOptions: newOptions.cornersSquareOptions,
    cornersDotOptions: newOptions.cornersDotOptions,
    image: imageUrl.value, // Include the computed image URL
    imageOptions: {
      ...newOptions.imageOptions,
      crossOrigin: 'anonymous',
    },
  }
  qrCode.update(updatedOptions)
}, { deep: true })

// Also watch for image URL changes separately
watch(() => imageUrl.value, (newImageUrl) => {
  qrCode.update({
    image: newImageUrl,
  })
})

function handleDirectDownload() {
  emit('download')
  showDownloadModal.value = true
}

function handleDownloadConfirm(downloadOptions: any) {
  try {
    // Create temporary QR code instance with download-specific settings
    const downloadQrOptions = {
      ...options.value,
      width: downloadOptions.resolution || 256,
      height: downloadOptions.resolution || 256,
    }

    const tempQrCode = new QRCodeStyling(downloadQrOptions)

    // Generate filename with resolution
    const slug = props.data.split('/').pop()
    const resolution = downloadOptions.resolution ? `_${downloadOptions.resolution}` : ''
    const filename = `qr_${slug}${resolution}`

    // Download with specified format
    tempQrCode.download({
      extension: downloadOptions.format,
      name: filename,
    })

    // Clean up temporary instance
    // Note: QRCodeStyling doesn't require explicit cleanup, but we can null the reference
    // tempQrCode = null would go here if needed
  }
  catch (error) {
    console.error('Failed to download QR code:', error)
  }
}

function handleOpenStyleEditor() {
  emit('editStyle')
  showStyleEditor.value = true
}

function handleStyleSave(updatedLink: any) {
  // The QR Style Editor now emits the full updated link from the API
  emit('update:link', updatedLink, 'edit')
}

// Expose functions for external use
defineExpose({
  handleDirectDownload,
  handleOpenStyleEditor,
})

onMounted(() => {
  if (qrCodeEl.value) {
    qrCode.append(qrCodeEl.value)
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div
      ref="qrCodeEl"
      :data-text="data"
      class="rounded-lg overflow-hidden"
    />

    <!-- Action Buttons - Responsive based on buttonMode prop -->
    <div
      v-if="buttonMode !== 'hidden'"
      class="flex items-center gap-2"
    >
      <Button
        variant="outline"
        size="sm"
        @click="handleDirectDownload"
      >
        <Download class="w-4 h-4" :class="buttonMode === 'full' ? 'mr-2' : ''" />
        <span v-if="buttonMode === 'full'">{{ $t('common.download') }}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        @click="handleOpenStyleEditor"
      >
        <Edit3 class="w-4 h-4" :class="buttonMode === 'full' ? 'mr-2' : ''" />
        <span v-if="buttonMode === 'full'">{{ $t('qr_style_editor.edit_style') }}</span>
      </Button>
    </div>

    <!-- QR Style Editor Modal -->
    <QRStyleEditor
      v-model:open="showStyleEditor"
      :data="data"
      :image="image"
      :initial-options="currentStyleOptions"
      :link="link"
      @save="handleStyleSave"
    />

    <!-- Download Options Modal -->
    <DownloadOptionsModal
      v-model:open="showDownloadModal"
      @download="handleDownloadConfirm"
    />
  </div>
</template>
