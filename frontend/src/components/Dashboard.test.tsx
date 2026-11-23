import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import Dashboard from './Dashboard'
import { events, health } from '../test/fixtures'

function mockApi(data = events) {
  const mock = vi.fn(async (path: string) => new Response(JSON.stringify(path === '/api/health' ? health : data)))
  vi.stubGlobal('fetch', mock)
  return mock
}
it('shows loading before requests resolve', () => {
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
  const view = render(<Dashboard />)
  expect(screen.getByText('Loading security events…')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Refreshing…' })).toBeDisabled()
  view.unmount()
})
it('renders fetched events, counts, filters, search and refresh', async () => {
  const mock = mockApi()
  render(<Dashboard />)
  expect(await screen.findByText('Backend connected')).toBeInTheDocument()
  const summary = await screen.findByRole('region', { name: 'Event summary' })
  expect(within(summary).getByText('3')).toBeInTheDocument()
  expect(screen.getAllByRole('row')).toHaveLength(4)
  fireEvent.change(screen.getByLabelText('Authentication result'), { target: { value: 'failure' } })
  expect(screen.getAllByRole('row')).toHaveLength(3)
  fireEvent.change(screen.getByLabelText('Search username or source IP'), { target: { value: 'jordan' } })
  expect(screen.getAllByRole('row')).toHaveLength(2)
  fireEvent.change(screen.getByLabelText('Search username or source IP'), { target: { value: 'missing' } })
  expect(screen.getByText('No events match your filters.')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
  await waitFor(() => expect(mock).toHaveBeenCalledTimes(4))
  await screen.findByRole('button', { name: 'Refresh' })
})
it('shows an empty API response', async () => {
  mockApi([])
  render(<Dashboard />)
  expect(await screen.findByText('No security events returned by the backend.')).toBeInTheDocument()
})
it('shows offline and event errors without fabricated zero metrics, then recovers', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
  render(<Dashboard />)
  expect(await screen.findByText('Backend unavailable')).toBeInTheDocument()
  expect(screen.getByText(/Could not load security events/)).toBeInTheDocument()
  expect(screen.queryByText('Total Events')).not.toBeInTheDocument()
  mockApi()
  fireEvent.click(await screen.findByRole('button', { name: 'Refresh' }))
  expect(await screen.findByText('Backend connected')).toBeInTheDocument()
  expect(await screen.findByText('Total Events')).toBeInTheDocument()
})
it('keeps the health indicator independent of event failures', async () => {
  vi.stubGlobal('fetch', vi.fn(async (path: string) => path === '/api/health' ? new Response(JSON.stringify(health)) : new Response('', { status: 500 })))
  render(<Dashboard />)
  expect(await screen.findByText('Backend connected')).toBeInTheDocument()
  expect(await screen.findByText(/HTTP 500/)).toBeInTheDocument()
})
it('renders untrusted values as text', async () => {
  mockApi([{ ...events[0], username: '<img src=x onerror=alert(1)>' }])
  render(<Dashboard />)
  expect(await screen.findByText('<img src=x onerror=alert(1)>')).toBeInTheDocument()
  expect(document.querySelector('img')).toBeNull()
})
