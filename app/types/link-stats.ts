export interface LinkStats {
  slug: string
  scans: number
  lastUpdated: string
}

export interface LinkStatsResponse {
  success: boolean
  data: LinkStats | null
  error?: string
}
