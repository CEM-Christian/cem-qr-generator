<script setup lang="ts">
import type { LayoutType } from '~/composables/useLayoutPreference'
import { Grid3x3, QrCode } from 'lucide-vue-next'

interface Props {
  layout: LayoutType
}

interface Emits {
  'update:layout': [layout: LayoutType]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

const layoutOptions = [
  {
    value: 'qr-code' as const,
    icon: QrCode,
    label: t('links.layout.qr_code'),
    tooltip: t('links.layout.qr_code_tooltip'),
  },
  {
    value: 'condensed' as const,
    icon: Grid3x3,
    label: t('links.layout.condensed'),
    tooltip: t('links.layout.condensed_tooltip'),
  },
]

function handleLayoutChange(newLayout: LayoutType) {
  emit('update:layout', newLayout)
}
</script>

<template>
  <div class="flex items-center border rounded-md h-10 px-1 gap-1">
    <TooltipProvider>
      <Tooltip v-for="option in layoutOptions" :key="option.value">
        <TooltipTrigger as-child>
          <Button
            :variant="props.layout === option.value ? 'default' : 'ghost'"
            size="sm"
            class="h-7 w-7 p-0 rounded border-0"
            :aria-label="option.tooltip"
            @click="handleLayoutChange(option.value)"
          >
            <component :is="option.icon" class="h-4 w-4" />
            <span class="sr-only">{{ option.label }}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ option.tooltip }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
