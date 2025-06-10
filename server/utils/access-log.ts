import type { H3Event } from 'h3'
import { parseAcceptLanguage } from 'intl-parse-accept-language'
import { UAParser } from 'ua-parser-js'
import {
  CLIs,
  Crawlers,
  Emails,
  ExtraDevices,
  Fetchers,
  InApps,
  MediaPlayers,
  Vehicles,
} from 'ua-parser-js/extensions'
import { parseURL } from 'ufo'
import { getFlag } from '@/utils/flag'

function toBlobNumber(blob: string) {
  return +blob.replace(/\D/g, '')
}

export const blobsMap = {
  blob1: 'slug',
  blob2: 'url',
  blob3: 'ua',
  blob4: 'ip',
  blob5: 'referer',
  blob6: 'country',
  blob7: 'region',
  blob8: 'city',
  blob9: 'timezone',
  blob10: 'language',
  blob11: 'os',
  blob12: 'browser',
  blob13: 'browserType',
  blob14: 'device',
  blob15: 'deviceType',
  blob16: 'COLO',
} as const

export const doublesMap = {
  double1: 'latitude',
  double2: 'longitude',
} as const

export type BlobsMap = typeof blobsMap
export type BlobsKey = keyof BlobsMap

export type DoublesMap = typeof doublesMap
export type DoublesKey = keyof DoublesMap

export type LogsKey = BlobsMap[BlobsKey] | DoublesMap[DoublesKey]
export type LogsMap = {
  [key in BlobsMap[BlobsKey]]: string | undefined
} & {
  [key in DoublesMap[DoublesKey]]?: number | undefined
}

export const logsMap = {
  ...Object.entries(blobsMap).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {}),
  ...Object.entries(doublesMap).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {}),
} as LogsMap

export function logs2blobs(logs: LogsMap) {
  return (Object.keys(blobsMap) as BlobsKey[])
    .sort((a, b) => toBlobNumber(a) - toBlobNumber(b))
    .map(key => String(logs[blobsMap[key] as LogsKey] || ''))
}

export function blobs2logs(blobs: string[]) {
  const logsList = Object.keys(blobsMap)

  return blobs.reduce((logs, blob, i) => {
    const key = blobsMap[logsList[i] as BlobsKey]
    logs[key] = blob
    return logs
  }, {} as Partial<LogsMap>)
}

export function logs2doubles(logs: LogsMap) {
  return (Object.keys(doublesMap) as DoublesKey[])
    .sort((a, b) => toBlobNumber(a) - toBlobNumber(b))
    .map(key => Number(logs[doublesMap[key] as LogsKey] || 0))
}

export function doubles2logs(doubles: number[]) {
  const logsList = Object.keys(doublesMap)

  return doubles.reduce((logs, double, i) => {
    const key = doublesMap[logsList[i] as DoublesKey]
    logs[key] = double
    return logs
  }, {} as Partial<LogsMap>)
}

