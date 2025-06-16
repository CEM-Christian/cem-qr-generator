export type LayoutType = 'details' | 'qr'

export function useLayoutPreference() {
  const layout = ref<LayoutType>('details')

  // Persist preference to localStorage
  watchEffect(() => {
    if (import.meta.client) {
      localStorage.setItem('links-layout-preference', layout.value)
    }
  })

  // Load saved preference on mount
  onMounted(() => {
    if (import.meta.client) {
      const saved = localStorage.getItem('links-layout-preference')
      if (saved === 'qr' || saved === 'details') {
        layout.value = saved
      }
    }
  })

  const setLayout = (newLayout: LayoutType) => {
    layout.value = newLayout
  }

  return {
    layout: readonly(layout),
    setLayout,
  }
}
