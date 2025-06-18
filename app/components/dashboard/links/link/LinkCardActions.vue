<script setup lang="ts">
import type { Link } from '@@/schemas/link'
import type { LinkUpdateType } from '@@/schemas/link-display'
import { Copy, Download, Eraser, Palette, PenLine, QrCode, SquareChevronDown } from 'lucide-vue-next'

interface Props {
  link: Link
  layout?: 'condensed' | 'qr-code'
}

withDefaults(defineProps<Props>(), {
  layout: 'condensed',
})

const emit = defineEmits<{
  'update:link': [link: Link, type?: LinkUpdateType]
  'qrDownload': []
  'qrStyleEdit': []
  'duplicate': []
}>()

const editPopoverOpen = ref(false)
const qrPopoverOpen = ref(false)

function updateLink(link: Link, type?: LinkUpdateType) {
  emit('update:link', link, type)
  editPopoverOpen.value = false
}

function handleQRDownload() {
  emit('qrDownload')
}

function handleQRStyleEdit() {
  emit('qrStyleEdit')
}

function handleDuplicateLink() {
  emit('duplicate')
}
</script>

<template>
  <!-- Condensed Layout Actions -->
  <div v-if="layout === 'condensed'" class="flex items-center space-x-1">
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
        <slot name="qr-code" />
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
            <PenLine class="w-5 h-5 mr-2" />
            {{ $t('common.edit') }}
          </div>
        </DashboardLinksEditor>

        <Separator />

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

  <!-- QR Code Layout Actions -->
  <div v-else-if="layout === 'qr-code'" class="flex items-center space-x-1 flex-shrink-0">
    <!-- Edit Button -->
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
</template>
