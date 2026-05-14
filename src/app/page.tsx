import { IngredientBubble } from "@/components/bubbles";
import { ContinueLastSession } from "@/components/flow";
import { AppShell } from "@/components/layout";
import Link from "next/link";
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

const takeoutMomentCards = [
  {
    label: "Decision first",
    title: "You have food. You just don’t have a plan.",
    description:
      "Scraps turns random ingredients into realistic options you can actually make.",
    tags: ["Random fridge", "Real options"],
  },
  {
    label: "Fast narrowing",
    title: "No long prompts or recipe-blog scrolling.",
    description:
      "Tap what you have, choose a craving, and let Scraps narrow the choices.",
    tags: ["Few taps", "Less noise"],
  },
  {
    label: "Real kitchen food",
    title: "Works with real-life food.",
    description:
      "Instant noodles, boxed mac, leftovers, frozen meals, pantry basics, and full meals all belong here.",
    tags: ["Pantry basics", "Quick meals"],
  },
];

const situationPreviewCards = [
  {
    title: "I’m too tired",
    description: "Low effort, fewer dishes, simple steps.",
    tag: "Low lift",
  },
  {
    title: "Make a quick meal better",
    description:
      "Upgrade noodles, boxed mac, leftovers, frozen food, or canned soup.",
    tag: "Upgrade",
  },
  {
    title: "Cheap and filling",
    description: "Stretch rice, pasta, eggs, beans, potatoes, and bread.",
    tag: "Budget",
  },
  {
    title: "Surprise me",
    description: "For when you know you’re hungry but not what you want.",
    tag: "Open choice",
  },
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
                <PrimaryButton className="w-full" href="/cook">
                  Start with what I have
                </PrimaryButton>
                <SecondaryButton
                  className="w-full"
                  href="/cook/appliances?situation=quick-meal-upgrade"
                >
                  Make a quick meal better
                </SecondaryButton>
              </div>
              <Link
                className="mt-4 inline-flex min-h-11 items-center rounded-2xl px-1 text-left text-sm font-semibold text-text-secondary transition hover:text-primary-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
                href="/cook"
              >
                Too tired, show easy meals
              </Link>
              <ContinueLastSession />
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

      <section aria-labelledby="takeout-moment" className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-clay-accent">
              Why Scraps
            </p>
            <h2
              className="mt-2 max-w-2xl text-2xl font-semibold text-text-primary sm:text-3xl"
              id="takeout-moment"
            >
              Built for the moment you almost order takeout
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-text-secondary sm:text-base lg:justify-self-end">
            Scraps is for the very normal gap between having ingredients and
            knowing what dinner should be. It helps you make a grounded choice
            before takeout becomes the default.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {takeoutMomentCards.map((card, index) => (
            <SurfaceCard className="overflow-hidden p-0" key={card.title}>
              <div
                className={[
                  "h-1.5",
                  index === 0 && "bg-primary-accent",
                  index === 1 && "bg-gold-accent",
                  index === 2 && "bg-green-accent",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-accent">
                  {card.label}
                </p>
                <h3 className="mt-4 text-lg font-semibold leading-7 text-text-primary">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {card.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      className="rounded-full border border-border bg-surface-warm px-3 py-1 text-xs font-semibold text-text-secondary"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <section aria-labelledby="situation-first" className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-clay-accent">
              First step
            </p>
            <h2
              className="mt-2 max-w-2xl text-2xl font-semibold text-text-primary sm:text-3xl"
              id="situation-first"
            >
              Start with the situation, not a search bar
            </h2>
          </div>
          <div className="rounded-card border border-border bg-surface-warm px-4 py-3 text-sm leading-6 text-text-secondary shadow-subtle">
            The first question is not “write a prompt.” It is what kind of
            food problem you are solving right now.
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {situationPreviewCards.map((card, index) => (
            <SurfaceCard className="p-5" key={card.title}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[rgb(232_93_63/0.11)] text-sm font-semibold text-primary-accent">
                  {index + 1}
                </span>
                <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-muted">
                  {card.tag}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold leading-6 text-text-primary">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {card.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
