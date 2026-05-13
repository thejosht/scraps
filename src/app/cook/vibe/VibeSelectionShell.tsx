"use client";

import { useState } from "react";
import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import {
  PrimaryButton,
  SecondaryButton,
  SelectableChip,
  SurfaceCard,
} from "@/components/ui";
import type { VibeId, VibeOption } from "@/types";

type VibeSelectionShellProps = {
  backHref: string;
  flowParams: {
    applianceIds?: string;
    ingredientIds?: string;
    situationId?: string;
  };
  vibes: VibeOption[];
};

type CustomVibe = {
  id: string;
  isCustom: true;
  label: string;
};

type VibeSection = {
  ids: VibeId[];
  title: string;
};

const vibeSections = [
  {
    title: "Quick mood",
    ids: ["surprise-me", "low-effort", "comfort-food", "cheap-and-filling"],
  },
  {
    title: "Flavor / texture",
    ids: [
      "spicy",
      "crispy",
      "sweet",
      "savory",
      "creamy",
      "fresh",
    ],
  },
  {
    title: "Cuisine-inspired",
    ids: [
      "caribbean-inspired",
      "asian-inspired",
      "italian-inspired",
      "mexican-inspired",
    ],
  },
  {
    title: "Goal / situation",
    ids: [
      "healthy-ish",
      "high-protein",
      "breakfast-style",
      "gym-meal",
      "one-pan",
      "no-cook",
    ],
  },
] satisfies VibeSection[];

