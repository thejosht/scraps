import type { ReactNode } from "react";

type DesktopShellProps = {
  children: ReactNode;
  className?: string;
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
};

export function DesktopShell({
  children,
  className = "",
  leftPanel,
  rightPanel,
}: DesktopShellProps) {
  return (
    <div
      className={[
        "hidden w-full gap-5 lg:grid",
        leftPanel && rightPanel
          ? "lg:grid-cols-[15rem_minmax(0,1fr)_20rem]"
          : leftPanel
            ? "lg:grid-cols-[15rem_minmax(0,1fr)]"
            : rightPanel
              ? "lg:grid-cols-[minmax(0,1fr)_20rem]"
              : "lg:grid-cols-1",
        className,
      ].join(" ")}
    >
      {leftPanel ? (
        <aside className="min-w-0 self-start lg:sticky lg:top-6">
          {leftPanel}
        </aside>
      ) : null}
      <div className="min-w-0">{children}</div>
      {rightPanel ? (
        <aside className="min-w-0 self-start lg:sticky lg:top-6">
          {rightPanel}
        </aside>
      ) : null}
    </div>
  );
}
