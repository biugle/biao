import type { BiuTabSession } from "../types.js";
export type { BiuTabSession } from "../types.js";

const TAB_SESSION_PREFIX = "BIU_TABS_SESSION:";

function sessionKey(scope: string) {
  return `${TAB_SESSION_PREFIX}${encodeURIComponent(scope.trim() || "default")}`;
}

export function readBiuTabSession(scope: string): BiuTabSession {
  if (typeof window === "undefined") return { keys: [] };
  try {
    const value = JSON.parse(
      window.sessionStorage.getItem(sessionKey(scope)) || "null",
    ) as Partial<BiuTabSession> | null;
    return {
      keys: Array.isArray(value?.keys)
        ? value.keys.filter((key): key is string => typeof key === "string").slice(0, 50)
        : [],
      selectedKey: typeof value?.selectedKey === "string" ? value.selectedKey : undefined,
    };
  } catch {
    return { keys: [] };
  }
}

export function writeBiuTabSession(scope: string, value: BiuTabSession) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      sessionKey(scope),
      JSON.stringify({ keys: value.keys.slice(0, 50), selectedKey: value.selectedKey }),
    );
  } catch {
    // Private mode and quota failures must not interrupt navigation.
  }
}
