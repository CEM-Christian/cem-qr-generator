<script setup lang="ts">
import type { QRStyleEditorEmits, QRStyleEditorProps, QRStyleOptions } from '@/types/qr-style-editor'
import { nextTick, onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'
import BaseStyleControl from './BaseStyleControl.vue'
import ComponentStyleControl from './ComponentStyleControl.vue'
import AdvancedControls from './AdvancedControls.vue'

const props = defineProps<QRStyleEditorProps>()
const emit = defineEmits<QRStyleEditorEmits>()

const { t } = useI18n()

// Component state
const isOpen = ref(props.open)
const openAccordions = ref([]) // Track open accordions. All closed by default.

// Use composables for logic
const {
  styleOptions,
  effectiveDotsColor,
  effectiveDotsType,
  effectiveCornerSquareColor,
  effectiveCornerSquareType,
  effectiveCornerDotColor,
  effectiveCornerDotType,
  isUsingBaseStyle,
  resetToBaseStyle,
  resetToDefaults,
  getCleanStyleOptions,
  handleDotsColorChange,
  handleDotsTypeChange,
  handleCornerSquareColorChange,
  handleCornerSquareTypeChange,
  handleCornerDotColorChange,
  handleCornerDotTypeChange,
  handleBaseColorChange,
  handleBaseTypeChange,
  handleLogoTypeChange,
  handleLogoIdChange
} = useQRStyleManager(props.initialOptions as any)

// Type assertion for styleOptions to ensure proper typing
const typedStyleOptions = styleOptions as QRStyleOptions

const {
  previewContainer,
  initializePreview,
  debouncedUpdatePreview
} = useQRPreview()

const { saveAndNotify } = useQRStyleSaver()

// Watch for changes and update preview
watch(() => typedStyleOptions, () => {
  debouncedUpdatePreview(
    props.data,
    props.image,
    typedStyleOptions,
    {
      dotsColor: effectiveDotsColor.value,
      dotsType: effectiveDotsType.value as any,
      cornerSquareColor: effectiveCornerSquareColor.value,
      cornerSquareType: effectiveCornerSquareType.value as any,
      cornerDotColor: effectiveCornerDotColor.value,
      cornerDotType: effectiveCornerDotType.value as any
    }
  )
}, { deep: true })

watch(() => props.open, (newValue) => {
  isOpen.value = newValue
})

watch(() => isOpen.value, (newValue) => {
  emit('update:open', newValue)
})

function handleOpenChange(open: boolean) {
  isOpen.value = open
}

function handleResetToDefaults() {
  resetToDefaults()
  toast(t('qr_style_editor.reset_success'))
}

function handleImageOptionsChange(newOptions: any) {
  if (typedStyleOptions?.imageOptions) {
    Object.assign(typedStyleOptions.imageOptions, newOptions)
  }
}

async function handleSave() {
  const cleanStyleOptions = getCleanStyleOptions()
  await saveAndNotify(
    props.link,
    cleanStyleOptions,
    (updatedLink) => emit('save', updatedLink),
    () => { isOpen.value = false }
  )
}

// Initialize preview when component mounts
onMounted(() => {
  nextTick(() => {
    if (props.open) {
      initializePreview(
        props.data,
        props.image,
        typedStyleOptions,
        {
          dotsColor: effectiveDotsColor.value,
          dotsType: effectiveDotsType.value as any,
          cornerSquareColor: effectiveCornerSquareColor.value,
          cornerSquareType: effectiveCornerSquareType.value as any,
          cornerDotColor: effectiveCornerDotColor.value,
          cornerDotType: effectiveCornerDotType.value as any
        }
      )
    }
  })
})

// Watch for dialog open state to initialize preview
watch(() => props.open, async (newValue) => {
  if (newValue) {
    await nextTick()
    initializePreview(
      props.data,
      props.image,
      typedStyleOptions,
      {
        dotsColor: effectiveDotsColor.value,
        dotsType: effectiveDotsType.value as any,
        cornerSquareColor: effectiveCornerSquareColor.value,
        cornerSquareType: effectiveCornerSquareType.value as any,
        cornerDotColor: effectiveCornerDotColor.value,
        cornerDotType: effectiveCornerDotType.value as any
      }
    )
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
          <BaseStyleControl
            :color="typedStyleOptions?.baseOptions?.color ?? '#000000'"
            :type="typedStyleOptions?.baseOptions?.type ?? 'square'"
            :on-color-change="handleBaseColorChange"
            :on-type-change="handleBaseTypeChange"
          />
          
          <!-- Logo Selection Section -->
          <div class="bg-muted/50 rounded-lg p-4 space-y-4">
            <LogoSelector
              :logo-type="typedStyleOptions?.logoSelection?.logoType"
              :selected-logo-id="typedStyleOptions?.logoSelection?.selectedLogoId"
              @update:logo-type="handleLogoTypeChange"
              @update:selected-logo-id="handleLogoIdChange"
            />
          </div>
          
          <Accordion v-model="openAccordions" type="multiple" class="w-full">
            <!-- Dots Styling -->
            <ComponentStyleControl
              :title="$t('qr_style_editor.sections.dots')"
              component="dots"
              :color-label="$t('qr_style_editor.dots.color')"
              :type-label="$t('qr_style_editor.dots.type')"
              :color="effectiveDotsColor"
              :type="effectiveDotsType"
              :is-using-base-color="isUsingBaseStyle('dots', 'color')"
              :is-using-base-type="isUsingBaseStyle('dots', 'type')"
              :on-color-change="handleDotsColorChange"
              :on-type-change="handleDotsTypeChange"
              :on-reset-color-to-base="() => resetToBaseStyle('dots', 'color')"
              :on-reset-type-to-base="() => resetToBaseStyle('dots', 'type')"
              :show-round-size="true"
              :round-size="typedStyleOptions?.dotsOptions?.roundSize"
              :on-round-size-change="(value) => { if (typedStyleOptions?.dotsOptions) typedStyleOptions.dotsOptions.roundSize = value }"
            />
            
            <!-- Corner Squares -->
            <ComponentStyleControl
              :title="$t('qr_style_editor.sections.corner_squares')"
              component="cornerSquares"
              :color-label="$t('qr_style_editor.corner_squares.color')"
              :type-label="$t('qr_style_editor.corner_squares.type')"
              :color="effectiveCornerSquareColor"
              :type="effectiveCornerSquareType"
              :is-using-base-color="isUsingBaseStyle('cornerSquares', 'color')"
              :is-using-base-type="isUsingBaseStyle('cornerSquares', 'type')"
              :on-color-change="handleCornerSquareColorChange"
              :on-type-change="handleCornerSquareTypeChange"
              :on-reset-color-to-base="() => resetToBaseStyle('cornerSquares', 'color')"
              :on-reset-type-to-base="() => resetToBaseStyle('cornerSquares', 'type')"
            />
            
            <!-- Corner Dots -->
            <ComponentStyleControl
              :title="$t('qr_style_editor.sections.corner_dots')"
              component="cornerDots"
              :color-label="$t('qr_style_editor.corner_dots.color')"
              :type-label="$t('qr_style_editor.corner_dots.type')"
              :color="effectiveCornerDotColor"
              :type="effectiveCornerDotType"
              :is-using-base-color="isUsingBaseStyle('cornerDots', 'color')"
              :is-using-base-type="isUsingBaseStyle('cornerDots', 'type')"
              :on-color-change="handleCornerDotColorChange"
              :on-type-change="handleCornerDotTypeChange"
              :on-reset-color-to-base="() => resetToBaseStyle('cornerDots', 'color')"
              :on-reset-type-to-base="() => resetToBaseStyle('cornerDots', 'type')"
            />
          </Accordion>
          
          <!-- Advanced Controls -->
          <AdvancedControls
            :background-color="typedStyleOptions?.backgroundOptions?.color ?? '#ffffff'"
            :image-options="typedStyleOptions?.imageOptions ?? { hideBackgroundDots: true, imageSize: 0.4, margin: 2 }"
            :on-background-color-change="(color) => { if (typedStyleOptions?.backgroundOptions) typedStyleOptions.backgroundOptions.color = color }"
            :on-image-options-change="handleImageOptionsChange"
          />
        </div>
      </div>
      
      <!-- Footer Actions -->
      <DialogFooter class="sm:justify-between">
        <div class="flex gap-2">
          <Button variant="outline" @click="handleResetToDefaults">
            {{ $t('qr_style_editor.reset') }}
          </Button>
        </div>
        <div class="flex gap-2">
          <DialogClose as-child>
            <Button variant="secondary">
              {{ $t('common.cancel') }}
            </Button>
          </DialogClose>
          <Button @click="handleSave">
            {{ $t('qr_style_editor.save') }}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
