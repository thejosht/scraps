import {
  ingredientGroups,
  ingredientSubgroups,
  specificIngredients,
} from "@/data";
import { IngredientSelectionShell } from "./IngredientSelectionShell";

type IngredientsPageProps = {
  searchParams?: Promise<{
    appliances?: string;
    situation?: string;
  }>;
};

function buildCookHref({
  applianceIds,
  path,
  situationId,
}: {
  applianceIds?: string;
  path: string;
  situationId?: string;
}) {
  const params = new URLSearchParams();

  if (situationId) {
    params.set("situation", situationId);
  }

  if (applianceIds) {
    params.set("appliances", applianceIds);
  }

  const query = params.toString();

  return query ? `${path}?${query}` : path;
}

export default async function IngredientsPage({
  searchParams,
}: IngredientsPageProps) {
  const params = await searchParams;

  return (
    <IngredientSelectionShell
      backHref={buildCookHref({
        applianceIds: params?.appliances,
        path: "/cook/appliances",
        situationId: params?.situation,
      })}
      flowParams={{
        applianceIds: params?.appliances,
        situationId: params?.situation,
      }}
      groups={ingredientGroups}
      specificIngredients={specificIngredients}
      subgroups={ingredientSubgroups}
    />
  );
}
