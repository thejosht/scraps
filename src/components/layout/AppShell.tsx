import type { ReactNode } from "react";
import { SurfaceCard } from "@/components/ui";
import { BottomNav } from "./BottomNav";
import { PageHeader } from "./PageHeader";

type AppShellProps = {
  children: ReactNode;
  className?: string;
  headerEyebrow?: string;
  leftPanel?: ReactNode;
  pageDescription?: string;
  pageTitle?: string;
  rightPanel?: ReactNode;
  showBottomNav?: boolean;
  showDesktopNav?: boolean;
};

export function AppShell({
  children,
  className = "",
  headerEyebrow = "Scraps preview",
  leftPanel,
  pageDescription,
  pageTitle,
  rightPanel,
  showBottomNav = true,
  showDesktopNav = true,
}: AppShellProps) {
  const header =
    pageTitle || pageDescription ? (
      <PageHeader
        eyebrow={headerEyebrow}
        title={pageTitle ?? "Scraps"}
        description={pageDescription}
      />
    ) : null;

  const desktopLeftPanel = (
    <SurfaceCard warm className="p-4">
      <p className="text-sm font-semibold text-text-primary">Scraps</p>
      <p className="mt-2 text-sm leading-5 text-text-secondary">
        Layout foundation for quick food decisions.
      </p>
      <div className="mt-5 space-y-2">
        {["Home", "Pantry", "Saved", "Account"].map((item, index) => (
          <div
            className={[
              "rounded-2xl px-3 py-2 text-sm font-medium",
              index === 0
                ? "bg-surface text-primary-accent shadow-[0_8px_18px_rgb(31_31_31/0.05)]"
                : "text-text-muted",
            ].join(" ")}
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </SurfaceCard>
  );

  const resolvedLeftPanel = leftPanel ?? (showDesktopNav ? desktopLeftPanel : undefined);

  return (
    <main
      className={[
        "scraps-page min-h-dvh px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10",
        className,
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={[
            "grid w-full gap-5",
            resolvedLeftPanel && rightPanel
              ? "lg:grid-cols-[15rem_minmax(0,1fr)_20rem]"
              : resolvedLeftPanel
                ? "lg:grid-cols-[15rem_minmax(0,1fr)]"
                : rightPanel
                  ? "lg:grid-cols-[minmax(0,1fr)_20rem]"
                  : "lg:grid-cols-1",
          ].join(" ")}
        >
          {resolvedLeftPanel ? (
            <aside className="hidden min-w-0 self-start lg:sticky lg:top-6 lg:block">
              {resolvedLeftPanel}
            </aside>
          ) : null}
          <div className="min-w-0 space-y-5">
            {header}
            {children}
          </div>
          {rightPanel ? (
            <aside className="min-w-0 self-start lg:sticky lg:top-6">
              {rightPanel}
            </aside>
          ) : null}
        </div>
      </div>
      {showBottomNav ? <BottomNav /> : null}
    </main>
  );
}
