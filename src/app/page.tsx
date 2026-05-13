import { IngredientBubble } from "@/components/bubbles";
import { AppShell } from "@/components/layout";
import {
  PrimaryButton,
  SecondaryButton,
  SelectableChip,
  SurfaceCard,
} from "@/components/ui";

const previewIngredients = [
  { category: "Carb", label: "Rice" },
  { category: "Protein", label: "Chicken thighs", selected: true },
  { category: "Protein", label: "Eggs" },
  { category: "Carb", label: "Pasta" },
  { category: "Sauce", label: "Hot sauce", selected: true },
  { category: "Frozen", label: "Frozen vegetables" },
  { category: "Breakfast", label: "Oats" },
  { category: "Dairy", label: "Cheese" },
];

const whyCards = [
  {
    title: "Less typing than a chatbot",
    description:
      "Tap a few useful choices instead of explaining your whole kitchen from scratch.",
  },
  {
    title: "Uses what you actually have",
    description:
      "Scraps starts with your ingredients, appliances, and effort level before suggesting ideas.",
  },
  {
    title: "Realistic meals, not recipe-blog fluff",
    description:
      "The goal is a practical answer you can cook soon, not a long story about dinner.",
  },
];

const howItWorks = [
  "Pick your food situation",
  "Tap what you have",
  "Choose a vibe",
  "Get realistic meal ideas",
];

const desktopPreview = (
  <div className="hidden lg:block">
    <SurfaceCard className="p-5">
      <p className="text-sm font-medium text-text-muted">Selected so far</p>
      <h2 className="mt-2 text-xl font-semibold text-text-primary">
        Tonight direction
      </h2>

      <div className="mt-5 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
            Ingredients
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <SelectableChip selected>Rice</SelectableChip>
            <SelectableChip selected>Chicken thighs</SelectableChip>
            <SelectableChip selected>Hot sauce</SelectableChip>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
            Vibe
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <SelectableChip selected>Spicy</SelectableChip>
            <SelectableChip selected>Low effort</SelectableChip>
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-border bg-surface-warm p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-accent">
            Possible result
          </p>
          <h3 className="mt-2 text-lg font-semibold text-text-primary">
            Spicy Chicken Rice Plate
          </h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            A realistic direction from what is already on hand. The full flow is
            coming later.
          </p>
        </div>
      </div>
    </SurfaceCard>
  </div>
);

export default function Home() {
  return (
    <AppShell
      rightPanel={desktopPreview}
      showBottomNav={false}
      showDesktopNav={false}
    >
      <section className="grid gap-6 lg:min-h-[calc(100dvh-5rem)] lg:items-center">
        <SurfaceCard warm className="overflow-hidden p-5 sm:p-7 lg:p-9">
          <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr] xl:items-center">
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-clay-accent">
                Scraps
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-text-primary sm:text-5xl lg:text-6xl">
                What can you make with what you already have?
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                Tap your ingredients, choose a craving, and Scraps will help
                you find realistic meals without a grocery run.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_1fr] xl:max-w-xl">
                <PrimaryButton className="w-full">
                  Start with what I have
                </PrimaryButton>
                <SecondaryButton className="w-full">
                  Upgrade something frozen
                </SecondaryButton>
              </div>
              <button
                className="mt-4 min-h-11 rounded-2xl px-1 text-left text-sm font-semibold text-text-secondary transition hover:text-primary-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
                type="button"
              >
                Too tired, show easy meals
              </button>
            </div>

            <div className="rounded-card border border-border bg-surface/70 p-4 shadow-[0_18px_42px_rgb(31_31_31/0.06)] sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    Tap what you have
                  </p>
                  <p className="mt-1 text-lg font-semibold text-text-primary">
                    Pantry preview
                  </p>
                </div>
                <span className="rounded-full bg-[rgb(79_138_91/0.12)] px-3 py-1 text-xs font-semibold text-green-accent">
                  Fast start
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {previewIngredients.map((ingredient) => (
                  <IngredientBubble
                    categoryLabel={ingredient.category}
                    key={ingredient.label}
                    label={ingredient.label}
                    selected={ingredient.selected}
                  />
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>
      </section>

      <section aria-labelledby="why-scraps" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-clay-accent">
              Why Scraps
            </p>
            <h2
              className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl"
              id="why-scraps"
            >
              Built for deciding, not endlessly generating.
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {whyCards.map((card) => (
            <SurfaceCard className="p-5" key={card.title}>
              <h3 className="text-lg font-semibold text-text-primary">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {card.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-it-works" className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-clay-accent">
            How it works
          </p>
          <h2
            className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl"
            id="how-it-works"
          >
            Four quick choices, then dinner gets clearer.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {howItWorks.map((step, index) => (
            <SurfaceCard className="p-5" key={step}>
              <span className="grid size-9 place-items-center rounded-full bg-surface-warm text-sm font-semibold text-primary-accent">
                {index + 1}
              </span>
              <h3 className="mt-5 text-base font-semibold text-text-primary">
                {step}
              </h3>
            </SurfaceCard>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
