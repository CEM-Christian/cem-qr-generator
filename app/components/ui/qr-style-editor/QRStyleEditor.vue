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
import { Badge } from '../badge'

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
const openAccordions = ref([]) // Track open accordions. All closed by default.

// Default QR style options with base style support
const defaultStyleOptions = {
  // Base style options that apply to all components
  baseOptions: {
    color: '#000000',
    type: 'square'
  },
  // Individual component overrides
  componentOverrides: {
    dots: {},
    cornerSquares: {},
    cornerDots: {}
  },
  // Legacy component options (maintained for backward compatibility)
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

// Initialize style options with backward compatibility support
function initializeStyleOptions(initialOptions) {
  const options = { ...defaultStyleOptions }
  
  if (initialOptions) {
    // If initialOptions has new baseOptions structure, use it
    if (initialOptions.baseOptions) {
      Object.assign(options, initialOptions)
    } else {
      // Backward compatibility: convert legacy format
      options.dotsOptions = { ...options.dotsOptions, ...initialOptions.dotsOptions }
      options.backgroundOptions = { ...options.backgroundOptions, ...initialOptions.backgroundOptions }
      options.cornersSquareOptions = { ...options.cornersSquareOptions, ...initialOptions.cornersSquareOptions }
      options.cornersDotOptions = { ...options.cornersDotOptions, ...initialOptions.cornersDotOptions }
      options.imageOptions = { ...options.imageOptions, ...initialOptions.imageOptions }
    }
  }
  
  return options
}

// Base style management functions
function applyBaseStyle(component, property) {
  if (component === 'dots' && property === 'color') {
    styleOptions.dotsOptions.color = effectiveDotsColor.value
    delete styleOptions.componentOverrides.dots.color
  } else if (component === 'dots' && property === 'type') {
    styleOptions.dotsOptions.type = effectiveDotsType.value
    delete styleOptions.componentOverrides.dots.type
  } else if (component === 'cornerSquares' && property === 'color') {
    styleOptions.cornersSquareOptions.color = effectiveCornerSquareColor.value
    delete styleOptions.componentOverrides.cornerSquares.color
  } else if (component === 'cornerSquares' && property === 'type') {
    styleOptions.cornersSquareOptions.type = effectiveCornerSquareType.value
    delete styleOptions.componentOverrides.cornerSquares.type
  } else if (component === 'cornerDots' && property === 'color') {
    styleOptions.cornersDotOptions.color = effectiveCornerDotColor.value
    delete styleOptions.componentOverrides.cornerDots.color
  } else if (component === 'cornerDots' && property === 'type') {
    styleOptions.cornersDotOptions.type = effectiveCornerDotType.value
    delete styleOptions.componentOverrides.cornerDots.type
  }
}

function markAsCustomized(component, property, value) {
  if (!styleOptions.componentOverrides[component]) {
    styleOptions.componentOverrides[component] = {}
  }
  styleOptions.componentOverrides[component][property] = value
}

function resetToBaseStyle(component, property) {
  if (styleOptions.componentOverrides[component]) {
    delete styleOptions.componentOverrides[component][property]
    // If no overrides left, remove the component override object
    if (Object.keys(styleOptions.componentOverrides[component]).length === 0) {
      delete styleOptions.componentOverrides[component]
    }
  }
  applyBaseStyle(component, property)
}

function isUsingBaseStyle(component, property) {
  return !styleOptions.componentOverrides[component] || 
         !(property in styleOptions.componentOverrides[component])
}

// Individual component change handlers
function handleDotsColorChange(newColor) {
  styleOptions.dotsOptions.color = newColor
  markAsCustomized('dots', 'color', newColor)
}

function handleDotsTypeChange(newType) {
  styleOptions.dotsOptions.type = newType
  markAsCustomized('dots', 'type', newType)
}

function handleCornerSquareColorChange(newColor) {
  styleOptions.cornersSquareOptions.color = newColor
  markAsCustomized('cornerSquares', 'color', newColor)
}

function handleCornerSquareTypeChange(newType) {
  styleOptions.cornersSquareOptions.type = newType
  markAsCustomized('cornerSquares', 'type', newType)
}

function handleCornerDotColorChange(newColor) {
  styleOptions.cornersDotOptions.color = newColor
  markAsCustomized('cornerDots', 'color', newColor)
}

function handleCornerDotTypeChange(newType) {
  styleOptions.cornersDotOptions.type = newType
  markAsCustomized('cornerDots', 'type', newType)
}

// Base style change handlers
function handleBaseColorChange(newColor) {
  styleOptions.baseOptions.color = newColor
  // Update all non-customized components
  if (isUsingBaseStyle('dots', 'color')) {
    styleOptions.dotsOptions.color = newColor
  }
  if (isUsingBaseStyle('cornerSquares', 'color')) {
    styleOptions.cornersSquareOptions.color = newColor
  }
  if (isUsingBaseStyle('cornerDots', 'color')) {
    styleOptions.cornersDotOptions.color = newColor
  }
}

function handleBaseTypeChange(newType) {
  styleOptions.baseOptions.type = newType
  // Update all non-customized components
  if (isUsingBaseStyle('dots', 'type')) {
    styleOptions.dotsOptions.type = newType
  }
  if (isUsingBaseStyle('cornerSquares', 'type')) {
    styleOptions.cornersSquareOptions.type = newType
  }
  if (isUsingBaseStyle('cornerDots', 'type')) {
    styleOptions.cornersDotOptions.type = newType
  }
}

// Style options reactive object
const styleOptions = reactive(initializeStyleOptions(props.initialOptions))

// QR Code instance
let qrCodePreview = null

// Computed properties for effective styles
const effectiveDotsColor = computed(() => {
  return isUsingBaseStyle('dots', 'color') ? styleOptions.baseOptions.color : styleOptions.dotsOptions.color
})

const effectiveDotsType = computed(() => {
  return isUsingBaseStyle('dots', 'type') ? styleOptions.baseOptions.type : styleOptions.dotsOptions.type
})

const effectiveCornerSquareColor = computed(() => {
  return isUsingBaseStyle('cornerSquares', 'color') ? styleOptions.baseOptions.color : styleOptions.cornersSquareOptions.color
})

const effectiveCornerSquareType = computed(() => {
  return isUsingBaseStyle('cornerSquares', 'type') ? styleOptions.baseOptions.type : styleOptions.cornersSquareOptions.type
})

const effectiveCornerDotColor = computed(() => {
  return isUsingBaseStyle('cornerDots', 'color') ? styleOptions.baseOptions.color : styleOptions.cornersDotOptions.color
})

const effectiveCornerDotType = computed(() => {
  return isUsingBaseStyle('cornerDots', 'type') ? styleOptions.baseOptions.type : styleOptions.cornersDotOptions.type
})

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
      color: effectiveDotsColor.value,
      type: effectiveDotsType.value,
      roundSize: styleOptions.dotsOptions.roundSize,
      gradient: styleOptions.dotsOptions.gradient || null
    },
    cornersSquareOptions: {
      color: effectiveCornerSquareColor.value,
      type: effectiveCornerSquareType.value,
      gradient: styleOptions.cornersSquareOptions.gradient || null
    },
    cornersDotOptions: {
      color: effectiveCornerDotColor.value,
      type: effectiveCornerDotType.value,
      gradient: styleOptions.cornersDotOptions.gradient || null
    },
    backgroundOptions: {
      ...styleOptions.backgroundOptions,
      gradient: styleOptions.backgroundOptions.gradient || null
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
  // Clear all component overrides
  styleOptions.componentOverrides = {}
  toast(t('qr_style_editor.reset_success'))
}

