<script setup lang="ts">
import type { LayoutType } from '~/composables/useLayoutPreference'
import { List, QrCode } from 'lucide-vue-next'

interface Props {
  layout: LayoutType
}

interface Emits {
  'update:layout': [layout: LayoutType]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleLayoutChange(newLayout: LayoutType) {
  emit('update:layout', newLayout)
}
</script>

<template>
  <div class="flex items-center border rounded-md p-1">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            :variant="$props.layout === 'details' ? 'default' : 'ghost'"
            size="sm"
            :aria-label="$t('links.layout.details')"
            @click="handleLayoutChange('details')"
          >
            <List class="h-4 w-4" />
            <span class="hidden sm:ml-2 sm:inline">
              {{ $t('links.layout.details') }}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ $t('links.layout.details_description') }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            :variant="$props.layout === 'qr' ? 'default' : 'ghost'"
            size="sm"
            :aria-label="$t('links.layout.qr')"
            @click="handleLayoutChange('qr')"
          >
            <QrCode class="h-4 w-4" />
            <span class="hidden sm:ml-2 sm:inline">
              {{ $t('links.layout.qr') }}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ $t('links.layout.qr_description') }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
