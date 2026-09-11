export interface BiuDocumentTitleInput {
  menuTitle?: string;
  menuCode?: string;
  systemTitle?: string;
  brandLabel?: string;
  portalCode?: string;
  appId?: string;
  fallback?: string;
}

/** Resolve a stable, readable browser title without leaking an empty config value. */
export function resolveDocumentTitle(input: BiuDocumentTitleInput) {
  const prefix =
    [input.systemTitle, input.brandLabel, input.portalCode, input.appId, input.fallback]
      .map((value) => value?.trim())
      .find(Boolean) || "Biu 应用";
  const page = [input.menuTitle, input.menuCode].map((value) => value?.trim()).find(Boolean);
  return page && page !== prefix ? `${prefix} - ${page}` : prefix;
}
