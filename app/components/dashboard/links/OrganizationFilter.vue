<script setup lang="ts">
import type { OrganizationId } from '../../../../schemas/organization'
import { Building2 } from 'lucide-vue-next'

interface Props {
  selectedOrganization?: OrganizationId | '' | 'all'
}

const props = withDefaults(defineProps<Props>(), {
  selectedOrganization: 'all',
})

const emit = defineEmits<{
  'update:selectedOrganization': [value: OrganizationId | '' | 'all']
}>()

const { t } = useI18n()

const { organizations } = useOrganizations()

// Computed property to get the display text for the selected organization
const selectedOrganizationLabel = computed(() => {
  const selected = props.selectedOrganization

  if (!selected) {
    return t('organization.filter_placeholder')
  }

  if (selected === 'all') {
    return t('organization.all')
  }

  const org = organizations.value.find(o => o.id === selected)
  return org?.name || ''
})

function handleOrganizationChange(organizationId: string) {
  emit('update:selectedOrganization', organizationId as OrganizationId | '' | 'all')
}
</script>

<template>
  <div class="w-full sm:w-[240px]">
    <TooltipProvider>
      <Tooltip :delay-duration="100">
        <TooltipTrigger as-child>
          <Select :model-value="selectedOrganization" @update:model-value="handleOrganizationChange">
            <SelectTrigger>
              <div class="flex items-center w-full">
                <Building2 class="h-4 w-4 mr-2" />
                <SelectValue :placeholder="$t('organization.filter_placeholder')">
                  {{ selectedOrganizationLabel }}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {{ $t('organization.all') }}
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
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ $t('organization.filter_tip') }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
