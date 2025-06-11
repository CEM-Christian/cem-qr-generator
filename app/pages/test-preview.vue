<!-- Test page for Link Preview component -->
<script setup lang="ts">
const { buildUtmParams } = useUtmBuilder()

// Test data
const testForm = ref({
  slug: 'test-link',
  url: 'https://example.com/test-page',
  utm_source: 'qr-code',
  utm_medium: 'flyer',
  utm_campaign: 'Test-Campaign',
  utm_id: 'Test-Campaign-01-25',
})

const utmParams = computed(() => {
  return buildUtmParams({
    utm_source: testForm.value.utm_source,
    utm_medium: testForm.value.utm_medium,
    utm_campaign: testForm.value.utm_campaign,
    utm_id: testForm.value.utm_id,
  })
})

const baseUrl = computed(() => {
  if (import.meta.server)
    return ''
  return window.location.origin
})
</script>

<template>
  <div class="container mx-auto p-8 max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">
      Link Preview Test
    </h1>

    <!-- Test form to modify values -->
    <div class="space-y-4 mb-8 p-4 border rounded-lg bg-muted/30">
      <h2 class="text-lg font-semibold">
        Test Form
      </h2>

      <div>
        <label class="block text-sm font-medium mb-1">Slug</label>
        <input
          v-model="testForm.slug"
          class="w-full p-2 border rounded"
          placeholder="Enter slug..."
        >
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">URL</label>
        <input
          v-model="testForm.url"
          class="w-full p-2 border rounded"
          placeholder="Enter URL..."
        >
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">UTM Source</label>
          <input
            v-model="testForm.utm_source"
            class="w-full p-2 border rounded"
            placeholder="UTM Source..."
          >
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">UTM Medium</label>
          <input
            v-model="testForm.utm_medium"
            class="w-full p-2 border rounded"
            placeholder="UTM Medium..."
          >
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">UTM Campaign</label>
          <input
            v-model="testForm.utm_campaign"
            class="w-full p-2 border rounded"
            placeholder="UTM Campaign..."
          >
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">UTM ID</label>
          <input
            v-model="testForm.utm_id"
            class="w-full p-2 border rounded"
            placeholder="UTM ID..."
          >
        </div>
      </div>
    </div>

    <!-- Link Preview Component -->
    <LinkPreview
      :slug="testForm.slug"
      :url="testForm.url"
      :utm-params="utmParams"
      :base-url="baseUrl"
    />

    <!-- Debug Information -->
    <div class="mt-8 p-4 border rounded-lg bg-muted/20">
      <h2 class="text-lg font-semibold mb-4">
        Debug Information
      </h2>
      <pre class="text-sm bg-background p-4 rounded border overflow-auto">{{ JSON.stringify({ testForm, utmParams, baseUrl }, null, 2) }}</pre>
    </div>
  </div>
</template>
