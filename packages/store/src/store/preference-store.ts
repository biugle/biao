import { create } from "zustand";
import type { BiuAuthContext, BiuDirection, BiuTheme } from "../types.js";
import { normalizeBiuLocale, type BiuLocale } from "@biugle/biu-i18n";
import { normalizeBiuDirection, normalizeBiuTheme, normalizeBiuTimezone } from "../config.js";

export interface BiuPreferenceState {
  storageScope: string;
  locale: BiuLocale;
  theme: BiuTheme;
  direction: BiuDirection;
  timezone: string;
  auth?: BiuAuthContext;
  setLocale: (locale: BiuLocale) => void;
  setTheme: (theme: BiuTheme) => void;
  setDirection: (direction: BiuDirection) => void;
  setTimezone: (timezone: string) => void;
  setStorageScope: (scope: string) => void;
  setAuth: (auth?: BiuAuthContext) => void;
  initialize: (
    values: Partial<Pick<BiuPreferenceState, "locale" | "theme" | "direction" | "timezone" | "auth">>,
    scope?: string,
  ) => void;
}

type PersistedPreferenceState = Pick<BiuPreferenceState, "locale" | "theme" | "direction" | "timezone">;
const PREFERENCE_SESSION_PREFIX = "BIU_PREFERENCES_SESSION:";

function storageKey(scope: string) {
  return `${PREFERENCE_SESSION_PREFIX}${encodeURIComponent(scope.trim() || "default")}`;
}

function readStored(scope: string): Partial<PersistedPreferenceState> {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(
      window.sessionStorage.getItem(storageKey(scope)) || "null",
    ) as Partial<PersistedPreferenceState> | null;
    return {
      locale: typeof value?.locale === "string" ? normalizeBiuLocale(value.locale) : undefined,
      theme: normalizeBiuTheme(value?.theme, "light"),
      direction: normalizeBiuDirection(value?.direction, "ltr"),
      timezone: normalizeBiuTimezone(value?.timezone),
    };
  } catch {
    return {};
  }
}

function writeStored(scope: string, value: PersistedPreferenceState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(storageKey(scope), JSON.stringify(value));
  } catch {
    // Private mode and quota failures must not interrupt preference changes.
  }
}

function normalizeScope(scope?: string) {
  return scope?.trim() || "default";
}

/** Runtime preferences persist for the current browser tab and are scoped by portal/environment. */
export const useBiuPreferenceStore = create<BiuPreferenceState>((set) => ({
  storageScope: "default",
  locale: "zh-CN",
  theme: "light",
  direction: "ltr",
  timezone: "Asia/Shanghai",
  setLocale: (locale) =>
    set((state) => {
      const normalizedLocale = normalizeBiuLocale(locale);
      const next = { ...state, locale: normalizedLocale };
      writeStored(state.storageScope, next);
      return { locale: normalizedLocale };
    }),
  setTheme: (theme) =>
    set((state) => {
      const next = { ...state, theme: normalizeBiuTheme(theme) };
      writeStored(state.storageScope, next);
      return { theme: next.theme };
    }),
  setDirection: (direction) =>
    set((state) => {
      const next = { ...state, direction: normalizeBiuDirection(direction) };
      writeStored(state.storageScope, next);
      return { direction: next.direction };
    }),
  setTimezone: (timezone) =>
    set((state) => {
      const next = { ...state, timezone: normalizeBiuTimezone(timezone) };
      writeStored(state.storageScope, next);
      return { timezone: next.timezone };
    }),
  setStorageScope: (scope) =>
    set((state) => {
      const storageScope = normalizeScope(scope);
      if (state.storageScope === storageScope) return state;
      const stored = readStored(storageScope);
      return {
        storageScope,
        locale: normalizeBiuLocale(stored.locale),
        theme: normalizeBiuTheme(stored.theme),
        direction: normalizeBiuDirection(stored.direction),
        timezone: normalizeBiuTimezone(stored.timezone),
      };
    }),
  setAuth: (auth) => set({ auth }),
  initialize: (values, scope) =>
    set(() => {
      const storageScope = normalizeScope(scope);
      const stored = readStored(storageScope);
      return {
        ...values,
        locale: normalizeBiuLocale(stored.locale ?? values.locale),
        theme: normalizeBiuTheme(stored.theme ?? values.theme),
        direction: normalizeBiuDirection(stored.direction ?? values.direction),
        timezone: normalizeBiuTimezone(stored.timezone ?? values.timezone),
        storageScope,
      };
    }),
}));

export const useBiuStore = useBiuPreferenceStore;
export const useBiuLocale = () => useBiuPreferenceStore((state) => state.locale);
export const useBiuTheme = () => useBiuPreferenceStore((state) => state.theme);
export const useBiuTimezone = () => useBiuPreferenceStore((state) => state.timezone);
export const useBiuDirection = () => useBiuPreferenceStore((state) => state.direction);
export const useBiuAuth = () => useBiuPreferenceStore((state) => state.auth);
