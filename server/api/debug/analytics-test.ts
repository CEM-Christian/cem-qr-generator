export default eventHandler(async (event) => {
  const { cloudflare } = event.context
  const config = useRuntimeConfig()
  
  if (!cloudflare?.env?.ANALYTICS) {
    return {
      success: false,
      error: 'ANALYTICS binding not available',
      context: {
        hasCloudflare: !!cloudflare,
        hasEnv: !!cloudflare?.env,
        availableBindings: cloudflare?.env ? Object.keys(cloudflare.env) : []
      }
    }
  }

  const testData = {
    indexes: [`test-${Date.now()}`],
    blobs: ['test-slug', 'https://example.com', ''],
    doubles: [1, Date.now(), 0]
  }

  try {
    console.log('🧪 [ANALYTICS-TEST] Writing test data via direct binding:', testData)
    
    // Use the direct Analytics Engine binding
    await cloudflare.env.ANALYTICS.writeDataPoint(testData)
    
    console.log('✅ [ANALYTICS-TEST] Direct binding test write successful')
    
    // Also test hubAnalytics if available
    let hubResult = null
    try {
      hubResult = hubAnalytics().put(testData)
      console.log('🧪 [ANALYTICS-TEST] hubAnalytics() result:', typeof hubResult, hubResult)
    }
    catch (hubError: any) {
      console.log('⚠️ [ANALYTICS-TEST] hubAnalytics() failed:', hubError.message)
      hubResult = { error: hubError.message }
    }
    
    return {
      success: true,
      message: 'Analytics Engine write successful',
      testData,
      timestamp: new Date().toISOString(),
      directBinding: 'success',
      hubAnalytics: hubResult
    }
  }
  catch (error: any) {
    console.error('❌ [ANALYTICS-TEST] Test write failed:', error)
    
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      testData,
      config: {
        dataset: config.dataset,
        accountId: config.cfAccountId ? '[SET]' : '[MISSING]',
        apiToken: config.cfApiToken ? '[SET]' : '[MISSING]'
      }
    }
  }
})
