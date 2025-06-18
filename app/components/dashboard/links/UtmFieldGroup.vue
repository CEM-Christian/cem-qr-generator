<script setup lang="ts">
import { BarChart3 } from 'lucide-vue-next'

interface Props {
  sourceValue: string
  mediumValue: string
  campaignValue: string
  idValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:sourceValue': [value: string]
  'update:mediumValue': [value: string]
  'update:campaignValue': [value: string]
  'update:idValue': [value: string]
}>()

const { utmSourceOptions, utmMediumOptions, utmFieldConfig } = useUtmConfiguration()

const localSource = computed({
  get: () => props.sourceValue,
  set: (value: string) => emit('update:sourceValue', value),
})

const localMedium = computed({
  get: () => props.mediumValue,
  set: (value: string) => emit('update:mediumValue', value),
})

const localCampaign = computed({
  get: () => props.campaignValue,
  set: (value: string) => emit('update:campaignValue', value),
})

const localId = computed({
  get: () => props.idValue,
  set: (value: string) => emit('update:idValue', value),
})
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 lg:p-6">
    <div class="flex items-center mb-4">
      <BarChart3 class="w-5 h-5 mr-2" />
      <h3 class="text-lg font-semibold">
        {{ $t('links.form.utm.section_title') }}
      </h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- UTM Source -->
      <FormField name="utm.source">
        <FormItem>
          <FormLabel>{{ utmFieldConfig.source.label }}</FormLabel>
          <FormControl>
            <Select v-model="localSource">
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
      <FormField name="utm.medium">
        <FormItem>
          <FormLabel>{{ utmFieldConfig.medium.label }}</FormLabel>
          <FormControl>
            <Select v-model="localMedium">
              <SelectTrigger class="data-[placeholder]:text-muted-foreground">
                <SelectValue :placeholder="$t('links.form.utm.medium.placeholder')" />
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
      <FormField name="utm.campaign">
        <FormItem>
          <FormLabel>{{ utmFieldConfig.campaign.label }}</FormLabel>
          <FormControl>
            <Input
              v-model="localCampaign"
              :placeholder="utmFieldConfig.campaign.placeholder"
            />
          </FormControl>
          <FormDescription v-if="utmFieldConfig.campaign.description" class="pl-1">
            {{ utmFieldConfig.campaign.description }}
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- UTM ID -->
      <FormField name="utm.id">
        <FormItem>
          <FormLabel>{{ utmFieldConfig.id.label }}</FormLabel>
          <FormControl>
            <Input
              v-model="localId"
              :placeholder="utmFieldConfig.id.placeholder"
            />
          </FormControl>
          <FormDescription v-if="utmFieldConfig.id.description" class="pl-1">
            {{ utmFieldConfig.id.description }}
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </div>
</template>
