import { create } from "zustand";
import type { BiuMenuRecord, MenuNode } from "@biugle/biu-router";
import type { BiuMenuMode } from "../types.js";
export type { BiuMenuMode } from "../types.js";

interface MenuStoreState {
  directoryCodes: string[];
  directoryParents: Record<string, string | undefined>;
  collapsedCodes: string[];
  accordion: boolean;
  showMenuTitle: boolean;
  menuMode: BiuMenuMode;
  showTopSearch: boolean;
  selectedGroupCode?: string;
  storageScope: string;
  favorites: BiuMenuRecord[];
  recent: BiuMenuRecord[];
  setTree: (menus: MenuNode[]) => void;
  setDirectoryScope: (menus: MenuNode[]) => void;
  isExpanded: (code: string) => boolean;
  toggleDirectory: (code: string) => void;
  expandDirectories: (codes: string[]) => void;
  setAllExpanded: () => void;
  setAllCollapsed: () => void;
  setAccordion: (value: boolean) => void;
  setShowMenuTitle: (value: boolean) => void;
  setMenuMode: (value: BiuMenuMode) => void;
  setShowTopSearch: (value: boolean) => void;
  setSelectedGroupCode: (code?: string) => void;
  setStorageScope: (scope: string) => void;
  toggleFavorite: (record: BiuMenuRecord) => void;
  isFavorite: (key: string) => boolean;
  addRecent: (record: BiuMenuRecord) => void;
  clearRecent: () => void;
}

const STORAGE_PREFIX = "BIU_MENU_STATE:";
const MAX_FAVORITES = 100;
const MAX_RECENT = 10;

function storageKey(scope: string) {
  return `${STORAGE_PREFIX}${encodeURIComponent(scope.trim() || "default")}`;
}

type PersistedMenuState = Pick<
  MenuStoreState,
  | "favorites"
  | "recent"
  | "collapsedCodes"
  | "accordion"
  | "showMenuTitle"
  | "menuMode"
  | "showTopSearch"
  | "selectedGroupCode"
>;

function readStored(scope: string): Partial<PersistedMenuState> {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(
      window.localStorage.getItem(storageKey(scope)) || "null",
    ) as Partial<MenuStoreState> | null;
    return {
      favorites: Array.isArray(value?.favorites) ? value.favorites.slice(0, MAX_FAVORITES) : [],
      recent: Array.isArray(value?.recent) ? value.recent.slice(0, MAX_RECENT) : [],
      collapsedCodes: Array.isArray(value?.collapsedCodes)
        ? value.collapsedCodes.filter((code): code is string => typeof code === "string")
        : [],
      accordion: typeof value?.accordion === "boolean" ? value.accordion : undefined,
      showMenuTitle: typeof value?.showMenuTitle === "boolean" ? value.showMenuTitle : undefined,
      menuMode: value?.menuMode === "STANDARD" || value?.menuMode === "MULTI_LEVEL" ? value.menuMode : undefined,
      showTopSearch: typeof value?.showTopSearch === "boolean" ? value.showTopSearch : undefined,
      selectedGroupCode: typeof value?.selectedGroupCode === "string" ? value.selectedGroupCode : undefined,
    };
  } catch {
    return {};
  }
}

function writeStored(scope: string, state: PersistedMenuState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      storageKey(scope),
      JSON.stringify({
        favorites: state.favorites,
        recent: state.recent,
        collapsedCodes: state.collapsedCodes,
        accordion: state.accordion,
        showMenuTitle: state.showMenuTitle,
        menuMode: state.menuMode,
        showTopSearch: state.showTopSearch,
        selectedGroupCode: state.selectedGroupCode,
      }),
    );
  } catch {
    // Private mode and storage quota failures must not break navigation.
  }
}

function persistState(state: MenuStoreState, values: Partial<PersistedMenuState> = {}) {
  writeStored(state.storageScope, {
    favorites: values.favorites ?? state.favorites,
    recent: values.recent ?? state.recent,
    collapsedCodes: values.collapsedCodes ?? state.collapsedCodes,
    accordion: values.accordion ?? state.accordion,
    showMenuTitle: values.showMenuTitle ?? state.showMenuTitle,
    menuMode: values.menuMode ?? state.menuMode,
    showTopSearch: values.showTopSearch ?? state.showTopSearch,
    selectedGroupCode: values.selectedGroupCode ?? state.selectedGroupCode,
  });
}

interface DirectoryScopeEntry {
  key: string;
  parentKey: string;
}

function directoryScope(nodes: MenuNode[], parentKey = ""): DirectoryScopeEntry[] {
  return nodes.flatMap((node) => {
    const metaKey = node.meta?.__BIU_MENU_KEY;
    const key = typeof metaKey === "string" && metaKey ? metaKey : parentKey ? `${parentKey}/${node.code}` : node.code;
    return node.type === "DIRECTORY" ? [{ key, parentKey }, ...directoryScope(node.children ?? [], key)] : [];
  });
}

function scopeState(nodes: MenuNode[]) {
  const entries = directoryScope(nodes);
  return {
    directoryCodes: entries.map((entry) => entry.key),
    directoryParents: Object.fromEntries(entries.map((entry) => [entry.key, entry.parentKey])),
  };
}

