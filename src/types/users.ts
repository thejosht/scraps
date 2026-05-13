import type { ApplianceId } from "./appliances";
import type { IngredientId } from "./ingredients";
import type { VibeId } from "./vibes";

export type UserId = string;

export type UserPantryItem = {
  ingredientId: IngredientId;
  lastSelectedAt?: string;
};

export type UserPreferences = {
  defaultApplianceIds: ApplianceId[];
  favoriteVibeIds: VibeId[];
};

export type ScrapsUser = {
  id: UserId;
  displayName?: string;
  pantryItems: UserPantryItem[];
  preferences: UserPreferences;
  createdAt: string;
};
