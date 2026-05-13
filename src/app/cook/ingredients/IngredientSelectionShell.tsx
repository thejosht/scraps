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

export function IngredientSelectionShell({
  backHref,
  groups,
  specificIngredients,
  subgroups,
}: IngredientSelectionShellProps) {
  const [activeGroupId, setActiveGroupId] = useState<string>();
  const activeGroup = groups.find((group) => group.id === activeGroupId);
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
            Selected ingredients
          </p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">None yet.</p>
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
          <PrimaryButton className="w-full" disabled>
            Continue to vibe
          </PrimaryButton>
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
                  onClick={() => setActiveGroupId(group.id)}
                  selected={group.id === activeGroupId}
                  subtitle={getPreviewText(group.id, subgroups)}
                  title={group.name}
                />
              ))}
            </div>
          </section>

          <SurfaceCard className="p-5">
            <p className="text-sm font-medium text-text-muted">
              Category preview
            </p>
            <h2 className="mt-2 text-xl font-semibold text-text-primary">
              {activeGroup?.name ?? "Pick a group"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {activeGroup
                ? "These are the immediate subgroups Scraps can open next."
                : "Choose a category on the left to preview the next layer."}
            </p>

            {activeChildren.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {activeChildren.map((child) => (
                  <div
                    className="rounded-2xl border border-border bg-surface-warm p-4"
                    key={child.id}
                  >
                    <p className="text-base font-semibold text-text-primary">
                      {child.name}
                    </p>
                    <p className="mt-2 text-sm leading-5 text-text-secondary">
                      {getPreviewText(child.id, specificIngredients)}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {activeExamples.length > 0 ? (
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
                No ingredients selected yet.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <SelectableChip>Selection tray placeholder</SelectableChip>
            </div>
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
