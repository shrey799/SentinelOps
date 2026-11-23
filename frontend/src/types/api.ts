export interface HealthResponse {
  application: string
  status: 'ok'
  version: string
}
export type AuthenticationResult = 'success' | 'failure'
export interface SecurityEvent {
  event_id: string
  timestamp: string
  username: string
  source_ip: string
  event_type: 'authentication'
  authentication_result: AuthenticationResult
  source_system: string
  synthetic: true
}
