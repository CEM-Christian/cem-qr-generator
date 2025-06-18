<script setup lang="ts">
import { Copy, Shuffle, Sparkles } from 'lucide-vue-next'

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  isEdit?: boolean
  onRandomSlug?: () => void
  onAiSlug?: () => void
  aiSlugPending?: boolean
  shortUrl?: string
  onCopyShortUrl?: () => void
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  isEdit: false,
  aiSlugPending: false,
  shortUrl: '',
  description: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>

<template>
  <FormItem>
    <FormLabel>{{ $t('links.form.slug.label') }}</FormLabel>
    <div class="relative">
      <div
        v-if="!isEdit"
        class="flex h-full items-center absolute right-3 space-x-3 z-10"
      >
        <Shuffle
          class="w-4 h-4 cursor-pointer"
          :title="$t('links.actions.generate_random_slug')"
          @click="onRandomSlug"
        />
        <Sparkles
          class="w-4 h-4 cursor-pointer"
          :class="{ 'animate-bounce': aiSlugPending }"
          :title="$t('links.actions.generate_ai_slug')"
          @click="onAiSlug"
        />
      </div>
      <FormControl>
        <Input
          v-model="localValue"
          :placeholder="placeholder"
          :disabled="disabled"
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
          @click.stop.prevent="onCopyShortUrl"
        >
          <Copy class="h-3 w-3" />
        </Button>
      </div>
    </FormDescription>
    <FormDescription v-else>
      {{ description || $t('links.form.slug.description') }}
    </FormDescription>
    <FormMessage />
  </FormItem>
</template>
