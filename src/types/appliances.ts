export type ApplianceId =
  | "stove"
  | "oven"
  | "microwave"
  | "air-fryer"
  | "toaster-oven"
  | "blender"
  | "rice-cooker"
  | "no-cook-only"
  | "slow-cooker"
  | "instant-pot"
  | "grill";

export type ApplianceCategory =
  | "heat"
  | "countertop"
  | "prep"
  | "constraint"
  | "outdoor";

export type Appliance = {
  id: ApplianceId;
  label: string;
  category: ApplianceCategory;
  aliases?: string[];
};
