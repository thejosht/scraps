import type { UsageLimitsConfig } from "@/types";

export const usageLimits = {
  resetWindow: "daily",
  rules: [
    {
      planId: "guest",
      dailySuggestionLimit: 10,
      savedPantryItemLimit: 0,
      notes: "Starter local limit for unauthenticated use; no payment logic exists.",
    },
    {
      planId: "free",
      dailySuggestionLimit: 25,
      savedPantryItemLimit: 40,
      notes: "Placeholder for a future account tier; no backend is implemented.",
    },
    {
      planId: "future-paid",
      dailySuggestionLimit: 100,
      savedPantryItemLimit: 200,
      notes: "Planning placeholder only; do not add Stripe until requested.",
    },
  ],
} satisfies UsageLimitsConfig;
