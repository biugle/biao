import { messages as enUS } from "./en-US.js";
import { messages as zhCN } from "./zh-CN.js";

export type BiuLocale = "zh-CN" | "en-US" | (string & {});

export interface BiuLocaleOption {
  code: BiuLocale;
  label: string;
}

export interface BiuLanguageResource {
  key: BiuLocale;
  desc: string;
  translation: Record<string, string>;
}

export interface BiuI18nOptions {
  resources?: Record<string, BiuLanguageResource>;
  defaultLocale?: BiuLocale;
  fallbackLocale?: BiuLocale;
  storageKey?: string;
}

export const defaultBiuLocales: readonly BiuLocaleOption[] = [
  { code: "zh-CN", label: "简体中文" },
  { code: "en-US", label: "English" },
];

/** Normalize persisted/bridge locale values before they reach the UI. */
export function normalizeBiuLocale(
  value: unknown,
  supported: readonly BiuLocale[] = defaultBiuLocales.map((item) => item.code),
) {
  const candidates = supported.filter((item): item is BiuLocale => typeof item === "string" && item.trim().length > 0);
  const fallback = candidates.find((item) => item === "zh-CN") ?? candidates[0] ?? "zh-CN";
  if (typeof value !== "string" || !value.trim()) return fallback;
  const normalized = value.trim();
  return (
    candidates.find((item) => item === normalized) ??
    candidates.find((item) => item.toLowerCase() === normalized.toLowerCase()) ??
    candidates.find((item) => item.split("-")[0].toLowerCase() === normalized.toLowerCase()) ??
    fallback
  );
}

const builtinResources: Record<string, BiuLanguageResource> = {
  "zh-CN": { key: "zh-CN", desc: "简体中文", translation: zhCN },
  "en-US": { key: "en-US", desc: "English", translation: enUS },
};

function interpolate(value: string, params: Record<string, string | number> = {}) {
  return value.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
}

export function getBrowserLocale(supported: readonly BiuLocale[] = ["zh-CN", "en-US"]): BiuLocale {
  const browser = typeof navigator !== "undefined" ? navigator.language : "en-US";
  const match =
    supported.find((locale) => locale.toLowerCase() === browser.toLowerCase()) ??
    supported.find((locale) => locale.split("-")[0].toLowerCase() === browser.split("-")[0].toLowerCase());
  return match ?? supported[0] ?? "zh-CN";
}

export interface BiuI18n {
  readonly locale: BiuLocale;
  setLocale(locale: BiuLocale): BiuI18n;
  getLocale(): BiuLocale;
  getLocaleList(): BiuLocaleOption[];
  getTranslations(locale?: BiuLocale): Record<string, string>;
  addLocale(resource: BiuLanguageResource): BiuI18n;
  removeLocale(locale: BiuLocale): BiuI18n;
  $t(key: string, params?: Record<string, string | number>, locale?: BiuLocale): string;
}

/**
 * Small resource-oriented i18n core. It keeps the useful parts of the
 * reference implementation (resources, language list, runtime switching,
 * interpolation and fallback) without introducing a dependency into the
 * foundation package.
 */
export function createI18n(initialLocale?: BiuLocale, options: BiuI18nOptions = {}): BiuI18n {
  const resources = new Map<string, BiuLanguageResource>(
    Object.entries({ ...builtinResources, ...(options.resources ?? {}) }),
  );
  const fallbackLocale = options.fallbackLocale ?? "zh-CN";
  const storageKey = options.storageKey;
  const supported = [...resources.keys()] as BiuLocale[];
  let currentLocale = normalizeBiuLocale(
    initialLocale ??
      options.defaultLocale ??
      (storageKey && typeof localStorage !== "undefined" ? localStorage.getItem(storageKey) : null) ??
      getBrowserLocale(supported),
    supported,
  );

  const persist = () => {
    if (storageKey && typeof localStorage !== "undefined") localStorage.setItem(storageKey, currentLocale);
  };
  return {
    get locale() {
      return currentLocale;
    },
    setLocale(locale) {
      currentLocale = normalizeBiuLocale(locale, [...resources.keys()] as BiuLocale[]);
      persist();
      return this;
    },
    getLocale() {
      return currentLocale;
    },
    getLocaleList() {
      return [...resources.values()].map(({ key, desc }) => ({ code: key, label: desc }));
    },
    getTranslations(locale = currentLocale) {
      return resources.get(locale)?.translation ?? {};
    },
    addLocale(resource) {
      resources.set(resource.key, resource);
      return this;
    },
    removeLocale(locale) {
      if (locale !== fallbackLocale) resources.delete(locale);
      return this;
    },
    $t(key, params, locale = currentLocale) {
      const value =
        locale === "zh-CN"
          ? (resources.get(locale)?.translation[key] ?? resources.get(fallbackLocale)?.translation[key] ?? key)
          : (resources.get(locale)?.translation[key] ??
            resources.get("en-US")?.translation[key] ??
            resources.get(fallbackLocale)?.translation[key] ??
            key);
      return interpolate(value, params);
    },
  };
}

/** Non-React utilities use this stable resource registry. */
export const i18n = createI18n();
