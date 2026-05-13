import type { ReactNode } from "react";
import { SurfaceCard } from "@/components/ui";
import { BottomNav } from "./BottomNav";
import { DesktopShell } from "./DesktopShell";
import { PageHeader } from "./PageHeader";

type AppShellProps = {
  children: ReactNode;
  className?: string;
  pageDescription?: string;
  pageTitle?: string;
  rightPanel?: ReactNode;
};

export function AppShell({
  children,
  className = "",
  pageDescription,
  pageTitle,
  rightPanel,
}: AppShellProps) {
  const header =
    pageTitle || pageDescription ? (
      <PageHeader
        eyebrow="Scraps preview"
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

  return (
    <main
      className={[
        "scraps-page min-h-dvh px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10",
        className,
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="space-y-5 lg:hidden">
          {header}
          <div className="grid gap-5">{children}</div>
          {rightPanel ? <div>{rightPanel}</div> : null}
        </div>

        <DesktopShell leftPanel={desktopLeftPanel} rightPanel={rightPanel}>
          <div className="space-y-5">
            {header}
            {children}
          </div>
        </DesktopShell>
      </div>
      <BottomNav />
    </main>
  );
}
