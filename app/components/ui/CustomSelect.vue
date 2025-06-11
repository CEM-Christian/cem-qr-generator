<script setup lang="ts">
interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue?: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  label?: string
  description?: string
  required?: boolean
  error?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()

function handleValueChange(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="space-y-2">
    <Label
      v-if="label"
      :class="{ 'text-destructive': error }"
    >
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    
    <Select
      :model-value="modelValue"
      :disabled="disabled"
      @update:model-value="handleValueChange"
    >
      <SelectTrigger class="w-full">
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    
    <p
      v-if="description && !error"
      class="text-sm text-muted-foreground"
    >
      {{ description }}
    </p>
    
    <p
      v-if="error"
      class="text-sm text-destructive"
    >
      {{ error }}
    </p>
  </div>
</template>
