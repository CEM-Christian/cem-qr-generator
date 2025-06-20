<script setup lang="ts">
interface Props {
  backgroundColor: string
  onBackgroundColorChange: (color: string) => void
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
</script>

<template>
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
    </AccordionContent>
  </AccordionItem>
</template>
