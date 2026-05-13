import Link from "next/link";
import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import {
  PrimaryButton,
  SecondaryButton,
  SelectableChip,
  SurfaceCard,
} from "@/components/ui";
import { buildNextHref, parseCsvParam } from "@/lib/flow/queryParams";

type CookPageProps = {
  searchParams?: Promise<{
    appliances?: string | string[];
    customIngredients?: string | string[];
    customVibes?: string | string[];
    ingredients?: string | string[];
    situation?: string;
    vibes?: string | string[];
  }>;
};

type FoodSituation = {
  description: string;
  id: string;
  title: string;
};

const foodSituations: FoodSituation[] = [
  {
    id: "real-meal",
    title: "I need a real meal",
    description:
      "For lunch or dinner when you want something that feels complete.",
  },
  {
    id: "quick",
    title: "I want something quick",
    description: "Fast options when time matters.",
  },
  {
    id: "too-tired",
    title: "I'm too tired",
    description: "Low-effort meals with fewer steps and less cleanup.",
  },
  {
    id: "cheap-filling",
    title: "Cheap and filling",
    description:
      "Meals that stretch basics like rice, pasta, eggs, potatoes, beans, and bread.",
  },
  {
    id: "bake",
    title: "I want to bake",
    description: "Sweet or snacky bakes using pantry ingredients.",
  },
  {
    id: "snack",
    title: "I want a snack",
    description: "Small bites, quick cravings, and light food.",
  },
  {
    id: "upgrade-premade",
    title: "Make a quick meal better",
    description:
      "Improve instant noodles, boxed mac, frozen meals, canned soup, leftovers, or other quick food.",
  },
  {
    id: "emergency",
    title: "Emergency meal",
    description: "Very few ingredients, very low effort, no grocery run.",
  },
];

export default async function CookPage({ searchParams }: CookPageProps) {
  const params = await searchParams;
  const applianceIds = parseCsvParam(params?.appliances);
  const ingredientIds = parseCsvParam(params?.ingredients);
  const customIngredients = parseCsvParam(params?.customIngredients);
  const vibeIds = parseCsvParam(params?.vibes);
  const customVibes = parseCsvParam(params?.customVibes);
  const selectedSituation = foodSituations.find(
    (situation) => situation.id === params?.situation,
  );
  const getCookHref = (path: string, situationId: string) =>
    buildNextHref({
      path,
      query: {
        appliances: applianceIds,
        customIngredients,
        customVibes,
        ingredients: ingredientIds,
        situation: situationId,
        vibes: vibeIds,
      },
    });

  const summaryPanel = (
    <SurfaceCard className="p-5">
      <p className="text-sm font-medium text-text-muted">Flow summary</p>
      <h2 className="mt-2 text-xl font-semibold text-text-primary">
        Selected so far
      </h2>

      <div className="mt-5 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
            Step
          </p>
          <div className="mt-2">
            <SelectableChip selected>Situation</SelectableChip>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
            Selected situation
          </p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {selectedSituation?.title ?? "Choose one to keep going."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-warm p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-accent">
            Next step
          </p>
          <p className="mt-2 text-sm font-semibold text-text-primary">
            Appliances
          </p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Next, Scraps will narrow ideas by what you can cook with.
          </p>
        </div>

        <div className="grid gap-3">
          {selectedSituation ? (
            <PrimaryButton
              className="w-full"
              href={getCookHref("/cook/appliances", selectedSituation.id)}
            >
              Continue to appliances
            </PrimaryButton>
          ) : (
            <PrimaryButton className="w-full" disabled>
              Continue to appliances
            </PrimaryButton>
          )}
          <SecondaryButton className="w-full" href="/">
            Back to start
          </SecondaryButton>
        </div>
      </div>
    </SurfaceCard>
  );

  return (
    <AppShell
      rightPanel={summaryPanel}
      showBottomNav={false}
      showDesktopNav={false}
    >
      <div className="space-y-5">
        <PageHeader
          eyebrow="Situation"
          title="What are we solving right now?"
          description="Pick the situation that fits. Scraps will use it to show meals that match your energy, time, and ingredients."
        />

        <SurfaceCard warm className="p-4 sm:p-5">
          <StepProgress currentStep={1} />
        </SurfaceCard>

        <section aria-label="Food situation options">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {foodSituations.map((situation) => {
              const isSelected = situation.id === selectedSituation?.id;

              return (
                <Link
                  aria-pressed={isSelected}
                  className={[
                    "min-h-32 rounded-card border p-5 text-left transition duration-200 ease-out",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
                    isSelected
                      ? "border-primary-accent bg-surface-warm shadow-[0_16px_36px_rgb(232_93_63/0.14)]"
                      : "border-border bg-surface shadow-[0_12px_30px_rgb(31_31_31/0.05)] hover:-translate-y-0.5 hover:border-clay-accent hover:bg-surface-warm",
                  ].join(" ")}
                  href={getCookHref("/cook", situation.id)}
                  key={situation.id}
                  role="button"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-text-primary">
                        {situation.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-text-secondary">
                        {situation.description}
                      </p>
                    </div>
                    <span
                      className={[
                        "mt-1 grid size-6 shrink-0 place-items-center rounded-full border",
                        isSelected
                          ? "border-primary-accent bg-primary-accent"
                          : "border-border bg-surface-warm",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {isSelected ? (
                        <span className="size-2 rounded-full bg-white" />
                      ) : null}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
