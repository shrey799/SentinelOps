import { useEffect, useRef, useState } from 'react'
import { fetchEvents, fetchHealth } from '../services/api'
import type { AuthenticationResult, SecurityEvent } from '../types/api'
import { filterEvents } from '../utils/events'
import EventsTable from './EventsTable'
import SummaryCards from './SummaryCards'

type Connection = 'checking' | 'connected' | 'unavailable'
export default function Dashboard() {
  const [events, setEvents] = useState<SecurityEvent[] | null>(null)
  const [connection, setConnection] = useState<Connection>('checking')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [result, setResult] = useState<AuthenticationResult | 'all'>('all')
  const controller = useRef<AbortController | null>(null)

  async function loadData() {
    controller.current?.abort()
    const current = new AbortController()
    controller.current = current
    const timeout = window.setTimeout(() => current.abort(), 10000)
    setLoading(true)
    setError(null)
    setEvents(null)
    setConnection('checking')
    await Promise.all([
      fetchHealth(current.signal).then(() => {
        if (controller.current === current) setConnection('connected')
      }).catch(() => {
        if (controller.current === current) setConnection('unavailable')
      }),
      fetchEvents(current.signal).then((data) => {
        if (controller.current === current) setEvents(data)
      }).catch((reason: unknown) => {
        if (controller.current === current) setError(reason instanceof Error ? reason.message : 'Unable to load events.')
      }),
    ])
    window.clearTimeout(timeout)
    if (controller.current === current) setLoading(false)
  }
  useEffect(() => {
    void loadData()
    return () => { controller.current?.abort(); controller.current = null }
  }, [])

  const visibleEvents = filterEvents(events ?? [], result, search)
  return <div className="min-h-screen bg-slate-950 text-slate-100">
    <header className="border-b border-slate-800 bg-slate-900/50"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
      <div><p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-300">SentinelOps</p><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">SentinelOps — Security Operations Dashboard</h1></div>
      <p role="status" className={`rounded-full border px-4 py-2 text-sm ${connection === 'connected' ? 'border-emerald-400/30 text-emerald-300' : 'border-slate-700 text-slate-300'}`}>{connection === 'checking' ? 'Checking backend…' : connection === 'connected' ? 'Backend connected' : 'Backend unavailable'}</p>
    </div></header>
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Authentication overview</h2><p className="mt-2 text-sm leading-6 text-slate-400">Synthetic demonstration data only. No live monitoring or threat detection.</p></div><button type="button" onClick={() => void loadData()} disabled={loading} className="rounded-lg bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 disabled:cursor-wait disabled:opacity-50">{loading ? 'Refreshing…' : 'Refresh'}</button></div>
      {connection === 'unavailable' && <p role="alert" className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-amber-200">Cannot reach a healthy backend. It may be offline. Start FastAPI on port 8000, then select Refresh.</p>}
      {error && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-4 text-rose-200">Could not load security events. {error} Check the backend and select Refresh to retry.</p>}
      {loading && <p role="status" className="py-8 text-slate-300">Loading security events…</p>}
      {events !== null && <><SummaryCards events={events} /><section aria-labelledby="events-heading" className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="space-y-5 p-6"><div className="flex flex-wrap items-center justify-between gap-2"><h2 id="events-heading" className="text-xl font-semibold">Recent Security Events</h2><p aria-live="polite" className="text-sm text-slate-400">Showing {visibleEvents.length} of {events.length} events</p></div>
          <div className="flex flex-col gap-4 sm:flex-row"><label className="flex flex-1 flex-col gap-2 text-sm text-slate-300">Search username or source IP<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="e.g. jordan.lee or 203.0.113.42" className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 focus:outline-2 focus:outline-cyan-400" /></label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">Authentication result<select value={result} onChange={(event) => setResult(event.target.value as AuthenticationResult | 'all')} className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 focus:outline-2 focus:outline-cyan-400"><option value="all">All results</option><option value="success">Success</option><option value="failure">Failure</option></select></label></div>
          <p className="text-sm text-slate-400">Summary cards cover all fetched events. Filters apply to the table.</p>
        </div>{visibleEvents.length ? <EventsTable events={visibleEvents} /> : <p role="status" className="px-6 pb-8 text-slate-300">{events.length ? 'No events match your filters.' : 'No security events returned by the backend.'}</p>}
      </section></>}
    </main>
  </div>
}
