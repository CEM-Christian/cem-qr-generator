<script setup lang="ts">
import type { Link } from '../../../../schemas/link'
import type { OrganizationId } from '../../../../schemas/organization'
import { useInfiniteScroll } from '@vueuse/core'
import { Loader } from 'lucide-vue-next'

const links = ref<Link[]>([])
const limit = 24
let cursor = ''
let listComplete = false
let listError = false

const sortBy = ref('newest')
const selectedOrganization = ref<OrganizationId | '' | 'all'>('all')

// Layout preference integration
const { layout, setLayout } = useLayoutPreference()

// URL parameter persistence
const route = useRoute()
const router = useRouter()

// Initialize from URL parameters
onMounted(() => {
  if (route.query.organization) {
    selectedOrganization.value = route.query.organization as OrganizationId | 'all'
  }
  if (route.query.sort) {
    sortBy.value = route.query.sort as string
  }
})

// Watch for changes and update URL
watch([selectedOrganization, sortBy], ([newOrg, newSort]) => {
  const query = { ...route.query }

  if (newOrg && newOrg !== 'all') {
    query.organization = newOrg
  }
  else {
    delete query.organization
  }

  if (newSort && newSort !== 'newest') {
    query.sort = newSort
  }
  else {
    delete query.sort
  }

  router.replace({ query })
}, { deep: true })

const displayedLinks = computed(() => {
  let filtered = [...links.value]

  // Filter by organization if selected (and not 'all')
  if (selectedOrganization.value && selectedOrganization.value !== 'all') {
    filtered = filtered.filter(link =>
      link.organization === selectedOrganization.value,
    )
  }

  // Sort the filtered results
  switch (sortBy.value) {
    case 'newest':
      return filtered.sort((a, b) => b.createdAt - a.createdAt)
    case 'oldest':
      return filtered.sort((a, b) => a.createdAt - b.createdAt)
    case 'name-az':
      return filtered.sort((a, b) => {
        const nameA = a.name || a.slug // Fallback to slug if name is not available
        const nameB = b.name || b.slug
        return nameA.localeCompare(nameB)
      })
    case 'name-za':
      return filtered.sort((a, b) => {
        const nameA = a.name || a.slug
        const nameB = b.name || b.slug
        return nameB.localeCompare(nameA)
      })
    case 'slug-az':
      return filtered.sort((a, b) => a.slug.localeCompare(b.slug))
    case 'slug-za':
      return filtered.sort((a, b) => b.slug.localeCompare(a.slug))
    default:
      return filtered
  }
})

async function getLinks() {
  try {
    const data = await useAPI('/api/link/list', {
      query: {
        limit,
        cursor,
      },
    }) as { links: Link[], cursor: string, list_complete: boolean }
    links.value = links.value.concat(data.links).filter(Boolean) // Sometimes cloudflare will return null, filter out
    cursor = data.cursor
    listComplete = data.list_complete
    listError = false
  }
  catch (error) {
    console.error(error)
    listError = true
  }
}

const { isLoading } = useInfiniteScroll(
  document,
  getLinks,
  {
    distance: 150,
    interval: 1000,
    canLoadMore: () => {
      return !listError && !listComplete
    },
  },
)

function updateLinkList(link: Link, type?: 'edit' | 'delete' | 'create') {
  if (type === 'edit') {
    const index = links.value.findIndex(l => l.id === link.id)
    links.value[index] = link
  }
  else if (type === 'delete') {
    const index = links.value.findIndex(l => l.id === link.id)
    links.value.splice(index, 1)
  }
  else {
    links.value.unshift(link)
    sortBy.value = 'newest'
  }
}
</script>

<template>
  <main class="space-y-6">
    <div class="flex flex-col gap-6 md:gap-2 md:flex-row md:justify-between">
      <DashboardNav class="flex-1">
        <DashboardLinksEditor @update:link="updateLinkList" />
      </DashboardNav>
      <div class="flex flex-col lg:flex-row justify-end lg:justify-start items-stretch md:items-end gap-2">
        <div class="flex items-center gap-2">
          <DashboardLinksSort v-model:sort-by="sortBy" />
          <DashboardLinksOrganizationFilter v-model:selected-organization="selectedOrganization" />
          <DashboardLinksLayoutToggle
            :layout="layout"
            @update:layout="setLayout"
          />
        </div>
        <LazyDashboardLinksSearch />
      </div>
    </div>
    <section
      class="grid gap-4"
      :class="layout === 'qr'
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'"
    >
      <DashboardLinksLink
        v-for="link in displayedLinks"
        :key="link.id"
        :link="link"
        :layout="layout"
        @update:link="updateLinkList"
      />
    </section>
    <div
      v-if="isLoading"
      class="flex items-center justify-center"
    >
      <Loader class="animate-spin" />
    </div>
    <div
      v-if="!isLoading && listComplete"
      class="flex items-center justify-center text-sm"
    >
      {{ $t('links.no_more') }}
    </div>
    <div
      v-if="listError"
      class="flex items-center justify-center text-sm"
    >
      {{ $t('links.load_failed') }}
      <Button variant="link" @click="getLinks">
        {{ $t('common.try_again') }}
      </Button>
    </div>
  </main>
</template>
