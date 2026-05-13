import type { Appliance } from "@/types";

export const appliances = [
  {
    id: "stove",
    label: "Stove",
    category: "heat",
  },
  {
    id: "oven",
    label: "Oven",
    category: "heat",
  },
  {
    id: "microwave",
    label: "Microwave",
    category: "countertop",
  },
  {
    id: "air-fryer",
    label: "Air fryer",
    category: "countertop",
  },
  {
    id: "toaster-oven",
    label: "Toaster oven",
    category: "countertop",
  },
  {
    id: "blender",
    label: "Blender",
    category: "prep",
  },
  {
    id: "rice-cooker",
    label: "Rice cooker",
    category: "countertop",
  },
  {
    id: "no-cook-only",
    label: "No-cook only",
    category: "constraint",
  },
  {
    id: "slow-cooker",
    label: "Slow cooker",
    category: "countertop",
  },
  {
    id: "instant-pot",
    label: "Instant Pot",
    category: "countertop",
    aliases: ["pressure cooker"],
  },
  {
    id: "grill",
    label: "Grill",
    category: "outdoor",
  },
] satisfies Appliance[];
