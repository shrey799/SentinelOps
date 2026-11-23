import type { HealthResponse, SecurityEvent } from '../types/api'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
function isHealth(value: unknown): value is HealthResponse {
  return isRecord(value) && typeof value.application === 'string' && value.status === 'ok' && typeof value.version === 'string'
}
function isEvent(value: unknown): value is SecurityEvent {
  return isRecord(value)
    && ['event_id', 'timestamp', 'username', 'source_ip', 'source_system'].every((key) => typeof value[key] === 'string' && value[key].length > 0)
    && typeof value.timestamp === 'string' && Number.isFinite(Date.parse(value.timestamp))
    && value.event_type === 'authentication' && value.synthetic === true
    && (value.authentication_result === 'success' || value.authentication_result === 'failure')
}
async function request<T>(path: string, validate: (value: unknown) => value is T, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Request failed (HTTP ${response.status}).`)
  const data: unknown = await response.json()
  if (!validate(data)) throw new Error('The API returned an unexpected response format.')
  return data
}
export const fetchHealth = (signal?: AbortSignal): Promise<HealthResponse> => request('/api/health', isHealth, signal)
export const fetchEvents = (signal?: AbortSignal): Promise<SecurityEvent[]> => request('/api/events', (value): value is SecurityEvent[] => Array.isArray(value) && value.every(isEvent), signal)
