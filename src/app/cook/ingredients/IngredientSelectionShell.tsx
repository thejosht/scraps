"use client";

import { useMemo, useState } from "react";
import { CategoryBubble, IngredientBubble } from "@/components/bubbles";
import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import {
  PrimaryButton,
  SecondaryButton,
  SelectableChip,
  SurfaceCard,
} from "@/components/ui";
import type {
  IngredientGroup,
  IngredientId,
  IngredientSubgroup,
  SpecificIngredient,
} from "@/types";

type IngredientSelectionShellProps = {
  backHref: string;
  flowParams: {
    applianceIds?: string;
    situationId?: string;
  };
  groups: IngredientGroup[];
  specificIngredients: SpecificIngredient[];
  subgroups: IngredientSubgroup[];
};

function getPreviewText(
  parentId: IngredientId,
  children: Array<IngredientSubgroup | SpecificIngredient>,
) {
  const childNames = children
    .filter((child) => child.parentId === parentId)
    .map((child) => child.name);

  if (childNames.length === 0) {
    return "More options coming as the pantry model grows.";
  }

  const preview = childNames.slice(0, 3).join(", ");

  return childNames.length > 3 ? `${preview}...` : preview;
}

function getSpecificExamples({
  activeGroupId,
  specificIngredients,
  subgroups,
}: {
  activeGroupId?: string;
  specificIngredients: SpecificIngredient[];
  subgroups: IngredientSubgroup[];
}) {
  if (!activeGroupId) {
    return [];
  }

  const childSubgroupIds = new Set(
    subgroups
      .filter((subgroup) => subgroup.parentId === activeGroupId)
      .map((subgroup) => subgroup.id),
  );

  return specificIngredients
    .filter((ingredient) => childSubgroupIds.has(ingredient.parentId))
    .slice(0, 6);
}

function buildVibeHref({
  applianceIds,
  selectedIngredientIds,
  situationId,
}: {
  applianceIds?: string;
  selectedIngredientIds: IngredientId[];
  situationId?: string;
}) {
  const params = new URLSearchParams();

  if (situationId) {
    params.set("situation", situationId);
  }

  if (applianceIds) {
    params.set("appliances", applianceIds);
  }

  if (selectedIngredientIds.length > 0) {
    params.set("ingredients", selectedIngredientIds.join(","));
  }

  const query = params.toString();

  return query ? `/cook/vibe?${query}` : "/cook/vibe";
}

function SelectedIngredientChip({
  ingredient,
  onRemove,
}: {
  ingredient: SpecificIngredient;
  onRemove: () => void;
}) {
  return (
    <button
      aria-label={`Remove ${ingredient.name}`}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[rgb(217_164_65/0.42)] bg-[rgb(217_164_65/0.16)] px-3.5 py-2 text-sm font-medium text-text-primary shadow-[0_8px_18px_rgb(217_164_65/0.12)] transition hover:border-primary-accent hover:bg-surface-warm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
      onClick={onRemove}
      type="button"
    >
      <span>{ingredient.name}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
        Remove
      </span>
    </button>
  );
}

