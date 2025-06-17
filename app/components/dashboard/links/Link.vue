<script setup lang="ts">
import type { LayoutType } from '~/composables/useLayoutPreference'
import { nanoid } from '@@/schemas/link'
import { useClipboard } from '@vueuse/core'
import { BarChart3, CalendarPlus2, Copy, CopyCheck, Download, Eraser, ExternalLink, Palette, PenLine, QrCode, SquareChevronDown } from 'lucide-vue-next'
import { parseURL } from 'ufo'
import { toast } from 'vue-sonner'
import { useQRCode } from '~/composables/useQRCode'
import { DownloadOptionsModal } from '../../ui/download-options-modal'
import { QRStyleEditor } from '../../ui/qr-style-editor'
import QRCode from './QRCode.vue'

interface Props {
  link: Record<string, any>
  layout?: LayoutType
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'condensed',
})

const emit = defineEmits<{
  'update:link': [link: any, type?: 'edit' | 'delete' | 'create']
}>()

const { t } = useI18n()
const { getOrganizationById } = useOrganizations()
const editPopoverOpen = ref(false)
const qrPopoverOpen = ref(false)
const qrCodeRef = ref<InstanceType<typeof QRCode> | null>(null)

// QR Code background operations
const showDownloadModal = ref(false)
const showStyleEditor = ref(false)
const { downloadQRCode } = useQRCode()

const { host, origin } = location

