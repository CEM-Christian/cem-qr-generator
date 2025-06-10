export default eventHandler(async (event) => {
  const { cloudflare } = event.context
  
  return {
    hasCloudflareContext: !!cloudflare,
    hasAnalyticsBinding: !!cloudflare?.env?.ANALYTICS,
    availableBindings: cloudflare?.env ? Object.keys(cloudflare.env) : [],
    bindingType: cloudflare?.env?.ANALYTICS ? typeof cloudflare.env.ANALYTICS : 'undefined'
  }
})
