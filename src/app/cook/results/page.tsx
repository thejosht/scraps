import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import { SecondaryButton, SurfaceCard } from "@/components/ui";
import { appliances } from "@/data/appliances";
import {
  ingredientGroups,
  ingredientSubgroups,
  specificIngredients,
} from "@/data/ingredients";
import { vibes } from "@/data/vibes";
import {
  buildNextHref,
  decodeCustomValue,
  parseCsvParam,
} from "@/lib/flow/queryParams";
import { buildRecipeResults } from "@/lib/ranking";

type ResultsPageProps = {
  searchParams?: Promise<{
    appliances?: string | string[];
    customIngredients?: string | string[];
    customVibes?: string | string[];
    ingredients?: string | string[];
    situation?: string;
    vibes?: string | string[];
  }>;
};

const situationLabels = new Map([
  ["real-meal", "I need a real meal"],
  ["quick", "I want something quick"],
  ["too-tired", "I'm too tired"],
  ["cheap-filling", "Cheap and filling"],
  ["bake", "I want to bake"],
  ["snack", "I want a snack"],
  ["upgrade-premade", "Make a quick meal better"],
  ["emergency", "Emergency meal"],
]);

const applianceLabels = new Map(
  appliances.map((appliance) => [appliance.id, appliance.label]),
);

const ingredientLabels = new Map(
  [...ingredientGroups, ...ingredientSubgroups, ...specificIngredients].map(
    (ingredient) => [ingredient.id, ingredient.name],
  ),
);

const vibeLabels = new Map(vibes.map((vibe) => [vibe.id, vibe.label]));

function getLabel(id: string, labels: Map<string, string>) {
  return labels.get(id) ?? decodeCustomValue(id);
}

function SummarySection({
  items,
  title,
}: {
  items: string[];
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
        {title}
      </p>
      {items.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              className="rounded-full border border-border bg-surface-warm px-3 py-1.5 text-sm font-medium text-text-primary"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-text-secondary">None received.</p>
      )}
    </div>
  );
}

export default async function ResultsPlaceholderPage({
  searchParams,
}: ResultsPageProps) {
  const params = await searchParams;
  const applianceIds = parseCsvParam(params?.appliances);
  const ingredientIds = parseCsvParam(params?.ingredients);
  const customIngredients = parseCsvParam(params?.customIngredients);
  const vibeIds = parseCsvParam(params?.vibes);
  const customVibes = parseCsvParam(params?.customVibes);
  const rankedMatches = buildRecipeResults({
    applianceIds,
    customIngredients,
    customVibes,
    ingredientIds,
    situationId: params?.situation,
    vibeIds,
  }).slice(0, 5);
  const backHref = buildNextHref({
    path: "/cook/vibe",
    query: {
      appliances: applianceIds,
      customIngredients,
      customVibes,
      ingredients: ingredientIds,
      situation: params?.situation,
      vibes: vibeIds,
    },
  });

  return (
    <AppShell showBottomNav={false} showDesktopNav={false}>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Results"
          title="Meal ideas coming next."
          description="This placeholder keeps the flow target in place without building the results screen yet."
        />
        <SurfaceCard warm className="p-5 sm:p-6">
          <StepProgress currentStep={5} />

          <div className="mt-6 space-y-4">
            <SummarySection
              items={
                params?.situation
                  ? [getLabel(params.situation, situationLabels)]
                  : []
              }
              title="Situation"
            />
            <SummarySection
              items={applianceIds.map((id) => getLabel(id, applianceLabels))}
              title="Appliances"
            />
            <SummarySection
              items={ingredientIds.map((id) => getLabel(id, ingredientLabels))}
              title="Ingredients"
            />
            <SummarySection
              items={customIngredients.map(decodeCustomValue)}
              title="Custom ingredients"
            />
            <SummarySection
              items={vibeIds.map((id) => getLabel(id, vibeLabels))}
              title="Vibes"
            />
            <SummarySection
              items={customVibes.map(decodeCustomValue)}
              title="Custom vibes"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-accent">
                  Ranking debug
                </p>
                <h2 className="mt-2 text-lg font-semibold text-text-primary">
                  Top template matches
                </h2>
              </div>
              <p className="text-sm text-text-secondary">
                {rankedMatches.length} shown
              </p>
            </div>

            {rankedMatches.length > 0 ? (
              <ol className="mt-4 space-y-3">
                {rankedMatches.map((match) => (
                  <li
                    className="rounded-2xl border border-border bg-surface-warm p-4"
                    key={match.templateId}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-text-primary">
                          {match.name}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-text-secondary">
                          {match.description}
                        </p>
                      </div>
                      <div className="shrink-0 rounded-full border border-[rgb(232_93_63/0.22)] bg-[rgb(232_93_63/0.10)] px-3 py-1.5 text-sm font-semibold text-primary-accent">
                        {match.matchScore}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-primary">
                        {match.matchLabel}
                      </span>
                      <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-secondary">
                        {match.timeMinutes} min
                      </span>
                      <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-secondary">
                        {match.effort} effort
                      </span>
                      <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-secondary">
                        {match.cleanup} cleanup
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm leading-6 text-text-secondary">
                      <p>
                        <span className="font-medium text-text-primary">
                          Uses:
                        </span>{" "}
                        {match.ingredientsUsed.length > 0
                          ? match.ingredientsUsed.join(", ")
                          : "No selected ingredients yet"}
                      </p>
                      {match.missingRequired.length > 0 ? (
                        <p>
                          <span className="font-medium text-text-primary">
                            Missing:
                          </span>{" "}
                          {match.missingRequired.join(", ")}
                        </p>
                      ) : null}
                      <p>
                        <span className="font-medium text-text-primary">
                          Why:
                        </span>{" "}
                        {match.reasons.join(" ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm leading-6 text-text-secondary">
                No template matches yet. Add at least one compatible appliance
                and a core ingredient, then come back here.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <SecondaryButton href={backHref}>Back to vibe</SecondaryButton>
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
