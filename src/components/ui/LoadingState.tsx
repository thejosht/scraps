type LoadingStateProps = {
  className?: string;
  message: string;
};

export function LoadingState({ className = "", message }: LoadingStateProps) {
  return (
    <div
      className={[
        "inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-3",
        "text-sm font-medium text-text-secondary shadow-[0_10px_24px_rgb(31_31_31/0.05)]",
        className,
      ].join(" ")}
      role="status"
    >
      <span
        className="size-2.5 rounded-full bg-primary-accent motion-safe:animate-pulse"
        aria-hidden="true"
      />
      <span>{message}</span>
    </div>
  );
}
