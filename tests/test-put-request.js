#!/usr/bin/env node

const BASE_URL = process.env.BASE_URL || 'https://qr.cem.com.au'

async function testPutRequest() {
  console.log(`Testing PUT request to: ${BASE_URL}`)

  const testData = {
    name: 'Test Link PUT',
    url: 'https://example.com',
    slug: 'test-put-123',
    organization: 'test-org',
    utm_source: 'test',
    comment: 'Testing PUT request',
    qr_style_options: {
      baseOptions: { color: '#000000', type: 'square' },
      componentOverrides: {},
      dotsOptions: { color: '#000000', type: 'dots', roundSize: false },
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: { color: '#000000', type: 'square' },
      cornersDotOptions: { color: '#000000', type: 'square' },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 2 },
      logoSelection: { logoType: 'favicon' },
    },
  }

  try {
    console.log('Sending PUT request...')
    console.log('Request body:', JSON.stringify(testData, null, 2))

    const response = await fetch(`${BASE_URL}/api/link/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PUT-Test-Script/1.0',
      },
      body: JSON.stringify(testData),
    })

    console.log('\n--- Response Details ---')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log('Response Body:', responseText)

    if (response.ok) {
      console.log('✅ PUT request successful!')
    }
    else {
      console.log('❌ PUT request failed!')
    }
  }
  catch (error) {
    console.error('❌ Request failed with error:', error.message)

    if (error.cause) {
      console.error('Cause:', error.cause)
    }
  }
}

async function testMultipleMethods() {
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

  console.log('Testing multiple HTTP methods on /api/link/edit...\n')

  for (const method of methods) {
    try {
      console.log(`Testing ${method} request...`)

      const response = await fetch(`${BASE_URL}/api/link/edit`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Method-Test-Script/1.0',
        },
        body: method !== 'GET' ? JSON.stringify({ test: true }) : undefined,
      })

      console.log(`${method}: ${response.status} ${response.statusText}`)

      // Read a small portion of response to avoid large outputs
      const text = await response.text()
      if (text.length > 200) {
        console.log(`Response: ${text.substring(0, 200)}...`)
      }
      else {
        console.log(`Response: ${text}`)
      }
    }
    catch (error) {
      console.log(`${method}: ERROR - ${error.message}`)
    }

    console.log('---')
  }
}

// Test simple endpoint that should exist
async function testHealthCheck() {
  console.log('Testing basic connectivity...')

  try {
    const response = await fetch(`${BASE_URL}/api/link/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Health Check',
        url: 'https://example.com',
        organization: 'test',
      }),
    })

    console.log(`Health check: ${response.status} ${response.statusText}`)

    if (response.status === 400 || response.status === 422) {
      console.log('✅ Server is responding (validation error is expected)')
    }
    else if (response.ok) {
      console.log('✅ Server is fully functional')
    }
    else {
      console.log('⚠️  Server responding but with unexpected status')
    }
  }
  catch (error) {
    console.error('❌ Server connection failed:', error.message)
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node test-put-request.js [options]

Options:
  --all-methods    Test all HTTP methods
  --health        Test basic connectivity only
  --url <url>     Set custom base URL

Environment Variables:
  BASE_URL        Production URL to test (default: https://your-production-domain.com)

Examples:
  node test-put-request.js
  node test-put-request.js --all-methods
  BASE_URL=https://your-site.pages.dev node test-put-request.js
`)
    return
  }

  // Override URL if provided
  if (args.includes('--url')) {
    const urlIndex = args.indexOf('--url')
    if (args[urlIndex + 1]) {
      process.env.BASE_URL = args[urlIndex + 1]
    }
  }

  console.log('🧪 HTTP Method Testing Script')
  console.log('='.repeat(50))

  if (args.includes('--health')) {
    await testHealthCheck()
  }
  else if (args.includes('--all-methods')) {
    await testHealthCheck()
    console.log('\n')
    await testMultipleMethods()
  }
  else {
    await testHealthCheck()
    console.log('\n')
    await testPutRequest()
  }

  console.log('\n✨ Testing complete!')
}

main().catch(console.error)
