<script setup>
import { Download, Edit3 } from 'lucide-vue-next'
import QRCodeStyling from 'qr-code-styling'
import { DownloadOptionsModal } from '../../ui/download-options-modal'
import QRStyleEditor from '../../ui/qr-style-editor/QRStyleEditor.vue'

const props = defineProps({
  data: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  link: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:link'])

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

const options = computed(() => ({
  width: 256,
  height: 256,
  data: props.data,
  margin: 10,
  qrOptions: { typeNumber: '0', mode: 'Byte', errorCorrectionLevel: 'Q' },
  imageOptions: {
    ...currentStyleOptions.value.imageOptions,
    crossOrigin: 'anonymous',
  },
  dotsOptions: currentStyleOptions.value.dotsOptions,
  backgroundOptions: currentStyleOptions.value.backgroundOptions,
  cornersSquareOptions: currentStyleOptions.value.cornersSquareOptions,
  cornersDotOptions: currentStyleOptions.value.cornersDotOptions,
  image: props.image,
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
    imageOptions: {
      ...newOptions.imageOptions,
      crossOrigin: 'anonymous',
    },
  }
  qrCode.update(updatedOptions)
}, { deep: true })

function handleDirectDownload() {
  showDownloadModal.value = true
}

function handleDownloadConfirm(downloadOptions) {
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
  showStyleEditor.value = true
}

function handleStyleSave(newStyleOptions) {
  // Update the link object with new style options and emit to parent
  const updatedLink = {
    ...props.link,
    qr_style_options: newStyleOptions,
  }
  emit('update:link', updatedLink, 'edit')
}

onMounted(() => {
  qrCode.append(qrCodeEl.value)
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div
      ref="qrCodeEl"
      :data-text="data"
      class="bg-white p-1 rounded-lg"
    />

    <!-- Action Buttons -->
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        @click="handleDirectDownload"
      >
        <Download class="w-4 h-4 mr-2" />
        {{ $t('common.download') }}
      </Button>

      <Button
        variant="outline"
        size="sm"
        @click="handleOpenStyleEditor"
      >
        <Edit3 class="w-4 h-4 mr-2" />
        {{ $t('qr_style_editor.edit_style') }}
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