async function saveStyleOptions() {
  try {
    // Clean up the style options to ensure all values are valid
    const cleanStyleOptions = {
      // Include base options
      baseOptions: {
        color: styleOptions.baseOptions.color || '#000000',
        type: styleOptions.baseOptions.type || 'square'
      },
      componentOverrides: styleOptions.componentOverrides || {},
      // Legacy component options for backward compatibility
      dotsOptions: {
        color: effectiveDotsColor.value || '#000000',
        type: effectiveDotsType.value || 'square',
        roundSize: styleOptions.dotsOptions.roundSize ?? true
      },
      cornersSquareOptions: {
        color: effectiveCornerSquareColor.value || '#000000',
        ...(effectiveCornerSquareType.value && { type: effectiveCornerSquareType.value })
      },
      cornersDotOptions: {
        color: effectiveCornerDotColor.value || '#000000',
        ...(effectiveCornerDotType.value && { type: effectiveCornerDotType.value })
      },
      backgroundOptions: {
        color: styleOptions.backgroundOptions.color || '#ffffff'
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
          <!-- Base Style Section -->
          <div class="bg-muted/50 rounded-lg p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-sm font-semibold">{{ $t('qr_style_editor.base_style.title') }}</h3>
              <p class="text-xs text-muted-foreground">{{ $t('qr_style_editor.base_style.description') }}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Base Color -->
              <div class="space-y-2">
                <Label>{{ $t('qr_style_editor.base_style.color') }}</Label>
                <div class="flex items-center gap-2">
                  <div 
                    class="w-8 h-8 rounded border cursor-pointer"
                    :style="{ backgroundColor: styleOptions.baseOptions.color }"
                    @click="$refs.baseColorInput.click()"
                  />
                  <input
                    ref="baseColorInput"
                    :value="styleOptions.baseOptions.color"
                    type="color"
                    class="sr-only"
                    @input="handleBaseColorChange($event.target.value)"
                  />
                  <Input 
                    :model-value="styleOptions.baseOptions.color"
                    class="flex-1"
                    placeholder="#000000"
                    @update:model-value="handleBaseColorChange"
                  />
                </div>
              </div>
              
              <!-- Base Type -->
              <div class="space-y-2">
                <Label>{{ $t('qr_style_editor.base_style.type') }}</Label>
                <Select :model-value="styleOptions.baseOptions.type" @update:model-value="handleBaseTypeChange">
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
            </div>
          </div>
          
          <Accordion v-model="openAccordions" type="multiple" class="w-full">
            
            <!-- Dots Styling -->
            <AccordionItem value="dots">
              <AccordionTrigger class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  {{ $t('qr_style_editor.sections.dots') }}
                  <Badge 
                    :variant="isUsingBaseStyle('dots', 'color') && isUsingBaseStyle('dots', 'type') ? 'secondary' : 'default'"
                    class="text-xs"
                  >
                    {{ isUsingBaseStyle('dots', 'color') && isUsingBaseStyle('dots', 'type') 
                        ? $t('qr_style_editor.override_indicators.using_base') 
                        : $t('qr_style_editor.override_indicators.custom') }}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent class="space-y-4">
                
                <!-- Dots Color -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <Label>{{ $t('qr_style_editor.dots.color') }}</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-8 h-8 rounded border cursor-pointer"
                      :style="{ backgroundColor: effectiveDotsColor }"
                      @click="$refs.dotsColorInput.click()"
                    />
                    <input
                      ref="dotsColorInput"
                      :value="effectiveDotsColor"
                      type="color"
                      class="sr-only"
                      @input="handleDotsColorChange($event.target.value)"
                    />
                    <Input 
                      :model-value="effectiveDotsColor"
                      class="flex-1"
                      placeholder="#000000"
                      @update:model-value="handleDotsColorChange"
                    />
                    <Button
                      v-if="!isUsingBaseStyle('dots', 'color')"
                      variant="outline"
                      size="sm"
                      @click="resetToBaseStyle('dots', 'color')"
                    >
                      {{ $t('qr_style_editor.override_indicators.apply_base') }}
                    </Button>
                  </div>
                </div>
                
                <!-- Dots Type -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <Label>{{ $t('qr_style_editor.dots.type') }}</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Select :model-value="effectiveDotsType" @update:model-value="handleDotsTypeChange" class="flex-1">
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
                    <Button
                      v-if="!isUsingBaseStyle('dots', 'type')"
                      variant="outline"
                      size="sm"
                      @click="resetToBaseStyle('dots', 'type')"
                    >
                      {{ $t('qr_style_editor.override_indicators.apply_base') }}
                    </Button>
                  </div>
                </div>
                
                <!-- Round Size -->
                <div class="flex items-center justify-between">
                  <Label>{{ $t('qr_style_editor.dots.round_size') }}</Label>
                  <Switch v-model:checked="styleOptions.dotsOptions.roundSize" />
                </div>
                
              </AccordionContent>
            </AccordionItem>
            
            <!-- Corner Squares -->
            <AccordionItem value="corner-squares">
              <AccordionTrigger class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  {{ $t('qr_style_editor.sections.corner_squares') }}
                  <Badge 
                    :variant="isUsingBaseStyle('cornerSquares', 'color') && isUsingBaseStyle('cornerSquares', 'type') ? 'secondary' : 'default'"
                    class="text-xs"
                  >
                    {{ isUsingBaseStyle('cornerSquares', 'color') && isUsingBaseStyle('cornerSquares', 'type') 
                        ? $t('qr_style_editor.override_indicators.using_base') 
                        : $t('qr_style_editor.override_indicators.custom') }}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent class="space-y-4">
                
                <!-- Corner Squares Color -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <Label>{{ $t('qr_style_editor.corner_squares.color') }}</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-8 h-8 rounded border cursor-pointer"
                      :style="{ backgroundColor: effectiveCornerSquareColor }"
                      @click="$refs.cornerSquareColorInput.click()"
                    />
                    <input
                      ref="cornerSquareColorInput"
                      :value="effectiveCornerSquareColor"
                      type="color"
                      class="sr-only"
                      @input="handleCornerSquareColorChange($event.target.value)"
                    />
                    <Input 
                      :model-value="effectiveCornerSquareColor"
                      class="flex-1"
                      placeholder="#000000"
                      @update:model-value="handleCornerSquareColorChange"
                    />
                    <Button
                      v-if="!isUsingBaseStyle('cornerSquares', 'color')"
                      variant="outline"
                      size="sm"
                      @click="resetToBaseStyle('cornerSquares', 'color')"
                    >
                      {{ $t('qr_style_editor.override_indicators.apply_base') }}
                    </Button>
                  </div>
                </div>
                
                <!-- Corner Squares Type -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <Label>{{ $t('qr_style_editor.corner_squares.type') }}</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Select :model-value="effectiveCornerSquareType" @update:model-value="handleCornerSquareTypeChange" class="flex-1">
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
                    <Button
                      v-if="!isUsingBaseStyle('cornerSquares', 'type')"
                      variant="outline"
                      size="sm"
                      @click="resetToBaseStyle('cornerSquares', 'type')"
                    >
                      {{ $t('qr_style_editor.override_indicators.apply_base') }}
                    </Button>
                  </div>
                </div>
                
              </AccordionContent>
            </AccordionItem>
            
            <!-- Corner Dots -->
            <AccordionItem value="corner-dots">
              <AccordionTrigger class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  {{ $t('qr_style_editor.sections.corner_dots') }}
                  <Badge 
                    :variant="isUsingBaseStyle('cornerDots', 'color') && isUsingBaseStyle('cornerDots', 'type') ? 'secondary' : 'default'"
                    class="text-xs"
                  >
                    {{ isUsingBaseStyle('cornerDots', 'color') && isUsingBaseStyle('cornerDots', 'type') 
                        ? $t('qr_style_editor.override_indicators.using_base') 
                        : $t('qr_style_editor.override_indicators.custom') }}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent class="space-y-4">
                
                <!-- Corner Dots Color -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <Label>{{ $t('qr_style_editor.corner_dots.color') }}</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-8 h-8 rounded border cursor-pointer"
                      :style="{ backgroundColor: effectiveCornerDotColor }"
                      @click="$refs.cornerDotColorInput.click()"
                    />
                    <input
                      ref="cornerDotColorInput"
                      :value="effectiveCornerDotColor"
                      type="color"
                      class="sr-only"
                      @input="handleCornerDotColorChange($event.target.value)"
                    />
                    <Input 
                      :model-value="effectiveCornerDotColor"
                      class="flex-1"
                      placeholder="#000000"
                      @update:model-value="handleCornerDotColorChange"
                    />
                    <Button
                      v-if="!isUsingBaseStyle('cornerDots', 'color')"
                      variant="outline"
                      size="sm"
                      @click="resetToBaseStyle('cornerDots', 'color')"
                    >
                      {{ $t('qr_style_editor.override_indicators.apply_base') }}
                    </Button>
                  </div>
                </div>
                
                <!-- Corner Dots Type -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <Label>{{ $t('qr_style_editor.corner_dots.type') }}</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Select :model-value="effectiveCornerDotType" @update:model-value="handleCornerDotTypeChange" class="flex-1">
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
                    <Button
                      v-if="!isUsingBaseStyle('cornerDots', 'type')"
                      variant="outline"
                      size="sm"
                      @click="resetToBaseStyle('cornerDots', 'type')"
                    >
                      {{ $t('qr_style_editor.override_indicators.apply_base') }}
                    </Button>
                  </div>
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
