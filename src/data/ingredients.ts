import type { IngredientGroup } from "@/types";

export const ingredientGroups = [
  {
    id: "proteins",
    label: "Proteins",
    kind: "group",
    tags: ["protein"],
    children: [
      {
        id: "chicken",
        label: "Chicken",
        kind: "subgroup",
        tags: ["protein"],
        children: [
          {
            id: "chicken-breast",
            label: "Chicken breast",
            kind: "ingredient",
            storage: "refrigerated",
            tags: ["protein"],
          },
          {
            id: "chicken-thighs",
            label: "Chicken thighs",
            kind: "ingredient",
            storage: "refrigerated",
            tags: ["protein"],
          },
          {
            id: "chicken-drumsticks",
            label: "Chicken drumsticks",
            kind: "ingredient",
            storage: "refrigerated",
            tags: ["protein"],
          },
          {
            id: "chicken-wings",
            label: "Chicken wings",
            kind: "ingredient",
            storage: "refrigerated",
            tags: ["protein"],
          },
          {
            id: "ground-chicken",
            label: "Ground chicken",
            kind: "ingredient",
            storage: "refrigerated",
            tags: ["protein"],
          },
        ],
      },
      {
        id: "beef",
        label: "Beef",
        kind: "subgroup",
        tags: ["protein"],
        children: [
          {
            id: "ground-beef",
            label: "Ground beef",
            kind: "ingredient",
            storage: "refrigerated",
            tags: ["protein"],
          },
        ],
      },
      {
        id: "eggs-and-dairy-proteins",
        label: "Eggs",
        kind: "subgroup",
        tags: ["protein", "breakfast"],
        children: [
          {
            id: "eggs",
            label: "Eggs",
            kind: "ingredient",
            storage: "refrigerated",
            tags: ["protein", "breakfast"],
          },
        ],
      },
    ],
  },
  {
    id: "carbs",
    label: "Carbs",
    kind: "group",
    tags: ["carb"],
    children: [
      {
        id: "rice",
        label: "Rice",
        kind: "subgroup",
        tags: ["carb"],
        children: [
          {
            id: "white-rice",
            label: "White rice",
            kind: "ingredient",
            storage: "pantry",
            tags: ["carb", "pantry"],
          },
        ],
      },
      {
        id: "pasta",
        label: "Pasta",
        kind: "subgroup",
        tags: ["carb"],
        children: [
          {
            id: "dry-pasta",
            label: "Dry pasta",
            kind: "ingredient",
            storage: "pantry",
            tags: ["carb", "pantry"],
          },
        ],
      },
      {
        id: "noodles",
        label: "Noodles",
        kind: "subgroup",
        tags: ["carb", "convenience"],
        children: [
          {
            id: "instant-noodles",
            label: "Instant noodles",
            kind: "ingredient",
            storage: "pantry",
            tags: ["carb", "pantry", "convenience"],
          },
        ],
      },
      {
        id: "oats",
        label: "Oats",
        kind: "subgroup",
        tags: ["carb", "breakfast"],
        children: [
          {
            id: "rolled-oats",
            label: "Rolled oats",
            kind: "ingredient",
            storage: "pantry",
            tags: ["carb", "breakfast", "pantry"],
          },
        ],
      },
    ],
  },
  {
    id: "vegetables",
    label: "Vegetables",
    kind: "group",
    tags: ["vegetable"],
    children: [
      {
        id: "aromatics",
        label: "Aromatics",
        kind: "subgroup",
        tags: ["vegetable"],
        children: [
          {
            id: "garlic",
            label: "Garlic",
            kind: "ingredient",
            storage: "pantry",
            tags: ["vegetable"],
          },
          {
            id: "onion",
            label: "Onion",
            kind: "ingredient",
            storage: "pantry",
            tags: ["vegetable"],
          },
        ],
      },
    ],
  },
  {
    id: "dairy",
    label: "Dairy",
    kind: "group",
    tags: ["dairy"],
    children: [
      {
        id: "cheese",
        label: "Cheese",
        kind: "subgroup",
        tags: ["dairy"],
        children: [
          {
            id: "butter",
            label: "Butter",
            kind: "ingredient",
            storage: "refrigerated",
            tags: ["dairy"],
          },
          {
            id: "shredded-cheese",
            label: "Shredded cheese",
            kind: "ingredient",
            storage: "refrigerated",
            tags: ["dairy"],
          },
        ],
      },
    ],
  },
  {
    id: "pantry",
    label: "Pantry",
    kind: "group",
    tags: ["pantry"],
    children: [
      {
        id: "boxed-meals",
        label: "Boxed meals",
        kind: "subgroup",
        tags: ["pantry", "convenience"],
        children: [
          {
            id: "boxed-mac-and-cheese",
            label: "Boxed mac and cheese",
            kind: "ingredient",
            storage: "pantry",
            tags: ["pantry", "convenience"],
          },
        ],
      },
      {
        id: "canned-protein",
        label: "Canned protein",
        kind: "subgroup",
        tags: ["pantry", "protein"],
        children: [
          {
            id: "canned-tuna",
            label: "Canned tuna",
            kind: "ingredient",
            storage: "pantry",
            tags: ["protein", "pantry"],
          },
        ],
      },
    ],
  },
  {
    id: "sauces",
    label: "Sauces",
    kind: "group",
    tags: ["sauce"],
    children: [
      {
        id: "condiments",
        label: "Condiments",
        kind: "subgroup",
        tags: ["sauce"],
        children: [
          {
            id: "soy-sauce",
            label: "Soy sauce",
            kind: "ingredient",
            storage: "pantry",
            tags: ["sauce", "pantry"],
          },
          {
            id: "hot-sauce",
            label: "Hot sauce",
            kind: "ingredient",
            storage: "pantry",
            tags: ["sauce", "spice", "pantry"],
          },
        ],
      },
    ],
  },
  {
    id: "spices",
    label: "Spices",
    kind: "group",
    tags: ["spice"],
    children: [
      {
        id: "warming-spices",
        label: "Warming spices",
        kind: "subgroup",
        tags: ["spice"],
        children: [
          {
            id: "paprika",
            label: "Paprika",
            kind: "ingredient",
            storage: "pantry",
            tags: ["spice", "pantry"],
          },
          {
            id: "jerk-seasoning",
            label: "Jerk seasoning",
            kind: "ingredient",
            storage: "pantry",
            tags: ["spice", "pantry"],
          },
        ],
      },
    ],
  },
  {
    id: "frozen",
    label: "Frozen",
    kind: "group",
    tags: ["convenience"],
    children: [
      {
        id: "frozen-meals",
        label: "Frozen meals",
        kind: "subgroup",
        tags: ["convenience"],
        children: [
          {
            id: "frozen-pizza",
            label: "Frozen pizza",
            kind: "ingredient",
            storage: "frozen",
            tags: ["convenience"],
          },
        ],
      },
      {
        id: "frozen-vegetable-bags",
        label: "Frozen vegetable bags",
        kind: "subgroup",
        tags: ["vegetable"],
        children: [
          {
            id: "frozen-vegetables",
            label: "Frozen vegetables",
            kind: "ingredient",
            storage: "frozen",
            tags: ["vegetable"],
          },
        ],
      },
    ],
  },
  {
    id: "leftovers",
    label: "Leftovers",
    kind: "group",
    tags: ["leftover"],
    children: [
      {
        id: "leftover-grains",
        label: "Leftover grains",
        kind: "subgroup",
        tags: ["leftover", "carb"],
        children: [
          {
            id: "leftover-rice",
            label: "Leftover rice",
            kind: "ingredient",
            storage: "leftover",
            tags: ["leftover", "carb"],
          },
        ],
      },
    ],
  },
  {
    id: "baking",
    label: "Baking",
    kind: "group",
    tags: ["baking"],
    children: [
      {
        id: "baking-basics",
        label: "Baking basics",
        kind: "subgroup",
        tags: ["baking", "pantry"],
        children: [
          {
            id: "all-purpose-flour",
            label: "All-purpose flour",
            kind: "ingredient",
            storage: "pantry",
            tags: ["baking", "pantry"],
          },
        ],
      },
    ],
  },
] satisfies IngredientGroup[];
