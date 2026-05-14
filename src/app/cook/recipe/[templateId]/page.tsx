import type { ReactNode } from "react";
import { AppShell, PageHeader } from "@/components/layout";
import {
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  SurfaceCard,
} from "@/components/ui";
import { appliances } from "@/data/appliances";
import { ingredients } from "@/data/ingredients";
import { recipeTemplates } from "@/data/recipeTemplates";
import {
  buildNextHref,
  decodeCustomValue,
  parseCsvParam,
  slugifyCustomValue,
} from "@/lib/flow/queryParams";
import { buildRecipeResults } from "@/lib/ranking";
import type {
  ApplianceId,
  RankedRecipeMatch,
  RecipeTemplate,
} from "@/types";

type RecipeDetailPageProps = {
  params: Promise<{
    templateId: string;
  }>;
  searchParams?: Promise<{
    appliances?: string | string[];
    customIngredients?: string | string[];
    customVibes?: string | string[];
    ingredients?: string | string[];
    situation?: string;
    vibes?: string | string[];
  }>;
};

const ingredientLabels = new Map(
  ingredients.map((ingredient) => [ingredient.id, ingredient.name]),
);
const ingredientLookupIds = new Map<string, string>();
const ingredientLookupLabels = new Map<string, string>();

ingredients.forEach((ingredient) => {
  [
    ingredient.id,
    ingredient.name,
    ...ingredient.synonyms,
    ...ingredient.aliases,
  ].forEach((value) => {
    const lookupValue = slugifyCustomValue(value);

    if (lookupValue && !ingredientLookupLabels.has(lookupValue)) {
      ingredientLookupIds.set(lookupValue, ingredient.id);
      ingredientLookupLabels.set(lookupValue, ingredient.name);
    }
  });
});

const applianceLabels = new Map(
  appliances.map((appliance) => [appliance.id, appliance.label]),
);

function getIngredientLabel(id: string) {
  return (
    ingredientLabels.get(id) ??
    ingredientLookupLabels.get(slugifyCustomValue(id)) ??
    decodeCustomValue(id)
  );
}

function getApplianceLabel(id: string) {
  return applianceLabels.get(id as ApplianceId) ?? decodeCustomValue(id);
}

function formatValue(value: string) {
  return value.replace(/-/g, " ");
}

function getSlotIngredientIds(template: RecipeTemplate) {
  return new Set(
    [...template.requiredSlots, ...template.optionalSlots].flatMap((slot) => [
      ...(slot.ingredientIds ?? []),
      ...(slot.equivalentIngredientIds ?? []),
    ]),
  );
}

function getSelectedTemplateIngredientNames({
  selectedIngredientIds,
  template,
}: {
  selectedIngredientIds: string[];
  template: RecipeTemplate;
}) {
  const slotIngredientIds = getSlotIngredientIds(template);

  return selectedIngredientIds
    .filter((ingredientId) => {
      const canonicalId =
        ingredientLookupIds.get(slugifyCustomValue(ingredientId)) ?? ingredientId;

      return slotIngredientIds.has(canonicalId);
    })
    .map(getIngredientLabel);
}

function getToolNames({
  match,
  selectedApplianceIds,
  template,
}: {
  match?: RankedRecipeMatch;
  selectedApplianceIds: string[];
  template: RecipeTemplate;
}) {
  if (match?.appliancesUsed.length) {
    return match.appliancesUsed;
  }

  const selectedIds = new Set(selectedApplianceIds);
  const compatibleSelected = template.compatibleAppliances.filter((applianceId) =>
    selectedIds.has(applianceId),
  );
  const toolsToShow =
    compatibleSelected.length > 0
      ? compatibleSelected
      : template.compatibleAppliances;

  return toolsToShow.map(getApplianceLabel);
}

