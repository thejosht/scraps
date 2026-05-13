import { CategoryBubble, IngredientBubble } from "@/components/bubbles";
import {
  EmptyState,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
  SelectableChip,
  SurfaceCard,
} from "@/components/ui";

export default function Home() {
  return (
    <main className="scraps-page min-h-dvh px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <SurfaceCard
            warm
            className="flex flex-col justify-between gap-10 p-6 sm:p-8 lg:p-10"
          >
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-clay-accent">
                Scraps
              </p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-normal text-text-primary sm:text-5xl">
                Design system foundation is ready.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-text-secondary sm:text-lg">
                Warm neutrals, grounded accents, and reusable primitives are in
                place for a premium playful utility feel.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <PrimaryButton>Primary button</PrimaryButton>
              <SecondaryButton>Secondary button</SecondaryButton>
            </div>
          </SurfaceCard>

          <div className="grid gap-5 md:grid-cols-2">
            <SurfaceCard>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    Component samples
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-text-primary">
                    Useful, not noisy
                  </h2>
                </div>
                <span className="rounded-full bg-[rgb(79_138_91/0.12)] px-3 py-1 text-xs font-semibold text-green-accent">
                  Ready
                </span>
              </div>

              <div className="grid gap-3">
                <CategoryBubble
                  selected
                  title="Proteins"
                  subtitle="Chicken, beef, eggs, tuna"
                />
                <CategoryBubble
                  title="Carbs"
                  subtitle="Rice, pasta, noodles, oats"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <SelectableChip>Low effort</SelectableChip>
                <SelectableChip selected>Comfort food</SelectableChip>
                <SelectableChip>Fresh</SelectableChip>
              </div>
            </SurfaceCard>

            <div className="scraps-rounded-card flex flex-col justify-between gap-8 border border-[#332d27] bg-[#1f1f1f] p-5 text-white shadow-subtle sm:p-6">
              <div>
                <p className="text-sm font-medium text-[#cfc4b8]">
                  Bubble samples
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Tactile, still grown-up
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#d8cec2]">
                  Ingredient controls should feel satisfying without becoming
                  noisy or cartoonish.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl bg-[#2b2621] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#d9a441]">
                    Ingredient bubbles
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <IngredientBubble
                      selected
                      categoryLabel="Protein"
                      label="Chicken thighs"
                    />
                    <IngredientBubble
                      categoryLabel="Leftover"
                      helperText="Ready to reheat"
                      label="Rice"
                    />
                  </div>
                </div>
                <LoadingState
                  className="border-[#3a332d] bg-[#2b2621] text-[#d8cec2]"
                  message="Loading preview"
                />
              </div>
            </div>

            <SurfaceCard className="md:col-span-2">
              <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    Empty state
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-text-primary">
                    Calm fallback patterns
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
                    Future screens can reuse this for sparse pantry selections,
                    filtered-out results, or setup moments.
                  </p>
                </div>
                <EmptyState
                  title="Nothing selected yet"
                  description="Start with a few ingredients when the real flow is ready."
                  action={<SecondaryButton className="min-h-10">Sample action</SecondaryButton>}
                />
              </div>
            </SurfaceCard>
          </div>
        </div>
      </section>
    </main>
  );
}
