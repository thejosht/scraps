import type {
  RankedRecipeMatch,
  RecipeSituationId,
  RecipeTemplate,
  VibeId,
} from "@/types";
import type { RecipeApplianceMatch } from "./matchAppliances";
import type { RecipeIngredientMatch } from "./matchIngredients";

const relatedSituations: Record<string, RecipeSituationId[]> = {
  "real-meal": ["real-meal", "weeknight-dinner", "feeding-two"],
  quick: ["quick", "quick-lunch", "late-night"],
  "too-tired": ["too-tired", "low-energy", "late-night"],
  "cheap-filling": ["cheap-filling", "quick-lunch", "low-energy"],
  bake: ["bake", "breakfast"],
  snack: ["snack", "late-night", "quick-lunch"],
  "upgrade-premade": ["upgrade-premade", "low-energy", "leftovers"],
  emergency: ["emergency", "low-energy", "late-night"],
};

function getSituationScore(template: RecipeTemplate, situationId?: string) {
  if (!situationId) {
    return 0;
  }

  const relatedIds = relatedSituations[situationId] ?? [
    situationId as RecipeSituationId,
  ];

  return template.situations.some((situation) => relatedIds.includes(situation))
    ? 8
    : 0;
}

function getVibeScore(template: RecipeTemplate, vibeIds: VibeId[]) {
  const usefulVibeIds = vibeIds.filter((vibeId) => vibeId !== "surprise-me");

  if (usefulVibeIds.length === 0) {
    return 0;
  }

  const matchedVibes = usefulVibeIds.filter((vibeId) =>
    template.vibes.includes(vibeId),
  );

  return (matchedVibes.length / usefulVibeIds.length) * 12;
}

function getEffortScore({
  situationId,
  template,
  vibeIds,
}: {
  situationId?: string;
  template: RecipeTemplate;
  vibeIds: VibeId[];
}) {
  const wantsLowEffort =
    situationId === "too-tired" ||
    situationId === "emergency" ||
    situationId === "upgrade-premade" ||
    vibeIds.includes("low-effort");

  if (!wantsLowEffort) {
    return template.effort === "medium" ? 2 : 4;
  }

  if (template.effort === "very-low") {
    return 6;
  }

  return template.effort === "low" ? 3 : 0;
}

function getPracticalScore({
  situationId,
  template,
  vibeIds,
}: {
  situationId?: string;
  template: RecipeTemplate;
  vibeIds: VibeId[];
}) {
  let score = 0;

  if (
    situationId === "cheap-filling" ||
    vibeIds.includes("cheap-and-filling")
  ) {
    score += template.cheapScore;
  }

  if (
    situationId === "real-meal" ||
    vibeIds.includes("high-protein") ||
    vibeIds.includes("gym-meal")
  ) {
    score += template.fillingScore;
  }

  return score;
}

function getMatchLabel({
  missingRequired,
  score,
  situationId,
  template,
  vibeIds,
}: {
  missingRequired: string[];
  score: number;
  situationId?: string;
  template: RecipeTemplate;
  vibeIds: VibeId[];
}) {
  if (missingRequired.length === 1) {
    return "One small missing item";
  }

  if (template.tags.includes("quick-meal-upgrade")) {
    return "Quick meal upgrade";
  }

  if (
    (situationId === "too-tired" || vibeIds.includes("low-effort")) &&
    template.effort === "very-low"
  ) {
    return "Best lazy option";
  }

  if (score >= 90) {
    return "Perfect match";
  }

  if (score >= 75) {
    return "Great match";
  }

  return "Easy win";
}

function getReasons({
  applianceMatch,
  ingredientMatch,
  situationId,
  template,
  vibeIds,
}: {
  applianceMatch: RecipeApplianceMatch;
  ingredientMatch: RecipeIngredientMatch;
  situationId?: string;
  template: RecipeTemplate;
  vibeIds: VibeId[];
}) {
  const reasons: string[] = [];

  if (ingredientMatch.missingRequired.length === 0) {
    reasons.push("You have the core ingredients.");
  } else if (ingredientMatch.missingRequired.length === 1) {
    reasons.push(`Only missing ${ingredientMatch.missingRequired[0]}.`);
  }

  reasons.push(...ingredientMatch.preparationNotes);

  if (ingredientMatch.matchedOptional.length > 0) {
    reasons.push("Optional add-ons are available.");
  }

  if (applianceMatch.appliancesUsed.length > 0) {
    reasons.push(`Works with ${applianceMatch.appliancesUsed.join(" or ")}.`);
  }

  if (getSituationScore(template, situationId) > 0) {
    reasons.push("Fits the current food situation.");
  }

  if (getVibeScore(template, vibeIds) > 0) {
    reasons.push("Matches the selected vibe.");
  }

  return reasons;
}

export function scoreRecipe({
  applianceMatch,
  ingredientMatch,
  situationId,
  template,
  vibeIds,
}: {
  applianceMatch: RecipeApplianceMatch;
  ingredientMatch: RecipeIngredientMatch;
  situationId?: string;
  template: RecipeTemplate;
  vibeIds: VibeId[];
}): RankedRecipeMatch | null {
  if (!applianceMatch.isCompatible) {
    return null;
  }

  if (ingredientMatch.missingCoreRequired.length > 0) {
    return null;
  }

  if (ingredientMatch.missingRequired.length > 1) {
    return null;
  }

  const requiredScore =
    ingredientMatch.missingRequired.length === 0
      ? 45
      : 24 * ingredientMatch.requiredCoverage;
  const optionalScore = ingredientMatch.optionalCoverage * 18;
  const applianceScore = 20;
  const situationScore = getSituationScore(template, situationId);
  const vibeScore = getVibeScore(template, vibeIds);
  const effortScore = getEffortScore({ situationId, template, vibeIds });
  const practicalScore = getPracticalScore({ situationId, template, vibeIds });
  const rawScore =
    requiredScore +
    optionalScore +
    applianceScore +
    situationScore +
    vibeScore +
    effortScore +
    practicalScore;
  const matchScore = Math.min(100, Math.round(rawScore));

  return {
    templateId: template.id,
    name: template.name,
    description: template.baseDescription,
    matchScore,
    matchLabel: getMatchLabel({
      missingRequired: ingredientMatch.missingRequired,
      score: matchScore,
      situationId,
      template,
      vibeIds,
    }),
    ingredientsUsed: ingredientMatch.ingredientsUsed,
    missingRequired: ingredientMatch.missingRequired,
    missingOptional: ingredientMatch.missingOptional,
    preparationNotes: ingredientMatch.preparationNotes,
    appliancesUsed: applianceMatch.appliancesUsed,
    timeMinutes: template.timeMinutes,
    effort: template.effort,
    cleanup: template.cleanup,
    tags: template.tags,
    reasons: getReasons({
      applianceMatch,
      ingredientMatch,
      situationId,
      template,
      vibeIds,
    }),
  };
}
