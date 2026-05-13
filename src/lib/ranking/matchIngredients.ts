import { ingredients } from "@/data/ingredients";
import type {
  Ingredient,
  IngredientId,
  RecipeIngredientSlot,
  RecipeTemplate,
} from "@/types";

const ingredientsById = new Map<IngredientId, Ingredient>(
  ingredients.map((ingredient) => [ingredient.id, ingredient]),
);

export type IngredientSlotMatch = {
  ingredientIds: IngredientId[];
  ingredientNames: string[];
  isMatched: boolean;
  notes: string[];
  slot: RecipeIngredientSlot;
};

export type RecipeIngredientMatch = {
  ingredientsUsed: string[];
  missingCoreRequired: string[];
  matchedOptional: IngredientSlotMatch[];
  matchedRequired: IngredientSlotMatch[];
  missingOptional: string[];
  missingRequired: string[];
  preparationNotes: string[];
  optionalCoverage: number;
  requiredCoverage: number;
};

function hasMatchingTag(ingredient: Ingredient, slot: RecipeIngredientSlot) {
  if (!slot.tags || slot.tags.length === 0) {
    return false;
  }

  return slot.tags.some((tag) => ingredient.tags.includes(tag));
}

function matchSlot(
  slot: RecipeIngredientSlot,
  selectedIngredients: Ingredient[],
): IngredientSlotMatch {
  const directIds = new Set([
    ...(slot.ingredientIds ?? []),
    ...(slot.equivalentIngredientIds ?? []),
  ]);
  const directMatches = selectedIngredients.filter((ingredient) =>
    directIds.has(ingredient.id),
  );
  const tagMatches =
    directIds.size === 0
      ? selectedIngredients.filter((ingredient) => hasMatchingTag(ingredient, slot))
      : [];
  const matches = [...directMatches, ...tagMatches];
  const minMatches = slot.min ?? 1;
  const usedMatches = matches.slice(0, minMatches);
  const preparedIds = new Set(slot.preparedIngredientIds ?? slot.ingredientIds ?? []);
  const preparationNote = slot.preparationNote;
  const needsPreparationNote =
    preparationNote &&
    usedMatches.length > 0 &&
    usedMatches.some((ingredient) => !preparedIds.has(ingredient.id));

  return {
    ingredientIds: usedMatches.map((ingredient) => ingredient.id),
    ingredientNames: usedMatches.map((ingredient) => ingredient.name),
    isMatched: matches.length >= minMatches,
    notes: needsPreparationNote ? [preparationNote] : [],
    slot,
  };
}

function getCoverage(matches: IngredientSlotMatch[]) {
  if (matches.length === 0) {
    return 1;
  }

  return matches.filter((match) => match.isMatched).length / matches.length;
}

export function matchRecipeIngredients({
  selectedIngredientIds,
  template,
}: {
  selectedIngredientIds: IngredientId[];
  template: RecipeTemplate;
}): RecipeIngredientMatch {
  const selectedIngredients = selectedIngredientIds
    .map((ingredientId) => ingredientsById.get(ingredientId))
    .filter((ingredient): ingredient is Ingredient => Boolean(ingredient));
  const requiredMatches = template.requiredSlots.map((slot) =>
    matchSlot(slot, selectedIngredients),
  );
  const optionalMatches = template.optionalSlots.map((slot) =>
    matchSlot(slot, selectedIngredients),
  );
  const matchedRequired = requiredMatches.filter((match) => match.isMatched);
  const matchedOptional = optionalMatches.filter((match) => match.isMatched);
  const missingRequiredMatches = requiredMatches.filter(
    (match) => !match.isMatched,
  );
  const ingredientsUsed = Array.from(
    new Set(
      [...matchedRequired, ...matchedOptional].flatMap(
        (match) => match.ingredientNames,
      ),
    ),
  );

  return {
    ingredientsUsed,
    missingCoreRequired: missingRequiredMatches
      .filter((match) => match.slot.importance === "core")
      .map((match) => match.slot.label),
    matchedOptional,
    matchedRequired,
    missingOptional: optionalMatches
      .filter((match) => !match.isMatched)
      .map((match) => match.slot.label),
    missingRequired: missingRequiredMatches.map((match) => match.slot.label),
    preparationNotes: [...matchedRequired, ...matchedOptional].flatMap(
      (match) => match.notes,
    ),
    optionalCoverage: getCoverage(optionalMatches),
    requiredCoverage: getCoverage(requiredMatches),
  };
}
