import React from 'react';

const AuthShell = ({ eyebrow, title, subtitle, children, aside }) => {
  return (
    <div className="app-shell overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="surface-card-strong hero-grid relative overflow-hidden p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
            <div className="relative space-y-6">
              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1 text-sm font-semibold tracking-wide text-emerald-400">
                {eyebrow}
              </span>
              <div className="space-y-4">
                <h1 className="max-w-xl text-5xl font-semibold leading-tight text-[var(--app-text)]">
                  Premium turf booking with a calm, production-ready workflow.
                </h1>
                <p className="max-w-lg text-base leading-7 text-muted">
                  TurfPlay keeps discovery, booking, and account management consistent across devices so players and admins never fight the interface.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['Realtime availability', 'Always synced slots'],
                  ['Dual themes', 'Light and dark polished'],
                  ['Responsive layouts', 'Built for mobile first'],
                ].map(([label, text]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-[var(--app-text)]">{label}</p>
                    <p className="mt-1 text-sm text-muted">{text}</p>
                  </div>
                ))}
              </div>
              {aside}
            </div>
          </div>
        </section>

        <section className="surface-card-strong relative z-10 mx-auto w-full max-w-xl p-6 sm:p-8">
          <div className="mb-8 space-y-3">
            <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
              {eyebrow}
            </span>
            <h2 className="text-3xl font-semibold text-[var(--app-text)] sm:text-4xl">{title}</h2>
            <p className="text-sm leading-6 text-muted sm:text-base">{subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </div>
  );
};

export default AuthShell;
