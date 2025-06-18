<script setup lang="ts">
import { LinkEditorFormSchema } from '@@/schemas/link-editor'
import { ScrollIndicators } from '@/components/ui/scroll-indicators'
import SlugField from './SlugField.vue'
import UtmFieldGroup from './UtmFieldGroup.vue'

interface Props {
  link?: any
}

const props = withDefaults(defineProps<Props>(), {
  link: () => ({}),
})

const emit = defineEmits<{
  'update:link': [link: any, action: 'create' | 'edit']
}>()

const { organizations } = useOrganizations()
const { previewMode } = useRuntimeConfig().public

const isEdit = !!props.link.id

// Initialize composables
const editor = useLinkEditor()
const linkForm = useLinkForm({
  link: props.link,
  isEdit,
  onSubmit: (newLink: any, action: 'create' | 'edit') => {
    editor.closeDialog()
    emit('update:link', newLink, action)
  },
})

// Organization auto-detection for new links only
const organizationDetection = useOrganizationDetection({
  enableAutoDetection: !isEdit,
  onDetection: (organizationId, url) => {
    if (!isEdit && organizationId && !organizationDetection.manualOverride.value) {
      linkForm.form.setFieldValue('organization', organizationId as any)
      console.debug('Auto-detected organization:', organizationId, 'for URL:', url)
    }
  },
})

// Watch for manual organization changes to enable override
watch(() => linkForm.form.values.organization, (newOrg, oldOrg) => {
  if (!isEdit && newOrg && newOrg !== oldOrg && organizationDetection.detectedOrganization.value !== newOrg) {
    organizationDetection.enableManualOverride()
  }
})

// Function to handle URL blur for auto-detection
function handleUrlBlur(url: string) {
  if (!isEdit && url && url.trim() !== '') {
    organizationDetection.processUrl(url.trim())
  }
}

// Setup scroll listeners when mounted
onMounted(() => {
  editor.setupScrollListeners()
})

// Handle external form submission
function handleExternalSubmit() {
  linkForm.form.handleSubmit(linkForm.handleSubmit)()
}

function randomSlugAndOpen() {
  linkForm.generateRandomSlug()
  editor.openDialog()
}
</script>

