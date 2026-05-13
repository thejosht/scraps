type StepProgressProps = {
  className?: string;
  currentStep: number;
  steps?: string[];
};

const defaultSteps = [
  "Situation",
  "Appliances",
  "Ingredients",
  "Vibe",
  "Results",
];

export function StepProgress({
  className = "",
  currentStep,
  steps = defaultSteps,
}: StepProgressProps) {
  return (
    <nav
      aria-label="Scraps flow progress"
      className={["w-full overflow-x-auto", className].join(" ")}
    >
      <ol className="flex min-w-max items-center gap-2 pr-1">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;

          return (
            <li key={step} className="flex items-center gap-2">
              <div
                className={[
                  "flex items-center gap-2 rounded-full border px-3 py-2 transition",
                  isCurrent
                    ? "border-primary-accent bg-surface-warm text-text-primary shadow-[0_10px_24px_rgb(232_93_63/0.10)]"
                    : isComplete
                      ? "border-[rgb(79_138_91/0.30)] bg-[rgb(79_138_91/0.10)] text-green-accent"
                      : "border-border bg-surface text-text-muted",
                ].join(" ")}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={[
                    "grid size-6 place-items-center rounded-full text-xs font-semibold",
                    isCurrent
                      ? "bg-primary-accent text-white"
                      : isComplete
                        ? "bg-green-accent text-white"
                        : "bg-surface-warm text-text-muted",
                  ].join(" ")}
                >
                  {stepNumber}
                </span>
                <span className="text-sm font-medium">{step}</span>
              </div>
              {index < steps.length - 1 ? (
                <span className="h-px w-4 bg-border" aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
