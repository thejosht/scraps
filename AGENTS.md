<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Scraps Project Instructions

Scraps is a food decision app, not a generic AI recipe generator. The core promise is: open Scraps, tap what you have, choose a vibe, and get realistic meal ideas fast.

## Product Direction

- Keep the experience focused on deciding what to cook, not producing endless recipe text.
- Prioritize stable, practical suggestions over novelty.
- Make ingredient, vibe, appliance, and situation choices easy to scan and quick to act on.
- Treat "Surprise me" as an exploration aid, not a forced flavor profile.

## Engineering Rules

- Use TypeScript for application code, types, and data.
- Build responsive-first: mobile must be excellent, and desktop must be intentionally polished rather than a stretched mobile screen.
- Use premium playful utility styling: warm, modern, tactile, and adult-friendly.
- Do not make the app childish, cartoony, goofy, or like a cheap AI wrapper.
- Keep smart suggestions stable and explainable.
- Do not add Supabase until explicitly requested.
- Do not add AI API calls until explicitly requested.
- Do not add Stripe or payment logic until explicitly requested.
- Do not modify unrelated files.
- Prefer small, focused changes that preserve the product direction in `PRD.md`, `DESIGN_SYSTEM.md`, and `AI_RULES.md`.
