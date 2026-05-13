import { CategoryBubble, IngredientBubble } from "@/components/bubbles";
import { AppShell, StepProgress } from "@/components/layout";
import {
  EmptyState,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
  SelectableChip,
  SurfaceCard,
} from "@/components/ui";

const sessionSummary = (
  <SurfaceCard className="p-5">
    <p className="text-sm font-medium text-text-muted">Session summary</p>
    <h2 className="mt-2 text-xl font-semibold text-text-primary">
      Selected so far
    </h2>
    <div className="mt-5 space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
          Ingredients
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <SelectableChip selected>Chicken thighs</SelectableChip>
          <SelectableChip>Rice</SelectableChip>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
          Vibe
        </p>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Comfort food, low effort
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-surface-warm p-4">
        <p className="text-sm font-medium text-text-primary">Preview only</p>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          This panel demonstrates desktop structure without real app state.
        </p>
      </div>
    </div>
  </SurfaceCard>
);

export default function Home() {
  return (
    <AppShell
      pageTitle="Design system foundation is ready."
      pageDescription="Reusable layout and UI primitives are in place for a warm, responsive Scraps experience."
      rightPanel={sessionSummary}
    >
      <SurfaceCard warm className="p-5 sm:p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr] xl:items-center">
          <div>
            <p className="text-sm font-medium text-text-muted">
              Responsive shell preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-text-primary">
              Mobile-first, desktop-aware
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
              The shell stacks cleanly on small screens, then opens into a
              purpose-built desktop layout with navigation context, content, and
              an optional side panel.
            </p>
          </div>
          <StepProgress currentStep={3} />
        </div>
      </SurfaceCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <SurfaceCard>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Category and chip samples
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-text-primary">
                Useful, not noisy
              </h2>
            </div>
            <span className="rounded-full bg-[rgb(79_138_91/0.12)] px-3 py-1 text-xs font-semibold text-green-accent">
              Ready
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <CategoryBubble
              selected
              title="Proteins"
              subtitle="Chicken, beef, eggs, tuna"
            />
            <CategoryBubble title="Carbs" subtitle="Rice, pasta, noodles" />
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
              Ingredient controls should feel satisfying without becoming noisy
              or cartoonish.
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
      </div>

      <SurfaceCard>
        <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-text-muted">Empty state</p>
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
            action={
              <SecondaryButton className="min-h-10">
                Sample action
              </SecondaryButton>
            }
          />
        </div>
      </SurfaceCard>

      <div className="grid gap-3 sm:grid-cols-2">
        <PrimaryButton>Primary button</PrimaryButton>
        <SecondaryButton>Secondary button</SecondaryButton>
      </div>
    </AppShell>
  );
}
