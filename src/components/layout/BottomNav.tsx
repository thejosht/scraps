type BottomNavItem = {
  href: string;
  label: "Home" | "Pantry" | "Saved" | "Account";
};

type BottomNavProps = {
  activeItem?: BottomNavItem["label"];
  className?: string;
  items?: BottomNavItem[];
};

const defaultItems: BottomNavItem[] = [
  { href: "#", label: "Home" },
  { href: "#", label: "Pantry" },
  { href: "#", label: "Saved" },
  { href: "#", label: "Account" },
];

export function BottomNav({
  activeItem = "Home",
  className = "",
  items = defaultItems,
}: BottomNavProps) {
  return (
    <nav
      aria-label="Primary"
      className={[
        "fixed inset-x-3 bottom-3 z-20 rounded-[1.35rem] border border-border bg-surface/95 p-1.5 shadow-subtle backdrop-blur md:inset-x-6 lg:hidden",
        className,
      ].join(" ")}
    >
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const isActive = item.label === activeItem;

          return (
            <li key={item.label}>
              <a
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex min-h-11 items-center justify-center rounded-2xl px-2 text-xs font-semibold transition",
                  isActive
                    ? "bg-surface-warm text-primary-accent"
                    : "text-text-muted hover:bg-surface-warm hover:text-text-primary",
                ].join(" ")}
                href={item.href}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
