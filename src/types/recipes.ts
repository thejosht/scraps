import type { ApplianceId } from "./appliances";
import type { IngredientId } from "./ingredients";
import type { SituationId } from "./situations";
import type { VibeId } from "./vibes";

export type RecipeTemplateId = string;

export type EffortLevel = "very-low" | "low" | "medium";

export type CleanupLevel = "minimal" | "some" | "moderate";

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

export type RecipeTemplate = {
  id: RecipeTemplateId;
  title: string;
  summary: string;
  requiredIngredientIds: IngredientId[];
  optionalIngredientIds: IngredientId[];
  requiredApplianceIds: ApplianceId[];
  cookingMethods: CookingMethod[];
  situationIds: SituationId[];
  vibeIds: VibeId[];
  timeMinutes: number;
  effort: EffortLevel;
  cleanup: CleanupLevel;
  safetyNotes?: string[];
};
