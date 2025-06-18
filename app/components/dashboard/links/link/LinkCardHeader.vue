<script setup lang="ts">
import type { Link } from '@@/schemas/link'

interface Props {
  link: Link
  linkIcon: string
  displayName: string
  description?: string
  detailPageLink: string
  layout?: 'condensed' | 'qr-code'
}

withDefaults(defineProps<Props>(), {
  layout: 'condensed',
})
</script>

<template>
  <!-- Condensed Layout Header -->
  <div v-if="layout === 'condensed'" class="flex items-center justify-center space-x-1">
    <Avatar class="mr-2" shape="square">
      <AvatarImage
        :src="linkIcon"
        alt="@radix-vue"
        loading="lazy"
      />
      <AvatarFallback>
        <img
          src="/icon.png"
          alt="Sink"
          loading="lazy"
        >
      </AvatarFallback>
    </Avatar>

    <div class="flex-1 overflow-hidden">
      <NuxtLink
        class="font-bold leading-5 truncate text-lg hover:underline"
        :to="detailPageLink"
      >
        {{ displayName }}
      </NuxtLink>

      <!-- Optional comment/description below name -->
      <TooltipProvider v-if="description">
        <Tooltip>
          <TooltipTrigger as-child>
            <p class="text-sm text-muted-foreground truncate">
              {{ description }}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p class="max-w-[90svw] break-all">
              {{ description }}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <slot name="actions" />
  </div>

  <!-- QR Code Layout Header -->
  <div v-else-if="layout === 'qr-code'" class="flex items-center justify-between">
    <h3 class="font-bold text-lg truncate">
      <NuxtLink
        class="hover:underline"
        :to="detailPageLink"
      >
        {{ displayName }}
      </NuxtLink>
    </h3>
    <slot name="actions" />
  </div>
</template>
