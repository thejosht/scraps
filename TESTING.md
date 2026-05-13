# Scraps Testing

## Current Verification

Use these commands for the foundation:

```bash
npm run lint
npm run typecheck
npm run build
npm run dev
```

## Testing Direction

- TypeScript should catch invalid starter data shapes.
- Local ranking should get deterministic unit tests when implemented.
- UI flows should be checked across mobile and desktop breakpoints.
- Accessibility checks should cover keyboard navigation, focus states, and readable contrast.

## Manual QA Later

- Select common pantry ingredients and verify realistic suggestions.
- Try sparse inputs and confirm helpful fallback ideas.
- Confirm "Surprise me" does not force a specific flavor.
- Confirm appliance constraints remove incompatible templates.
