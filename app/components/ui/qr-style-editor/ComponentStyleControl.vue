<script setup lang="ts">
import type { QRComponentType } from '@/types/qr-style-editor'

interface Props {
  title: string
  component: QRComponentType
  colorLabel: string
  typeLabel: string
  color: string
  type: string
  isUsingBaseColor: boolean
  isUsingBaseType: boolean
  onColorChange: (color: string) => void
  onTypeChange: (type: string) => void
  onResetColorToBase: () => void
  onResetTypeToBase: () => void
  showRoundSize?: boolean
  roundSize?: boolean
  onRoundSizeChange?: (value: boolean) => void
}

const props = defineProps<Props>()

const { t } = useI18n()

const typeOptions = [
  { value: 'square', label: 'square' },
  { value: 'dots', label: 'dots' },
  { value: 'rounded', label: 'rounded' },
  { value: 'extra-rounded', label: 'extra_rounded' },
  { value: 'classy', label: 'classy' },
  { value: 'classy-rounded', label: 'classy_rounded' }
]

const cornerSquareTypeOptions = [
  { value: 'square', label: 'square' },
  { value: 'dot', label: 'dot' },
  { value: 'dots', label: 'dots' },
  { value: 'rounded', label: 'rounded' },
  { value: 'extra-rounded', label: 'extra_rounded' },
  { value: 'classy', label: 'classy' },
  { value: 'classy-rounded', label: 'classy_rounded' }
]

const cornerDotTypeOptions = [
  { value: 'square', label: 'square' },
  { value: 'dot', label: 'dot' },
  { value: 'dots', label: 'dots' },
  { value: 'rounded', label: 'rounded' },
  { value: 'extra-rounded', label: 'extra_rounded' },
  { value: 'classy', label: 'classy' },
  { value: 'classy-rounded', label: 'classy_rounded' }
]

const currentTypeOptions = computed(() => {
  switch (props.component) {
    case 'cornerSquares':
      return cornerSquareTypeOptions
    case 'cornerDots':
      return cornerDotTypeOptions
    default:
      return typeOptions
  }
})

const isCustomized = computed(() => !props.isUsingBaseColor || !props.isUsingBaseType)
</script>

<template>
  <AccordionItem :value="component">
    <AccordionTrigger class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        {{ title }}
        <Badge 
          :variant="isCustomized ? 'default' : 'secondary'"
          class="text-xs"
        >
          {{ isCustomized 
              ? $t('qr_style_editor.override_indicators.custom') 
              : $t('qr_style_editor.override_indicators.using_base') }}
        </Badge>
      </div>
    </AccordionTrigger>
    <AccordionContent class="space-y-4 px-2">
      <!-- Color Control -->
      <ColorControl
        :label="colorLabel"
        :color="color"
        :is-using-base="isUsingBaseColor"
        :on-color-change="onColorChange"
        :on-reset-to-base="onResetColorToBase"
      />
      
      <!-- Type Control -->
      <TypeControl
        :label="typeLabel"
        :value="type"
        :options="currentTypeOptions"
        :is-using-base="isUsingBaseType"
        :on-value-change="onTypeChange"
        :on-reset-to-base="onResetTypeToBase"
      />
      
      <!-- Round Size (for dots only) -->
      <div
        v-if="showRoundSize"
        class="flex items-center justify-between"
      >
        <Label>{{ $t('qr_style_editor.dots.round_size') }}</Label>
        <Switch 
          :checked="roundSize"
          @update:checked="onRoundSizeChange"
        />
      </div>
    </AccordionContent>
  </AccordionItem>
</template>
