import { describe, expect, it, vi } from 'vitest'
import { fetchEvents, fetchHealth } from './api'
import { events, health } from '../test/fixtures'

describe('API service', () => {
  it('requests the relative health endpoint and passes its signal', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(health)))
    vi.stubGlobal('fetch', fetchMock)
    const signal = new AbortController().signal
    expect(await fetchHealth(signal)).toEqual(health)
    expect(fetchMock).toHaveBeenCalledWith('/api/health', expect.objectContaining({ signal }))
  })
  it('reads the events array', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(events))))
    expect(await fetchEvents()).toEqual(events)
  })
  it('reports HTTP errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })))
    await expect(fetchEvents()).rejects.toThrow('HTTP 503')
  })
  it('reports network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(fetchHealth()).rejects.toThrow('Failed to fetch')
  })
  it.each([{ value: events }, [{ ...events[0], authentication_result: 'unknown' }], [{ ...events[0], timestamp: 'invalid' }]])('rejects an invalid event response %#', async (data) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(data))))
    await expect(fetchEvents()).rejects.toThrow('unexpected response format')
  })
  it('rejects malformed health data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 'bad' }))))
    await expect(fetchHealth()).rejects.toThrow('unexpected response format')
  })
})
