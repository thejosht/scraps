import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import { ClearFlowButton, FlowSessionSync } from "@/components/flow";
import {
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  SurfaceCard,
} from "@/components/ui";
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
  isQuickMealUpgradeSituation,
  parseCsvParam,
} from "@/lib/flow/queryParams";
import { buildRecipeResults } from "@/lib/ranking";
import type { RankedRecipeMatch } from "@/types";

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

type ResultSection = {
  description: string;
  matches: RankedRecipeMatch[];
  title: string;
};

const situationLabels = new Map([
  ["real-meal", "I need a real meal"],
  ["quick", "I want something quick"],
  ["too-tired", "I'm too tired"],
  ["cheap-filling", "Cheap and filling"],
  ["bake", "I want to bake"],
  ["snack", "I want a snack"],
  ["quick-meal-upgrade", "Make a quick meal better"],
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

function formatList(items: string[]) {
  return items.length > 0 ? items.join(", ") : "None yet";
}

function groupMatches(matches: RankedRecipeMatch[]): ResultSection[] {
  const assignedIds = new Set<string>();

  function takeMatches(
    title: string,
    description: string,
    predicate: (match: RankedRecipeMatch) => boolean,
  ) {
    const sectionMatches = matches.filter(
      (match) => !assignedIds.has(match.templateId) && predicate(match),
    );

    sectionMatches.forEach((match) => assignedIds.add(match.templateId));

    return sectionMatches.length > 0
      ? [{ title, description, matches: sectionMatches }]
      : [];
  }

  const sections = [
    ...takeMatches(
      "Make a quick meal better",
      "Best when you are improving noodles, boxed meals, soup, frozen food, or leftovers.",
      (match) => match.matchLabel === "Quick meal upgrade",
    ),
    ...takeMatches(
      "Use what you have",
      "Meal directions where the core ingredients are already covered.",
      (match) => match.missingRequired.length === 0,
    ),
    ...takeMatches(
      "Quick wins",
      "Fast options with enough overlap to make the decision easy.",
      (match) =>
        match.timeMinutes <= 15 && match.missingRequired.length === 0,
    ),
    ...takeMatches(
      "Low effort options",
      "Lower-lift ideas for when cleanup and energy matter.",
      (match) =>
        match.matchLabel === "Best lazy option" ||
        match.effort === "very-low",
    ),
    ...takeMatches(
      "One small missing item",
      "Worth considering when the base is covered and only a supporting item is missing.",
      (match) => match.matchLabel === "One small missing item",
    ),
  ];
  const otherMatches = matches.filter(
    (match) => !assignedIds.has(match.templateId),
  );

  if (otherMatches.length > 0) {
    sections.push({
      title: "Other ideas",
      description: "Still realistic, just not the closest fit from this pass.",
      matches: otherMatches,
    });
  }

  return sections;
}

function SnapshotSection({
  items,
  title,
}: {
  items: string[];
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
        {title}
      </p>
      {items.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
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
        <p className="mt-2 text-sm leading-6 text-text-secondary">None yet.</p>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}

function ResultCard({
  match,
  prominent = false,
  recipeHref,
}: {
  match: RankedRecipeMatch;
  prominent?: boolean;
  recipeHref: string;
}) {
  return (
    <article
      className={[
        "rounded-card border bg-surface p-5 shadow-subtle",
        prominent
          ? "border-[rgb(232_93_63/0.34)] shadow-[0_22px_54px_rgb(232_93_63/0.12)]"
          : "border-border",
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {prominent ? (
              <span className="rounded-full bg-primary-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                Best match
              </span>
            ) : null}
            <span className="rounded-full border border-[rgb(79_138_91/0.28)] bg-[rgb(79_138_91/0.10)] px-3 py-1 text-xs font-semibold text-green-accent">
              {match.matchLabel}
            </span>
            <span className="rounded-full border border-border bg-surface-warm px-3 py-1 text-xs font-semibold text-text-muted">
              {match.matchScore}% fit
            </span>
          </div>
          <h2
            className={[
              "mt-4 font-semibold text-text-primary",
              prominent ? "text-2xl" : "text-xl",
            ].join(" ")}
          >
            {match.name}
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {match.description}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <MiniStat label="Time" value={`${match.timeMinutes} min`} />
        <MiniStat label="Effort" value={match.effort.replace("-", " ")} />
        <MiniStat label="Cleanup" value={match.cleanup} />
      </div>

      {match.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {match.tags.slice(0, prominent ? 5 : 4).map((tag) => (
            <span
              className="rounded-full bg-surface-warm px-3 py-1 text-xs font-medium text-text-secondary"
              key={tag}
            >
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 text-sm leading-6 text-text-secondary">
        <p>
          <span className="font-semibold text-text-primary">Uses: </span>
          {formatList(match.ingredientsUsed)}
        </p>
        {match.missingRequired.length > 0 ? (
          <p>
            <span className="font-semibold text-primary-accent">
              Missing:{" "}
            </span>
            {match.missingRequired.join(", ")}
          </p>
        ) : null}
        <div>
          <p className="font-semibold text-text-primary">Why it fits</p>
          <ul className="mt-1 space-y-1">
            {match.reasons.slice(0, prominent ? 4 : 3).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton className="sm:w-auto" href={recipeHref}>
          View recipe
        </PrimaryButton>
        <SecondaryButton className="sm:w-auto" disabled>
          Save for later
        </SecondaryButton>
      </div>
    </article>
  );
}

function EmptyResults({
  backToIngredientsHref,
  backToVibeHref,
}: {
  backToIngredientsHref: string;
  backToVibeHref: string;
}) {
  return (
    <EmptyState
      title="No strong matches yet"
      description="Try adding one more ingredient, choosing another appliance, or using Surprise me."
      action={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <SecondaryButton href={backToIngredientsHref}>
            Back to ingredients
          </SecondaryButton>
          <SecondaryButton href={backToVibeHref}>Back to vibe</SecondaryButton>
        </div>
      }
    />
  );
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const applianceIds = parseCsvParam(params?.appliances);
  const ingredientIds = parseCsvParam(params?.ingredients);
  const customIngredients = parseCsvParam(params?.customIngredients);
  const vibeIds = parseCsvParam(params?.vibes);
  const customVibes = parseCsvParam(params?.customVibes);
  const isUpgradeMode = isQuickMealUpgradeSituation(params?.situation);
  const rankedMatches = buildRecipeResults({
    applianceIds,
    customIngredients,
    customVibes,
    ingredientIds,
    situationId: params?.situation,
    vibeIds,
  });
  const resultQuery = {
    appliances: applianceIds,
    customIngredients,
    customVibes,
    ingredients: ingredientIds,
    situation: params?.situation,
    vibes: vibeIds,
  };
  const topMatch = rankedMatches[0];
  const groupedMatches = groupMatches(rankedMatches.slice(1));
  const backToIngredientsHref = buildNextHref({
    path: "/cook/ingredients",
    query: {
      appliances: applianceIds,
      customIngredients,
      ingredients: ingredientIds,
      situation: params?.situation,
    },
  });
  const backToVibeHref = buildNextHref({
    path: "/cook/vibe",
    query: resultQuery,
  });
  const snapshotPanel = (
    <SurfaceCard className="p-5">
      <p className="text-sm font-medium text-text-muted">Your cooking snapshot</p>
      <h2 className="mt-2 text-xl font-semibold text-text-primary">
        What Scraps used
      </h2>
      <div className="mt-5 space-y-5">
        <SnapshotSection
          items={
            params?.situation
              ? [getLabel(params.situation, situationLabels)]
              : []
          }
          title="Situation"
        />
        <SnapshotSection
          items={applianceIds.map((id) => getLabel(id, applianceLabels))}
          title="Appliances"
        />
        <SnapshotSection
          items={ingredientIds.map((id) => getLabel(id, ingredientLabels))}
          title="Ingredients"
        />
        <SnapshotSection
          items={customIngredients.map(decodeCustomValue)}
          title="Custom ingredients"
        />
        <SnapshotSection
          items={vibeIds.map((id) => getLabel(id, vibeLabels))}
          title="Vibes"
        />
        <SnapshotSection
          items={customVibes.map(decodeCustomValue)}
          title="Custom vibes"
        />
        <div className="rounded-2xl border border-border bg-surface-warm p-4">
          <p className="text-sm leading-6 text-text-secondary">
            These are structured meal directions for now. Full step-by-step
            recipes come next.
          </p>
        </div>
        <ClearFlowButton className="w-full" />
      </div>
    </SurfaceCard>
  );

  return (
    <AppShell
      rightPanel={snapshotPanel}
      showBottomNav={false}
      showDesktopNav={false}
    >
      <FlowSessionSync />
      <div className="space-y-5">
        <PageHeader
          eyebrow="Results"
          title={
            isUpgradeMode
              ? "Here’s how to make it better"
              : "Here’s what you can make"
          }
          description={
            isUpgradeMode
              ? "Based on your quick meal base, Scraps found realistic upgrade directions that fit your tools and mood."
              : "Based on what you picked, Scraps found realistic meal directions that fit your ingredients, tools, and mood."
          }
        />

        <SurfaceCard warm className="p-4 sm:p-5">
          <StepProgress currentStep={5} />
        </SurfaceCard>

        {topMatch ? (
          <section aria-label="Best match" className="space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">
                  Best match
                </p>
                <h2 className="text-xl font-semibold text-text-primary">
                  Start here if you want the fastest decision.
                </h2>
              </div>
              <p className="text-sm text-text-secondary">
                {rankedMatches.length} ideas found
              </p>
            </div>
            <ResultCard
              match={topMatch}
              prominent
              recipeHref={buildNextHref({
                path: `/cook/recipe/${topMatch.templateId}`,
                query: resultQuery,
              })}
            />
          </section>
        ) : (
          <EmptyResults
            backToIngredientsHref={backToIngredientsHref}
            backToVibeHref={backToVibeHref}
          />
        )}

        {groupedMatches.map((section) => (
          <section className="space-y-3" key={section.title}>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {section.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                {section.description}
              </p>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {section.matches.map((match) => (
                <ResultCard
                  key={match.templateId}
                  match={match}
                  recipeHref={buildNextHref({
                    path: `/cook/recipe/${match.templateId}`,
                    query: resultQuery,
                  })}
                />
              ))}
            </div>
          </section>
        ))}

        {topMatch ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <SecondaryButton href={backToIngredientsHref}>
              Adjust ingredients
            </SecondaryButton>
            <SecondaryButton href={backToVibeHref}>Adjust vibe</SecondaryButton>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
