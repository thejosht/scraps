# Scraps Build Plan

## Phase 1: Foundation

- Next.js, React, TypeScript, and Tailwind CSS setup.
- Root project documentation.
- Folder structure for app, components, data, domain logic, and types.
- Typed starter data for ingredients, appliances, vibes, situations, recipe templates, and usage limits.

## Phase 2: Design Tokens

- Define color, typography, radius, spacing, elevation, and interaction tokens.
- Establish responsive layout rules for mobile and desktop.
- Create component styling guidance before building the full UI.

## Phase 3: Core Decision UI

- Build ingredient selection with progressive disclosure.
- Build vibe and appliance selection.
- Add ranked result cards from local recipe templates.
- Keep motion subtle and utility-focused.

## Phase 4: Local Intelligence

- Implement deterministic ranking from selected ingredients, appliances, vibes, and situations.
- Add lightweight local storage for recent selections.
- Add guardrails for stable suggestions.

## Later Phases

- Supabase only when requested.
- AI service layer only when requested.
- Stripe or payments only when requested.
