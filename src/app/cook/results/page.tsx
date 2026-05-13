import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import { SecondaryButton, SurfaceCard } from "@/components/ui";

type ResultsPageProps = {
  searchParams?: Promise<{
    appliances?: string;
    customVibes?: string | string[];
    ingredients?: string;
    situation?: string;
    vibes?: string;
  }>;
};

function buildBackHref({
  applianceIds,
  customVibes,
  ingredientIds,
  situationId,
  vibeIds,
}: {
  applianceIds?: string;
  customVibes?: string | string[];
  ingredientIds?: string;
  situationId?: string;
  vibeIds?: string;
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

  if (vibeIds) {
    params.set("vibes", vibeIds);
  }

  const customVibeValues = Array.isArray(customVibes)
    ? customVibes
    : customVibes
      ? [customVibes]
      : [];

  customVibeValues.forEach((vibe) => {
    params.append("customVibes", vibe);
  });

  const query = params.toString();

  return query ? `/cook/vibe?${query}` : "/cook/vibe";
}

export default async function ResultsPlaceholderPage({
  searchParams,
}: ResultsPageProps) {
  const params = await searchParams;

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
          <div className="mt-6">
            <SecondaryButton
              href={buildBackHref({
                applianceIds: params?.appliances,
                customVibes: params?.customVibes,
                ingredientIds: params?.ingredients,
                situationId: params?.situation,
                vibeIds: params?.vibes,
              })}
            >
              Back to vibe
            </SecondaryButton>
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
