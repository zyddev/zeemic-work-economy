import { useGtag } from '../utils/useGtag'

interface AnalyticsEventPayload {
  event: string
  [key: string]: unknown
}

export function useAnalyticsEvent() {
  const { gtag } = useGtag()

  function trackEvent(payload: AnalyticsEventPayload): void {
    const { event: eventName, ...params } = payload

    // 1. GA4 client-side (no-op on server / when gtag not loaded)
    gtag('event', eventName, params)

    // 2. Backend ingest — fire-and-forget; analytics failures must never surface to the user
    $fetch('/api/analytics/events', {
      method: 'POST',
      body: payload,
    }).catch(() => {})
  }

  return { trackEvent }
}
