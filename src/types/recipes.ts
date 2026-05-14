import type { ApplianceId } from "./appliances";
import type { IngredientId, IngredientTag } from "./ingredients";
import type { SituationId } from "./situations";
import type { VibeId } from "./vibes";

export type RecipeTemplateId = string;

export type EffortLevel = "very-low" | "low" | "medium";

export type CleanupLevel = "minimal" | "some" | "moderate";

export type SkillLevel = "beginner" | "comfortable" | "intermediate";

export type CookingMethod =
  | "no-cook"
  | "boil"
  | "saute"
  | "bake"
  | "air-fry"
  | "microwave"
  | "reheat"
  | "blend"
  | "grill";

export type FlowSituationId =
  | "real-meal"
  | "quick"
  | "too-tired"
  | "cheap-filling"
  | "bake"
  | "snack"
  | "quick-meal-upgrade"
  | "upgrade-premade"
  | "emergency";

export type RecipeSituationId = SituationId | FlowSituationId;

export type RecipeIngredientSlot = {
  id: string;
  label: string;
  equivalentIngredientIds?: IngredientId[];
  importance?: "core" | "supporting";
  ingredientIds?: IngredientId[];
  tags?: IngredientTag[];
  min?: number;
  preparationNote?: string;
  preparedIngredientIds?: IngredientId[];
};

export type RecipeTemplate = {
  id: RecipeTemplateId;
  name: string;
  baseDescription: string;
  requiredSlots: RecipeIngredientSlot[];
  optionalSlots: RecipeIngredientSlot[];
  requiredMethods: CookingMethod[];
  compatibleAppliances: ApplianceId[];
  situations: RecipeSituationId[];
  vibes: VibeId[];
  timeMinutes: number;
  effort: EffortLevel;
  cleanup: CleanupLevel;
  skillLevel: SkillLevel;
  fillingScore: number;
  cheapScore: number;
  tags: string[];
  safetyNotes?: string[];
  aiGuidance?: string;
  title?: string;
  summary?: string;
  requiredIngredientIds?: IngredientId[];
  optionalIngredientIds?: IngredientId[];
  requiredApplianceIds?: ApplianceId[];
  cookingMethods?: CookingMethod[];
  situationIds?: SituationId[];
  vibeIds?: VibeId[];
};

export type RankedRecipeMatch = {
  templateId: RecipeTemplateId;
  name: string;
  description: string;
  matchScore: number;
  matchLabel: string;
  ingredientsUsed: string[];
  missingRequired: string[];
  missingOptional: string[];
  preparationNotes: string[];
  appliancesUsed: string[];
  timeMinutes: number;
  effort: EffortLevel;
  cleanup: CleanupLevel;
  tags: string[];
  reasons: string[];
};
