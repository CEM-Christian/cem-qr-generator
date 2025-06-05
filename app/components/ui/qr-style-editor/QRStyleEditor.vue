<template>
  <Dialog v-model:open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="max-w-[95vw] max-h-[95vh] w-full md:max-w-4xl grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>{{ $t('qr_style_editor.title') }}</DialogTitle>
        <DialogDescription>{{ $t('qr_style_editor.description') }}</DialogDescription>
      </DialogHeader>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        <!-- Preview Section -->
        <div class="flex flex-col items-center gap-4">
          <div class="text-sm font-medium">{{ $t('qr_style_editor.preview') }}</div>
          <div 
            ref="previewContainer"
            class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          />
        </div>
        
        <!-- Style Options Section -->
        <div class="overflow-y-auto space-y-4">
          <Accordion v-model="openAccordions" type="multiple" class="w-full">
            
            <!-- Dots Styling -->
            <AccordionItem value="dots">
              <AccordionTrigger>{{ $t('qr_style_editor.sections.dots') }}</AccordionTrigger>
              <AccordionContent class="space-y-4">
                
                <!-- Dots Color -->
                <div class="space-y-2">
                  <Label>{{ $t('qr_style_editor.dots.color') }}</Label>
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-8 h-8 rounded border cursor-pointer"
                      :style="{ backgroundColor: styleOptions.dotsOptions.color }"
                      @click="$refs.dotsColorInput.click()"
                    />
                    <input
                      ref="dotsColorInput"
                      v-model="styleOptions.dotsOptions.color"
                      type="color"
                      class="sr-only"
                    />
                    <Input 
                      v-model="styleOptions.dotsOptions.color" 
                      class="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <!-- Dots Type -->
                <div class="space-y-2">
                  <Label>{{ $t('qr_style_editor.dots.type') }}</Label>
                  <Select v-model="styleOptions.dotsOptions.type">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">{{ $t('qr_style_editor.types.square') }}</SelectItem>
                      <SelectItem value="rounded">{{ $t('qr_style_editor.types.rounded') }}</SelectItem>
                      <SelectItem value="dots">{{ $t('qr_style_editor.types.dots') }}</SelectItem>
                      <SelectItem value="classy">{{ $t('qr_style_editor.types.classy') }}</SelectItem>
                      <SelectItem value="classy-rounded">{{ $t('qr_style_editor.types.classy_rounded') }}</SelectItem>
                      <SelectItem value="extra-rounded">{{ $t('qr_style_editor.types.extra_rounded') }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <!-- Round Size -->
                <div class="flex items-center justify-between">
                  <Label>{{ $t('qr_style_editor.dots.round_size') }}</Label>
                  <Switch v-model:checked="styleOptions.dotsOptions.roundSize" />
                </div>
                
              </AccordionContent>
            </AccordionItem>
            
            <!-- Background -->
            <AccordionItem value="background">
              <AccordionTrigger>{{ $t('qr_style_editor.sections.background') }}</AccordionTrigger>
              <AccordionContent class="space-y-4">
                
                <!-- Background Color -->
                <div class="space-y-2">
                  <Label>{{ $t('qr_style_editor.background.color') }}</Label>
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-8 h-8 rounded border cursor-pointer"
                      :style="{ backgroundColor: styleOptions.backgroundOptions.color }"
                      @click="$refs.backgroundColorInput.click()"
                    />
                    <input
                      ref="backgroundColorInput"
                      v-model="styleOptions.backgroundOptions.color"
                      type="color"
                      class="sr-only"
                    />
                    <Input 
                      v-model="styleOptions.backgroundOptions.color" 
                      class="flex-1"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                
              </AccordionContent>
            </AccordionItem>
            
            <!-- Corner Squares -->
            <AccordionItem value="corner-squares">
              <AccordionTrigger>{{ $t('qr_style_editor.sections.corner_squares') }}</AccordionTrigger>
              <AccordionContent class="space-y-4">
                
                <!-- Corner Squares Color -->
                <div class="space-y-2">
                  <Label>{{ $t('qr_style_editor.corner_squares.color') }}</Label>
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-8 h-8 rounded border cursor-pointer"
                      :style="{ backgroundColor: styleOptions.cornersSquareOptions.color }"
                      @click="$refs.cornerSquareColorInput.click()"
                    />
                    <input
                      ref="cornerSquareColorInput"
                      v-model="styleOptions.cornersSquareOptions.color"
                      type="color"
                      class="sr-only"
                    />
                    <Input 
                      v-model="styleOptions.cornersSquareOptions.color" 
                      class="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <!-- Corner Squares Type -->
                <div class="space-y-2">
                  <Label>{{ $t('qr_style_editor.corner_squares.type') }}</Label>
                  <Select v-model="styleOptions.cornersSquareOptions.type">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dot">{{ $t('qr_style_editor.types.dot') }}</SelectItem>
                      <SelectItem value="square">{{ $t('qr_style_editor.types.square') }}</SelectItem>
                      <SelectItem value="extra-rounded">{{ $t('qr_style_editor.types.extra_rounded') }}</SelectItem>
                      <SelectItem value="rounded">{{ $t('qr_style_editor.types.rounded') }}</SelectItem>
                      <SelectItem value="dots">{{ $t('qr_style_editor.types.dots') }}</SelectItem>
                      <SelectItem value="classy">{{ $t('qr_style_editor.types.classy') }}</SelectItem>
                      <SelectItem value="classy-rounded">{{ $t('qr_style_editor.types.classy_rounded') }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
              </AccordionContent>
            </AccordionItem>
            
            <!-- Corner Dots -->
            <AccordionItem value="corner-dots">
              <AccordionTrigger>{{ $t('qr_style_editor.sections.corner_dots') }}</AccordionTrigger>
              <AccordionContent class="space-y-4">
                
                <!-- Corner Dots Color -->
                <div class="space-y-2">
                  <Label>{{ $t('qr_style_editor.corner_dots.color') }}</Label>
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-8 h-8 rounded border cursor-pointer"
                      :style="{ backgroundColor: styleOptions.cornersDotOptions.color }"
                      @click="$refs.cornerDotColorInput.click()"
                    />
                    <input
                      ref="cornerDotColorInput"
                      v-model="styleOptions.cornersDotOptions.color"
                      type="color"
                      class="sr-only"
                    />
                    <Input 
                      v-model="styleOptions.cornersDotOptions.color" 
                      class="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <!-- Corner Dots Type -->
                <div class="space-y-2">
                  <Label>{{ $t('qr_style_editor.corner_dots.type') }}</Label>
                  <Select v-model="styleOptions.cornersDotOptions.type">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dot">{{ $t('qr_style_editor.types.dot') }}</SelectItem>
                      <SelectItem value="square">{{ $t('qr_style_editor.types.square') }}</SelectItem>
                      <SelectItem value="rounded">{{ $t('qr_style_editor.types.rounded') }}</SelectItem>
                      <SelectItem value="dots">{{ $t('qr_style_editor.types.dots') }}</SelectItem>
                      <SelectItem value="classy">{{ $t('qr_style_editor.types.classy') }}</SelectItem>
                      <SelectItem value="classy-rounded">{{ $t('qr_style_editor.types.classy_rounded') }}</SelectItem>
                      <SelectItem value="extra-rounded">{{ $t('qr_style_editor.types.extra_rounded') }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
              </AccordionContent>
            </AccordionItem>
            
            <!-- Image Settings -->
            <AccordionItem value="image">
              <AccordionTrigger>{{ $t('qr_style_editor.sections.image') }}</AccordionTrigger>
              <AccordionContent class="space-y-4">
                
                <!-- Hide Background Dots -->
                <div class="flex items-center justify-between">
                  <Label>{{ $t('qr_style_editor.image.hide_background_dots') }}</Label>
                  <Switch v-model:checked="styleOptions.imageOptions.hideBackgroundDots" />
                </div>
                
                <!-- Image Size -->
                <div class="space-y-2">
                  <Label>{{ $t('qr_style_editor.image.size') }} ({{ Math.round(styleOptions.imageOptions.imageSize * 100) }}%)</Label>
                  <input
                    v-model.number="styleOptions.imageOptions.imageSize"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <!-- Image Margin -->
                <div class="space-y-2">
                  <Label>{{ $t('qr_style_editor.image.margin') }}</Label>
                  <Input 
                    v-model.number="styleOptions.imageOptions.margin" 
                    type="number"
                    min="0"
                    max="20"
                    placeholder="2"
                  />
                </div>
                
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </div>
      </div>
      
      <!-- Footer Actions -->
      <DialogFooter class="sm:justify-between">
        <div class="flex gap-2">
          <Button variant="outline" @click="resetToDefaults">
            {{ $t('qr_style_editor.reset') }}
          </Button>
        </div>
        <div class="flex gap-2">
          <DialogClose as-child>
            <Button variant="secondary">
              {{ $t('common.cancel') }}
            </Button>
          </DialogClose>
          <Button @click="saveOnly">
            {{ $t('qr_style_editor.save') }}
          </Button>
        </div>
      </DialogFooter>
      
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import QRCodeStyling from 'qr-code-styling'
import { useDebounceFn } from '@vueuse/core'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select'
import { Switch } from '../switch'
import { Button } from '../button'
import { Input } from '../input'
import { Label } from '../label'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  data: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  initialOptions: {
    type: Object,
    default: () => ({})
  },
  link: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:open', 'save'])

const { t } = useI18n()

// Component state
const isOpen = ref(props.open)
const previewContainer = ref(null)
const openAccordions = ref(['dots', 'background', 'corner-squares', 'corner-dots', 'image'])

// Default QR style options
const defaultStyleOptions = {
  dotsOptions: {
    color: '#000000',
    type: 'square',
    roundSize: true
  },
  backgroundOptions: {
    color: '#ffffff'
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'square'
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'square'
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 2
  }
}

// Style options reactive object
const styleOptions = reactive({
  ...defaultStyleOptions,
  ...props.initialOptions
})

// QR Code instance
let qrCodePreview = null

// Debounced update function
const debouncedUpdatePreview = useDebounceFn(() => {
  updatePreview()
}, 300)

// Watch for changes and update preview
watch(() => styleOptions, () => {
  debouncedUpdatePreview()
}, { deep: true })

watch(() => props.open, (newValue) => {
  isOpen.value = newValue
})

watch(() => isOpen.value, (newValue) => {
  emit('update:open', newValue)
})

function handleOpenChange(open) {
  isOpen.value = open
}

function createQRCodeOptions() {
  return {
    width: 256,
    height: 256,
    data: props.data,
    margin: 10,
    qrOptions: { 
      typeNumber: '0', 
      mode: 'Byte', 
      errorCorrectionLevel: 'Q' 
    },
    image: props.image,
    dotsOptions: {
      ...styleOptions.dotsOptions,
      gradient: styleOptions.dotsOptions.gradient || null
    },
    backgroundOptions: {
      ...styleOptions.backgroundOptions,
      gradient: styleOptions.backgroundOptions.gradient || null
    },
    cornersSquareOptions: {
      ...styleOptions.cornersSquareOptions,
      gradient: styleOptions.cornersSquareOptions.gradient || null
    },
    cornersDotOptions: {
      ...styleOptions.cornersDotOptions,
      gradient: styleOptions.cornersDotOptions.gradient || null
    },
    imageOptions: {
      ...styleOptions.imageOptions,
      crossOrigin: 'anonymous'
    }
  }
}

function updatePreview() {
  if (!previewContainer.value || !qrCodePreview) return
  
  try {
    const options = createQRCodeOptions()
    qrCodePreview.update(options)
  } catch (error) {
    console.error('Failed to update QR code preview:', error)
  }
}

function initializePreview() {
  if (!previewContainer.value) return
  
  try {
    const options = createQRCodeOptions()
    qrCodePreview = new QRCodeStyling(options)
    
    // Clear previous content
    previewContainer.value.innerHTML = ''
    
    // Append new QR code
    qrCodePreview.append(previewContainer.value)
  } catch (error) {
    console.error('Failed to initialize QR code preview:', error)
  }
}

function resetToDefaults() {
  Object.assign(styleOptions, defaultStyleOptions)
  toast(t('qr_style_editor.reset_success'))
}

async function saveStyleOptions() {
  try {
    // Clean up the style options to ensure all values are valid
    const cleanStyleOptions = {
      dotsOptions: {
        color: styleOptions.dotsOptions.color || '#000000',
        type: styleOptions.dotsOptions.type || 'square',
        roundSize: styleOptions.dotsOptions.roundSize ?? true
      },
      backgroundOptions: {
        color: styleOptions.backgroundOptions.color || '#ffffff'
      },
      cornersSquareOptions: {
        color: styleOptions.cornersSquareOptions.color || '#000000',
        ...(styleOptions.cornersSquareOptions.type && { type: styleOptions.cornersSquareOptions.type })
      },
      cornersDotOptions: {
        color: styleOptions.cornersDotOptions.color || '#000000',
        ...(styleOptions.cornersDotOptions.type && { type: styleOptions.cornersDotOptions.type })
      },
      imageOptions: {
        hideBackgroundDots: styleOptions.imageOptions.hideBackgroundDots ?? true,
        imageSize: styleOptions.imageOptions.imageSize ?? 0.4,
        margin: styleOptions.imageOptions.margin ?? 2
      }
    }
    
    // Build the update payload with only defined fields
    const updatedLink = {
      id: props.link.id,
      url: props.link.url,
      slug: props.link.slug,
      qr_style_options: cleanStyleOptions
    }
    
    // Add optional fields only if they exist
    if (props.link.name !== undefined) updatedLink.name = props.link.name
    if (props.link.comment !== undefined) updatedLink.comment = props.link.comment
    if (props.link.expiration !== undefined) updatedLink.expiration = props.link.expiration
    if (props.link.title !== undefined) updatedLink.title = props.link.title
    if (props.link.description !== undefined) updatedLink.description = props.link.description
    if (props.link.image !== undefined) updatedLink.image = props.link.image
    if (props.link.utm_source !== undefined) updatedLink.utm_source = props.link.utm_source
    if (props.link.utm_medium !== undefined) updatedLink.utm_medium = props.link.utm_medium
    if (props.link.utm_campaign !== undefined) updatedLink.utm_campaign = props.link.utm_campaign
    if (props.link.utm_id !== undefined) updatedLink.utm_id = props.link.utm_id
    
    const response = await useAPI('/api/link/edit', {
      method: 'PUT',
      body: updatedLink
    })
    
    emit('save', cleanStyleOptions)
    return true
  } catch (error) {
    console.error('Failed to save QR style options:', error)
    toast.error(t('qr_style_editor.save_error'))
    return false
  }
}

async function saveOnly() {
  const success = await saveStyleOptions()
  if (success) {
    toast.success(t('qr_style_editor.save_success'))
    isOpen.value = false
  }
}

// Initialize preview when component mounts
onMounted(() => {
  nextTick(() => {
    if (props.open) {
      initializePreview()
    }
  })
})

// Watch for dialog open state to initialize preview
watch(() => props.open, async (newValue) => {
  if (newValue) {
    await nextTick()
    initializePreview()
  }
})
</script>
