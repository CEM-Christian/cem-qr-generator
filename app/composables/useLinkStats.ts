import type { LinkStats } from '~/types/link-stats'

interface UseLinkStatsOptions {
  immediate?: boolean
}

export function useLinkStats(slug: Ref<string> | string, options: UseLinkStatsOptions = {}) {
  const { immediate = true } = options

  const stats = ref<LinkStats | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const slugRef = typeof slug === 'string' ? ref(slug) : slug

  const fetchStats = async () => {
    if (!slugRef.value)
      return

    loading.value = true
    error.value = null

    try {
      const response = await useAPI(`/api/link/stats?slug=${encodeURIComponent(slugRef.value)}`)

      // If response is null, analytics service is unavailable
      if (response === null) {
        stats.value = null
        return
      }

      stats.value = response as LinkStats
    }
    catch (err) {
      // Log error but don't throw - allows graceful degradation
      console.error('Failed to fetch link stats:', err)
      error.value = err as Error
      stats.value = null
    }
    finally {
      loading.value = false
    }
  }

  // Watch for slug changes and refetch
  watch(slugRef, fetchStats, { immediate })

  return {
    stats: readonly(stats),
    loading: readonly(loading),
    error: readonly(error),
    fetchStats,
    refresh: fetchStats,
  }
}
