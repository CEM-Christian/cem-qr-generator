<script setup lang="ts">
interface Props {
  showTopGradient: boolean
  showBottomGradient: boolean
  topGradientOpacity: number
  bottomGradientOpacity: number
}

const props = defineProps<Props>()

// Computed styles for gradient indicators with dynamic opacity
const topGradientStyle = computed(() => ({
  opacity: props.topGradientOpacity,
}))

const bottomGradientStyle = computed(() => ({
  opacity: props.bottomGradientOpacity,
}))
</script>

<template>
  <!-- Top gradient indicator -->
  <div
    v-if="showTopGradient"
    class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/20 via-black/10 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent pointer-events-none z-10"
    :style="topGradientStyle"
  />

  <!-- Bottom gradient indicator -->
  <div
    v-if="showBottomGradient"
    class="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/20 via-black/10 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent pointer-events-none z-10"
    :style="bottomGradientStyle"
  />
</template>
