"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryBubble, IngredientBubble } from "@/components/bubbles";
import { FlowSessionSync } from "@/components/flow";
import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import {
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  SelectableChip,
  SurfaceCard,
} from "@/components/ui";
import {
  buildNextHref,
  isQuickMealUpgradeSituation,
  slugifyCustomValue,
} from "@/lib/flow/queryParams";
import { hasFlowParams, writeFlowSession } from "@/lib/flow/localSession";
import type {
  IngredientGroup,
  IngredientId,
  IngredientSubgroup,
  SpecificIngredient,
} from "@/types";

type IngredientSelectionShellProps = {
  backHref: string;
  flowParams: {
    applianceIds: string[];
    situationId?: string;
  };
  groups: IngredientGroup[];
  initialCustomIngredients: CustomIngredient[];
  initialIngredientIds: string[];
  specificIngredients: SpecificIngredient[];
  subgroups: IngredientSubgroup[];
};

type CustomIngredient = {
  id: IngredientId;
  isCustom: true;
  name: string;
  queryValue: string;
};

type KnownSelectableIngredient = IngredientSubgroup | SpecificIngredient;

const upgradeModeGroupOrder = [
  "frozen-premade",
  "pantry-basics",
  "leftovers",
  "proteins",
  "sauces",
  "spices-seasonings",
];

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

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesSearch(value: string, normalizedQuery: string) {
  if (!normalizedQuery) {
    return false;
  }

  if (value.includes(normalizedQuery)) {
    return true;
  }

  const queryParts = normalizedQuery.split(" ");

  return queryParts.every((part) => value.includes(part));
}

