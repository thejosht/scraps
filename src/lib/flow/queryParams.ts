export type CsvParamValue = string | string[] | undefined;

export function parseCsvParam(value: CsvParamValue) {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return values
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

export function setCsvParam(
  params: URLSearchParams,
  key: string,
  values?: string[],
) {
  const cleanValues = values?.map((value) => value.trim()).filter(Boolean) ?? [];

  if (cleanValues.length > 0) {
    params.set(key, cleanValues.join(","));
  }
}

export function slugifyCustomValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function decodeCustomValue(value: string) {
  return value
    .trim()
    .replace(/^custom[_-]/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

export function isQuickMealUpgradeSituation(situationId?: string) {
  return (
    situationId === "quick-meal-upgrade" || situationId === "upgrade-premade"
  );
}

export function buildNextHref({
  path,
  query,
}: {
  path: string;
  query: {
    appliances?: string[];
    customIngredients?: string[];
    customVibes?: string[];
    ingredients?: string[];
    situation?: string;
    vibes?: string[];
  };
}) {
  const params = new URLSearchParams();

  if (query.situation) {
    params.set("situation", query.situation);
  }

  setCsvParam(params, "appliances", query.appliances);
  setCsvParam(params, "ingredients", query.ingredients);
  setCsvParam(params, "customIngredients", query.customIngredients);
  setCsvParam(params, "vibes", query.vibes);
  setCsvParam(params, "customVibes", query.customVibes);

  const search = params.toString();

  return search ? `${path}?${search}` : path;
}
