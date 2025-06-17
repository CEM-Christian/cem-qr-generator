<script setup lang="ts">
import { LinkSchema, nanoid } from '@@/schemas/link'
import { OrganizationSchema } from '@@/schemas/organization'
import { toTypedSchema } from '@vee-validate/zod'
import { BarChart3, Copy, Shuffle, Sparkles } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { ScrollIndicators } from '@/components/ui/scroll-indicators'

interface SelectOption {
  value: string
  label: string
}

const props = defineProps({
  link: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:link'])

const { t } = useI18n()
const { organizations } = useOrganizations()
const link = ref(props.link)
const dialogOpen = ref(false)
const autoFormRef = ref()

const isEdit = !!props.link.id

// UTM options configuration
const utmSourceOptions: SelectOption[] = [
  { value: 'qr-code', label: 'QR Code' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'google', label: 'Google Search' },
  { value: 'bing', label: 'Bing Search' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'email', label: 'Email' },
]

const utmMediumOptions: SelectOption[] = [
  { value: 'flyer', label: 'Flyer' },
  { value: 'poster', label: 'Poster' },
  { value: 'banner', label: 'Banner' },
  { value: 'e-guide', label: 'E-Guide' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'website', label: 'Website' },
]

// Editor-specific schema with nested UTM structure for form rendering
const EditorFormSchema = z.object({
  name: LinkSchema.shape.name,
  url: LinkSchema.shape.url,
  slug: LinkSchema.shape.slug,
  organization: OrganizationSchema,
  utm: z.object({
    source: LinkSchema.shape.utm_source,
    medium: LinkSchema.shape.utm_medium,
    campaign: LinkSchema.shape.utm_campaign,
    id: LinkSchema.shape.utm_id,
  }).optional(),
  optional: z.object({
    comment: LinkSchema.shape.comment,
    expiration: z.coerce.date().optional(),
  }).optional(),
})

// Data mapping functions
function flatToNested(linkData: any) {
  return {
    name: linkData.name,
    url: linkData.url,
    slug: linkData.slug,
    organization: linkData.organization || 'none',
    utm: {
      source: linkData.utm_source,
      medium: linkData.utm_medium,
      campaign: linkData.utm_campaign,
      id: linkData.utm_id,
    },
    optional: {
      comment: linkData.comment,
      expiration: linkData.expiration,
    },
  }
}

function nestedToFlat(formData: any) {
  return {
    name: formData.name,
    url: formData.url,
    slug: formData.slug,
    organization: formData.organization === 'none' ? undefined : formData.organization,
    utm_source: formData.utm?.source,
    utm_medium: formData.utm?.medium,
    utm_campaign: formData.utm?.campaign,
    utm_id: formData.utm?.id,
    comment: formData.optional?.comment,
    expiration: formData.optional?.expiration,
  }
}

const fieldConfig = computed(() => ({
  name: {
    label: t('links.form.name.label'),
    inputProps: {
      placeholder: t('links.form.name.placeholder'),
    },
  },
  url: {
    label: t('links.form.destination_url.label'),
    inputProps: {
      placeholder: t('links.form.destination_url.placeholder'),
    },
  },
  slug: {
    label: t('links.form.slug.label'),
    description: t('links.form.slug.description'),
    inputProps: {
      disabled: isEdit,
      placeholder: t('links.form.slug.placeholder'),
    },
  },
  organization: {
    label: t('links.form.organization.label'),
    description: t('links.form.organization.description'),
    inputProps: {
      placeholder: t('links.form.organization.placeholder'),
    },
  },
  utm: {
    source: {
      label: t('links.form.utm.source.label'),
      // description: t('links.form.utm.source.description'),
    },
    medium: {
      label: t('links.form.utm.medium.label'),
      // description: t('links.form.utm.medium.description'),
    },
    campaign: {
      label: t('links.form.utm.campaign.label'),
      description: t('links.form.utm.campaign.description'),
      options: ['Excelencia-Live', 'Kindy-Open-Day', 'Principals-Tour'],
    },
    id: {
      label: t('links.form.utm.id.label'),
      description: t('links.form.utm.id.description'),
      options: ['Excelencia-Live-07-25', 'Kindy-Open-Day-11-24', 'Principals-Tour-01-25'],
    },
  },
  optional: {
    comment: {
      component: 'textarea',
    },
  },
} as any))

// const dependencies = [
//   {
//     sourceField: 'slug',
//     type: DependencyType.DISABLES,
//     targetField: 'slug',
//     when: () => isEdit,
//   },
// ]
// Remove dependencies to avoid TypeScript issues for now

const form = useForm({
  validationSchema: toTypedSchema(EditorFormSchema),
  initialValues: flatToNested({
    name: link.value.name,
    slug: link.value.slug,
    url: link.value.url,
    organization: link.value.organization,
    utm_source: link.value.utm_source || 'qr-code',
    utm_medium: link.value.utm_medium,
    utm_campaign: link.value.utm_campaign,
    utm_id: link.value.utm_id,
    comment: link.value.comment,
  }),
  validateOnMount: isEdit,
  keepValuesOnUnmount: isEdit,
})

// Organization auto-detection for new links only
const organizationDetection = useOrganizationDetection({
  enableAutoDetection: !isEdit, // Only enable for new links
  onDetection: (organizationId, url) => {
    if (!isEdit && organizationId && !organizationDetection.manualOverride.value) {
      // Auto-populate organization field
      form.setFieldValue('organization', organizationId)
      console.debug('Auto-detected organization:', organizationId, 'for URL:', url)
    }
  },
})

// Watch for manual organization changes to enable override
watch(() => form.values.organization, (newOrg, oldOrg) => {
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

// Scroll indicators setup
const scrollContainer = ref<HTMLElement>()
const scrollIndicators = useScrollIndicators(scrollContainer, {
  watchTargets: [() => form.values, () => dialogOpen.value],
})

function randomSlug() {
  form.setFieldValue('slug', nanoid()())
}

const aiSlugPending = ref(false)
async function aiSlug() {
  if (!form.values.url)
    return

  aiSlugPending.value = true
  try {
    const { slug } = await useAPI('/api/link/ai', {
      query: {
        url: form.values.url,
      },
    }) as { slug: string }
    form.setFieldValue('slug', slug)
  }
  catch (error) {
    console.log(error)
  }
  aiSlugPending.value = false
}

onMounted(() => {
  if (link.value.expiration) {
    form.setFieldValue('optional.expiration', unix2date(link.value.expiration).toDate(getTimeZone()))
  }

  // Set up a final fallback observer for AutoForm changes
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
})

async function onSubmit(formData: any) {
  // Convert nested form data back to flat structure for API
  const flatData = nestedToFlat(formData)

  const link = {
    name: flatData.name,
    url: flatData.url,
    slug: flatData.slug,
    organization: flatData.organization,
    utm_source: flatData.utm_source,
    utm_medium: flatData.utm_medium,
    utm_campaign: flatData.utm_campaign,
    utm_id: flatData.utm_id,
    comment: flatData.comment,
    expiration: flatData.expiration ? date2unix(flatData.expiration, 'end') : undefined,
    // Preserve existing QR style options when editing
    ...(isEdit && props.link.qr_style_options && { qr_style_options: props.link.qr_style_options }),
  }
  const { link: newLink } = await useAPI(isEdit ? '/api/link/edit' : '/api/link/create', {
    method: isEdit ? 'PUT' : 'POST',
    body: link,
  }) as { link: any }
  dialogOpen.value = false
  emit('update:link', newLink, isEdit ? 'edit' : 'create')
  if (isEdit) {
    toast(t('links.messages.update_success'))
  }
  else {
    toast(t('links.messages.create_success'))
  }
}

// Function to trigger form submission from external button
function handleExternalSubmit() {
  // Trigger form validation and submission
  form.handleSubmit(onSubmit)()
}

const { previewMode } = useRuntimeConfig().public

// Computed properties for link preview
const baseUrl = computed(() => {
  if (import.meta.server)
    return ''
  return window.location.origin
})

// Computed properties for inline preview
const shortUrl = computed(() => {
  if (!form.values.slug || !baseUrl.value)
    return ''
  return `${baseUrl.value}/${form.values.slug}`
})

async function copyShortUrl() {
  if (!shortUrl.value)
    return

  try {
    await navigator.clipboard.writeText(shortUrl.value)
    toast.success(t('common.copied_to_clipboard'))
  }
  catch (error) {
    console.error('Failed to copy to clipboard:', error)
    toast.error(t('common.copy_failed'))
  }
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <slot>
        <Button
          class="sm:ml-2"
          variant="outline"
          @click="randomSlug"
        >
          {{ $t('links.actions.create') }}
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-2xl grid grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>{{ link.id ? $t('links.actions.edit') : $t('links.actions.create') }}</DialogTitle>
        <DialogDescription>
          {{ link.id ? $t('links.messages.edit_description') : $t('links.messages.create_description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Scrollable content area with shadow indicators -->
      <div class="relative">
        <!-- Scroll indicators component -->
        <ScrollIndicators
          :show-top-gradient="scrollIndicators.showTopGradient.value"
          :show-bottom-gradient="scrollIndicators.showBottomGradient.value"
          :top-gradient-opacity="scrollIndicators.topGradientOpacity.value"
          :bottom-gradient-opacity="scrollIndicators.bottomGradientOpacity.value"
        />

        <!-- Scrollable content -->
        <div
          ref="scrollContainer"
          class="overflow-y-auto px-1 space-y-4 max-h-full"
          @scroll="scrollIndicators.updateScrollIndicators"
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
              ref="autoFormRef"
              class="space-y-2"
              :schema="EditorFormSchema"
              :form="form"
              :field-config="fieldConfig"
              @submit="onSubmit"
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

              <template #slug="slotProps">
                <FormField v-slot="fieldSlotProps" :name="slotProps.fieldName">
                  <FormItem>
                    <FormLabel>{{ slotProps.config?.label || $t('links.slug') }}</FormLabel>
                    <div class="relative">
                      <div
                        v-if="!isEdit"
                        class="flex h-full items-center absolute right-3 space-x-3 z-10"
                      >
                        <Shuffle
                          class="w-4 h-4 cursor-pointer"
                          :title="$t('links.actions.generate_random_slug')"
                          @click="randomSlug"
                        />
                        <Sparkles
                          class="w-4 h-4 cursor-pointer"
                          :class="{ 'animate-bounce': aiSlugPending }"
                          :title="$t('links.actions.generate_ai_slug')"
                          @click="aiSlug"
                        />
                      </div>
                      <FormControl>
                        <Input
                          v-bind="fieldSlotProps.componentField"
                          :placeholder="slotProps.config?.inputProps?.placeholder || $t('links.slug_placeholder')"
                          :disabled="slotProps.config?.inputProps?.disabled || false"
                        />
                      </FormControl>
                    </div>

                    <!-- Short URL Preview in Description -->
                    <FormDescription v-if="shortUrl" class="flex items-center text-sm gap-2">
                      <span class="pl-1 break-all">{{ shortUrl }}</span>
                      <div class="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          class="h-6 w-6 p-0"
                          type="button"
                          :title="$t('common.copy')"
                          @click.stop.prevent="copyShortUrl"
                        >
                          <Copy class="h-3 w-3" />
                        </Button>
                      </div>
                    </FormDescription>
                    <FormDescription v-else>
                      {{ slotProps.config?.description || $t('links.slug_description') }}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
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

              <!-- Custom UTM slot with styled container -->
              <template #utm>
                <div class="bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 lg:p-6">
                  <div class="flex items-center mb-4">
                    <BarChart3 class="w-5 h-5 mr-2" />
                    <h3 class="text-lg font-semibold">
                      {{ $t('links.form.utm.section_title') }}
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- UTM Source -->
                    <FormField v-slot="sourceSlotProps" name="utm.source">
                      <FormItem>
                        <FormLabel>{{ fieldConfig.utm.source.label }}</FormLabel>
                        <FormDescription v-if="fieldConfig.utm.source.description">
                          {{ fieldConfig.utm.source.description }}
                        </FormDescription>
                        <FormControl>
                          <Select
                            :model-value="sourceSlotProps.componentField.modelValue"
                            @update:model-value="sourceSlotProps.componentField['onUpdate:modelValue']"
                          >
                            <SelectTrigger>
                              <SelectValue :placeholder="$t('links.form.utm.source.placeholder')" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                v-for="option in utmSourceOptions"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <!-- UTM Medium -->
                    <FormField v-slot="mediumSlotProps" name="utm.medium">
                      <FormItem>
                        <FormLabel>{{ fieldConfig.utm.medium.label }}</FormLabel>
                        <FormDescription v-if="fieldConfig.utm.medium.description">
                          {{ fieldConfig.utm.medium.description }}
                        </FormDescription>
                        <FormControl>
                          <Select
                            :model-value="mediumSlotProps.componentField.modelValue"
                            @update:model-value="mediumSlotProps.componentField['onUpdate:modelValue']"
                          >
                            <SelectTrigger
                              class="data-[placeholder]:text-muted-foreground"
                            >
                              <SelectValue
                                :placeholder="$t('links.form.utm.medium.placeholder')"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                v-for="option in utmMediumOptions"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <!-- UTM Campaign -->
                    <FormField v-slot="campaignSlotProps" name="utm.campaign">
                      <FormItem>
                        <FormLabel>{{ fieldConfig.utm.campaign.label }}</FormLabel>
                        <FormControl>
                          <Input
                            v-bind="campaignSlotProps.componentField"
                            placeholder="Enter campaign name"
                          />
                        </FormControl>
                        <FormDescription v-if="fieldConfig.utm.campaign.description" class="pl-1">
                          {{ fieldConfig.utm.campaign.description }}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <!-- UTM ID -->
                    <FormField v-slot="idSlotProps" name="utm.id">
                      <FormItem>
                        <FormLabel>{{ fieldConfig.utm.id.label }}</FormLabel>
                        <FormControl>
                          <Input
                            v-bind="idSlotProps.componentField"
                            placeholder="Enter campaign ID"
                          />
                        </FormControl>
                        <FormDescription v-if="fieldConfig.utm.id.description" class="pl-1">
                          {{ fieldConfig.utm.id.description }}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                </div>
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
