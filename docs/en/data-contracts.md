# Data Contracts

This document defines the data boundary between the foundation, Portals, APPs and backend services. Demo `src/mock/` files are examples only; production projects must use SSO, permission and business services.

## Common response

```json
{ "code": 0, "message": "", "data": {} }
```

Only `code === 0` is success. Error details must not include request headers, cookies, tokens, passwords or session IDs.

## Menus and permissions

Menu and directory APIs receive the current `locale` and return `DIRECTORY`/`MENU` nodes. The stable identity is the complete Code chain, for example:

```text
menuKey: system-config/system-basic/PageA
routePath: /system-config/system-basic/PageA
```

Titles can change with locale; Codes and paths must not. Repeated leaf Codes require `navigateByKey`. Permission failures use fail-closed behavior when the permission API is enabled.

## Locale resources

```json
{
  "code": 0,
  "data": {
    "key": "en-US",
    "translation": { "系统配置": "System configuration" }
  }
}
```

Missing values fall back to English, Chinese and then the key. Invalid locale values fall back to `zh-CN`.

## Portal and APP

```ts
remoteApps: {
  "child-app": {
    APP_URL: "https://app.example.com",
    ALLOWED_ORIGINS: ["https://app.example.com"],
    OVERLAY_MODE: "IFRAME",
    VERSION: "1.0.0"
  }
}
```

Cross-origin APPs require an exact allowed Origin. Portal and APP are built and deployed separately.

## Auth and user data

The foundation exposes `login`, `logout`, `refreshAuth` and `setAuth`. It stores only non-sensitive identity data. Tokens, cookies, passwords and session IDs remain in SSO or the gateway. `extra` is reserved for non-sensitive project metadata.

## Scoped client state

- Favorites: localStorage, scoped by Portal and environment, up to 100.
- Recent items: localStorage, same scope, up to 10.
- Tabs: sessionStorage, same scope.
- Locale, theme, direction and timezone: sessionStorage, same scope.

Old favorites and recent records are retained and handled by the page-not-found fallback if a menu changes.

## Bridge and updates

Bridge payloads contain Portal Code, environment, locale, theme, direction, timezone, current Code and redacted auth only. Lifecycle values are `LOAD_START`, `READY`, `ERROR`, `UNLOAD`, `MOUNT`, `UNMOUNT`, `BEFORE`, `AFTER` and `ERROR`. Update manifests contain build IDs and asset metadata, never user credentials.
