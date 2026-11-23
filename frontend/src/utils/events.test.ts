import { expect, it } from 'vitest'
import { events } from '../test/fixtures'
import { filterEvents, summarizeEvents } from './events'

it('calculates summaries from records, including duplicate IPs', () => {
  expect(summarizeEvents(events)).toEqual({ total: 3, successful: 1, failed: 2, uniqueIPs: 2 })
  expect(summarizeEvents([])).toEqual({ total: 0, successful: 0, failed: 0, uniqueIPs: 0 })
})
it('combines result and case-insensitive username filters', () => {
  expect(filterEvents(events, 'failure', ' ALEX ')).toEqual([events[2]])
})
it('searches IPs and sorts newest first without mutating input', () => {
  expect(filterEvents(events, 'all', '192.0.2')).toEqual([events[2], events[0]])
  expect(events[0].username).toBe('alex')
  expect(filterEvents(events, 'all', 'missing')).toEqual([])
})
