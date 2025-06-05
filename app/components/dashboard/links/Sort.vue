<script setup>
import { ArrowUpDown } from 'lucide-vue-next'

defineProps({
  sortBy: {
    type: String,
    default: 'newest',
  },
})

const emit = defineEmits(['update:sortBy'])
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        <TooltipProvider>
          <Tooltip :delay-duration="100">
            <TooltipTrigger class="flex items-center">
              <ArrowUpDown class="h-4 w-4 sm:mr-2" />
              <span class="hidden sm:inline">
                {{ $t(`links.sort.${sortBy}`) }}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ $t('links.sort.tip') }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="emit('update:sortBy', 'newest')">
        {{ $t('links.sort.newest') }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('update:sortBy', 'oldest')">
        {{ $t('links.sort.oldest') }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('update:sortBy', 'name-az')">
        {{ $t('links.sort.name_az') }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('update:sortBy', 'name-za')">
        {{ $t('links.sort.name_za') }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('update:sortBy', 'slug-az')">
        {{ $t('links.sort.slug_az') }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('update:sortBy', 'slug-za')">
        {{ $t('links.sort.slug_za') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
