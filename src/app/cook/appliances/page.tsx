import Link from "next/link";
import { FlowSessionSync } from "@/components/flow";
import { appliances } from "@/data";
import type { Appliance, ApplianceId } from "@/types";
import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import {
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  SelectableChip,
  SurfaceCard,
} from "@/components/ui";
import { ApplianceSearchInput } from "./ApplianceSearchInput";

type AppliancesPageProps = {
  searchParams?: Promise<{
    applianceSearch?: string;
    appliances?: string;
    situation?: string;
  }>;
};

const normalKitchenAppliances: ApplianceId[] = ["stove", "oven", "microwave"];
const dormAppliances: ApplianceId[] = [
  "microwave",
  "air-fryer",
  "toaster-oven",
];
const commonApplianceIds: ApplianceId[] = [
  "stove",
  "oven",
  "microwave",
  "air-fryer",
  "toaster-oven",
  "blender",
  "rice-cooker",
  "no-cook-only",
];
const validApplianceIds = new Set(appliances.map((appliance) => appliance.id));

function getApplianceSearchText(appliance: Appliance) {
  return [appliance.label, appliance.id, ...(appliance.aliases ?? [])]
    .join(" ")
    .toLowerCase();
}

function parseSelectedAppliances(applianceParam?: string): ApplianceId[] {
  if (!applianceParam) {
    return [];
  }

  return applianceParam
    .split(",")
    .filter((id): id is ApplianceId => validApplianceIds.has(id as ApplianceId));
}

function buildCookHref({
  applianceSearch,
  applianceIds,
  path,
  situationId,
}: {
  applianceSearch?: string;
  applianceIds?: ApplianceId[];
  path: string;
  situationId?: string;
}) {
  const params = new URLSearchParams();

  if (situationId) {
    params.set("situation", situationId);
  }

  if (applianceIds && applianceIds.length > 0) {
    params.set("appliances", applianceIds.join(","));
  }

  if (applianceSearch) {
    params.set("applianceSearch", applianceSearch);
  }

  const query = params.toString();

  return query ? `${path}?${query}` : path;
}

function getToggledAppliances(
  selectedApplianceIds: ApplianceId[],
  applianceId: ApplianceId,
): ApplianceId[] {
  if (applianceId === "no-cook-only") {
    return selectedApplianceIds.includes("no-cook-only") ? [] : ["no-cook-only"];
  }

  const withoutNoCook = selectedApplianceIds.filter(
    (id) => id !== "no-cook-only",
  );

  if (withoutNoCook.includes(applianceId)) {
    return withoutNoCook.filter((id) => id !== applianceId);
  }

  return [...withoutNoCook, applianceId];
}

