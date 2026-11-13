function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-6">
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 font-bold text-cyan-300">S</span>
          <span className="font-semibold tracking-wide">SentinelOps</span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <p className="mb-6 text-sm font-medium uppercase tracking-widest text-cyan-300">Milestone 1 / Frontend foundation</p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">SentinelOps</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-200 sm:text-2xl">Security Operations &amp; Threat Detection Platform</p>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
          An educational Mini-SIEM (Security Information and Event Management)
          platform in development. SentinelOps will bring security logs together,
          detect suspicious activity, and support incident investigation using
          synthetic security data.
        </p>
        <section aria-labelledby="dashboard-heading" className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Coming in a later milestone</p>
          <h2 id="dashboard-heading" className="mt-3 text-xl font-semibold">Your security dashboard starts here.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Event exploration, threat alerts, and investigation tools will arrive
            as we build and test each milestone. This welcome screen does not
            collect logs or monitor security activity yet.
          </p>
        </section>
      </main>
      <footer className="mx-auto max-w-5xl px-6 pb-8 text-sm text-slate-500">Built to learn. Designed for investigation.</footer>
    </div>
  )
}

export default WelcomeScreen
