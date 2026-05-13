"use client";

import { useRouter } from "next/navigation";
import type { ApplianceId } from "@/types";

type ApplianceSearchInputProps = {
  applianceIds: ApplianceId[];
  initialValue: string;
  situationId?: string;
};

export function ApplianceSearchInput({
  applianceIds,
  initialValue,
  situationId,
}: ApplianceSearchInputProps) {
  const router = useRouter();

  function updateSearch(value: string) {
    const params = new URLSearchParams();

    if (situationId) {
      params.set("situation", situationId);
    }

    if (applianceIds.length > 0) {
      params.set("appliances", applianceIds.join(","));
    }

    if (value.trim()) {
      params.set("applianceSearch", value.trim());
    }

    const query = params.toString();

    router.replace(query ? `/cook/appliances?${query}` : "/cook/appliances");
  }

  return (
    <label className="block">
      <span className="text-sm font-medium text-text-muted">
        Search appliances
      </span>
      <input
        className="mt-3 min-h-12 w-full rounded-2xl border border-border bg-surface px-4 text-sm font-medium text-text-primary shadow-[0_10px_24px_rgb(31_31_31/0.04)] outline-none transition placeholder:text-text-muted focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/15"
        defaultValue={initialValue}
        onChange={(event) => updateSearch(event.target.value)}
        placeholder="Try pressure cooker, crockpot, waffle iron..."
        type="search"
      />
    </label>
  );
}
