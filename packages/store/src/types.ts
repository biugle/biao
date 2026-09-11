import type { BiuLocale } from "@biugle/biu-i18n";

export type BiuTheme = "light" | "dark" | "system";
export type BiuDirection = "ltr" | "rtl";

export interface BiuLayoutUser {
  name: string;
  role?: string;
  avatar?: string;
  id?: string;
}

export interface BiuAuthUser extends BiuLayoutUser {
  roles?: string[];
  permissions?: string[];
  /** Project-owned non-sensitive extensions. Credentials never belong here. */
  extra?: Record<string, unknown>;
}

export interface BiuAuthContext {
  mode: "SSO" | "NONE";
  authenticated: boolean;
  user?: BiuAuthUser;
}

export type BiuMenuMode = "STANDARD" | "MULTI_LEVEL";

export interface BiuTabSession {
  keys: string[];
  selectedKey?: string;
}

export interface BiuPreferenceValues {
  locale: BiuLocale;
  theme: BiuTheme;
  direction: BiuDirection;
  timezone: string;
}
