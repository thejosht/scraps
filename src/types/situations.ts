export type SituationId =
  | "quick-lunch"
  | "weeknight-dinner"
  | "leftovers"
  | "low-energy"
  | "post-workout"
  | "breakfast"
  | "late-night"
  | "feeding-two"
  | "meal-prep";

export type Situation = {
  id: SituationId;
  label: string;
  description: string;
};