/** Menu interaction preferences stay separate from locale/theme/auth state. */
export const useBiuMenuStore = create<MenuStoreState>((set, get) => ({
  directoryCodes: [],
  directoryParents: {},
  collapsedCodes: [],
  accordion: false,
  showMenuTitle: true,
  menuMode: "STANDARD",
  showTopSearch: false,
  setTree: (menus) =>
    set((state) => {
      const scope = scopeState(menus);
      const next = {
        ...scope,
        collapsedCodes: state.collapsedCodes.filter((code) => scope.directoryCodes.includes(code)),
      };
      persistState({ ...state, ...next });
      return next;
    }),
  /**
   * Limit expand/collapse actions to the collection currently visible in the
   * right-hand menu pane. The runtime registers the complete tree on load;
   * multi-level layouts replace this scope when the first-level group changes.
   */
  setDirectoryScope: (menus) =>
    set((state) => {
      const scope = scopeState(menus);
      // Keep the collapse state of other first-level groups. The actions below
      // still operate only on this scope, so switching groups does not reset a
      // user's menu choices or affect another right-hand pane.
      return { ...scope, collapsedCodes: state.collapsedCodes };
    }),
  isExpanded: (code) => !get().collapsedCodes.includes(code),
  toggleDirectory: (code) =>
    set((state) => {
      const collapsed = new Set(state.collapsedCodes);
      if (state.accordion) {
        const parentKey = state.directoryParents[code];
        const siblings = state.directoryCodes.filter((other) => state.directoryParents[other] === parentKey);
        const hasOtherExpanded = siblings.some((other) => other !== code && !collapsed.has(other));
        if (collapsed.has(code) || hasOtherExpanded) {
          for (const other of siblings) if (other !== code) collapsed.add(other);
          collapsed.delete(code);
        } else {
          collapsed.add(code);
        }
      } else if (collapsed.has(code)) {
        collapsed.delete(code);
      } else {
        collapsed.add(code);
      }
      const collapsedCodes = [...collapsed];
      persistState({ ...state, collapsedCodes });
      return { collapsedCodes };
    }),
  expandDirectories: (codes) =>
    set((state) => {
      if (!codes.length) return state;
      const visible = new Set(state.directoryCodes);
      const collapsedCodes = state.collapsedCodes.filter((code) => !codes.includes(code) || !visible.has(code));
      if (collapsedCodes.length === state.collapsedCodes.length) return state;
      persistState({ ...state, collapsedCodes });
      return { collapsedCodes };
    }),
  setAllExpanded: () =>
    set((state) => {
      const collapsedCodes = state.collapsedCodes.filter((code) => !state.directoryCodes.includes(code));
      persistState({ ...state, collapsedCodes });
      return { collapsedCodes };
    }),
  setAllCollapsed: () =>
    set((state) => {
      const collapsedCodes = [...new Set([...state.collapsedCodes, ...state.directoryCodes])];
      persistState({ ...state, collapsedCodes });
      return { collapsedCodes };
    }),
  setAccordion: (value) =>
    set((state) => {
      if (!value) {
        persistState({ ...state, accordion: false });
        return { accordion: false };
      }
      const openParents = new Set<string | undefined>();
      const collapsedCodes = new Set(state.collapsedCodes);
      for (const code of state.directoryCodes) {
        const parentKey = state.directoryParents[code];
        if (collapsedCodes.has(code) || openParents.has(parentKey)) collapsedCodes.add(code);
        else openParents.add(parentKey);
      }
      const next = { accordion: true, collapsedCodes: [...collapsedCodes] };
      persistState({ ...state, ...next });
      return next;
    }),
  setShowMenuTitle: (value) =>
    set((state) => {
      persistState({ ...state, showMenuTitle: value });
      return { showMenuTitle: value };
    }),
  setMenuMode: (value) =>
    set((state) => {
      persistState({ ...state, menuMode: value });
      return { menuMode: value };
    }),
  setShowTopSearch: (value) =>
    set((state) => {
      persistState({ ...state, showTopSearch: value });
      return { showTopSearch: value };
    }),
  setSelectedGroupCode: (code) =>
    set((state) => {
      persistState({ ...state, selectedGroupCode: code });
      return { selectedGroupCode: code };
    }),
  storageScope: "default",
  favorites: [],
  recent: [],
  setStorageScope: (scope) =>
    set((state) => {
      const storageScope = scope.trim() || "default";
      if (state.storageScope === storageScope) return state;
      const stored = readStored(storageScope);
      return {
        storageScope,
        directoryCodes: [],
        directoryParents: {},
        collapsedCodes: stored.collapsedCodes ?? [],
        accordion: stored.accordion ?? false,
        showMenuTitle: stored.showMenuTitle ?? true,
        menuMode: stored.menuMode ?? "STANDARD",
        showTopSearch: stored.showTopSearch ?? false,
        selectedGroupCode: stored.selectedGroupCode,
        favorites: stored.favorites ?? [],
        recent: stored.recent ?? [],
      };
    }),
  toggleFavorite: (record) =>
    set((state) => {
      const exists = state.favorites.some((item) => item.key === record.key);
      const favorites = exists
        ? state.favorites.filter((item) => item.key !== record.key)
        : [record, ...state.favorites].slice(0, MAX_FAVORITES);
      persistState({ ...state, favorites });
      return { favorites };
    }),
  isFavorite: (key) => get().favorites.some((item) => item.key === key),
  addRecent: (record) =>
    set((state) => {
      const recent = [record, ...state.recent.filter((item) => item.key !== record.key)].slice(0, MAX_RECENT);
      persistState({ ...state, recent });
      return { recent };
    }),
  clearRecent: () =>
    set((state) => {
      persistState({ ...state, recent: [] });
      return { recent: [] };
    }),
}));