function getDirections(template: RecipeTemplate) {
  const fallbackSteps = [
    `Gather the ingredients you have for ${template.name.toLowerCase()}.`,
    "Prep anything that needs chopping, draining, opening, or reheating.",
    "Use one of the listed tools to bring the main ingredients together.",
    "Taste, adjust seasoning, and keep the steps simple.",
  ];

  const directionsByTemplateId: Record<string, string[]> = {
    "fried-rice": [
      "Prep your rice and any add-ins before the pan gets hot.",
      "Heat a pan with oil or butter.",
      "Cook aromatics, vegetables, egg, or protein if using.",
      "Add rice and sauce, then toss until everything is hot.",
      "Adjust seasoning and serve right away.",
    ],
    "rice-bowl": [
      "Warm or cook the rice first.",
      "Heat or prep the protein and vegetables you want to use.",
      "Add everything to a bowl in layers.",
      "Finish with sauce, seasoning, cheese, or heat if it fits your vibe.",
    ],
    "chicken-and-rice-plate": [
      "Cook or reheat the rice.",
      "Cook the chicken with seasoning, or reheat it if already cooked.",
      "Add vegetables or sauce if you have them.",
      "Plate the chicken with rice and adjust seasoning.",
    ],
    "garlic-butter-pasta": [
      "Boil pasta until tender.",
      "Warm butter with garlic in a pan.",
      "Toss pasta into the garlic butter with a splash of pasta water.",
      "Add cheese, vegetables, or heat if using.",
    ],
    "tomato-pasta": [
      "Boil pasta until tender.",
      "Warm tomato sauce or canned tomatoes in a pan.",
      "Add vegetables, protein, or seasoning if using.",
      "Toss pasta with the sauce and finish with cheese if you have it.",
    ],
    "tuna-pasta": [
      "Boil pasta until tender.",
      "Drain tuna and prep any sauce or vegetables.",
      "Combine pasta with tuna and your creamy or tomato base.",
      "Season, warm through, and serve.",
    ],
    quesadilla: [
      "Place cheese and any fillings on a tortilla.",
      "Fold or top with another tortilla.",
      "Toast in a pan, press, or toaster oven until crisp and melty.",
      "Slice and add sauce if you have it.",
    ],
    "toasted-sandwich": [
      "Build the sandwich with bread and your filling.",
      "Toast it in a pan, toaster oven, or press.",
      "Cook until the outside is crisp and the filling is warmed.",
      "Add condiments or fresh vegetables at the end if useful.",
    ],
    "air-fryer-chicken-drumsticks": [
      "Pat the drumsticks dry and season them well.",
      "Air fry in a single layer so they can crisp.",
      "Turn once if needed and cook until safely done.",
      "Serve with rice, potatoes, vegetables, or sauce if you have them.",
    ],
    "upgraded-instant-noodles": [
      "Cook the noodles using the package directions.",
      "Add vegetables, egg, or protein while the noodles cook if using.",
      "Stir in sauce, spice, or peanut butter to change the flavor.",
      "Taste and adjust with hot sauce or soy sauce.",
    ],
    "boxed-mac-and-cheese-upgrade": [
      "Prepare the boxed mac according to the package directions.",
      "Stir in protein or vegetables if using.",
      "Add hot sauce, extra cheese, breadcrumbs, or seasoning.",
      "Serve as-is or crisp the top if you have an oven or toaster oven.",
    ],
    "loaded-frozen-fries": [
      "Cook the frozen fries until crisp.",
      "Warm any protein, vegetables, or sauce you want to add.",
      "Top the fries with cheese, sauce, seasoning, or protein.",
      "Return to heat briefly if you want the topping melted.",
    ],
    "canned-soup-upgrade": [
      "Heat the canned soup according to the package directions.",
      "Add rice, pasta, noodles, vegetables, or protein if using.",
      "Simmer or microwave until everything is hot.",
      "Season with sauce, spice, or herbs if you have them.",
    ],
    "oatmeal-bowl": [
      "Cook oats with milk, water, or the liquid you have.",
      "Stir until thick and warm.",
      "Add fruit, sweetener, cinnamon, peanut butter, or yogurt.",
      "Taste and adjust sweetness or texture.",
    ],
    "egg-scramble-plate": [
      "Beat the eggs and prep any vegetables or cheese.",
      "Cook vegetables or leftovers first if using.",
      "Add eggs and stir gently until set.",
      "Serve with toast, rice, potatoes, tortillas, or sauce if you have them.",
    ],
    "no-cook-snack-plate": [
      "Pick one filling anchor like bread, cheese, yogurt, tuna, fruit, or a spread.",
      "Add any no-cook extras you have.",
      "Season or add sauce if it makes the plate better.",
      "Keep it simple and serve cold or room temperature.",
    ],
  };

  return directionsByTemplateId[template.id] ?? fallbackSteps;
}

