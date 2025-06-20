<script setup lang="ts">
interface Props {
  backgroundColor: string
  imageOptions: {
    hideBackgroundDots: boolean
    imageSize: number
    margin: number
  }
  onBackgroundColorChange: (color: string) => void
  onImageOptionsChange: (options: any) => void
}

const props = defineProps<Props>()

const { t } = useI18n()
const backgroundColorInputRef = ref<HTMLInputElement>()

const isTransparent = computed(() => props.backgroundColor === 'transparent')

function handleBackgroundColorInput(event: Event) {
  const target = event.target as HTMLInputElement
  props.onBackgroundColorChange(target.value)
}

function handleTransparentToggle(value: boolean) {
  if (value) {
    props.onBackgroundColorChange('transparent')
  } else {
    props.onBackgroundColorChange('#ffffff') // Default to white when disabling transparency
  }
}

function handleHideBackgroundDotsChange(value: boolean) {
  props.onImageOptionsChange({
    ...props.imageOptions,
    hideBackgroundDots: value
  })
}

function handleImageSizeChange(value: number) {
  props.onImageOptionsChange({
    ...props.imageOptions,
    imageSize: value
  })
}

function handleImageMarginChange(value: number) {
  props.onImageOptionsChange({
    ...props.imageOptions,
    margin: value
  })
}
</script>

<template>
  <Accordion 
    type="multiple" 
    class="w-full"
  >
    <!-- Background -->
    <AccordionItem value="background">
      <AccordionTrigger>{{ $t('qr_style_editor.sections.background') }}</AccordionTrigger>
      <AccordionContent class="space-y-4 px-2">
        <!-- Transparent Background Toggle -->
        <div class="flex items-center justify-between">
          <Label>{{ $t('qr_style_editor.background.transparent') }}</Label>
          <Switch 
            :checked="isTransparent"
            @update:checked="handleTransparentToggle" 
          />
        </div>
        
        <!-- Background Color -->
        <div v-if="!isTransparent" class="space-y-2">
          <Label>{{ $t('qr_style_editor.background.color') }}</Label>
          <div class="flex items-center gap-2">
            <div 
              class="w-8 h-8 rounded border cursor-pointer"
              :style="{ backgroundColor: backgroundColor }"
              @click="backgroundColorInputRef?.click()"
            />
            <input
              ref="backgroundColorInputRef"
              :value="backgroundColor"
              type="color"
              class="sr-only"
              @input="handleBackgroundColorInput"
            />
            <Input 
              :model-value="backgroundColor" 
              class="flex-1"
              placeholder="#ffffff"
              @update:model-value="(value) => onBackgroundColorChange(String(value))"
            />
          </div>
        </div>
        
        <!-- Transparent Background Info -->
        <div v-if="isTransparent" class="bg-muted/50 rounded-lg p-3">
          <p class="text-sm text-muted-foreground">
            {{ $t('qr_style_editor.background.transparent_info') }}
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
    
    <!-- Image Settings -->
    <AccordionItem value="image">
      <AccordionTrigger>{{ $t('qr_style_editor.sections.image') }}</AccordionTrigger>
      <AccordionContent class="space-y-4 px-2">
        <!-- Hide Background Dots -->
        <div class="flex items-center justify-between">
          <Label>{{ $t('qr_style_editor.image.hide_background_dots') }}</Label>
          <Switch 
            :checked="imageOptions.hideBackgroundDots"
            @update:checked="handleHideBackgroundDotsChange" 
          />
        </div>
        
        <!-- Image Size -->
        <div class="space-y-2">
          <Label>{{ $t('qr_style_editor.image.size') }} ({{ Math.round(imageOptions.imageSize * 100) }}%)</Label>
          <input
            :value="imageOptions.imageSize"
            type="range"
            min="0"
            max="1"
            step="0.1"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            @input="handleImageSizeChange(Number(($event.target as HTMLInputElement).value))"
          />
        </div>
        
        <!-- Image Margin -->
        <div class="space-y-2">
          <Label>{{ $t('qr_style_editor.image.margin') }}</Label>
          <Input 
            :model-value="imageOptions.margin" 
            type="number"
            min="0"
            max="20"
            placeholder="2"
            @update:model-value="handleImageMarginChange(Number($event))"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
