export type IngredientId = string;

export type IngredientSpecificity = "group" | "subgroup" | "specific";
export type IngredientNodeKind = IngredientSpecificity;

export type IngredientStorage =
  | "fresh"
  | "refrigerated"
  | "frozen"
  | "pantry"
  | "leftover";

export type IngredientTag =
  | "protein"
  | "carb"
  | "vegetable"
  | "dairy"
  | "pantry"
  | "sauce"
  | "spice"
  | "frozen"
  | "convenience"
  | "breakfast"
  | "baking"
  | "leftover";

export type IngredientDietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "contains-dairy"
  | "contains-gluten"
  | "contains-meat"
  | "contains-fish"
  | "contains-shellfish"
  | "contains-egg"
  | "nut-free";

export type Ingredient = {
  id: IngredientId;
  name: string;
  label: string;
  category: string;
  subcategory?: string;
  parentId?: IngredientId;
  specificity: IngredientSpecificity;
  kind: IngredientNodeKind;
  synonyms: string[];
  aliases: string[];
  commonPairings: IngredientId[];
  unlocksTemplates: string[];
  dietaryTags: IngredientDietaryTag[];
  storageType?: IngredientStorage;
  storage?: IngredientStorage;
  cookingNotes?: string;
  isPantryBasic: boolean;
  isCommon: boolean;
  tags: IngredientTag[];
};

export type IngredientGroup = Ingredient & {
  specificity: "group";
  kind: "group";
  parentId?: undefined;
  subcategory?: undefined;
};

export type IngredientSubgroup = Ingredient & {
  specificity: "subgroup";
  kind: "subgroup";
  parentId: IngredientId;
};

export type SpecificIngredient = Ingredient & {
  specificity: "specific";
  kind: "specific";
  parentId: IngredientId;
};

export type IngredientTreeNode =
  | IngredientGroup
  | IngredientSubgroup
  | SpecificIngredient;
