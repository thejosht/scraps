import { appliances } from "@/data/appliances";
import type { ApplianceId, RecipeTemplate } from "@/types";

const applianceLabels = new Map(
  appliances.map((appliance) => [appliance.id, appliance.label]),
);

export type RecipeApplianceMatch = {
  appliancesUsed: string[];
  isCompatible: boolean;
  missingAppliances: string[];
};

function getApplianceLabel(applianceId: ApplianceId) {
  return applianceLabels.get(applianceId) ?? applianceId;
}

export function matchRecipeAppliances({
  selectedApplianceIds,
  template,
}: {
  selectedApplianceIds: ApplianceId[];
  template: RecipeTemplate;
}): RecipeApplianceMatch {
  const selectedIds = new Set(selectedApplianceIds);
  const isNoCookTemplate = template.requiredMethods.includes("no-cook");

  if (isNoCookTemplate) {
    return {
      appliancesUsed: selectedIds.has("no-cook-only")
        ? ["No-cook only"]
        : ["No appliance needed"],
      isCompatible: true,
      missingAppliances: [],
    };
  }

  if (selectedIds.has("no-cook-only")) {
    return {
      appliancesUsed: [],
      isCompatible: false,
      missingAppliances: template.compatibleAppliances.map(getApplianceLabel),
    };
  }

  const compatibleSelectedIds = template.compatibleAppliances.filter(
    (applianceId) => selectedIds.has(applianceId),
  );

  return {
    appliancesUsed: compatibleSelectedIds.map(getApplianceLabel),
    isCompatible: compatibleSelectedIds.length > 0,
    missingAppliances: compatibleSelectedIds.length
      ? []
      : template.compatibleAppliances.map(getApplianceLabel),
  };
}