export function IngredientSelectionShell({
  backHref,
  flowParams,
  groups,
  specificIngredients,
  subgroups,
}: IngredientSelectionShellProps) {
  const [activeGroupId, setActiveGroupId] = useState<string>();
  const [activeSubgroupId, setActiveSubgroupId] = useState<string>();
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<
    IngredientId[]
  >([]);
  const activeGroup = groups.find((group) => group.id === activeGroupId);
  const activeSubgroup = subgroups.find(
    (subgroup) => subgroup.id === activeSubgroupId,
  );
  const activeChildren = useMemo(
    () =>
      activeGroupId
        ? subgroups.filter((subgroup) => subgroup.parentId === activeGroupId)
        : [],
    [activeGroupId, subgroups],
  );
  const activeExamples = useMemo(
    () =>
      getSpecificExamples({
        activeGroupId,
        specificIngredients,
        subgroups,
      }),
    [activeGroupId, specificIngredients, subgroups],
  );
  const activeSpecificIngredients = useMemo(
    () =>
      activeSubgroupId
        ? specificIngredients.filter(
            (ingredient) => ingredient.parentId === activeSubgroupId,
          )
        : [],
    [activeSubgroupId, specificIngredients],
  );
  const selectedIngredients = useMemo(
    () =>
      selectedIngredientIds
        .map((ingredientId) =>
          specificIngredients.find((ingredient) => ingredient.id === ingredientId),
        )
        .filter((ingredient): ingredient is SpecificIngredient => Boolean(ingredient)),
    [selectedIngredientIds, specificIngredients],
  );
  const continueHref = buildVibeHref({
    applianceIds: flowParams.applianceIds,
    selectedIngredientIds,
    situationId: flowParams.situationId,
  });

  function handleGroupSelect(groupId: IngredientId) {
    setActiveGroupId(groupId);
    setActiveSubgroupId((currentSubgroupId) => {
      const currentSubgroup = subgroups.find(
        (subgroup) => subgroup.id === currentSubgroupId,
      );

      return currentSubgroup?.parentId === groupId ? currentSubgroupId : undefined;
    });
  }

  function toggleIngredient(ingredientId: IngredientId) {
    setSelectedIngredientIds((currentIds) =>
      currentIds.includes(ingredientId)
        ? currentIds.filter((id) => id !== ingredientId)
        : [...currentIds, ingredientId],
    );
  }

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
            <SelectableChip selected>Ingredients</SelectableChip>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
            Active group
          </p>
          {activeGroup ? (
            <div className="mt-2">
              <SelectableChip selected>{activeGroup.name}</SelectableChip>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Choose a category to preview what is inside.
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
            Active subgroup
          </p>
          {activeSubgroup ? (
            <div className="mt-2">
              <SelectableChip selected>{activeSubgroup.name}</SelectableChip>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Pick a subgroup to see specific ingredients.
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
            Selected ingredients
          </p>
          {selectedIngredients.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <SelectableChip selected key={ingredient.id}>
                  {ingredient.name}
                </SelectableChip>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-text-secondary">None yet.</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface-warm p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-accent">
            Next step
          </p>
          <p className="mt-2 text-sm font-semibold text-text-primary">Vibe</p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            The next screen will ask what kind of meal you are in the mood for.
          </p>
        </div>

        <div className="grid gap-3">
          {selectedIngredients.length > 0 ? (
            <PrimaryButton className="w-full" href={continueHref}>
              Continue to vibe
            </PrimaryButton>
          ) : (
            <PrimaryButton className="w-full" disabled>
              Continue to vibe
            </PrimaryButton>
          )}
          <SecondaryButton className="w-full" href={backHref}>
            Back to appliances
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
          eyebrow="Ingredients"
          title="What do you have?"
          description="Start with a category. You can get specific next, like chicken drumsticks, leftover rice, or boxed mac."
        />

        <SurfaceCard warm className="p-4 sm:p-5">
          <StepProgress currentStep={3} />
        </SurfaceCard>

        <SurfaceCard className="p-4 sm:p-5">
          <label
            className="text-sm font-medium text-text-muted"
            htmlFor="ingredient-search-placeholder"
          >
            Search ingredients
          </label>
          <input
            className="mt-3 min-h-12 w-full rounded-2xl border border-border bg-surface px-4 text-base text-text-primary shadow-[0_10px_24px_rgb(31_31_31/0.04)] outline-none transition placeholder:text-text-muted focus:border-primary-accent focus:ring-4 focus:ring-[rgb(232_93_63/0.10)]"
            id="ingredient-search-placeholder"
            placeholder="Search ingredients like chicken drumsticks, leftover rice, boxed mac..."
            readOnly
            type="search"
          />
        </SurfaceCard>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
          <section aria-label="Ingredient categories" className="space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">
                  Start with a category
                </p>
                <h2 className="mt-1 text-xl font-semibold text-text-primary">
                  Browse your kitchen in chunks
                </h2>
              </div>
              <p className="text-sm text-text-secondary">
                {groups.length} groups
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {groups.map((group) => (
                <CategoryBubble
                  key={group.id}
                  onClick={() => handleGroupSelect(group.id)}
                  selected={group.id === activeGroupId}
                  subtitle={getPreviewText(group.id, subgroups)}
                  title={group.name}
                />
              ))}
            </div>
          </section>

          <SurfaceCard className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">
                  Category preview
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-text-secondary">
                  {activeGroup ? (
                    <span>{activeGroup.name}</span>
                  ) : (
                    <span>Choose a group</span>
                  )}
                  {activeSubgroup ? (
                    <>
                      <span className="text-text-muted">{">"}</span>
                      <span className="text-text-primary">
                        {activeSubgroup.name}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              {activeSubgroup && activeGroup ? (
                <SecondaryButton
                  className="min-h-10 rounded-full px-3.5 py-2 text-xs"
                  onClick={() => setActiveSubgroupId(undefined)}
                >
                  Back to {activeGroup.name}
                </SecondaryButton>
              ) : null}
            </div>
            <h2 className="mt-2 text-xl font-semibold text-text-primary">
              {activeSubgroup?.name ?? activeGroup?.name ?? "Pick a group"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {activeSubgroup
                ? "Choose the specific ingredients you have right now."
                : activeGroup
                  ? "Choose a subgroup to get specific without seeing the whole pantry at once."
                  : "Choose a category on the left to preview the next layer."}
            </p>

            {!activeSubgroup && activeChildren.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {activeChildren.map((child) => (
                  <button
                    aria-pressed={child.id === activeSubgroupId}
                    className={[
                      "rounded-2xl border p-4 text-left transition duration-200 ease-out",
                      "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
                      child.id === activeSubgroupId
                        ? "border-primary-accent bg-surface-warm shadow-[0_16px_36px_rgb(232_93_63/0.14)]"
                        : "border-border bg-surface-warm hover:border-clay-accent hover:bg-surface",
                    ].join(" ")}
                    key={child.id}
                    onClick={() => setActiveSubgroupId(child.id)}
                    type="button"
                  >
                    <p className="text-base font-semibold text-text-primary">
                      {child.name}
                    </p>
                    <p className="mt-2 text-sm leading-5 text-text-secondary">
                      {getPreviewText(child.id, specificIngredients)}
                    </p>
                  </button>
                ))}
              </div>
            ) : null}

            {activeSubgroup ? (
              <div className="mt-5">
                {activeSpecificIngredients.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {activeSpecificIngredients.map((ingredient) => (
                      <IngredientBubble
                        categoryLabel={ingredient.subcategory}
                        helperText={ingredient.storageType}
                        key={ingredient.id}
                        label={ingredient.name}
                        onClick={() => toggleIngredient(ingredient.id)}
                        selected={selectedIngredientIds.includes(ingredient.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-border bg-surface-warm p-4 text-sm leading-6 text-text-secondary">
                    Specific ingredients for this subgroup are coming later.
                  </p>
                )}
              </div>
            ) : null}

            {!activeSubgroup && activeExamples.length > 0 ? (
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
                  Example ingredients
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeExamples.map((ingredient) => (
                    <IngredientBubble
                      categoryLabel={ingredient.subcategory}
                      key={ingredient.id}
                      label={ingredient.name}
                      onClick={() => {
                        setActiveSubgroupId(ingredient.parentId);
                        toggleIngredient(ingredient.id);
                      }}
                      selected={selectedIngredientIds.includes(ingredient.id)}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </SurfaceCard>
        </div>

        <SurfaceCard warm className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Selected ingredients
              </p>
              <h2 className="mt-1 text-xl font-semibold text-text-primary">
                {selectedIngredients.length > 0
                  ? `${selectedIngredients.length} selected.`
                  : "No ingredients selected yet."}
              </h2>
            </div>
            {selectedIngredients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ingredient) => (
                  <SelectedIngredientChip
                    ingredient={ingredient}
                    key={ingredient.id}
                    onRemove={() => toggleIngredient(ingredient.id)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Good with this
              </p>
              <h2 className="mt-1 text-xl font-semibold text-text-primary">
                Suggestions will appear after you choose ingredients.
              </h2>
            </div>
            <span className="rounded-full border border-border bg-surface-warm px-3 py-1.5 text-xs font-semibold text-text-muted">
              Smart suggestions later
            </span>
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
