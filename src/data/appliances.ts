import type { Appliance } from "@/types";

export const appliances = [
  {
    id: "stove",
    label: "Stove",
    category: "heat",
    aliases: ["cooktop", "range", "stovetop"],
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
    aliases: ["microwave oven"],
  },
  {
    id: "air-fryer",
    label: "Air fryer",
    category: "countertop",
    aliases: ["airfryer"],
  },
  {
    id: "toaster-oven",
    label: "Toaster oven",
    category: "countertop",
    aliases: ["countertop oven"],
  },
  {
    id: "blender",
    label: "Blender",
    category: "prep",
    aliases: ["smoothie blender"],
  },
  {
    id: "rice-cooker",
    label: "Rice cooker",
    category: "countertop",
    aliases: ["rice maker"],
  },
  {
    id: "no-cook-only",
    label: "No-cook only",
    category: "constraint",
    aliases: ["no cook", "no heat", "no appliance"],
  },
  {
    id: "slow-cooker",
    label: "Slow cooker",
    category: "countertop",
    aliases: ["crock pot", "crockpot"],
  },
  {
    id: "instant-pot",
    label: "Instant Pot",
    category: "countertop",
    aliases: ["multi-cooker", "multicooker"],
  },
  {
    id: "pressure-cooker",
    label: "Pressure cooker",
    category: "countertop",
    aliases: ["electric pressure cooker"],
  },
  {
    id: "grill",
    label: "Grill",
    category: "outdoor",
    aliases: ["bbq", "barbecue"],
  },
  {
    id: "waffle-maker",
    label: "Waffle maker",
    category: "countertop",
    aliases: ["waffle iron"],
  },
  {
    id: "food-processor",
    label: "Food processor",
    category: "prep",
    aliases: ["processor", "chopper"],
  },
  {
    id: "stand-mixer",
    label: "Stand mixer",
    category: "prep",
    aliases: ["kitchenaid", "mixer"],
  },
  {
    id: "hand-mixer",
    label: "Hand mixer",
    category: "prep",
    aliases: ["electric hand mixer"],
  },
  {
    id: "panini-press",
    label: "Panini press",
    category: "countertop",
    aliases: ["sandwich press"],
  },
  {
    id: "electric-skillet",
    label: "Electric skillet",
    category: "countertop",
    aliases: ["electric frying pan"],
  },
] satisfies Appliance[];
