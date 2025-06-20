<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { Label } from '../label'
import { RadioGroup, RadioGroupItem } from '../radio-group'

const props = defineProps({
  logoType: {
    type: String,
    default: 'favicon'
  },
  selectedLogoId: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:logoType', 'update:selectedLogoId'])

const { t } = useI18n()
const { availableLogos } = useLogoSelection()

// Handle logo type change
function handleLogoTypeChange(newType: string) {
  emit('update:logoType', newType)
  // Clear selected logo when switching to favicon or none
  if (newType === 'favicon' || newType === 'none') {
    emit('update:selectedLogoId', undefined)
  }
}

// Handle logo selection
function handleLogoSelect(logoId: string) {
  emit('update:selectedLogoId', logoId)
}
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-1">
      <h3 class="text-sm font-semibold">{{ $t('qr_style_editor.logo_selection.title') }}</h3>
      <p class="text-xs text-muted-foreground">{{ $t('qr_style_editor.logo_selection.description') }}</p>
    </div>

    <!-- Logo Type Selection -->
    <RadioGroup
      :model-value="logoType"
      @update:model-value="handleLogoTypeChange"
      class="space-y-2"
    >
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="favicon" value="favicon" />
        <Label for="favicon" class="text-sm">
          {{ $t('qr_style_editor.logo_selection.use_favicon') }}
        </Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="organization" value="organization" />
        <Label for="organization" class="text-sm">
          {{ $t('qr_style_editor.logo_selection.use_organization') }}
        </Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="none" value="none" />
        <Label for="none" class="text-sm">
          {{ $t('qr_style_editor.logo_selection.use_none') }}
        </Label>
      </div>
    </RadioGroup>

    <!-- Organization Logo Grid -->
    <div v-if="logoType === 'organization'" class="space-y-3">
      <Label class="text-sm font-medium">{{ $t('qr_style_editor.logo_selection.select_logo') }}</Label>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="logo in availableLogos"
          :key="logo.id"
          class="relative group cursor-pointer"
          @click="handleLogoSelect(logo.id)"
        >
          <div
            class="aspect-square border-2 rounded-lg p-3 transition-all duration-200 hover:border-primary hover:shadow-md"
            :class="{
              'border-primary bg-primary/5': selectedLogoId === logo.id,
              'border-border': selectedLogoId !== logo.id
            }"
          >
            <!-- Logo Image -->
            <div class="w-full h-full flex items-center justify-center">
              <img
                :src="`/logos/${logo.filename}`"
                :alt="logo.name"
                class="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>

            <!-- Selection Indicator -->
            <div
              v-if="selectedLogoId === logo.id"
              class="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
            >
              <Check class="w-3 h-3 text-primary-foreground" />
            </div>
          </div>

          <!-- Logo Name -->
          <div class="mt-2 text-center">
            <p class="text-xs font-medium text-foreground">{{ logo.name }}</p>
            <!-- <p class="text-xs text-muted-foreground">{{ logo.organization }}</p> -->
          </div>
        </div>
      </div>

      <!-- No Logo Selected State -->
      <div v-if="!selectedLogoId" class="text-center py-4">
        <p class="text-sm text-muted-foreground">
          {{ $t('qr_style_editor.logo_selection.no_logo_selected') }}
        </p>
      </div>
    </div>
  </div>
</template>
