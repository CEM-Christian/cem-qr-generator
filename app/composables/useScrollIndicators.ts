export interface ScrollIndicatorState {
  showTopGradient: Ref<boolean>
  showBottomGradient: Ref<boolean>
  topGradientOpacity: Ref<number>
  bottomGradientOpacity: Ref<number>
  updateScrollIndicators: () => void
  /** Manually trigger a delayed update (useful for form changes) */
  scheduleUpdate: () => void
}

export interface ScrollIndicatorOptions {
  /** Height of gradient indicators in pixels */
  indicatorHeight?: number
  /** Additional watch targets for immediate updates */
  watchTargets?: Array<() => any>
  /** Debounce delay for updates in milliseconds */
  debounceDelay?: number
}

export function useScrollIndicators(
  scrollContainer: Ref<HTMLElement | undefined>,
  options: ScrollIndicatorOptions = {},
): ScrollIndicatorState {
  const {
    indicatorHeight = 16,
    watchTargets = [],
    debounceDelay = 30,
  } = options

  // Reactive state
  const showTopGradient = ref(false)
  const showBottomGradient = ref(false)
  const topGradientOpacity = ref(0)
  const bottomGradientOpacity = ref(0)

  // Debounced update mechanism
  let updateTimeout: ReturnType<typeof setTimeout> | null = null

  // Cleanup resources
  let resizeObserver: ResizeObserver | null = null
  let currentContainer: HTMLElement | null = null

  // Cleanup function
  function cleanup() {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (currentContainer) {
      currentContainer.removeEventListener('scroll', updateScrollIndicators)
      currentContainer = null
    }
    if (updateTimeout) {
      clearTimeout(updateTimeout)
      updateTimeout = null
    }
  }

  // Core scroll indicator calculation
  function updateScrollIndicators() {
    if (!scrollContainer.value)
      return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
    const maxScrollTop = scrollHeight - clientHeight

    // Calculate top gradient opacity based on scroll distance
    if (scrollTop > 0) {
      showTopGradient.value = true
      // Fade in over the indicator height distance
      topGradientOpacity.value = Math.min(scrollTop / (indicatorHeight * 2), 1)
    }
    else {
      showTopGradient.value = false
      topGradientOpacity.value = 0
    }

    // Calculate bottom gradient opacity based on remaining scroll distance
    const remainingScroll = maxScrollTop - scrollTop
    if (remainingScroll > 0) {
      showBottomGradient.value = true
      // Fade in over the indicator height distance
      bottomGradientOpacity.value = Math.min(remainingScroll / indicatorHeight, 1)
    }
    else {
      showBottomGradient.value = false
      bottomGradientOpacity.value = 0
    }
  }

  // Scheduled update with debouncing
  function scheduleUpdate() {
    if (updateTimeout)
      clearTimeout(updateTimeout)
    updateTimeout = setTimeout(() => {
      updateScrollIndicators()
    }, debounceDelay)
  }

  // Centralized cleanup function
  function performCleanup() {
    cleanup()
  }

  // Set up observers when container is available
  watch(scrollContainer, (newContainer, _oldContainer) => {
    // Cleanup previous setup
    performCleanup()

    if (newContainer) {
      currentContainer = newContainer

      // **Primary: ResizeObserver for height changes**
      resizeObserver = new ResizeObserver(() => {
        scheduleUpdate()
      })
      resizeObserver.observe(newContainer)

      // **Secondary: Scroll event for immediate feedback**
      newContainer.addEventListener('scroll', updateScrollIndicators)

      // Initial update
      nextTick(() => {
        updateScrollIndicators()
      })
    }
  }, { immediate: true })

  // Global cleanup on unmount - register at component level
  onUnmounted(performCleanup)

  // Watch additional targets for immediate updates
  if (watchTargets.length > 0) {
    watch(watchTargets, () => {
      scheduleUpdate()
    }, { deep: true })
  }

  return {
    showTopGradient,
    showBottomGradient,
    topGradientOpacity,
    bottomGradientOpacity,
    updateScrollIndicators,
    scheduleUpdate,
  }
}
