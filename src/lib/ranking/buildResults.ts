import { recipeTemplates } from "@/data/recipeTemplates";
import { isQuickMealUpgradeSituation } from "@/lib/flow/queryParams";
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

const upgradeBaseTemplateIds = new Map<string, string[]>([
  ["boxed-mac-and-cheese", ["boxed-mac-and-cheese-upgrade"]],
  ["instant-noodles", ["upgraded-instant-noodles"]],
  ["instant-ramen", ["upgraded-instant-noodles"]],
  ["ramen-noodles", ["upgraded-instant-noodles"]],
  ["frozen-fries", ["loaded-frozen-fries"]],
  ["canned-soup", ["canned-soup-upgrade"]],
]);

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
  const lockedUpgradeTemplateIds = isQuickMealUpgradeSituation(situationId)
    ? ingredientIds
        .map((ingredientId) => upgradeBaseTemplateIds.get(ingredientId))
        .find((templateIds) => templateIds && templateIds.length > 0)
    : undefined;
  const matches = recipeTemplates
    .filter(
      (template) =>
        !lockedUpgradeTemplateIds ||
        lockedUpgradeTemplateIds.includes(template.id),
    )
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
