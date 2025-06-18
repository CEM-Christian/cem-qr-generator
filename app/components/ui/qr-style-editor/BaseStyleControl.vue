<script setup lang="ts">
interface Props {
  color: string
  type: string
  onColorChange: (color: string) => void
  onTypeChange: (type: string) => void
}

const props = defineProps<Props>()

const { t } = useI18n()
const baseColorInputRef = ref<HTMLInputElement>()

const typeOptions = [
  { value: 'square', label: 'square' },
  { value: 'rounded', label: 'rounded' },
  { value: 'dots', label: 'dots' },
  { value: 'classy', label: 'classy' },
  { value: 'classy-rounded', label: 'classy_rounded' },
  { value: 'extra-rounded', label: 'extra_rounded' }
]

function handleColorInput(event: Event) {
  const target = event.target as HTMLInputElement
  props.onColorChange(target.value)
}

// Handle color change from Input component (can be string | number)
function handleColorChange(value: string | number) {
  props.onColorChange(String(value))
}
</script>

<template>
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
            :style="{ backgroundColor: color }"
            @click="baseColorInputRef?.click()"
          />
          <input
            ref="baseColorInputRef"
            :value="color"
            type="color"
            class="sr-only"
            @input="handleColorInput"
          />
          <Input 
            :model-value="color"
            class="flex-1"
            placeholder="#000000"
            @update:model-value="handleColorChange"
          />
        </div>
      </div>
      
      <!-- Base Type -->
      <div class="space-y-2">
        <Label>{{ $t('qr_style_editor.base_style.type') }}</Label>
        <Select 
          :model-value="type" 
          @update:model-value="onTypeChange"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in typeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ $t(`qr_style_editor.types.${option.label}`) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
</template>
