export type VibeId =
  | "surprise-me"
  | "spicy"
  | "comfort-food"
  | "crispy"
  | "healthy-ish"
  | "high-protein"
  | "sweet"
  | "savory"
  | "creamy"
  | "fresh"
  | "cheap-and-filling"
  | "low-effort"
  | "caribbean-inspired"
  | "asian-inspired"
  | "italian-inspired"
  | "mexican-inspired"
  | "breakfast-style"
  | "gym-meal";

export type VibeFlavorInfluence = "none" | "light" | "medium" | "strong";

export type VibeOption = {
  id: VibeId;
  label: string;
  allowsMultiSelect: true;
  flavorInfluence: VibeFlavorInfluence;
  description?: string;
};

export type VibeSelection = VibeId[];
