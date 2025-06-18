<script setup lang="ts">
import type { Link } from '@@/schemas/link'
import { BarChart3, CalendarPlus2 } from 'lucide-vue-next'
import { formatUtmTooltip } from '~/utils/link-formatter'

interface Props {
  link: Link
  organizationConfig: any
  hasUtmParams: boolean
}

const props = defineProps<Props>()

const utmTooltipData = computed(() => formatUtmTooltip(props.link))
</script>

<template>
  <div class="flex items-center space-x-2 text-muted-foreground flex-wrap gap-1">
    <!-- Creation date -->
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <div class="flex items-center shrink-0">
            <CalendarPlus2 class="w-3 h-3 mr-1" />
            <span>{{ shortDate(link.createdAt) }}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Created At: {{ longDate(link.createdAt) }}</p>
          <p>Updated At: {{ longDate(link.updatedAt) }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <!-- Organization -->
    <template v-if="organizationConfig">
      <span class="text-muted-foreground">|</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <div class="flex items-center gap-1 shrink-0">
              <div
                v-if="organizationConfig.logo"
                class="flex items-center justify-center w-3 h-3"
              >
                <img
                  :src="`/logos/${organizationConfig.logo}`"
                  :alt="organizationConfig.name"
                  class="w-3 h-3 object-contain"
                  loading="lazy"
                >
              </div>
              <span>{{ organizationConfig.initials }}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ organizationConfig.name }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </template>

    <!-- UTM tags -->
    <template v-if="hasUtmParams">
      <span class="text-muted-foreground">|</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <div class="flex items-center text-blue-600 shrink-0">
              <BarChart3 class="w-3 h-3 mr-1" />
              <span>UTM</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div class="space-y-1">
              <p
                v-for="param in utmTooltipData"
                :key="param.label"
              >
                <strong>{{ param.label }}:</strong> {{ param.value }}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </template>
  </div>
</template>
