<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarRoot } from 'radix-vue'
import { type AvatarVariants, avatarVariant } from '.'
import { cn } from '@/utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
  background?: AvatarVariants['background']
}>(), {
  size: 'sm',
  shape: 'circle',
  background: 'tertiary'
})
</script>

<template>
  <AvatarRoot :class="cn(avatarVariant({ size, shape, background }), props.class)">
    <slot />
  </AvatarRoot>
</template>
