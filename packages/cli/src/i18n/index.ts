import { messages as enUS } from "./en-US.js";
import { messages as zhCN, type MessageKey } from "./zh-CN.js";

export type BiuLocale = "zh-CN" | "en-US";

let currentLocale: BiuLocale = resolveLocale(process.env.BIU_LOCALE);

function resolveLocale(value: string | undefined): BiuLocale {
  return value === "en-US" ? "en-US" : "zh-CN";
}

export function setLocale(value: string | undefined) {
  if (!value) return;
  if (value && value !== "zh-CN" && value !== "en-US") {
    throw new Error(t("--lang 只支持 zh-CN 或 en-US"));
  }
  currentLocale = resolveLocale(value);
}

export function getLocale(): BiuLocale {
  return currentLocale;
}

export function t(key: MessageKey, params: Record<string, string | number> = {}) {
  const template = (currentLocale === "en-US" ? enUS[key] : zhCN[key]) ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
}