export default async function AppliancesPage({
  searchParams,
}: AppliancesPageProps) {
  const params = await searchParams;
  const situationId = params?.situation;
  const applianceSearch = params?.applianceSearch?.trim() ?? "";
  const selectedApplianceIds = parseSelectedAppliances(params?.appliances);
  const selectedAppliances = appliances.filter((appliance) =>
    selectedApplianceIds.includes(appliance.id),
  );
  const filteredAppliances = appliances.filter((appliance) => {
    if (!applianceSearch) {
      return true;
    }

    return getApplianceSearchText(appliance).includes(
      applianceSearch.toLowerCase(),
    );
  });
  const commonAppliances = filteredAppliances.filter((appliance) =>
    commonApplianceIds.includes(appliance.id),
  );
  const nicheAppliances = filteredAppliances.filter(
    (appliance) => !commonApplianceIds.includes(appliance.id),
  );
  const isSearching = applianceSearch.length > 0;
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
            <SelectableChip selected>Appliances</SelectableChip>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
            Selected appliances
          </p>
          {selectedAppliances.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedAppliances.map((appliance) => (
                <SelectableChip selected key={appliance.id}>
                  {appliance.label}
                </SelectableChip>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Pick at least one tool to keep suggestions realistic.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface-warm p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-accent">
            Next step
          </p>
          <p className="mt-2 text-sm font-semibold text-text-primary">
            Ingredients
          </p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Next, Scraps will ask what you already have on hand.
          </p>
        </div>

        <div className="grid gap-3">
          {selectedApplianceIds.length > 0 ? (
            <PrimaryButton
              className="w-full"
              href={buildCookHref({
                applianceIds: selectedApplianceIds,
                path: "/cook/ingredients",
                situationId,
              })}
            >
              Continue to ingredients
            </PrimaryButton>
          ) : (
            <PrimaryButton className="w-full" disabled>
              Continue to ingredients
            </PrimaryButton>
          )}
          <SecondaryButton
            className="w-full"
            href={buildCookHref({ path: "/cook", situationId })}
          >
            Back to situation
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
          eyebrow="Appliances"
          title="What can you cook with?"
          description="Pick the tools you have. Scraps will only suggest meals that fit what you can actually use."
        />

        <SurfaceCard warm className="p-4 sm:p-5">
          <StepProgress currentStep={2} />
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Quick presets
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <PresetLink
                  applianceIds={normalKitchenAppliances}
                  currentSearch={applianceSearch}
                  selectedApplianceIds={selectedApplianceIds}
                  situationId={situationId}
                >
                  Normal kitchen
                </PresetLink>
                <PresetLink
                  applianceIds={dormAppliances}
                  currentSearch={applianceSearch}
                  selectedApplianceIds={selectedApplianceIds}
                  situationId={situationId}
                >
                  Dorm/student setup
                </PresetLink>
                <PresetLink
                  applianceIds={["no-cook-only"]}
                  currentSearch={applianceSearch}
                  selectedApplianceIds={selectedApplianceIds}
                  situationId={situationId}
                >
                  No-cook only
                </PresetLink>
              </div>
            </div>

            <ApplianceSearchInput
              applianceIds={selectedApplianceIds}
              initialValue={applianceSearch}
              situationId={situationId}
            />
          </div>
        </SurfaceCard>

        {filteredAppliances.length > 0 ? (
          <section className="space-y-5" aria-label="Appliance options">
            {isSearching ? (
              <ApplianceGrid
                applianceSearch={applianceSearch}
                appliancesToShow={filteredAppliances}
                selectedApplianceIds={selectedApplianceIds}
                situationId={situationId}
              />
            ) : (
              <>
                <div>
                  <p className="mb-3 text-sm font-medium text-text-muted">
                    Common tools
                  </p>
                  <ApplianceGrid
                    appliancesToShow={commonAppliances}
                    selectedApplianceIds={selectedApplianceIds}
                    situationId={situationId}
                  />
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-text-muted">
                    More tools
                  </p>
                  <ApplianceGrid
                    appliancesToShow={nicheAppliances}
                    selectedApplianceIds={selectedApplianceIds}
                    situationId={situationId}
                  />
                </div>
              </>
            )}
          </section>
        ) : (
          <EmptyState
            title="No match yet."
            description="You can add it as a custom appliance later."
          />
        )}
      </div>
    </AppShell>
  );
}

function PresetLink({
  applianceIds,
  children,
  currentSearch,
  selectedApplianceIds,
  situationId,
}: {
  applianceIds: ApplianceId[];
  children: string;
  currentSearch?: string;
  selectedApplianceIds: ApplianceId[];
  situationId?: string;
}) {
  const isSelected = applianceIds.every((id) => selectedApplianceIds.includes(id));

  return (
    <Link
      aria-pressed={isSelected}
      className={[
        "inline-flex min-h-10 items-center justify-center rounded-full border px-3.5 py-2 text-sm font-medium transition duration-200 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
        isSelected
          ? "border-[rgb(217_164_65/0.42)] bg-[rgb(217_164_65/0.16)] text-text-primary shadow-[0_8px_18px_rgb(217_164_65/0.12)]"
          : "border-border bg-surface text-text-secondary hover:border-primary-accent hover:bg-surface-warm hover:text-text-primary",
      ].join(" ")}
      href={buildCookHref({
        applianceIds,
        applianceSearch: currentSearch,
        path: "/cook/appliances",
        situationId,
      })}
      role="button"
    >
      {children}
    </Link>
  );
}

function ApplianceGrid({
  applianceSearch,
  appliancesToShow,
  selectedApplianceIds,
  situationId,
}: {
  applianceSearch?: string;
  appliancesToShow: Appliance[];
  selectedApplianceIds: ApplianceId[];
  situationId?: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {appliancesToShow.map((appliance) => {
        const isSelected = selectedApplianceIds.includes(appliance.id);
        const nextApplianceIds = getToggledAppliances(
          selectedApplianceIds,
          appliance.id,
        );

        return (
          <Link
            aria-pressed={isSelected}
            className={[
              "min-h-24 rounded-card border p-4 text-left transition duration-200 ease-out",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
              isSelected
                ? "border-primary-accent bg-surface-warm shadow-[0_16px_36px_rgb(232_93_63/0.14)]"
                : "border-border bg-surface shadow-[0_12px_30px_rgb(31_31_31/0.05)] hover:-translate-y-0.5 hover:border-clay-accent hover:bg-surface-warm",
            ].join(" ")}
            href={buildCookHref({
              applianceIds: nextApplianceIds,
              applianceSearch,
              path: "/cook/appliances",
              situationId,
            })}
            key={appliance.id}
            role="button"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-text-primary">
                  {appliance.label}
                </p>
                <p className="mt-2 text-sm capitalize text-text-secondary">
                  {appliance.category.replace("-", " ")}
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
  );
}