function getSpecificIngredientSearchText(ingredient: SpecificIngredient) {
  return normalizeSearchValue(
    [
      ingredient.name,
      ingredient.category,
      ingredient.subcategory,
      ...ingredient.synonyms,
      ...ingredient.aliases,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function getSubgroupSearchText(subgroup: IngredientSubgroup) {
  return normalizeSearchValue(
    [subgroup.name, subgroup.category, subgroup.subcategory, ...subgroup.synonyms]
      .filter(Boolean)
      .join(" "),
  );
}

function getGroupSearchText(group: IngredientGroup) {
  return normalizeSearchValue([group.name, group.category, ...group.synonyms].join(" "));
}

function slugifyCustomIngredient(name: string) {
  const slug = slugifyCustomValue(name);

  return slug ? `custom_${slug}` : "custom_ingredient";
}

function getCleanCustomName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function getSuggestedIngredients({
  ingredientsById,
  selectedIngredientIds,
  selectedIngredients,
}: {
  ingredientsById: Map<IngredientId, KnownSelectableIngredient>;
  selectedIngredientIds: IngredientId[];
  selectedIngredients: KnownSelectableIngredient[];
}) {
  const selectedIds = new Set(selectedIngredientIds);
  const suggestions = new Map<
    IngredientId,
    {
      firstSeenIndex: number;
      ingredient: KnownSelectableIngredient;
      score: number;
    }
  >();

  selectedIngredients.forEach((selectedIngredient, selectedIndex) => {
    selectedIngredient.commonPairings.forEach((pairingId, pairingIndex) => {
      if (selectedIds.has(pairingId)) {
        return;
      }

      const ingredient = ingredientsById.get(pairingId);

      if (!ingredient) {
        return;
      }

      const existingSuggestion = suggestions.get(pairingId);

      if (existingSuggestion) {
        suggestions.set(pairingId, {
          ...existingSuggestion,
          score: existingSuggestion.score + 1,
        });
        return;
      }

      suggestions.set(pairingId, {
        firstSeenIndex: selectedIndex * 100 + pairingIndex,
        ingredient,
        score: 1,
      });
    });
  });

  return Array.from(suggestions.values())
    .sort(
      (first, second) =>
        second.score - first.score || first.firstSeenIndex - second.firstSeenIndex,
    )
    .map((suggestion) => suggestion.ingredient)
    .slice(0, 10);
}

function buildVibeHref({
  customIngredients,
  flowParams,
  selectedIngredientIds,
}: {
  customIngredients: CustomIngredient[];
  flowParams: IngredientSelectionShellProps["flowParams"];
  selectedIngredientIds: IngredientId[];
}) {
  return buildNextHref({
    path: "/cook/vibe",
    query: {
      appliances: flowParams.applianceIds,
      customIngredients: customIngredients.map((ingredient) => ingredient.queryValue),
      ingredients: selectedIngredientIds,
      situation: flowParams.situationId,
    },
  });
}

function SelectedIngredientChip({
  helperText,
  label,
  onRemove,
}: {
  helperText?: string;
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      aria-label={`Remove ${label}`}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[rgb(217_164_65/0.42)] bg-[rgb(217_164_65/0.16)] px-3.5 py-2 text-sm font-medium text-text-primary shadow-[0_8px_18px_rgb(217_164_65/0.12)] transition hover:border-primary-accent hover:bg-surface-warm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
      onClick={onRemove}
      type="button"
    >
      <span>{label}</span>
      {helperText ? (
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
          {helperText}
        </span>
      ) : null}
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
  initialCustomIngredients,
  initialIngredientIds,
  specificIngredients,
  subgroups,
}: IngredientSelectionShellProps) {
  const knownSelectableIds = new Set(
    [...subgroups, ...specificIngredients].map((ingredient) => ingredient.id),
  );
  const [activeGroupId, setActiveGroupId] = useState<string>();
  const [activeSubgroupId, setActiveSubgroupId] = useState<string>();
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<
    IngredientId[]
  >(initialIngredientIds.filter((ingredientId) => knownSelectableIds.has(ingredientId)));
  const [customIngredients, setCustomIngredients] = useState<CustomIngredient[]>(
    initialCustomIngredients,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const isUpgradeMode = isQuickMealUpgradeSituation(flowParams.situationId);
  const activeGroup = groups.find((group) => group.id === activeGroupId);
  const activeSubgroup = subgroups.find(
    (subgroup) => subgroup.id === activeSubgroupId,
  );
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);
  const cleanSearchTerm = getCleanCustomName(searchTerm);
  const isSearching = normalizedSearchTerm.length > 0;
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
  const knownIngredientsById = useMemo(
    () =>
      new Map<IngredientId, KnownSelectableIngredient>(
        [...subgroups, ...specificIngredients].map((ingredient) => [
          ingredient.id,
          ingredient,
        ]),
      ),
    [specificIngredients, subgroups],
  );
  const selectedIngredients = useMemo(
    () =>
      selectedIngredientIds
        .map((ingredientId) => knownIngredientsById.get(ingredientId))
        .filter((ingredient): ingredient is KnownSelectableIngredient =>
          Boolean(ingredient),
        ),
    [knownIngredientsById, selectedIngredientIds],
  );
  const suggestedIngredients = useMemo(
    () =>
      getSuggestedIngredients({
        ingredientsById: knownIngredientsById,
        selectedIngredientIds,
        selectedIngredients,
      }),
    [knownIngredientsById, selectedIngredientIds, selectedIngredients],
  );
  const visibleSuggestedIngredients = isSearching ? [] : suggestedIngredients;
  const selectedItems = [
    ...selectedIngredients.map((ingredient) => ({
      id: ingredient.id,
      isCustom: false,
      name: ingredient.name,
    })),
    ...customIngredients,
  ];
  const searchSpecificResults = useMemo(
    () =>
      isSearching
        ? specificIngredients
            .filter((ingredient) =>
              matchesSearch(
                getSpecificIngredientSearchText(ingredient),
                normalizedSearchTerm,
              ),
            )
            .slice(0, 12)
        : [],
    [isSearching, normalizedSearchTerm, specificIngredients],
  );
  const searchSubgroupResults = useMemo(
    () =>
      isSearching
        ? subgroups
            .filter((subgroup) =>
              matchesSearch(getSubgroupSearchText(subgroup), normalizedSearchTerm),
            )
            .slice(0, 8)
        : [],
    [isSearching, normalizedSearchTerm, subgroups],
  );
  const searchGroupResults = useMemo(
    () =>
      isSearching
        ? groups
            .filter((group) => {
              const groupSearchText = getGroupSearchText(group);

              return (
                groupSearchText === normalizedSearchTerm ||
                (normalizedSearchTerm.length >= 4 &&
                  groupSearchText.includes(normalizedSearchTerm))
              );
            })
            .slice(0, 4)
        : [],
    [groups, isSearching, normalizedSearchTerm],
  );
  const displayGroups = useMemo(() => {
    if (!isUpgradeMode) {
      return groups;
    }

    return [...groups].sort((firstGroup, secondGroup) => {
      const firstIndex = upgradeModeGroupOrder.indexOf(firstGroup.id);
      const secondIndex = upgradeModeGroupOrder.indexOf(secondGroup.id);

      if (firstIndex === -1 && secondIndex === -1) {
        return firstGroup.name.localeCompare(secondGroup.name);
      }

      if (firstIndex === -1) {
        return 1;
      }

      if (secondIndex === -1) {
        return -1;
      }

      return firstIndex - secondIndex;
    });
  }, [groups, isUpgradeMode]);
  const hasSearchResults =
    searchSpecificResults.length > 0 ||
    searchSubgroupResults.length > 0 ||
    searchGroupResults.length > 0;
  const continueHref = buildVibeHref({
    customIngredients,
    flowParams,
    selectedIngredientIds,
  });

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !hasFlowParams(new URLSearchParams(window.location.search)) &&
      selectedIngredientIds.length === 0 &&
      customIngredients.length === 0
    ) {
      return;
    }

    writeFlowSession({
      appliances: flowParams.applianceIds,
      customIngredients: customIngredients.map(
        (ingredient) => ingredient.queryValue,
      ),
      ingredients: selectedIngredientIds,
      situation: flowParams.situationId,
    });
  }, [
    customIngredients,
    flowParams.applianceIds,
    flowParams.situationId,
    selectedIngredientIds,
  ]);

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

  function handleSubgroupSelect(subgroup: IngredientSubgroup) {
    setActiveGroupId(subgroup.parentId);
    setActiveSubgroupId(subgroup.id);
  }

  function addCustomIngredient() {
    if (!cleanSearchTerm) {
      return;
    }

    const customIngredient = {
      id: slugifyCustomIngredient(cleanSearchTerm),
      isCustom: true,
      name: cleanSearchTerm,
      queryValue: slugifyCustomValue(cleanSearchTerm),
    } satisfies CustomIngredient;

    setCustomIngredients((currentIngredients) => {
      if (
        currentIngredients.some(
          (ingredient) => ingredient.queryValue === customIngredient.queryValue,
        )
      ) {
        return currentIngredients;
      }

      return [...currentIngredients, customIngredient];
    });
  }

  function removeCustomIngredient(ingredientId: IngredientId) {
    setCustomIngredients((currentIngredients) =>
      currentIngredients.filter((ingredient) => ingredient.id !== ingredientId),
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
          {selectedItems.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedItems.map((ingredient) => (
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
          {selectedItems.length > 0 ? (
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
      <FlowSessionSync />
      <div className="space-y-5">
        <PageHeader
          eyebrow={isUpgradeMode ? "Quick meal upgrade" : "Ingredients"}
          title={
            isUpgradeMode
              ? "What are you trying to make better?"
              : "What do you have?"
          }
          description={
            isUpgradeMode
              ? "Pick the boxed, frozen, leftover, canned, or instant item you already have."
              : "Start with a category. You can get specific next, like chicken drumsticks, leftover rice, or boxed mac."
          }
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
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Can&apos;t find something? Search it or add it as custom.
          </p>
          <input
            className="mt-3 min-h-12 w-full rounded-2xl border border-border bg-surface px-4 text-base text-text-primary shadow-[0_10px_24px_rgb(31_31_31/0.04)] outline-none transition placeholder:text-text-muted focus:border-primary-accent focus:ring-4 focus:ring-[rgb(232_93_63/0.10)]"
            id="ingredient-search-placeholder"
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                isSearching &&
                !hasSearchResults
              ) {
                addCustomIngredient();
              }
            }}
            placeholder="Search ingredients like chicken drumsticks, leftover rice, boxed mac..."
            type="search"
            value={searchTerm}
          />

          {isSearching ? (
            <div className="mt-5 border-t border-border pt-5">
              {hasSearchResults ? (
                <div className="space-y-5">
                  {searchSpecificResults.length > 0 ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
                        Matching ingredients
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {searchSpecificResults.map((ingredient) => (
                          <IngredientBubble
                            categoryLabel={ingredient.subcategory}
                            helperText={ingredient.storageType}
                            key={ingredient.id}
                            label={ingredient.name}
                            onClick={() => toggleIngredient(ingredient.id)}
                            selected={selectedIngredientIds.includes(
                              ingredient.id,
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {searchSubgroupResults.length > 0 ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
                        Matching subgroups
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {searchSubgroupResults.map((subgroup) => (
                          <button
                            aria-pressed={subgroup.id === activeSubgroupId}
                            className={[
                              "rounded-2xl border p-4 text-left transition duration-200 ease-out",
                              "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
                              subgroup.id === activeSubgroupId
                                ? "border-primary-accent bg-surface-warm shadow-[0_16px_36px_rgb(232_93_63/0.14)]"
                                : "border-border bg-surface hover:border-clay-accent hover:bg-surface-warm",
                            ].join(" ")}
                            key={subgroup.id}
                            onClick={() => handleSubgroupSelect(subgroup)}
                            type="button"
                          >
                            <p className="text-base font-semibold text-text-primary">
                              {subgroup.name}
                            </p>
                            <p className="mt-2 text-sm leading-5 text-text-secondary">
                              {subgroup.category}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {searchGroupResults.length > 0 ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
                        Matching groups
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {searchGroupResults.map((group) => (
                          <CategoryBubble
                            key={group.id}
                            onClick={() => handleGroupSelect(group.id)}
                            selected={group.id === activeGroupId}
                            subtitle={getPreviewText(group.id, subgroups)}
                            title={group.name}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <EmptyState
                  action={
                    <PrimaryButton onClick={addCustomIngredient}>
                      Add custom ingredient
                    </PrimaryButton>
                  }
                  description={`Add "${cleanSearchTerm}" as a local ingredient for this session.`}
                  title="No match yet."
                />
              )}
            </div>
          ) : null}
        </SurfaceCard>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
          <section aria-label="Ingredient categories" className="space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">
                  {isUpgradeMode ? "Start with the base item" : "Start with a category"}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-text-primary">
                  {isUpgradeMode
                    ? "Quick meals and add-ons first"
                    : "Browse your kitchen in chunks"}
                </h2>
              </div>
              <p className="text-sm text-text-secondary">
                {displayGroups.length} groups
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {displayGroups.map((group) => (
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
                {selectedItems.length > 0
                  ? `${selectedItems.length} selected.`
                  : "No ingredients selected yet."}
              </h2>
            </div>
            {selectedItems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ingredient) => (
                  <SelectedIngredientChip
                    label={ingredient.name}
                    key={ingredient.id}
                    onRemove={() => toggleIngredient(ingredient.id)}
                  />
                ))}
                {customIngredients.map((ingredient) => (
                  <SelectedIngredientChip
                    helperText="Custom"
                    key={ingredient.id}
                    label={ingredient.name}
                    onRemove={() => removeCustomIngredient(ingredient.id)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">
                  Good with this
                </p>
                <h2 className="mt-1 text-xl font-semibold text-text-primary">
                  {isSearching
                    ? "Finish search to see quick add-ons."
                    : visibleSuggestedIngredients.length > 0
                    ? "Quick add-ons based on what you picked."
                    : "Suggestions will appear after you choose ingredients."}
                </h2>
              </div>
              {visibleSuggestedIngredients.length > 0 ? (
                <span className="rounded-full border border-border bg-surface-warm px-3 py-1.5 text-xs font-semibold text-text-muted">
                  Structured pairings
                </span>
              ) : null}
            </div>

            {visibleSuggestedIngredients.length > 0 ? (
              <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                {visibleSuggestedIngredients.map((ingredient) => (
                  <IngredientBubble
                    categoryLabel={ingredient.subcategory ?? ingredient.category}
                    helperText={
                      ingredient.specificity === "subgroup"
                        ? "Subgroup"
                        : ingredient.storageType
                    }
                    key={ingredient.id}
                    label={ingredient.name}
                    onClick={() => toggleIngredient(ingredient.id)}
                    selected={selectedIngredientIds.includes(ingredient.id)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
