import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import { SecondaryButton, SurfaceCard } from "@/components/ui";

type VibePageProps = {
  searchParams?: Promise<{
    appliances?: string;
    ingredients?: string;
    situation?: string;
  }>;
};

function buildBackHref({
  applianceIds,
  ingredientIds,
  situationId,
}: {
  applianceIds?: string;
  ingredientIds?: string;
  situationId?: string;
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

  const query = params.toString();

  return query ? `/cook/ingredients?${query}` : "/cook/ingredients";
}

export default async function VibePlaceholderPage({
  searchParams,
}: VibePageProps) {
  const params = await searchParams;

  return (
    <AppShell showBottomNav={false} showDesktopNav={false}>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Vibe"
          title="Vibe selection coming next."
          description="This placeholder keeps the flow target in place without building the vibe selector yet."
        />
        <SurfaceCard warm className="p-5 sm:p-6">
          <StepProgress currentStep={4} />
          <div className="mt-6">
            <SecondaryButton
              href={buildBackHref({
                applianceIds: params?.appliances,
                ingredientIds: params?.ingredients,
                situationId: params?.situation,
              })}
            >
              Back to ingredients
            </SecondaryButton>
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
