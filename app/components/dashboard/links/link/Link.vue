<script setup lang="ts">
import type { Link } from '@@/schemas/link'
import type { LinkCardLayout, LinkUpdateType } from '@@/schemas/link-display'
import type LinkQRCode from './LinkQRCode.vue'
import { DownloadOptionsModal } from '../../../ui/download-options-modal'
import { QRStyleEditor } from '../../../ui/qr-style-editor'
// import LinkCardActions from './LinkCardActions.vue'
// import LinkCardFooter from './LinkCardFooter.vue'
// import LinkCardHeader from './LinkCardHeader.vue'

interface Props {
  link: Link
  layout?: LinkCardLayout
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'condensed',
})

const emit = defineEmits<{
  'update:link': [link: Link, type?: LinkUpdateType]
}>()

// Use composables for link card logic
const linkRef = toRef(props, 'link')
const {
  shortLink,
  linkIcon,
  displayName,
  description,
  hasUtmParams,
  organizationConfig,
  detailPageLink,
} = useLinkCard(linkRef)

const {
  copied,
  showDownloadModal,
  showStyleEditor,
  copyLink,
  updateLink,
  handleQRDownload,
  handleQRStyleEdit,
  handleDownloadConfirm,
  handleStyleSave,
  handleDuplicateLink,
} = useLinkActions(linkRef, shortLink, linkIcon, emit)

const qrCodeRef = ref<InstanceType<typeof LinkQRCode> | null>(null)

// Event handlers for child components
function handleCopyLink() {
  copyLink()
}

function handleActionsQRDownload() {
  handleQRDownload()
}

function handleActionsQRStyleEdit() {
  handleQRStyleEdit()
}

function handleActionsDuplicate() {
  handleDuplicateLink()
}
</script>

<template>
  <Card>
    <!-- Condensed Layout -->
    <div
      v-if="layout === 'condensed'"
      class="flex flex-col p-4 space-y-3 hover:bg-accent/50 hover:text-accent-foreground transition-colors"
    >
      <DashboardLinksLinkCardHeader
        :link="link"
        :link-icon="linkIcon"
        :display-name="displayName"
        :description="description"
        :detail-page-link="detailPageLink"
        :layout="layout"
      >
        <template #actions>
          <DashboardLinksLinkCardActions
            :link="link"
            :layout="layout"
            @update:link="updateLink"
            @qr-download="handleActionsQRDownload"
            @qr-style-edit="handleActionsQRStyleEdit"
            @duplicate="handleActionsDuplicate"
          >
            <template #qr-code>
              <DashboardLinksLinkQRCode
                ref="qrCodeRef"
                :data="shortLink"
                :image="linkIcon"
                :link="link"
                button-mode="hidden"
                @update:link="updateLink"
              />
            </template>
          </DashboardLinksLinkCardActions>
        </template>
      </DashboardLinksLinkCardHeader>

      <DashboardLinksLinkCardFooter
        :link="link"
        :short-link="shortLink"
        :copied="copied"
        :organization-config="organizationConfig"
        :has-utm-params="hasUtmParams"
        @copy-link="handleCopyLink"
      />
    </div>

    <!-- QR Code Layout -->
    <div
      v-else-if="layout === 'qr-code'"
      class="flex flex-col md:flex-row items-start md:items-center p-4 space-y-4 md:space-y-0 md:space-x-4 hover:bg-accent/50 hover:text-accent-foreground transition-colors"
    >
      <!-- Left: QR Code Section -->
      <div class="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
        <DashboardLinksLinkQRCode
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
        <DashboardLinksLinkCardHeader
          :link="link"
          :link-icon="linkIcon"
          :display-name="displayName"
          :description="description"
          :detail-page-link="detailPageLink"
          :layout="layout"
        >
          <template #actions>
            <DashboardLinksLinkCardActions
              :link="link"
              :layout="layout"
              @update:link="updateLink"
              @qr-download="handleActionsQRDownload"
              @qr-style-edit="handleActionsQRStyleEdit"
              @duplicate="handleActionsDuplicate"
            />
          </template>
        </DashboardLinksLinkCardHeader>

        <!-- Optional comment/description -->
        <p v-if="description" class="text-sm text-muted-foreground truncate mt-1">
          {{ description }}
        </p>

        <!-- URLs and metadata -->
        <div class="space-y-2 text-sm mt-3">
          <DashboardLinksLinkCardFooter
            :link="link"
            :short-link="shortLink"
            :copied="copied"
            :organization-config="organizationConfig"
            :has-utm-params="hasUtmParams"
            @copy-link="handleCopyLink"
          />
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
