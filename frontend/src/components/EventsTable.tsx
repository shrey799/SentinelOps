import type { SecurityEvent } from '../types/api'

export default function EventsTable({ events }: { events: SecurityEvent[] }) {
  return <div role="region" aria-label="Security event table" tabIndex={0} className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-cyan-400">
    <table className="w-full whitespace-nowrap text-left text-sm">
      <caption className="sr-only">Synthetic authentication events, newest first. Timestamps are UTC.</caption>
      <thead className="border-y border-slate-800 bg-slate-950/50 text-slate-400"><tr>{['Timestamp (UTC)', 'Username', 'Source IP', 'Event Type', 'Authentication Result', 'Source System'].map((heading) => <th key={heading} scope="col" className="px-6 py-4 font-medium">{heading}</th>)}</tr></thead>
      <tbody className="divide-y divide-slate-800">{events.map((event) => <tr key={event.event_id} className="hover:bg-slate-800/40">
        <td className="px-6 py-4 text-slate-400"><time dateTime={event.timestamp}>{new Date(event.timestamp).toISOString().replace('T', ' ').replace('.000Z', '')}</time></td>
        <td className="px-6 py-4 font-medium">{event.username}</td><td className="px-6 py-4 font-mono text-cyan-200">{event.source_ip}</td><td className="px-6 py-4 text-slate-300">{event.event_type}</td>
        <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 font-medium ${event.authentication_result === 'success' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/10 text-rose-300'}`}>{event.authentication_result}</span></td>
        <td className="px-6 py-4 text-slate-300">{event.source_system}</td>
      </tr>)}</tbody>
    </table>
  </div>
}
