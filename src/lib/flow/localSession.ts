import { buildNextHref, parseCsvParam } from "./queryParams";

export const FLOW_SESSION_STORAGE_KEY = "scraps.flow.v1";
const flowSessionChangeEvent = "scraps-flow-session-change";
let cachedRawSession: string | null | undefined;
let cachedSession: FlowSessionState | null = null;

export type FlowSessionState = {
  appliances?: string[];
  customIngredients?: string[];
  customVibes?: string[];
  ingredients?: string[];
  situation?: string;
  updatedAt: string;
  vibes?: string[];
};

type FlowSessionInput = Omit<FlowSessionState, "updatedAt">;

const flowParamKeys = [
  "situation",
  "appliances",
  "ingredients",
  "customIngredients",
  "vibes",
  "customVibes",
] as const;

function cleanList(values?: string[]) {
  const cleanValues = values?.map((value) => value.trim()).filter(Boolean) ?? [];

  return cleanValues.length > 0 ? cleanValues : undefined;
}

function cleanState(input: FlowSessionInput): FlowSessionInput {
  return {
    appliances: cleanList(input.appliances),
    customIngredients: cleanList(input.customIngredients),
    customVibes: cleanList(input.customVibes),
    ingredients: cleanList(input.ingredients),
    situation: input.situation?.trim() || undefined,
    vibes: cleanList(input.vibes),
  };
}

function parseFlowSession(rawSession: string | null) {
  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as FlowSessionState;

    if (!parsedSession.updatedAt || !hasUsefulFlowState(parsedSession)) {
      return null;
    }

    return {
      ...cleanState(parsedSession),
      updatedAt: parsedSession.updatedAt,
    } satisfies FlowSessionState;
  } catch {
    return null;
  }
}

export function hasUsefulFlowState(state?: FlowSessionInput | null) {
  if (!state) {
    return false;
  }

  return Boolean(
    state.situation ||
      state.appliances?.length ||
      state.ingredients?.length ||
      state.customIngredients?.length ||
      state.vibes?.length ||
      state.customVibes?.length,
  );
}

export function hasFlowParams(params: URLSearchParams) {
  return flowParamKeys.some((key) => {
    const value = params.get(key);

    return value !== null && value.trim().length > 0;
  });
}

export function getFlowStateFromSearchParams(params: URLSearchParams) {
  return cleanState({
    appliances: parseCsvParam(params.get("appliances") ?? undefined),
    customIngredients: parseCsvParam(
      params.get("customIngredients") ?? undefined,
    ),
    customVibes: parseCsvParam(params.get("customVibes") ?? undefined),
    ingredients: parseCsvParam(params.get("ingredients") ?? undefined),
    situation: params.get("situation") ?? undefined,
    vibes: parseCsvParam(params.get("vibes") ?? undefined),
  });
}

export function readFlowSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(FLOW_SESSION_STORAGE_KEY);

    if (rawSession === cachedRawSession) {
      return cachedSession;
    }

    cachedRawSession = rawSession;
    cachedSession = parseFlowSession(rawSession);

    return cachedSession;
  } catch {
    cachedRawSession = null;
    cachedSession = null;
    return null;
  }
}

export function writeFlowSession(input: FlowSessionInput) {
  if (typeof window === "undefined") {
    return;
  }

  const cleanInput = cleanState(input);

  try {
    if (!hasUsefulFlowState(cleanInput)) {
      window.localStorage.removeItem(FLOW_SESSION_STORAGE_KEY);
      cachedRawSession = null;
      cachedSession = null;
      window.dispatchEvent(new Event(flowSessionChangeEvent));
      return;
    }

    const session = {
      ...cleanInput,
      updatedAt: new Date().toISOString(),
    } satisfies FlowSessionState;

    const rawSession = JSON.stringify(session);

    window.localStorage.setItem(FLOW_SESSION_STORAGE_KEY, rawSession);
    cachedRawSession = rawSession;
    cachedSession = session;
    window.dispatchEvent(new Event(flowSessionChangeEvent));
  } catch {
    // Storage can be unavailable in private contexts; the URL flow still works.
  }
}

export function clearFlowSession() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(FLOW_SESSION_STORAGE_KEY);
    cachedRawSession = null;
    cachedSession = null;
    window.dispatchEvent(new Event(flowSessionChangeEvent));
  } catch {
    // Ignore storage failures; clearing is a convenience, not a hard dependency.
  }
}

export function subscribeToFlowSession(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(flowSessionChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(flowSessionChangeEvent, callback);
  };
}

export function buildFlowHrefFromSession({
  existingSearch,
  path,
  state,
}: {
  existingSearch?: string;
  path: string;
  state: FlowSessionInput;
}) {
  const href = buildNextHref({ path, query: cleanState(state) });

  if (!existingSearch) {
    return href;
  }

  const existingParams = new URLSearchParams(existingSearch);
  const restoredParams = new URLSearchParams(href.split("?")[1] ?? "");

  flowParamKeys.forEach((key) => existingParams.delete(key));
  restoredParams.forEach((value, key) => existingParams.set(key, value));

  const query = existingParams.toString();

  return query ? `${path}?${query}` : path;
}

export function getResumeFlowPath(state: FlowSessionInput) {
  if (state.vibes?.length || state.customVibes?.length) {
    return "/cook/results";
  }

  if (state.ingredients?.length || state.customIngredients?.length) {
    return "/cook/vibe";
  }

  if (state.appliances?.length) {
    return "/cook/ingredients";
  }

  if (state.situation) {
    return "/cook/appliances";
  }

  return "/cook";
}
