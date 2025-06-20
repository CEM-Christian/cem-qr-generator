<script setup lang="ts">
interface Props {
  label: string
  color: string
  isUsingBase: boolean
  onColorChange: (color: string) => void
  onResetToBase: () => void
}

const props = defineProps<Props>()

const { t } = useI18n()
const colorInputRef = ref<HTMLInputElement>()

function handleColorInput(event: Event) {
  const target = event.target as HTMLInputElement
  props.onColorChange(target.value)
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <Label>{{ label }}</Label>
    </div>
    <div class="flex items-center gap-2">
      <div 
        class="w-8 h-8 rounded border cursor-pointer"
        :style="{ backgroundColor: color }"
        @click="colorInputRef?.click()"
      />
      <input
        ref="colorInputRef"
        :value="color"
        type="color"
        class="sr-only"
        @input="handleColorInput"
      />
      <Input 
        :model-value="color"
        class="flex-1"
        placeholder="#000000"
        @update:model-value="(value) => onColorChange(String(value))"
      />
      <Button
        v-if="!isUsingBase"
        variant="outline"
        size="sm"
        @click="onResetToBase"
      >
        {{ $t('qr_style_editor.override_indicators.apply_base') }}
      </Button>
    </div>
  </div>
</template>
