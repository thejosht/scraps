import {
  ingredientGroups,
  ingredientSubgroups,
  specificIngredients,
} from "@/data";
import {
  buildNextHref,
  decodeCustomValue,
  parseCsvParam,
  slugifyCustomValue,
} from "@/lib/flow/queryParams";
import { IngredientSelectionShell } from "./IngredientSelectionShell";

type IngredientsPageProps = {
  searchParams?: Promise<{
    appliances?: string;
    customIngredients?: string | string[];
    ingredients?: string;
    situation?: string;
  }>;
};

export default async function IngredientsPage({
  searchParams,
}: IngredientsPageProps) {
  const params = await searchParams;
  const applianceIds = parseCsvParam(params?.appliances);
  const initialIngredientIds = parseCsvParam(params?.ingredients);
  const initialCustomIngredients = parseCsvParam(params?.customIngredients).map(
    (value) => {
      const queryValue = slugifyCustomValue(value);

      return {
        id: queryValue ? `custom_${queryValue}` : "custom_ingredient",
        isCustom: true as const,
        name: decodeCustomValue(value),
        queryValue,
      };
    },
  );

  return (
    <IngredientSelectionShell
      backHref={buildNextHref({
        path: "/cook/appliances",
        query: {
          appliances: applianceIds,
          situation: params?.situation,
        },
      })}
      flowParams={{
        applianceIds,
        situationId: params?.situation,
      }}
      groups={ingredientGroups}
      initialCustomIngredients={initialCustomIngredients}
      initialIngredientIds={initialIngredientIds}
      specificIngredients={specificIngredients}
      subgroups={ingredientSubgroups}
    />
  );
}
