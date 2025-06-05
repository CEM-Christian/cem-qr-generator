<script setup>
import { Download } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select'
import { Label } from '../label'
import { Button } from '../button'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:open', 'download'])

const { t } = useI18n()

// Reactive data for format and resolution selection
const selectedFormat = ref('png')
const selectedResolution = ref('256')

// Format options with metadata
const formatOptions = [
  {
    value: 'png',
    label: 'PNG',
    description: t('links.download_options.formats.png_description'),
    isVector: false,
  },
  {
    value: 'jpeg',
    label: 'JPEG',
    description: t('links.download_options.formats.jpeg_description'),
    isVector: false,
  },
  {
    value: 'svg',
    label: 'SVG',
    description: t('links.download_options.formats.svg_description'),
    isVector: true,
  },
]

// Resolution options for raster formats
const resolutionOptions = [
  { value: '256', label: '256×256' },
  { value: '512', label: '512×512' },
  { value: '1024', label: '1024×1024' },
  { value: '2048', label: '2048×2048' },
]



// Computed properties
const isVectorFormat = computed(() => {
  const format = formatOptions.find(f => f.value === selectedFormat.value)
  return format?.isVector || false
})

const estimatedFileSize = computed(() => {
  // Simple estimation logic
  const resolution = parseInt(selectedResolution.value)
  const baseSize = Math.pow(resolution / 256, 2) // Scale based on resolution
  
  switch (selectedFormat.value) {
    case 'png':
      return `~${Math.round(baseSize * 5)}KB`
    case 'jpeg':
      return `~${Math.round(baseSize * 3)}KB`
    case 'svg':
      return '~2-5KB'
    default:
      return ''
  }
})

// Handle download
function handleDownload() {
  const downloadOptions = {
    format: selectedFormat.value,
    resolution: isVectorFormat.value ? null : parseInt(selectedResolution.value),
  }
  
  emit('download', downloadOptions)
  emit('update:open', false)
}

// Handle open state changes
function handleOpenChange(open) {
  emit('update:open', open)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ $t('links.download_options.title') }}</DialogTitle>
        <DialogDescription>
          {{ $t('links.download_options.description') }}
        </DialogDescription>
      </DialogHeader>
      
      <div class="space-y-6">
        <!-- Format Selection -->
        <div class="space-y-2">
          <Label>{{ $t('links.download_options.format_label') }}</Label>
          <Select v-model="selectedFormat">
            <SelectTrigger>
              <SelectValue :placeholder="$t('links.download_options.select_format')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="format in formatOptions"
                  :key="format.value"
                  :value="format.value"
                >
                  <div class="flex flex-col">
                    <span class="font-medium">{{ format.label }}</span>
                    <span class="text-xs text-muted-foreground">{{ format.description }}</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <!-- Resolution Selection (disabled for vector formats) -->
        <div class="space-y-2">
          <Label :class="{ 'text-muted-foreground': isVectorFormat }">
            {{ $t('links.download_options.resolution_label') }}
          </Label>
          <Select
            v-model="selectedResolution"
            :disabled="isVectorFormat"
          >
            <SelectTrigger :disabled="isVectorFormat">
              <SelectValue :placeholder="$t('links.download_options.select_resolution')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="resolution in resolutionOptions"
                  :key="resolution.value"
                  :value="resolution.value"
                >
                  {{ resolution.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p v-if="isVectorFormat" class="text-xs text-muted-foreground">
            {{ $t('links.download_options.vector_format_note') }}
          </p>
        </div>

        <!-- File Size Estimation -->
        <div class="p-3 bg-muted rounded-lg">
          <div class="flex justify-between items-center text-sm">
            <span class="text-muted-foreground">{{ $t('links.download_options.estimated_size') }}:</span>
            <span class="font-medium">{{ estimatedFileSize }}</span>
          </div>
          <div class="flex justify-between items-center text-sm mt-1">
            <span class="text-muted-foreground">{{ $t('links.download_options.format') }}:</span>
            <span class="font-medium">{{ selectedFormat.toUpperCase() }}</span>
          </div>
        </div>
      </div>

      <DialogFooter class="sm:justify-start">
        <Button @click="handleDownload" class="w-full sm:w-auto">
          <Download class="w-4 h-4 mr-2" />
          {{ $t('links.download_options.download_button') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