<template>
  <Dialog v-model:open="editor.dialogOpen.value">
    <DialogTrigger as-child>
      <slot>
        <Button
          class="sm:ml-2"
          variant="outline"
          @click="randomSlugAndOpen"
        >
          {{ $t('links.actions.create') }}
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-2xl grid grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>{{ props.link.id ? $t('links.actions.edit') : $t('links.actions.create') }}</DialogTitle>
        <DialogDescription>
          {{ props.link.id ? $t('links.messages.edit_description') : $t('links.messages.create_description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Scrollable content area with shadow indicators -->
      <div class="relative">
        <!-- Scroll indicators component -->
        <ScrollIndicators
          :show-top-gradient="editor.scrollIndicators.showTopGradient.value"
          :show-bottom-gradient="editor.scrollIndicators.showBottomGradient.value"
          :top-gradient-opacity="editor.scrollIndicators.topGradientOpacity.value"
          :bottom-gradient-opacity="editor.scrollIndicators.bottomGradientOpacity.value"
        />

        <!-- Scrollable content -->
        <div
          :ref="(el) => editor.scrollContainer.value = el as HTMLElement"
          class="overflow-y-auto px-1 space-y-4 max-h-full"
          @scroll="editor.scrollIndicators.updateScrollIndicators"
        >
          <p
            v-if="previewMode"
            class="text-sm text-muted-foreground px-1"
          >
            {{ $t('links.preview_mode_tip') }}
          </p>

          <!-- Form Content -->
          <div class="px-1">
            <AutoForm
              :ref="(el) => editor.autoFormRef.value = el"
              class="space-y-2"
              :schema="LinkEditorFormSchema"
              :form="linkForm.form"
              :field-config="linkForm.fieldConfig.value"
              @submit="linkForm.handleSubmit"
            >
              <!-- Custom URL field template with blur handler for auto-detection -->
              <template #url="slotProps">
                <FormField v-slot="fieldSlotProps" :name="slotProps.fieldName">
                  <FormItem>
                    <FormLabel>{{ slotProps.config?.label || $t('links.form.destination_url.label') }}</FormLabel>
                    <FormControl>
                      <Input
                        v-bind="fieldSlotProps.componentField"
                        :placeholder="slotProps.config?.inputProps?.placeholder || $t('links.form.destination_url.placeholder')"
                        @blur="handleUrlBlur(fieldSlotProps.componentField.modelValue)"
                      />
                    </FormControl>
                    <FormDescription v-if="slotProps.config?.description">
                      {{ slotProps.config.description }}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </template>

              <!-- Custom slug field -->
              <template #slug="slotProps">
                <FormField v-slot="fieldSlotProps" :name="slotProps.fieldName">
                  <SlugField
                    v-model="fieldSlotProps.componentField.modelValue"
                    :placeholder="slotProps.config?.inputProps?.placeholder || $t('links.form.slug.placeholder')"
                    :disabled="Boolean(slotProps.config?.inputProps?.disabled)"
                    :is-edit="isEdit"
                    :on-random-slug="linkForm.generateRandomSlug"
                    :on-ai-slug="linkForm.generateAiSlug"
                    :ai-slug-pending="linkForm.aiSlugPending.value"
                    :short-url="linkForm.shortUrl.value"
                    :on-copy-short-url="linkForm.copyShortUrl"
                    :description="slotProps.config?.description"
                  />
                </FormField>
              </template>

              <!-- Organization field -->
              <template #organization="slotProps">
                <FormField v-slot="fieldSlotProps" :name="slotProps.fieldName">
                  <FormItem>
                    <FormLabel>{{ slotProps.config?.label || $t('links.form.organization.label') }}</FormLabel>
                    <FormControl>
                      <Select
                        :model-value="fieldSlotProps.componentField.modelValue"
                        @update:model-value="fieldSlotProps.componentField['onUpdate:modelValue']"
                      >
                        <SelectTrigger>
                          <SelectValue :placeholder="slotProps.config?.inputProps?.placeholder || $t('links.form.organization.placeholder')" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            {{ $t('organization.none') }}
                          </SelectItem>
                          <SelectItem
                            v-for="org in organizations"
                            :key="org.id"
                            :value="org.id"
                          >
                            <div class="flex items-center gap-2">
                              <img
                                :src="`/logos/${org.logo}`"
                                :alt="org.name"
                                class="h-4 w-4 object-contain"
                              >
                              <span>{{ org.name }}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription v-if="slotProps.config?.description">
                      {{ slotProps.config.description }}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </template>

              <!-- Custom UTM slot -->
              <template #utm>
                <UtmFieldGroup
                  :source-value="linkForm.form.values.utm?.source || ''"
                  :medium-value="linkForm.form.values.utm?.medium || ''"
                  :campaign-value="linkForm.form.values.utm?.campaign || ''"
                  :id-value="linkForm.form.values.utm?.id || ''"
                  @update:source-value="(value) => linkForm.form.setFieldValue('utm.source', value as any)"
                  @update:medium-value="(value) => linkForm.form.setFieldValue('utm.medium', value as any)"
                  @update:campaign-value="(value) => linkForm.form.setFieldValue('utm.campaign', value as any)"
                  @update:id-value="(value) => linkForm.form.setFieldValue('utm.id', value as any)"
                />
              </template>
            </AutoForm>
          </div>
        </div>
      </div>

      <!-- Footer outside scrollable area -->
      <DialogFooter>
        <DialogClose as-child>
          <Button
            type="button"
            variant="secondary"
            class="mt-2 sm:mt-0"
          >
            {{ $t('common.close') }}
          </Button>
        </DialogClose>
        <Button
          type="button"
          @click="handleExternalSubmit"
        >
          {{ $t('common.save') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
