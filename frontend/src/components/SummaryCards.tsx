import type { SecurityEvent } from '../types/api'
import { summarizeEvents } from '../utils/events'

export default function SummaryCards({ events }: { events: SecurityEvent[] }) {
  const counts = summarizeEvents(events)
  const cards = [['Total Events', counts.total, 'text-slate-100'], ['Successful Logins', counts.successful, 'text-emerald-300'], ['Failed Logins', counts.failed, 'text-rose-300'], ['Unique Source IPs', counts.uniqueIPs, 'text-cyan-300']] as const
  return <section aria-label="Event summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {cards.map(([label, count, color]) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><p className="text-sm text-slate-400">{label}</p><p className={`mt-3 text-4xl font-semibold tabular-nums ${color}`}>{count}</p></div>)}
  </section>
}
