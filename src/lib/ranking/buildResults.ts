import { recipeTemplates } from "@/data/recipeTemplates";
import type {
  ApplianceId,
  IngredientId,
  RankedRecipeMatch,
  VibeId,
} from "@/types";
import { matchRecipeAppliances } from "./matchAppliances";
import { matchRecipeIngredients } from "./matchIngredients";
import { scoreRecipe } from "./scoreRecipe";

export type BuildRecipeResultsInput = {
  applianceIds: string[];
  customIngredients: string[];
  customVibes: string[];
  ingredientIds: string[];
  situationId?: string;
  vibeIds: string[];
};

function stableSortMatches(matches: RankedRecipeMatch[]) {
  return matches.toSorted(
    (first, second) =>
      second.matchScore - first.matchScore ||
      first.timeMinutes - second.timeMinutes ||
      first.name.localeCompare(second.name),
  );
}

export function buildRecipeResults({
  applianceIds,
  ingredientIds,
  situationId,
  vibeIds,
}: BuildRecipeResultsInput) {
  const matches = recipeTemplates
    .map((template) => {
      const ingredientMatch = matchRecipeIngredients({
        selectedIngredientIds: ingredientIds as IngredientId[],
        template,
      });
      const applianceMatch = matchRecipeAppliances({
        selectedApplianceIds: applianceIds as ApplianceId[],
        template,
      });

      return scoreRecipe({
        applianceMatch,
        ingredientMatch,
        situationId,
        template,
        vibeIds: vibeIds as VibeId[],
      });
    })
    .filter((match): match is RankedRecipeMatch => Boolean(match));

  return stableSortMatches(matches);
}
