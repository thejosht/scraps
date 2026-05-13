import { AppShell, PageHeader } from "@/components/layout";
import { SecondaryButton, SurfaceCard } from "@/components/ui";
import { buildNextHref, parseCsvParam } from "@/lib/flow/queryParams";

type RecipeDetailPlaceholderPageProps = {
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

export default async function RecipeDetailPlaceholderPage({
  params,
  searchParams,
}: RecipeDetailPlaceholderPageProps) {
  const { templateId } = await params;
  const queryParams = await searchParams;
  const backHref = buildNextHref({
    path: "/cook/results",
    query: {
      appliances: parseCsvParam(queryParams?.appliances),
      customIngredients: parseCsvParam(queryParams?.customIngredients),
      customVibes: parseCsvParam(queryParams?.customVibes),
      ingredients: parseCsvParam(queryParams?.ingredients),
      situation: queryParams?.situation,
      vibes: parseCsvParam(queryParams?.vibes),
    },
  });

  return (
    <AppShell showBottomNav={false} showDesktopNav={false}>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Recipe"
          title="Recipe detail coming next."
          description="This placeholder keeps the recipe route ready without building full step-by-step instructions yet."
        />
        <SurfaceCard warm className="p-5 sm:p-6">
          <p className="text-sm font-medium text-text-muted">Template</p>
          <p className="mt-2 text-lg font-semibold text-text-primary">
            {templateId}
          </p>
          <div className="mt-5">
            <SecondaryButton href={backHref}>Back to results</SecondaryButton>
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