function getCleanCustomVibe(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function slugifyCustomVibe(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `custom_${slug}` : "custom_vibe";
}

function buildResultsHref({
  applianceIds,
  customVibes,
  ingredientIds,
  situationId,
  vibeIds,
}: {
  applianceIds?: string;
  customVibes: CustomVibe[];
  ingredientIds?: string;
  situationId?: string;
  vibeIds: VibeId[];
}) {
  const params = new URLSearchParams();

  if (situationId) {
    params.set("situation", situationId);
  }

  if (applianceIds) {
    params.set("appliances", applianceIds);
  }

  if (ingredientIds) {
    params.set("ingredients", ingredientIds);
  }

  if (vibeIds.length > 0) {
    params.set("vibes", vibeIds.join(","));
  }

  customVibes.forEach((vibe) => {
    params.append("customVibes", vibe.label);
  });

  const query = params.toString();

  return query ? `/cook/results?${query}` : "/cook/results";
}

export function VibeSelectionShell({
  backHref,
  flowParams,
  vibes,
}: VibeSelectionShellProps) {
  const [selectedVibeIds, setSelectedVibeIds] = useState<VibeId[]>([]);
  const [customVibeInput, setCustomVibeInput] = useState("");
  const [customVibes, setCustomVibes] = useState<CustomVibe[]>([]);
  const cleanCustomVibeInput = getCleanCustomVibe(customVibeInput);
  const selectedVibes = selectedVibeIds
    .map((vibeId) => vibes.find((vibe) => vibe.id === vibeId))
    .filter((vibe): vibe is VibeOption => Boolean(vibe));
  const selectedCount = selectedVibes.length + customVibes.length;
  const resultsHref = buildResultsHref({
    applianceIds: flowParams.applianceIds,
    customVibes,
    ingredientIds: flowParams.ingredientIds,
    situationId: flowParams.situationId,
    vibeIds: selectedVibeIds,
  });
  const skipHref = buildResultsHref({
    applianceIds: flowParams.applianceIds,
    customVibes: [],
    ingredientIds: flowParams.ingredientIds,
    situationId: flowParams.situationId,
    vibeIds: [],
  });

  function toggleVibe(vibeId: VibeId) {
    setSelectedVibeIds((currentIds) => {
      if (currentIds.includes(vibeId)) {
        return currentIds.filter((id) => id !== vibeId);
      }

      if (vibeId === "surprise-me") {
        return ["surprise-me"];
      }

      return [...currentIds.filter((id) => id !== "surprise-me"), vibeId];
    });
  }

  function addCustomVibe() {
    if (!cleanCustomVibeInput) {
      return;
    }

    const customVibe = {
      id: slugifyCustomVibe(cleanCustomVibeInput),
      isCustom: true,
      label: cleanCustomVibeInput,
    } satisfies CustomVibe;

    setSelectedVibeIds((currentIds) =>
      currentIds.filter((id) => id !== "surprise-me"),
    );
    setCustomVibes((currentVibes) => {
      if (currentVibes.some((vibe) => vibe.id === customVibe.id)) {
        return currentVibes;
      }

      return [...currentVibes, customVibe];
    });
    setCustomVibeInput("");
  }

  function removeCustomVibe(vibeId: string) {
    setCustomVibes((currentVibes) =>
      currentVibes.filter((vibe) => vibe.id !== vibeId),
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
            <SelectableChip selected>Vibe</SelectableChip>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
            Selected vibes
          </p>
          {selectedCount > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedVibes.map((vibe) => (
                <SelectableChip selected key={vibe.id}>
                  {vibe.label}
                </SelectableChip>
              ))}
              {customVibes.map((vibe) => (
                <SelectableChip selected key={vibe.id}>
                  {vibe.label}
                </SelectableChip>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Pick a vibe or skip if you are open.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface-warm p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-accent">
            Next step
          </p>
          <p className="mt-2 text-sm font-semibold text-text-primary">
            Results
          </p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Scraps will use this to avoid generic suggestions.
          </p>
        </div>

        <div className="grid gap-3">
          {selectedCount > 0 ? (
            <PrimaryButton className="w-full" href={resultsHref}>
              Show meal ideas
            </PrimaryButton>
          ) : (
            <PrimaryButton className="w-full" disabled>
              Show meal ideas
            </PrimaryButton>
          )}
          <SecondaryButton className="w-full" href={backHref}>
            Back to ingredients
          </SecondaryButton>
          <SecondaryButton className="w-full" href={skipHref}>
            Skip for now
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
          eyebrow="Vibe"
          title="What are you in the mood for?"
          description="Pick one vibe, combine a few, or choose Surprise me if you’re open to anything."
        />

        <SurfaceCard warm className="p-4 sm:p-5">
          <StepProgress currentStep={4} />
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:items-end">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Custom craving
              </p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                You can combine vibes. For example: spicy + low effort +
                Caribbean-inspired.
              </p>
              <input
                className="mt-3 min-h-12 w-full rounded-2xl border border-border bg-surface px-4 text-base text-text-primary shadow-[0_10px_24px_rgb(31_31_31/0.04)] outline-none transition placeholder:text-text-muted focus:border-primary-accent focus:ring-4 focus:ring-[rgb(232_93_63/0.10)]"
                onChange={(event) => setCustomVibeInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    addCustomVibe();
                  }
                }}
                placeholder="Type a vibe, craving, or cuisine..."
                type="text"
                value={customVibeInput}
              />
            </div>
            <PrimaryButton
              className="w-full"
              disabled={!cleanCustomVibeInput}
              onClick={addCustomVibe}
            >
              Add custom vibe
            </PrimaryButton>
          </div>

          {customVibes.length > 0 ? (
            <div className="mt-5 border-t border-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
                Custom vibes
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {customVibes.map((vibe) => (
                  <button
                    aria-label={`Remove ${vibe.label}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[rgb(217_164_65/0.42)] bg-[rgb(217_164_65/0.16)] px-3.5 py-2 text-sm font-medium text-text-primary shadow-[0_8px_18px_rgb(217_164_65/0.12)] transition hover:border-primary-accent hover:bg-surface-warm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
                    key={vibe.id}
                    onClick={() => removeCustomVibe(vibe.id)}
                    type="button"
                  >
                    <span>{vibe.label}</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                      Remove
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </SurfaceCard>

        <section aria-label="Vibe options" className="space-y-4">
          {vibeSections.map((section) => {
            const sectionVibes = section.ids
              .map((vibeId) => vibes.find((vibe) => vibe.id === vibeId))
              .filter((vibe): vibe is VibeOption => Boolean(vibe));

            return (
              <SurfaceCard className="p-5" key={section.title}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">
                      {section.title}
                    </p>
                    {section.title === "Quick mood" ? (
                      <p className="mt-1 text-sm leading-6 text-text-secondary">
                        Start here if you want Scraps to narrow the decision
                        quickly.
                      </p>
                    ) : null}
                  </div>
                  <p className="text-sm text-text-secondary">
                    {sectionVibes.length} options
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {sectionVibes.map((vibe) => (
                    <SelectableChip
                      key={vibe.id}
                      onClick={() => toggleVibe(vibe.id)}
                      selected={selectedVibeIds.includes(vibe.id)}
                    >
                      {vibe.label}
                    </SelectableChip>
                  ))}
                </div>
              </SurfaceCard>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
