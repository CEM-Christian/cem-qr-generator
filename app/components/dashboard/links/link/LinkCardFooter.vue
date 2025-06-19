<script setup lang="ts">
import type { Link } from '@@/schemas/link'
import { Copy, CopyCheck, ExternalLink } from 'lucide-vue-next'
// import LinkMetadata from './LinkMetadata.vue'

interface Props {
  link: Link
  shortLink: string
  copied: boolean
  organizationConfig: any
  hasUtmParams: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  copyLink: []
}>()

function handleCopyLink() {
  emit('copyLink')
}
</script>

<template>
  <div class="text-sm space-y-2 pr-1">
    <!-- Shortened URL -->
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <div
            class="inline-flex items-center cursor-pointer hover:bg-accent/50 hover:underline rounded px-1 -mx-1"
            @click.prevent="handleCopyLink"
          >
            <span class="truncate">{{ shortLink }}</span>
            <CopyCheck
              v-if="copied"
              class="w-4 h-4 ml-2 shrink-0"
            />
            <Copy
              v-else
              class="w-4 h-4 ml-2 shrink-0"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ $t('links.click_to_copy') }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <!-- Destination URL -->
    <div class="flex items-center gap-1 min-w-0">
      <span class="text-muted-foreground shrink-0">↳</span>
      <a
        :href="link.url"
        class="flex items-center hover:underline min-w-0 flex-1"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
      >
        <span class="truncate">{{ link.url }}</span>
        <ExternalLink class="w-4 h-4 ml-2 shrink-0" />
      </a>
    </div>

    <!-- Metadata row -->
    <DashboardLinksLinkMetadata
      :link="link"
      :organization-config="organizationConfig"
      :has-utm-params="hasUtmParams"
    />
  </div>
</template>
