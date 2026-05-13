import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import { SecondaryButton, SurfaceCard } from "@/components/ui";

type IngredientsPageProps = {
  searchParams?: Promise<{
    situation?: string;
  }>;
};

export default async function IngredientsPlaceholderPage({
  searchParams,
}: IngredientsPageProps) {
  const params = await searchParams;
  const querySuffix = params?.situation
    ? `?situation=${encodeURIComponent(params.situation)}`
    : "";

  return (
    <AppShell showBottomNav={false} showDesktopNav={false}>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Ingredients"
          title="Ingredient selection coming next."
          description="This placeholder keeps the flow target in place without building the ingredient explorer yet."
        />
        <SurfaceCard warm className="p-5 sm:p-6">
          <StepProgress currentStep={3} />
          <div className="mt-6">
            <SecondaryButton href={`/cook/appliances${querySuffix}`}>
              Back to appliances
            </SecondaryButton>
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
