import type { BiuDirection, BiuTheme } from "./types.js";

export const DEFAULT_BIU_TIMEZONE = "Asia/Shanghai";

export function normalizeBiuTheme(value: unknown, fallback: BiuTheme = "light"): BiuTheme {
  return value === "light" || value === "dark" || value === "system" ? value : fallback;
}

export function normalizeBiuDirection(value: unknown, fallback: BiuDirection = "ltr"): BiuDirection {
  return value === "ltr" || value === "rtl" ? value : fallback;
}

export function isBiuTimezone(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function normalizeBiuTimezone(value: unknown, fallback = DEFAULT_BIU_TIMEZONE) {
  return isBiuTimezone(value) ? value : isBiuTimezone(fallback) ? fallback : "UTC";
}
