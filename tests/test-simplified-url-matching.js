#!/usr/bin/env node

// Quick validation test for simplified URL matching
import { matchUrlToOrganization } from '../app/utils/url-matcher.js'

console.log('🧪 Testing Simplified URL Pattern Matching\n')

const testCases = [
  // ACC main domain tests
  { url: 'https://www.acc.edu.au/about', expected: 'acc', description: 'ACC main domain with www' },
  { url: 'https://acc.edu.au/programs', expected: 'acc', description: 'ACC domain without www' },

  // ACC Moreton tests
  { url: 'https://www.acc.edu.au/moreton/campus', expected: 'acc-moreton', description: 'ACC Moreton path match' },
  { url: 'https://acc.edu.au/moreton/', expected: 'acc-moreton', description: 'ACC Moreton base path' },
  { url: 'https://www.acc.edu.au/moreton/programs/year-7', expected: 'acc-moreton', description: 'ACC Moreton deep path' },

  // ACC Southlands tests
  { url: 'https://www.acc.edu.au/southlands/events', expected: 'acc-southlands', description: 'ACC Southlands path match' },
  { url: 'https://acc.edu.au/southlands/', expected: 'acc-southlands', description: 'ACC Southlands base path' },

  // Non-matching tests
  { url: 'https://www.google.com', expected: null, description: 'Non-ACC domain' },
  { url: 'https://www.acc.edu.au/general/info', expected: 'acc', description: 'ACC general path (should match main)' },
  { url: 'invalid-url', expected: null, description: 'Invalid URL' },
]

let passed = 0
let failed = 0

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
  console.log('\n🎉 All tests passed! Simplified URL matching is working correctly.')
}
else {
  console.log('\n⚠️  Some tests failed. Please check the implementation.')
}
