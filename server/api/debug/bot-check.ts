export default eventHandler(async (event) => {
  const body = await readBody(event)
  const userAgent = body.userAgent || ''
  
  // Import the bot detection logic from access-log
  const { isBot } = await import('../../utils/access-log')
  
  const result = {
    userAgent,
    isDetectedAsBot: isBot(userAgent),
    disableBotLogging: useRuntimeConfig().disableBotAccessLog,
    wouldBeFiltered: isBot(userAgent) && useRuntimeConfig().disableBotAccessLog
  }
  
  console.log('🤖 [BOT-CHECK] Analysis:', result)
  
  return result
})
