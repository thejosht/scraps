export type UsageLimitPlanId = "guest" | "free" | "future-paid";

export type UsageLimitRule = {
  planId: UsageLimitPlanId;
  dailySuggestionLimit: number;
  savedPantryItemLimit: number;
  notes: string;
};

export type UsageLimitsConfig = {
  rules: UsageLimitRule[];
  resetWindow: "daily";
};
