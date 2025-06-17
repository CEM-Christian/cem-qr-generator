<script setup lang="ts">
interface TestCase {
  description: string
  url: string
  expected: string
  result?: {
    passed: boolean
    actual: string
  }
}

interface TestResult {
  url: string
  organization: any
  logoId: string | null
  score: number
  matchDetails: any
}

const testUrl = ref('')
const testResult = ref<TestResult | null>(null)
const allTestsRun = ref(false)

// Import the utilities we need
const organizationDetection = useOrganizationDetection()

// Helper function to detect organization from URL for testing
async function detectOrganizationFromUrl(url: string) {
  organizationDetection.forceDetection(url)

  // Wait for detection to complete
  await nextTick()

  return {
    organization: organizationDetection.detectedOrganization.value
      ? {
          id: organizationDetection.detectedOrganization.value,
          name: organizationDetection.detectedOrganization.value,
        }
      : null,
    logoId: organizationDetection.detectedLogoId.value,
    score: organizationDetection.detectedOrganization.value ? 100 : 0,
    matchDetails: {},
  }
}

const testCases = ref<TestCase[]>([
  {
    description: 'ACC Main Domain',
    url: 'https://www.acc.edu.au',
    expected: 'acc',
  },
  {
    description: 'ACC Subdomain',
    url: 'https://acc.edu.au/some-form',
    expected: 'acc',
  },
  {
    description: 'ACC with www',
    url: 'https://www.acc.edu.au/about-us',
    expected: 'acc',
  },
  {
    description: 'ACC Moreton - specific path',
    url: 'https://www.acc.edu.au/moreton/services',
    expected: 'acc-moreton',
  },
  {
    description: 'ACC Moreton - deep path',
    url: 'https://www.acc.edu.au/moreton/health/physiotherapy',
    expected: 'acc-moreton',
  },
  {
    description: 'ACC Southlands - specific path',
    url: 'https://www.acc.edu.au/southlands/programs',
    expected: 'acc-southlands',
  },
  {
    description: 'ACC Southlands - deep path',
    url: 'https://www.acc.edu.au/southlands/community/events',
    expected: 'acc-southlands',
  },
  {
    description: 'Non-ACC URL',
    url: 'https://www.google.com',
    expected: 'None',
  },
  {
    description: 'ACC but not Moreton/Southlands',
    url: 'https://www.acc.edu.au/general/services',
    expected: 'acc',
  },
  {
    description: 'Invalid URL',
    url: 'not-a-url',
    expected: 'None',
  },
])

async function testUrlMatching() {
  if (!testUrl.value)
    return

  try {
    const result = await detectOrganizationFromUrl(testUrl.value)
    testResult.value = {
      url: testUrl.value,
      organization: result.organization,
      logoId: result.logoId,
      score: result.score || 0,
      matchDetails: result.matchDetails || {},
    }
  }
  catch (error) {
    console.error('Test error:', error)
    testResult.value = {
      url: testUrl.value,
      organization: null,
      logoId: null,
      score: 0,
      matchDetails: { error: String(error) },
    }
  }
}

async function runTestCase(testCase: TestCase) {
  try {
    const result = await detectOrganizationFromUrl(testCase.url)
    const actual = result.organization?.id || 'None'

    testCase.result = {
      passed: actual === testCase.expected,
      actual,
    }
  }
  catch (error) {
    console.error('Test case error:', error)
    testCase.result = {
      passed: testCase.expected === 'None',
      actual: 'Error',
    }
  }
}

async function runAllTests() {
  for (const testCase of testCases.value) {
    await runTestCase(testCase)
  }
  allTestsRun.value = true
}

const passedTests = computed(() => {
  return testCases.value.filter(tc => tc.result?.passed).length
})

const failedTests = computed(() => {
  return testCases.value.filter(tc => tc.result && !tc.result.passed).length
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">
        URL Pattern Matching Test
      </h1>
      <p class="text-muted-foreground">
        Test the auto-organization detection functionality
      </p>
    </div>

    <!-- Test Input -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Test URL:</label>
        <input
          v-model="testUrl"
          type="url"
          placeholder="Enter URL to test..."
          class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
      </div>

      <button
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        @click="testUrlMatching"
      >
        Test URL Matching
      </button>
    </div>

    <!-- Results -->
    <div v-if="testResult" class="bg-muted/50 border border-border rounded-lg p-4">
      <h3 class="font-semibold mb-2">
        Test Result:
      </h3>
      <div class="space-y-2 text-sm">
        <div><strong>URL:</strong> {{ testResult.url }}</div>
        <div><strong>Organization Found:</strong> {{ testResult.organization?.name || 'None' }}</div>
        <div v-if="testResult.organization">
          <strong>Organization ID:</strong> {{ testResult.organization.id }}
        </div>
        <div v-if="testResult.logoId">
          <strong>Logo ID:</strong> {{ testResult.logoId }}
        </div>
        <div><strong>Match Score:</strong> {{ testResult.score }}</div>
        <div v-if="testResult.matchDetails">
          <strong>Match Details:</strong> {{ JSON.stringify(testResult.matchDetails, null, 2) }}
        </div>
      </div>
    </div>

    <!-- Predefined Test Cases -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">
        Predefined Test Cases
      </h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="(testCase, index) in testCases"
          :key="index"
          class="border border-border rounded-lg p-4 space-y-2"
        >
          <div class="font-medium">
            {{ testCase.description }}
          </div>
          <div class="text-sm text-muted-foreground break-all">
            {{ testCase.url }}
          </div>
          <div class="text-sm">
            <strong>Expected:</strong> {{ testCase.expected }}
          </div>
          <button
            class="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
            @click="runTestCase(testCase)"
          >
            Test
          </button>
          <div v-if="testCase.result" class="text-sm mt-2">
            <div class="font-medium" :class="testCase.result.passed ? 'text-green-600' : 'text-red-600'">
              {{ testCase.result.passed ? '✓ Passed' : '✗ Failed' }}
            </div>
            <div class="text-muted-foreground">
              Got: {{ testCase.result.actual }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Run All Tests -->
    <div class="flex justify-center">
      <button
        class="px-6 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90"
        @click="runAllTests"
      >
        Run All Tests
      </button>
    </div>

    <!-- All Results Summary -->
    <div v-if="allTestsRun" class="bg-muted/50 border border-border rounded-lg p-4">
      <h3 class="font-semibold mb-2">
        Test Summary:
      </h3>
      <div class="text-sm">
        <div>Total Tests: {{ testCases.length }}</div>
        <div class="text-green-600">
          Passed: {{ passedTests }}
        </div>
        <div class="text-red-600">
          Failed: {{ failedTests }}
        </div>
      </div>
    </div>
  </div>
</template>
