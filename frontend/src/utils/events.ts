import type { AuthenticationResult, SecurityEvent } from '../types/api'

export function summarizeEvents(events: SecurityEvent[]) {
  return {
    total: events.length,
    successful: events.filter((event) => event.authentication_result === 'success').length,
    failed: events.filter((event) => event.authentication_result === 'failure').length,
    uniqueIPs: new Set(events.map((event) => event.source_ip)).size,
  }
}
export function filterEvents(events: SecurityEvent[], result: AuthenticationResult | 'all', search: string): SecurityEvent[] {
  const query = search.trim().toLowerCase()
  return events.filter((event) => (result === 'all' || event.authentication_result === result)
    && (event.username.toLowerCase().includes(query) || event.source_ip.includes(query)))
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
}
