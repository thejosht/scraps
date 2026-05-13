export type IngredientId = string;

export type IngredientNodeKind = "group" | "subgroup" | "ingredient";

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

type IngredientNodeBase = {
  id: IngredientId;
  label: string;
  kind: IngredientNodeKind;
  aliases?: string[];
  tags?: IngredientTag[];
};

export type IngredientGroup = IngredientNodeBase & {
  kind: "group";
  children: IngredientSubgroup[];
};

export type IngredientSubgroup = IngredientNodeBase & {
  kind: "subgroup";
  children: Ingredient[];
};

export type Ingredient = IngredientNodeBase & {
  kind: "ingredient";
  storage: IngredientStorage;
};

export type IngredientTreeNode = IngredientGroup | IngredientSubgroup | Ingredient;
