import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import Dashboard from '../src/components/Dashboard'
import { summarizeEvents } from '../src/utils/events'
import type { SecurityEvent } from '../src/types/api'

it('renders live FastAPI data through the running Vite proxy', async () => {
  const nativeFetch = globalThis.fetch
  const response = await nativeFetch('http://127.0.0.1:5173/api/events')
  expect(response.ok).toBe(true)
  const events: SecurityEvent[] = await response.json()
  const counts = summarizeEvents(events)
  vi.stubGlobal('fetch', (path: string, options?: RequestInit) => nativeFetch(new URL(path, 'http://127.0.0.1:5173'), options))
  render(<Dashboard />)
  expect(await screen.findByText('Backend connected')).toBeInTheDocument()
  const summary = await screen.findByRole('region', { name: 'Event summary' })
  for (const value of Object.values(counts)) expect(within(summary).getAllByText(String(value)).length).toBeGreaterThan(0)
  expect(screen.getAllByRole('row')).toHaveLength(events.length + 1)
  for (const event of events) expect(screen.getAllByText(event.username).length).toBeGreaterThan(0)
  console.info('Live API summary:', counts)
})

it('displays a newly ingested synthetic event after Refresh', async () => {
  const nativeFetch = globalThis.fetch
  vi.stubGlobal('fetch', (path: string, options?: RequestInit) => nativeFetch(new URL(path, 'http://127.0.0.1:5173'), options))
  render(<Dashboard />)
  await screen.findByRole('region', { name: 'Event summary' })
  await screen.findByRole('button', { name: 'Refresh' })
  const initialRows = screen.getAllByRole('row').length
  const username = `Demo.Refresh.${crypto.randomUUID()}`
  const response = await nativeFetch('http://127.0.0.1:5173/api/events/ingest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: '2026-11-25T09:30:00-05:00', username,
      source_ip: '192.0.2.88', event_type: 'authentication',
      authentication_result: ' FAILED ', source_system: 'demo-integration', synthetic: true,
    }),
  })
  expect(response.status).toBe(201)
  const inserted: SecurityEvent = await response.json()
  expect(inserted.timestamp).toBe('2026-11-25T14:30:00Z')
  expect(inserted.authentication_result).toBe('failure')
  expect(screen.queryByText(username)).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
  expect(await screen.findByText(username)).toBeInTheDocument()
  await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(initialRows + 1))
  const summary = screen.getByRole('region', { name: 'Event summary' })
  expect(within(summary).getByText('Total Events').nextElementSibling).toHaveTextContent(String(initialRows))
})
