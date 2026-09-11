import type { BiuAuthConfig, BiuAuthContext, BiuRemoteAppResolvedConfig, BiuRuntimeConfig } from "./types.js";

/** Runtime-only resolution stays here; the protocol package remains framework independent. */
export function remoteAppFor(
  config: BiuRuntimeConfig,
  node: { appId?: string },
): BiuRemoteAppResolvedConfig & { url?: string } {
  const value = node.appId ? config.remoteApps?.[node.appId] : undefined;
  return {
    url: value?.APP_URL,
    allowedOrigins: value?.ALLOWED_ORIGINS ?? config.remoteAppOrigins,
    overlayMode: value?.OVERLAY_MODE ?? "IFRAME",
  };
}

export function authContextFor(config: Pick<BiuRuntimeConfig, "auth">): BiuAuthContext {
  const auth: BiuAuthConfig | undefined = config.auth;
  return {
    mode: auth?.mode ?? "NONE",
    authenticated: auth?.authenticated ?? Boolean(auth?.user),
    user: auth?.user,
  };
}
