<script setup lang="ts">
interface TypeOption {
  value: string
  label: string
}

interface Props {
  label: string
  value: string
  options: TypeOption[]
  isUsingBase: boolean
  onValueChange: (value: string) => void
  onResetToBase: () => void
}

const props = defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <Label>{{ label }}</Label>
    </div>
    <div class="flex items-center gap-2">
      <Select 
        :model-value="value" 
        class="flex-1"
        @update:model-value="onValueChange"
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ $t(`qr_style_editor.types.${option.label}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
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
