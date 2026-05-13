# Scraps Data Model

## Ingredient Taxonomy

Ingredients use progressive disclosure:

- Group: broad category such as Proteins, Carbs, Vegetables, Dairy, Pantry, Sauces, Spices, Frozen, Leftovers, or Baking.
- Subgroup: narrower family such as Chicken, Beef, Rice, Pasta, or Noodles.
- Ingredient: selectable concrete item such as chicken drumsticks or leftover rice.

## Core Entities

- Ingredient: selectable food item with labels, aliases, storage hints, and tags.
- Appliance: available cooking tool or method, including no-cook only.
- Vibe: multi-select preference signal such as Spicy, Crispy, Comfort food, or Surprise me.
- Situation: practical context such as low effort, leftovers, breakfast, or late night.
- Recipe template: deterministic local meal idea with required and optional ingredients, appliances, situations, vibes, time, effort, cleanup, and safety notes.
- User: future account or local user shape; no backend is implemented yet.
- Usage limits: local static rules for future gating; no payment logic is implemented.

## Stability Notes

Recipe templates should stay deterministic. Ranking can evolve, but repeated identical inputs should produce stable suggestions unless data changes intentionally.