function getLinkHost(url: string) {
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

const { copy, copied } = useClipboard({ source: shortLink.value, copiedDuring: 400 })

function updateLink(link: any, type?: 'edit' | 'delete' | 'create') {
  emit('update:link', link, type)
  editPopoverOpen.value = false
}

function copyLink() {
  copy(shortLink.value)
  toast(t('links.copy_success'))
}

function handleQRDownload() {
  // Open download modal directly without QR popup
  showDownloadModal.value = true
}

function handleQRStyleEdit() {
  // Open style editor directly without QR popup
  showStyleEditor.value = true
}

function handleDownloadConfirm(downloadOptions: any) {
  try {
    downloadQRCode({
      data: shortLink.value,
      image: linkIcon.value,
      link: props.link,
      format: downloadOptions.format,
      resolution: downloadOptions.resolution,
    })
  }
  catch (error) {
    console.error('Failed to download QR code:', error)
    toast.error(t('qr_style_editor.save_error'))
  }
}

function handleStyleSave(updatedLink: any) {
  updateLink(updatedLink, 'edit')
}

function handleDuplicateLink() {
  // Create a duplicate of the current link with a new slug
  const duplicateData = {
    ...props.link,
    slug: nanoid()(), // Generate new slug
    name: props.link.name ? `${props.link.name} (Copy)` : undefined,
    // Remove ID and timestamps as these will be generated fresh
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  }

  // Emit as a create event to add to the list
  emit('update:link', duplicateData, 'create')
  toast(t('links.messages.create_success'))
}
</script>

<template>
  <Card>
    <!-- Details Layout (default) -->
    <div
      v-if="layout === 'condensed'"
      class="flex flex-col p-4 space-y-3 hover:bg-accent/50 hover:text-accent-foreground transition-colors"
    >
      <div class="flex items-center justify-center space-x-1">
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
            :to="`/dashboard/link?slug=${link.slug}`"
          >
            {{ link.name || `${host}/${link.slug}` }}
          </NuxtLink>

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

        <Popover v-model:open="qrPopoverOpen">
          <PopoverTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8"
              @click.prevent
            >
              <QrCode class="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <QRCode
              ref="qrCodeRef"
              :data="shortLink"
              :image="linkIcon"
              :link="link"
              button-mode="hidden"
              @update:link="updateLink"
            />
          </PopoverContent>
        </Popover>

        <!-- QR Action Buttons -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                @click.prevent="handleQRDownload"
              >
                <Download class="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ $t('common.download') }} QR</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                @click.prevent="handleQRStyleEdit"
              >
                <Palette class="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ $t('qr_style_editor.edit_style') }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Popover v-model:open="editPopoverOpen">
          <PopoverTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8"
              @click.prevent
            >
              <SquareChevronDown class="w-5 h-5" />
            </Button>
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
                <PenLine
                  class="w-5 h-5 mr-2"
                />
                {{ $t('common.edit') }}
              </div>
            </DashboardLinksEditor>

            <Separator />

            <div
              class="cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              @click.prevent="handleDuplicateLink"
            >
              <Copy
                class="w-5 h-5 mr-2"
              />
              {{ $t('common.duplicate') }}
            </div>

            <Separator />

            <DashboardLinksDelete
              :link="link"
              @update:link="updateLink"
            >
              <div
                class="cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-destructive"
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
              <p>{{ $t('links.click_to_copy') }}</p>
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
    </div>

    <!-- QR Layout -->
    <div
      v-else-if="layout === 'qr-code'"
      class="flex flex-col md:flex-row items-start md:items-center p-4 space-y-4 md:space-y-0 md:space-x-4 hover:bg-accent/50 hover:text-accent-foreground transition-colors"
    >
      <!-- Left: QR Code Section -->
      <div class="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
        <QRCode
          ref="qrCodeRef"
          :data="shortLink"
          :image="linkIcon"
          :link="link"
          :size="180"
          button-mode="hidden"
          :compact="true"
          @update:link="updateLink"
        />
      </div>

      <!-- Right: Condensed Details -->
      <div class="flex-1 min-w-0 w-full">
        <!-- Title and actions -->
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-lg truncate">
            <NuxtLink
              class="hover:underline"
              :to="`/dashboard/link?slug=${link.slug}`"
            >
              {{ link.name || `${host}/${link.slug}` }}
            </NuxtLink>
          </h3>
          <div class="flex items-center space-x-1 flex-shrink-0">
            <!-- Edit Button - NEW -->
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <div>
                    <DashboardLinksEditor :link="link" @update:link="updateLink">
                      <Button
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8"
                      >
                        <PenLine class="w-5 h-5" />
                      </Button>
                    </DashboardLinksEditor>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ $t('links.actions.edit') }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <!-- QR Action Buttons -->
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8"
                    @click.prevent="handleQRDownload"
                  >
                    <Download class="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ $t('common.download') }} QR</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8"
                    @click.prevent="handleQRStyleEdit"
                  >
                    <Palette class="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ $t('qr_style_editor.edit_style') }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <!-- Dropdown for remaining actions -->
            <Popover v-model:open="editPopoverOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8"
                  @click.prevent
                >
                  <SquareChevronDown class="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                class="w-auto p-0"
                :hide-when-detached="false"
              >
                <div
                  class="cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  @click.prevent="handleDuplicateLink"
                >
                  <Copy class="w-5 h-5 mr-2" />
                  {{ $t('common.duplicate') }}
                </div>

                <Separator />

                <DashboardLinksDelete
                  :link="link"
                  @update:link="updateLink"
                >
                  <div
                    class="cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-destructive"
                  >
                    <Eraser class="w-5 h-5 mr-2" />
                    {{ $t('common.delete') }}
                  </div>
                </DashboardLinksDelete>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <!-- Optional comment/description -->
        <p v-if="link.comment || link.title || link.description" class="text-sm text-muted-foreground truncate mt-1">
          {{ link.comment || link.title || link.description }}
        </p>

        <!-- URLs and metadata -->
        <div class="space-y-2 text-sm mt-3">
          <!-- Shortened URL -->
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <div
                  class="inline-flex items-center cursor-pointer hover:bg-accent/50 hover:underline rounded px-1 -mx-1"
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
                <p>{{ $t('links.click_to_copy') }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <!-- Destination URL -->
          <div class="flex items-center space-x-1">
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

          <!-- Metadata row -->
          <div class="flex items-center space-x-2 text-muted-foreground flex-wrap gap-1">
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
      </div>
    </div>
  </Card>

  <!-- QR Download Modal -->
  <DownloadOptionsModal
    v-model:open="showDownloadModal"
    @download="handleDownloadConfirm"
  />

  <!-- QR Style Editor Modal -->
  <QRStyleEditor
    v-model:open="showStyleEditor"
    :data="shortLink"
    :image="linkIcon"
    :initial-options="link.qr_style_options || {}"
    :link="link"
    @save="handleStyleSave"
  />
</template>
