import { i18n, type BiuLocale } from "@biugle/biu-i18n";

/** Small safe fallback shown when a Portal has no custom Home page. */
export function BiuDefaultHome({
  appName,
  portalCode,
  locale,
}: {
  appName?: string;
  portalCode?: string;
  locale?: BiuLocale;
}) {
  return (
    <section className="biu-default-home" aria-labelledby="biu-default-home-title">
      <p>{i18n.$t("BIU 基座", undefined, locale)}</p>
      <h1 id="biu-default-home-title">
        {i18n.$t("欢迎使用 {app}", { app: appName || i18n.$t("门户", undefined, locale) }, locale)}
      </h1>
      <span>{portalCode || i18n.$t("请选择菜单", undefined, locale)}</span>
    </section>
  );
}
