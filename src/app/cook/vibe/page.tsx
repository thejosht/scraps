import { vibes } from "@/data";
import { VibeSelectionShell } from "./VibeSelectionShell";

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

export default async function VibePage({ searchParams }: VibePageProps) {
  const params = await searchParams;

  return (
    <VibeSelectionShell
      backHref={buildBackHref({
        applianceIds: params?.appliances,
        ingredientIds: params?.ingredients,
        situationId: params?.situation,
      })}
      flowParams={{
        applianceIds: params?.appliances,
        ingredientIds: params?.ingredients,
        situationId: params?.situation,
      }}
      vibes={vibes}
    />
  );
}
