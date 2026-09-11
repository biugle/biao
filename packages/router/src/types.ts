import type { BiuLocale } from "@biugle/biu-i18n";

export type MenuType = "DIRECTORY" | "MENU";
export type MenuTarget = "APP" | "PORTAL";

export interface MenuNode {
  code: string;
  type: MenuType;
  icon?: string;
  titleKey?: string;
  path?: string;
  target?: MenuTarget;
  permissionCode?: string;
  permissionType?: "DIRECTORY" | "MENU" | "COMPONENT";
  appId?: string;
  appPath?: string;
  version?: string;
  meta?: Record<string, unknown>;
  children?: MenuNode[];
}

export interface BiuMenuRecord {
  key: string;
  code: string;
  title: string;
  path: string;
  /** Localized hierarchy shown in favorites/recent panels. */
  titlePath?: string;
  target?: MenuTarget;
  appId?: string;
  appPath?: string;
}

export interface BiuRuntimeMenuConfig {
  portalTreeUrl?: string;
  directoryTreeUrl?: string;
  permissionCodesUrl?: string;
  headers?: Record<string, string>;
  requestTimeoutMs?: number;
}

/** Minimal config consumed by router/menu APIs; Runtime can extend it freely. */
export interface BiuRouterConfig {
  locale?: BiuLocale;
  portalCode?: string;
  menuRootCode?: string;
  fallbackMenus?: MenuNode[];
  menu?: BiuRuntimeMenuConfig;
}
