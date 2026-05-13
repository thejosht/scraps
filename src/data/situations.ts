import type { Situation } from "@/types";

export const situations = [
  {
    id: "quick-lunch",
    label: "Quick lunch",
    description: "A practical meal with minimal prep and a short cook time.",
  },
  {
    id: "weeknight-dinner",
    label: "Weeknight dinner",
    description: "A satisfying dinner that avoids fussy steps.",
  },
  {
    id: "leftovers",
    label: "Using leftovers",
    description: "Build around food that is already cooked.",
  },
  {
    id: "low-energy",
    label: "Low energy",
    description: "Low mental load, low effort, and forgiving timing.",
  },
  {
    id: "post-workout",
    label: "Post-workout",
    description: "Protein-forward and filling without becoming elaborate.",
  },
  {
    id: "breakfast",
    label: "Breakfast",
    description: "Breakfast-style ideas for mornings or breakfast-for-dinner.",
  },
  {
    id: "late-night",
    label: "Late night",
    description: "Fast, contained meals with minimal cleanup.",
  },
  {
    id: "feeding-two",
    label: "Feeding two",
    description: "Ideas that scale naturally without much extra work.",
  },
  {
    id: "meal-prep",
    label: "Meal prep",
    description: "Templates that make sense as leftovers or batch meals.",
  },
] satisfies Situation[];