function getSubstitutionNotes(template: RecipeTemplate) {
  const notes = [
    "Swap similar proteins when the format still makes sense.",
    "Use any sauce or seasoning you like if the exact one is missing.",
    "Frozen vegetables can stand in for fresh vegetables in most cooked versions.",
  ];

  if (template.tags.includes("rice")) {
    notes.push("Leftover rice is easiest, but fresh rice can work if you cook it first.");
  }

  if (template.tags.includes("quick-meal-upgrade")) {
    notes.push("Treat packaged directions as the baseline, then add only what improves it.");
  }

  if (template.tags.includes("no-cook")) {
    notes.push("Keep anything that needs cooking off the plate unless it is already cooked.");
  }

  return notes;
}

function FactPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}

function ChipList({
  emptyText = "None yet.",
  items,
}: {
  emptyText?: string;
  items: string[];
}) {
  if (items.length === 0) {
    return <p className="text-sm leading-6 text-text-secondary">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          className="rounded-full border border-border bg-surface-warm px-3 py-1.5 text-sm font-medium text-text-primary"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function DetailSection({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow?: string;
  title: string;
}) {
  return (
    <SurfaceCard className="p-5 sm:p-6">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <div className="mt-4">{children}</div>
    </SurfaceCard>
  );
}

function InvalidRecipeState({ backHref }: { backHref: string }) {
  return (
    <AppShell showBottomNav={false} showDesktopNav={false}>
      <EmptyState
        title="Recipe not found"
        description="That meal idea is not in the current Scraps template set."
        action={<PrimaryButton href={backHref}>Go back to results</PrimaryButton>}
      />
    </AppShell>
  );
}

export default async function RecipeDetailPage({
  params,
  searchParams,
}: RecipeDetailPageProps) {
  const { templateId } = await params;
  const queryParams = await searchParams;
  const applianceIds = parseCsvParam(queryParams?.appliances);
  const ingredientIds = parseCsvParam(queryParams?.ingredients);
  const customIngredients = parseCsvParam(queryParams?.customIngredients);
  const vibeIds = parseCsvParam(queryParams?.vibes);
  const customVibes = parseCsvParam(queryParams?.customVibes);
  const preservedQuery = {
    appliances: applianceIds,
    customIngredients,
    customVibes,
    ingredients: ingredientIds,
    situation: queryParams?.situation,
    vibes: vibeIds,
  };
  const backToResultsHref = buildNextHref({
    path: "/cook/results",
    query: preservedQuery,
  });
  const adjustIngredientsHref = buildNextHref({
    path: "/cook/ingredients",
    query: {
      appliances: applianceIds,
      customIngredients,
      ingredients: ingredientIds,
      situation: queryParams?.situation,
    },
  });
  const template = recipeTemplates.find((recipe) => recipe.id === templateId);

  if (!template) {
    return <InvalidRecipeState backHref={backToResultsHref} />;
  }

  const rankedMatches = buildRecipeResults({
    applianceIds,
    customIngredients,
    customVibes,
    ingredientIds,
    situationId: queryParams?.situation,
    vibeIds,
  });
  const match = rankedMatches.find(
    (rankedMatch) => rankedMatch.templateId === template.id,
  );
  const selectedIngredientNames = getSelectedTemplateIngredientNames({
    selectedIngredientIds: ingredientIds,
    template,
  });
  const customIngredientNames = customIngredients.map(decodeCustomValue);
  const whatYouHave = Array.from(
    new Set([...selectedIngredientNames, ...customIngredientNames]),
  );
  const needItems = [
    ...(match?.missingRequired ?? []),
    ...(match?.preparationNotes ?? []),
  ];
  const toolNames = getToolNames({
    match,
    selectedApplianceIds: applianceIds,
    template,
  });
  const directions = getDirections(template);
  const substitutionNotes = getSubstitutionNotes(template);
  const quickFactsPanel = (
    <SurfaceCard className="p-5">
      <p className="text-sm font-medium text-text-muted">Recipe snapshot</p>
      <h2 className="mt-2 text-xl font-semibold text-text-primary">
        Quick facts
      </h2>
      <div className="mt-5 grid gap-3">
        <FactPill label="Time" value={`${template.timeMinutes} min`} />
        <FactPill label="Effort" value={formatValue(template.effort)} />
        <FactPill label="Cleanup" value={template.cleanup} />
        <FactPill label="Skill" value={template.skillLevel} />
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
          Tools
        </p>
        <div className="mt-3">
          <ChipList items={toolNames} />
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-border bg-surface-warm p-4">
        <p className="text-sm leading-6 text-text-secondary">
          These directions are template-based so they stay practical and
          consistent.
        </p>
      </div>
    </SurfaceCard>
  );

  return (
    <AppShell
      rightPanel={quickFactsPanel}
      showBottomNav={false}
      showDesktopNav={false}
    >
      <div className="space-y-5">
        <PageHeader
          eyebrow="Recipe"
          title={template.name}
          description={template.baseDescription}
        />

        <SurfaceCard warm className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[rgb(79_138_91/0.28)] bg-[rgb(79_138_91/0.10)] px-3 py-1 text-xs font-semibold text-green-accent">
              {match?.matchLabel ?? "Template direction"}
            </span>
            {match ? (
              <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-muted">
                {match.matchScore}% fit
              </span>
            ) : null}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <FactPill label="Time" value={`${template.timeMinutes} min`} />
            <FactPill label="Effort" value={formatValue(template.effort)} />
            <FactPill label="Cleanup" value={template.cleanup} />
          </div>
          {template.tags.length > 0 ? (
            <div className="mt-5">
              <ChipList
                items={template.tags.slice(0, 6).map((tag) => formatValue(tag))}
              />
            </div>
          ) : null}
        </SurfaceCard>

        <DetailSection title="Why this fits">
          {match?.reasons.length ? (
            <ul className="space-y-2 text-sm leading-6 text-text-secondary">
              {match.reasons.slice(0, 4).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-text-secondary">
              This template is available, but it was not a strong ranked match
              for the current selections.
            </p>
          )}
        </DetailSection>

        <div
          className={[
            "grid gap-5",
            needItems.length > 0 ? "lg:grid-cols-2" : "lg:grid-cols-1",
          ].join(" ")}
        >
          <DetailSection title="What you have">
            <ChipList
              emptyText="No matching selected ingredients for this template yet."
              items={whatYouHave}
            />
          </DetailSection>

          {needItems.length > 0 ? (
            <DetailSection title="You may need">
              <ul className="space-y-2 text-sm leading-6 text-text-secondary">
                {needItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DetailSection>
          ) : null}
        </div>

        <DetailSection title="Tools">
          <ChipList items={toolNames} />
        </DetailSection>

        <DetailSection eyebrow="Deterministic" title="Basic directions">
          <ol className="space-y-3 text-sm leading-6 text-text-secondary">
            {directions.map((direction, index) => (
              <li className="flex gap-3" key={direction}>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-warm text-xs font-semibold text-primary-accent">
                  {index + 1}
                </span>
                <span>{direction}</span>
              </li>
            ))}
          </ol>
        </DetailSection>

        <DetailSection title="Substitution notes">
          <ul className="space-y-2 text-sm leading-6 text-text-secondary">
            {substitutionNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </DetailSection>

        {template.safetyNotes?.length ? (
          <DetailSection title="Safety notes">
            <ul className="space-y-2 text-sm leading-6 text-text-secondary">
              {template.safetyNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </DetailSection>
        ) : null}

        <SurfaceCard className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href={backToResultsHref}>Back to results</PrimaryButton>
            <SecondaryButton href={adjustIngredientsHref}>
              Adjust ingredients
            </SecondaryButton>
            <SecondaryButton disabled>Save recipe</SecondaryButton>
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
