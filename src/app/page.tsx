export default function Home() {
  return (
    <main className="scraps-page min-h-dvh px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="scraps-card-warm flex flex-col justify-between gap-10 p-6 sm:p-8 lg:p-10">
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-clay-accent">
                Scraps
              </p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-normal text-text-primary sm:text-5xl">
                Design system foundation is ready.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-text-secondary sm:text-lg">
                Warm neutrals, grounded accents, and compact controls are in
                place for a premium playful utility feel.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <button className="min-h-12 rounded-2xl bg-primary-accent px-5 text-sm font-semibold text-white shadow-[0_12px_26px_rgb(232_93_63/0.22)] transition hover:bg-primary-accent-dark">
                Primary button
              </button>
              <button className="min-h-12 rounded-2xl border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition hover:border-primary-accent hover:text-primary-accent">
                Secondary button
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="scraps-card p-5 sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    Component sample
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-text-primary">
                    Useful, not noisy
                  </h2>
                </div>
                <span className="rounded-full bg-[rgb(79_138_91/0.12)] px-3 py-1 text-xs font-semibold text-green-accent">
                  Ready
                </span>
              </div>

              <div className="rounded-[1.1rem] border border-border bg-surface-warm p-4">
                <p className="text-sm font-medium text-text-primary">
                  Starter card
                </p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Card surfaces use soft contrast, restrained radius, and a
                  subtle shadow that works on cream backgrounds.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-surface px-3 py-2 text-sm font-medium text-text-secondary">
                  Low effort
                </span>
                <span className="rounded-full border border-[rgb(217_164_65/0.38)] bg-[rgb(217_164_65/0.12)] px-3 py-2 text-sm font-medium text-text-primary">
                  Comfort food
                </span>
              </div>
            </div>

            <div className="scraps-rounded-card flex flex-col justify-between gap-8 border border-[#332d27] bg-[#1f1f1f] p-5 text-white shadow-subtle sm:p-6">
              <div>
                <p className="text-sm font-medium text-[#cfc4b8]">
                  Dark-neutral sample
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Adult-friendly contrast
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#d8cec2]">
                  The palette can hold a rich neutral panel without turning the
                  interface into a dark app.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl bg-[#2b2621] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#d9a441]">
                    Ingredient bubble
                  </p>
                  <div className="mt-3 inline-flex rounded-full bg-[#fff8ed] px-4 py-2 text-sm font-semibold text-[#1f1f1f]">
                    Chicken thighs
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[#3a332d]">
                  <div className="h-2 w-2/3 rounded-full bg-soft-orange" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
