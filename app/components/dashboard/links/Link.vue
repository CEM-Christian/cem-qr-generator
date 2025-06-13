<script setup>
import { useClipboard } from '@vueuse/core'
import { BarChart3, CalendarPlus2, Copy, CopyCheck, Eraser, Link as LinkIcon, QrCode, SquareChevronDown, SquarePen, ExternalLink } from 'lucide-vue-next'
import { parseURL } from 'ufo'
import { toast } from 'vue-sonner'
import QRCode from './QRCode.vue'

const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:link'])

const { t } = useI18n()
const { getOrganizationById } = useOrganizations()
const editPopoverOpen = ref(false)

const { host, origin } = location

function getLinkHost(url) {
  const { host } = parseURL(url)
  return host
}

const shortLink = computed(() => `${origin}/${props.link.slug}`)
const linkIcon = computed(() => `https://unavatar.io/${getLinkHost(props.link.url)}?fallback=https://sink.cool/icon.png`)

const hasUtmParams = computed(() => {
  return !!(props.link.utm_source || props.link.utm_medium || props.link.utm_campaign || props.link.utm_id)
})

const organizationConfig = computed(() => {
  return props.link.organization ? getOrganizationById(props.link.organization) : null
})

// const organizationTooltip = computed(() => {
//   return organizationConfig.value?.name || ''
// })

const { copy, copied } = useClipboard({ source: shortLink.value, copiedDuring: 400 })

function updateLink(link, type) {
  emit('update:link', link, type)
  editPopoverOpen.value = false
}

function copyLink() {
  copy(shortLink.value)
  toast(t('links.copy_success'))
}
</script>

<template>
  <Card>
    <NuxtLink
      class="flex flex-col p-4 space-y-3 hover:bg-accent/50 hover:text-accent-foreground transition-colors"
      :to="`/dashboard/link?slug=${link.slug}`"
    >
      <div class="flex items-center justify-center space-x-3">
        <Avatar shape="square">
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
          <div class="flex items-center">
            <div class="font-bold leading-5 truncate text-lg">
              {{ link.name || `${host}/${link.slug}` }}
            </div>
          </div>

          <!-- Optional comment/description below name -->
          <TooltipProvider v-if="link.comment || link.title || link.description">
            <Tooltip>
              <TooltipTrigger as-child>
                <p class="text-sm text-muted-foreground truncate">
                  {{ link.comment || link.title || link.description }}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p class="max-w-[90svw] break-all">
                  {{ link.comment || link.title || link.description }}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <a
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
        >
          <LinkIcon class="w-5 h-5" />
        </a>

        <Popover>
          <PopoverTrigger>
            <QrCode
              class="w-5 h-5"
              @click.prevent
            />
          </PopoverTrigger>
          <PopoverContent>
            <QRCode
              :data="shortLink"
              :image="linkIcon"
              :link="link"
              @update:link="updateLink"
            />
          </PopoverContent>
        </Popover>

        <Popover v-model:open="editPopoverOpen">
          <PopoverTrigger>
            <SquareChevronDown
              class="w-5 h-5"
              @click.prevent
            />
          </PopoverTrigger>
          <PopoverContent
            class="w-auto p-0"
            :hide-when-detached="false"
          >
            <DashboardLinksEditor
              :link="link"
              @update:link="updateLink"
            >
              <div
                class="cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <SquarePen
                  class="w-5 h-5 mr-2"
                />
                {{ $t('common.edit') }}
              </div>
            </DashboardLinksEditor>

            <Separator />

            <DashboardLinksDelete
              :link="link"
              @update:link="updateLink"
            >
              <div
                class="cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <Eraser
                  class="w-5 h-5 mr-2"
                /> {{ $t('common.delete') }}
              </div>
            </DashboardLinksDelete>
          </PopoverContent>
        </Popover>
      </div>

      <!-- Footer content reorganized into three rows -->
      <div class="text-sm">
        <!-- First row: Shortened URL -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <div
                class="inline-flex items-center mb-1 cursor-pointer hover:bg-accent/50 hover:underline rounded px-1 -mx-1"
                @click.prevent="copyLink"
              >
                <span class="truncate">{{ shortLink }}</span>
                <CopyCheck
                  v-if="copied"
                  class="w-4 h-4 ml-2 shrink-0"
                />
                <Copy
                  v-else
                  class="w-4 h-4 ml-2 shrink-0"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ $t('links.click_to_copy') }}: {{ shortLink }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- Second row: Destination URL -->
        <div class="flex items-center space-x-1 mb-2">
          <span class="text-muted-foreground">↳</span>
          <a
            :href="link.url"
            class="inline-flex items-center hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            <span class="truncate">{{ link.url }}</span>
            <ExternalLink class="w-4 h-4 ml-2 shrink-0" />
          </a>
        </div>

        <!-- Third row: Creation date, organization, and UTM tags -->
        <div class="flex items-center space-x-2 text-muted-foreground">
          <!-- Creation date -->
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <div class="flex items-center shrink-0">
                  <CalendarPlus2 class="w-3 h-3 mr-1" />
                  <span>{{ shortDate(link.createdAt) }}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Created At: {{ longDate(link.createdAt) }}</p>
                <p>Updated At: {{ longDate(link.updatedAt) }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <!-- Organization -->
          <template v-if="organizationConfig">
            <span class="text-muted-foreground">|</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <div class="flex items-center gap-1 shrink-0">
                    <!-- Logo or initials -->
                    <div
                      v-if="organizationConfig.logo"
                      class="flex items-center justify-center w-3 h-3"
                    >
                      <img
                        :src="`/logos/${organizationConfig.logo}`"
                        :alt="organizationConfig.name"
                        class="w-3 h-3 object-contain"
                        loading="lazy"
                      >
                    </div>
                    <span>{{ organizationConfig.initials }}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ organizationConfig.name }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </template>

          <!-- UTM tags -->
          <template v-if="hasUtmParams">
            <span class="text-muted-foreground">|</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <div class="flex items-center text-blue-600 shrink-0">
                    <BarChart3 class="w-3 h-3 mr-1" />
                    <span>UTM</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div class="space-y-1">
                    <p v-if="link.utm_source">
                      <strong>Source:</strong> {{ link.utm_source }}
                    </p>
                    <p v-if="link.utm_medium">
                      <strong>Medium:</strong> {{ link.utm_medium }}
                    </p>
                    <p v-if="link.utm_campaign">
                      <strong>Campaign:</strong> {{ link.utm_campaign }}
                    </p>
                    <p v-if="link.utm_id">
                      <strong>ID:</strong> {{ link.utm_id }}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </template>
        </div>
      </div>
    </NuxtLink>
  </Card>
</template>
