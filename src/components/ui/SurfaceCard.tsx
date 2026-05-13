import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
  warm?: boolean;
} & ComponentPropsWithoutRef<"div">;

export function SurfaceCard({
  children,
  className = "",
  warm = false,
  ...props
}: SurfaceCardProps) {
  return (
    <div
      className={[
        warm ? "scraps-card-warm" : "scraps-card",
        "p-5 sm:p-6",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
