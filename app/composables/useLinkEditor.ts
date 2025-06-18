/**
 * Composable for managing link editor state and operations
 */
export function useLinkEditor() {
  const dialogOpen = ref(false)
  const autoFormRef = ref()
  const scrollContainer = ref<HTMLElement>()

  // Scroll indicators setup
  const scrollIndicators = useScrollIndicators(scrollContainer, {
    watchTargets: [() => dialogOpen.value],
  })

  // Setup scroll event listeners for accordion interactions
  function setupScrollListeners() {
    nextTick(() => {
      if (scrollContainer.value) {
        // Observe for any click events that might trigger accordion changes
        scrollContainer.value.addEventListener('click', (e) => {
          const target = e.target as HTMLElement
          // Check if clicked element looks like an accordion trigger
          if (target.matches('button') || target.closest('button')) {
            console.log('Button clicked, scheduling update:', target)
            // Schedule update after potential accordion animation
            setTimeout(() => {
              scrollIndicators.scheduleUpdate()
            }, 150)
          }
        })
      }
    })
  }

  // Function to trigger form submission from external button
  function handleExternalSubmit(submitFn: () => void) {
    submitFn()
  }

  function openDialog() {
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
  }

  return {
    dialogOpen,
    autoFormRef,
    scrollContainer,
    scrollIndicators,
    setupScrollListeners,
    handleExternalSubmit,
    openDialog,
    closeDialog,
  }
}
