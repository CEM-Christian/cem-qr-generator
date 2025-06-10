export default eventHandler(async (_event) => {
  const config = useRuntimeConfig()
  
  const requiredVars = {
    NUXT_CF_ACCOUNT_ID: config.cfAccountId,
    NUXT_CF_API_TOKEN: config.cfApiToken ? '[SET]' : '[MISSING]',
    NUXT_DATASET: config.dataset,
    NUXT_DISABLE_BOT_ACCESS_LOG: config.disableBotAccessLog,
    NODE_ENV: process.env.NODE_ENV
  }
  
  const missingVars = Object.entries(requiredVars)
    .filter(([_key, value]) => !value || value === '[MISSING]')
    .map(([key]) => key)
  
  return {
    environment: requiredVars,
    missingVariables: missingVars,
    hasCriticalMissing: missingVars.some(v => 
      ['NUXT_CF_ACCOUNT_ID', 'NUXT_CF_API_TOKEN'].includes(v)
    )
  }
})
