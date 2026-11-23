import type { SecurityEvent } from '../types/api'

export const events: SecurityEvent[] = [
  { event_id: '15450066-a472-57b4-a089-37a47aea7c91', timestamp: '2026-11-22T14:00:00Z', username: 'alex', source_ip: '192.0.2.10', event_type: 'authentication', authentication_result: 'success', source_system: 'demo-vpn', synthetic: true },
  { event_id: '2cddb68e-4294-5dfb-915a-86cd507b310b', timestamp: '2026-11-22T14:01:00Z', username: 'jordan', source_ip: '203.0.113.42', event_type: 'authentication', authentication_result: 'failure', source_system: 'demo-vpn', synthetic: true },
  { event_id: '1a4d544c-c20e-5d3c-be83-30200fed06b9', timestamp: '2026-11-22T14:02:00Z', username: 'alex', source_ip: '192.0.2.10', event_type: 'authentication', authentication_result: 'failure', source_system: 'demo-sso', synthetic: true },
]
export const health = { application: 'SentinelOps', status: 'ok', version: '0.1.0' }