export function useAccessLog(event: H3Event) {
  const startTime = Date.now()
  console.log('🔍 [ACCESS-LOG] Started for:', {
    url: event.node.req.url,
    userAgent: event.node.req.headers['user-agent'],
    timestamp: new Date().toISOString()
  })

  const ip = getHeader(event, 'cf-connecting-ip') || getHeader(event, 'x-real-ip') || getRequestIP(event, { xForwardedFor: true })

  const { host: referer } = parseURL(getHeader(event, 'referer'))

  const acceptLanguage = getHeader(event, 'accept-language') || ''
  const language = (parseAcceptLanguage(acceptLanguage) || [])[0]

  const userAgent = getHeader(event, 'user-agent') || ''
  const uaInfo = (new UAParser(userAgent, {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    browser: [Crawlers.browser || [], CLIs.browser || [], Emails.browser || [], Fetchers.browser || [], InApps.browser || [], MediaPlayers.browser || [], Vehicles.browser || []].flat(),
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    device: [ExtraDevices.device || []].flat(),
  })).getResult()

  const { request: { cf } } = event.context.cloudflare
  const link = event.context.link || {}

  console.log('🔗 [ACCESS-LOG] Link context:', {
    linkId: link.id,
    linkSlug: link.slug
  })

  const isBot = cf?.botManagement?.verifiedBot
    || ['crawler', 'fetcher'].includes(uaInfo?.browser?.type || '')
    || ['spider', 'bot'].includes(uaInfo?.browser?.name?.toLowerCase() || '')

  const { disableBotAccessLog } = useRuntimeConfig(event)
  if (isBot && disableBotAccessLog) {
    console.log('🤖 [ACCESS-LOG] Bot access log disabled:', userAgent)
    return Promise.resolve()
  }

  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
  const countryName = regionNames.of(cf?.country || 'WD') // fallback to "Worldwide"
  const accessLogs = {
    url: link.url,
    slug: link.slug,
    ua: userAgent,
    ip,
    referer,
    country: cf?.country,
    region: `${getFlag(cf?.country)} ${[cf?.region, countryName].filter(Boolean).join(',')}`,
    city: `${getFlag(cf?.country)} ${[cf?.city, countryName].filter(Boolean).join(',')}`,
    timezone: cf?.timezone,
    language,
    os: uaInfo?.os?.name,
    browser: uaInfo?.browser?.name,
    browserType: uaInfo?.browser?.type,
    device: uaInfo?.device?.model,
    deviceType: uaInfo?.device?.type,
    COLO: cf?.colo,

    // For RealTime Globe
    latitude: Number(cf?.latitude || getHeader(event, 'cf-iplatitude') || 0),
    longitude: Number(cf?.longitude || getHeader(event, 'cf-iplongitude') || 0),
  }

  console.log('📊 [ACCESS-LOG] Generated logs:', {
    logCount: Object.keys(accessLogs).length,
    link: { id: link.id, slug: link.slug },
    isProduction: process.env.NODE_ENV === 'production'
  })

  if (!link.id) {
    console.warn('⚠️ [ACCESS-LOG] No link.id in context')
    return Promise.resolve()
  }

  if (process.env.NODE_ENV === 'production') {
    const analyticsData = {
      indexes: [link.id], // only one index
      blobs: logs2blobs(accessLogs),
      doubles: logs2doubles(accessLogs),
    }
    
    console.log('📤 [ACCESS-LOG] Attempting Analytics Engine write:', {
      indexes: analyticsData.indexes,
      blobsLength: analyticsData.blobs.length,
      doublesLength: analyticsData.doubles.length,
      rawBlobs: analyticsData.blobs,
      rawDoubles: analyticsData.doubles
    })

    try {
      const analyticsResult = hubAnalytics().put(analyticsData)
      
      // Check if result is a Promise
      if (analyticsResult && typeof analyticsResult === 'object' && 'then' in analyticsResult) {
        return (analyticsResult as Promise<any>)
          .then(() => {
            console.log('✅ [ACCESS-LOG] Successfully written to Analytics Engine')
            console.log(`⏱️ [ACCESS-LOG] Total time: ${Date.now() - startTime}ms`)
          })
          .catch((error: any) => {
            console.error('❌ [ACCESS-LOG] Failed to write to Analytics Engine:', {
              error: error.message,
              stack: error.stack,
              linkId: link.id,
              data: analyticsData
            })
            throw error
          })
      }
      else {
        console.log('✅ [ACCESS-LOG] Analytics Engine write completed synchronously')
        console.log(`⏱️ [ACCESS-LOG] Total time: ${Date.now() - startTime}ms`)
        return Promise.resolve()
      }
    }
    catch (error: any) {
      console.error('❌ [ACCESS-LOG] Failed to write to Analytics Engine:', {
        error: error.message,
        stack: error.stack,
        linkId: link.id,
        data: analyticsData
      })
      throw error
    }
  }
  else {
    console.log('🧪 [ACCESS-LOG] Development mode - skipping Analytics Engine write')
    console.log('📄 [ACCESS-LOG] Would have written:', {
      indexes: [link.id],
      blobs: logs2blobs(accessLogs),
      doubles: logs2doubles(accessLogs)
    })
    console.log('access logs:', accessLogs, logs2blobs(accessLogs), logs2doubles(accessLogs), { ...blobs2logs(logs2blobs(accessLogs)), ...doubles2logs(logs2doubles(accessLogs)) })
    return Promise.resolve()
  }
}

// Helper functions for debugging
export function isBot(userAgent: string, cf?: any) {
  const uaInfo = (new UAParser(userAgent, {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    browser: [Crawlers.browser || [], CLIs.browser || [], Emails.browser || [], Fetchers.browser || [], InApps.browser || [], MediaPlayers.browser || [], Vehicles.browser || []].flat(),
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    device: [ExtraDevices.device || []].flat(),
  })).getResult()

  return cf?.botManagement?.verifiedBot
    || ['crawler', 'fetcher'].includes(uaInfo?.browser?.type || '')
    || ['spider', 'bot'].includes(uaInfo?.browser?.name?.toLowerCase() || '')
}

export function getAccessLog(event: H3Event): LogsMap {
  const ip = getHeader(event, 'cf-connecting-ip') || getHeader(event, 'x-real-ip') || getRequestIP(event, { xForwardedFor: true })
  const { host: referer } = parseURL(getHeader(event, 'referer'))
  const acceptLanguage = getHeader(event, 'accept-language') || ''
  const language = (parseAcceptLanguage(acceptLanguage) || [])[0]
  const userAgent = getHeader(event, 'user-agent') || ''
  
  const uaInfo = (new UAParser(userAgent, {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    browser: [Crawlers.browser || [], CLIs.browser || [], Emails.browser || [], InApps.browser || [], MediaPlayers.browser || [], Vehicles.browser || []].flat(),
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    device: [ExtraDevices.device || []].flat(),
  })).getResult()

  const { request: { cf } } = event.context.cloudflare || { request: { cf: {} } }
  const link = event.context.link || {}

  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
  const countryName = regionNames.of(cf?.country || 'WD')

  return {
    url: link.url,
    slug: link.slug,
    ua: userAgent,
    ip,
    referer,
    country: cf?.country,
    region: `${getFlag(cf?.country)} ${[cf?.region, countryName].filter(Boolean).join(',')}`,
    city: `${getFlag(cf?.country)} ${[cf?.city, countryName].filter(Boolean).join(',')}`,
    timezone: cf?.timezone,
    language,
    os: uaInfo?.os?.name,
    browser: uaInfo?.browser?.name,
    browserType: uaInfo?.browser?.type,
    device: uaInfo?.device?.model,
    deviceType: uaInfo?.device?.type,
    COLO: cf?.colo,
    latitude: Number(cf?.latitude || getHeader(event, 'cf-iplatitude') || 0),
    longitude: Number(cf?.longitude || getHeader(event, 'cf-iplongitude') || 0),
  }
}
