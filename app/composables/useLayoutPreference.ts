export type LayoutType = 'condensed' | 'qr-code'

// Migration function for backward compatibility
function migrateOldLayoutValue(value: string): LayoutType {
  switch (value) {
    case 'qr':
      return 'qr-code'
    case 'details':
    case 'grid':
    case 'list':
    default:
      return 'condensed'
  }
}

export function useLayoutPreference() {
  const layout = ref<LayoutType>('condensed')

  // Persist preference to localStorage
  watchEffect(() => {
    if (import.meta.client) {
      localStorage.setItem('links-layout-preference', layout.value)
    }
  })

  // Load saved preference on mount with migration
  onMounted(() => {
    if (import.meta.client) {
      const saved = localStorage.getItem('links-layout-preference')
      if (saved) {
        layout.value = migrateOldLayoutValue(saved)
      }
    }
  })

  const setLayout = (newLayout: LayoutType) => {
    layout.value = newLayout
    // Immediately persist the new value
    if (import.meta.client) {
      localStorage.setItem('links-layout-preference', newLayout)
    }
  }

  return {
    layout: readonly(layout),
    setLayout,
  }
}
