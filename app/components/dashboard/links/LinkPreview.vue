<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Copy, CopyCheck, ExternalLink } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface Props {
  slug?: string
  url?: string
  utmParams?: Record<string, string>
  baseUrl?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  slug: '',
  url: '',
  utmParams: () => ({}),
  baseUrl: '',
})

const { t } = useI18n()

// Get base URL from current location
const baseUrl = computed(() => {
  if (import.meta.server)
    return props.baseUrl || ''
  const { origin } = window.location
  return props.baseUrl || origin
})

// Build short URL
const shortUrl = computed(() => {
  const slug = props.slug || 'your-slug'
  return `${baseUrl.value}/${slug}`
})

// Build destination URL with UTM parameters
const destinationUrl = computed(() => {
  if (!props.url)
    return ''

  try {
    const url = new URL(props.url)

    // Add UTM parameters if they exist and are not empty
    Object.entries(props.utmParams).forEach(([key, value]) => {
      if (value && value.trim() && value !== 'undefined') {
        url.searchParams.set(key, value.trim())
      }
    })

    return url.toString()
  }
  catch {
    return props.url
  }
})

// Copy functionality for short URL
const { copy: copyShort, copied: copiedShort } = useClipboard({
  source: shortUrl,
  copiedDuring: 2000,
})

// Copy functionality for destination URL
const { copy: copyDestination, copied: copiedDestination } = useClipboard({
  source: destinationUrl,
  copiedDuring: 2000,
})

function handleCopyShort() {
  copyShort()
  toast(t('links.preview.copy_short_success'))
}

function handleCopyDestination() {
  copyDestination()
  toast(t('links.preview.copy_destination_success'))
}

// Truncate long URLs for display
function truncateUrl(url: string, maxLength = 60) {
  if (url.length <= maxLength)
    return url
  return `${url.substring(0, maxLength - 3)}...`
}
</script>

<template>
  <div
    :class="cn('border rounded-lg p-4 bg-muted/30 space-y-3', props.class)"
  >
    <h3 class="text-sm font-medium text-foreground mb-3">
      {{ $t('links.preview.title') }}
    </h3>

    <!-- Short URL Preview -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-xs font-medium text-muted-foreground">
          {{ $t('links.preview.short_url') }}
        </label>
        <Button
          variant="ghost"
          size="sm"
          class="h-6 w-6 p-0"
          :title="$t('links.preview.copy_short')"
          @click="handleCopyShort"
        >
          <CopyCheck v-if="copiedShort" class="h-3 w-3" />
          <Copy v-else class="h-3 w-3" />
        </Button>
      </div>
      <div
        class="text-sm bg-background border rounded px-3 py-2 font-mono cursor-pointer hover:bg-muted/50 transition-colors"
        :title="shortUrl"
        role="button"
        tabindex="0"
        :aria-label="$t('links.preview.copy_short')"
        @click="handleCopyShort"
        @keydown.enter="handleCopyShort"
        @keydown.space.prevent="handleCopyShort"
      >
        {{ truncateUrl(shortUrl) }}
      </div>
    </div>

    <!-- Destination URL Preview -->
    <div v-if="destinationUrl" class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-xs font-medium text-muted-foreground">
          {{ $t('links.preview.destination_url') }}
        </label>
        <div class="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            class="h-6 w-6 p-0"
            :title="$t('links.preview.copy_destination')"
            @click="handleCopyDestination"
          >
            <CopyCheck v-if="copiedDestination" class="h-3 w-3" />
            <Copy v-else class="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            as="a"
            :href="destinationUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="h-6 w-6 p-0"
            :title="$t('links.preview.open_destination')"
          >
            <ExternalLink class="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div
        class="text-sm bg-background border rounded px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
        :title="destinationUrl"
        role="button"
        tabindex="0"
        :aria-label="$t('links.preview.copy_destination')"
        @click="handleCopyDestination"
        @keydown.enter="handleCopyDestination"
        @keydown.space.prevent="handleCopyDestination"
      >
        {{ truncateUrl(destinationUrl, 80) }}
      </div>
    </div>
  </div>
</template>
