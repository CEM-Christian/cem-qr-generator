#!/usr/bin/env node

// Simple test script for URL matching functionality
import { matchUrlToOrganization } from '../app/utils/url-matcher.js'

console.log('🧪 Testing URL Pattern Matching for Organization Detection\n')

const testCases = [
  // ACC main organization tests
  {
    url: 'https://www.acc.edu.au/podcast',
    expected: 'acc',
    description: 'ACC main website with podcast path',
  },
  {
    url: 'https://acc.edu.au/about',
    expected: 'acc',
    description: 'ACC website without www',
  },

  // ACC Moreton tests
  {
    url: 'https://www.acc.edu.au/moreton/on-campus/',
    expected: 'acc-moreton',
    description: 'ACC Moreton with specific path',
  },
  {
    url: 'https://acc.edu.au/moreton/',
    expected: 'acc-moreton',
    description: 'ACC Moreton base path',
  },
  {
    url: 'https://www.acc.edu.au/moreton/programs/year-7',
    expected: 'acc-moreton',
    description: 'ACC Moreton with nested path',
  },

  // ACC Southlands tests
  {
    url: 'https://www.acc.edu.au/southlands/on-campus/',
    expected: 'acc-southlands',
    description: 'ACC Southlands with specific path',
  },
  {
    url: 'https://acc.edu.au/southlands/',
    expected: 'acc-southlands',
    description: 'ACC Southlands base path',
  },

  // Non-matching URLs
  {
    url: 'https://www.google.com',
    expected: null,
    description: 'Unrelated website',
  },
  {
    url: 'https://example.com/acc.edu.au',
    expected: null,
    description: 'Domain in path (should not match)',
  },
  {
    url: 'invalid-url',
    expected: null,
    description: 'Invalid URL format',
  },
]

let passed = 0
let failed = 0

console.log('Running test cases...\n')

for (const testCase of testCases) {
  try {
    const result = matchUrlToOrganization(testCase.url)
    const success = result === testCase.expected

    if (success) {
      console.log(`✅ PASS: ${testCase.description}`)
      console.log(`   URL: ${testCase.url}`)
      console.log(`   Expected: ${testCase.expected}, Got: ${result}\n`)
      passed++
    }
    else {
      console.log(`❌ FAIL: ${testCase.description}`)
      console.log(`   URL: ${testCase.url}`)
      console.log(`   Expected: ${testCase.expected}, Got: ${result}\n`)
      failed++
    }
  }
  catch (error) {
    console.log(`💥 ERROR: ${testCase.description}`)
    console.log(`   URL: ${testCase.url}`)
    console.log(`   Error: ${error.message}\n`)
    failed++
  }
}

console.log('📊 Test Results:')
console.log(`   ✅ Passed: ${passed}`)
console.log(`   ❌ Failed: ${failed}`)
console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`)

if (failed === 0) {
  console.log('\n🎉 All tests passed! URL matching is working correctly.')
  process.exit(0)
}
else {
  console.log('\n🚨 Some tests failed. Please check the implementation.')
  process.exit(1)
}
