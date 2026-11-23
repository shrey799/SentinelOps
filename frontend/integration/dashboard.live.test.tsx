import { render, screen, within } from '@testing-library/react'
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
