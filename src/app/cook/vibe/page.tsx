import { vibes } from "@/data";
import { buildNextHref, parseCsvParam } from "@/lib/flow/queryParams";
import { VibeSelectionShell } from "./VibeSelectionShell";

type VibePageProps = {
  searchParams?: Promise<{
    appliances?: string;
    customIngredients?: string | string[];
    customVibes?: string | string[];
    ingredients?: string;
    situation?: string;
    vibes?: string;
  }>;
};

export default async function VibePage({ searchParams }: VibePageProps) {
  const params = await searchParams;
  const applianceIds = parseCsvParam(params?.appliances);
  const ingredientIds = parseCsvParam(params?.ingredients);
  const customIngredients = parseCsvParam(params?.customIngredients);
  const initialVibeIds = parseCsvParam(params?.vibes);
  const initialCustomVibes = parseCsvParam(params?.customVibes);

  return (
    <VibeSelectionShell
      backHref={buildNextHref({
        path: "/cook/ingredients",
        query: {
          appliances: applianceIds,
          customIngredients,
          ingredients: ingredientIds,
          situation: params?.situation,
        },
      })}
      flowParams={{
        applianceIds,
        customIngredients,
        ingredientIds,
        situationId: params?.situation,
      }}
      initialCustomVibes={initialCustomVibes}
      initialVibeIds={initialVibeIds}
      vibes={vibes}
    />
  );
}
