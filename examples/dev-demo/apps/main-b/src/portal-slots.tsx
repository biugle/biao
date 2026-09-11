import { useState } from "react";
import { useBiuAuthContext, useBiuContext, useBiuI18n, type BiuPortalSlots } from "@biugle/biu-runtime";
import { biuMessage } from "@biugle/biu-ui";
import { Glyph, HeaderMenuItem } from "@biugle/biu-preset/toolbar";
import DemoAuthPage from "./pages/Login";
import { demoCredentials } from "./mock/auth";
import { demoText } from "./mock/copy";
import "./portal-slots.css";

const timezoneOptions = [
  { code: "Asia/Shanghai", label: "UTC+08 · Shanghai" },
  { code: "Europe/London", label: "UTC+00 · London" },
  { code: "America/New_York", label: "UTC-05 · New York" },
];

function TimezoneMenu({ close }: { close: () => void }) {
  const { timezone, setTimezone } = useBiuContext();
  return (
    <>
      {timezoneOptions.map((option) => (
        <HeaderMenuItem
          key={option.code}
          icon={<Glyph name="clock" />}
          active={option.code === timezone}
          onClick={() => {
            setTimezone(option.code);
            close();
          }}
        >
          {option.label}
        </HeaderMenuItem>
      ))}
    </>
  );
}

function DemoWorkbar() {
  const { $t } = useBiuI18n();
  const [value, setValue] = useState("");
  return (
    <label className="biu-demo-workbar">
      <Glyph name="search" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={$t("门户工作栏")}
        aria-label={$t("门户工作栏")}
      />
    </label>
  );
}

function ProfilePanel({ close }: { close: () => void }) {
  const { $t } = useBiuI18n();
  const { auth, setAuth } = useBiuAuthContext();
  const [name, setName] = useState(auth?.user?.name || "");
  const user = auth?.user;
  return (
    <form
      className="biu-account-panel-form"
      onSubmit={(event) => {
        event.preventDefault();
        setAuth(
          auth
            ? { ...auth, user: { ...user, id: user?.id || "demo-user", name, role: user?.role, extra: user?.extra } }
            : auth,
        );
        biuMessage.success($t("个人信息已保存"));
        close();
      }}
    >
      <label>
        {$t("姓名")}
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        {$t("角色")}
        <input value={user?.role || "-"} readOnly />
      </label>
      <button type="submit">{$t("保存")}</button>
    </form>
  );
}

function PasswordPanel({ close }: { close: () => void }) {
  const { $t, locale } = useBiuI18n();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  return (
    <form
      className="biu-account-panel-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (current !== demoCredentials.password || !next.trim()) {
          biuMessage.error($t("当前密码不正确或新密码为空"));
          return;
        }
        biuMessage.success(demoText(locale, "passwordChanged"));
        close();
      }}
    >
      <label>
        {$t("当前密码")}
        <input
          type="password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          autoComplete="current-password"
        />
      </label>
      <label>
        {$t("新密码")}
        <input
          type="password"
          value={next}
          onChange={(event) => setNext(event.target.value)}
          autoComplete="new-password"
        />
      </label>
      <button type="submit">{$t("保存")}</button>
    </form>
  );
}

const portalSlots: BiuPortalSlots = {
  authPage: DemoAuthPage,
  profilePanel: (close) => <ProfilePanel close={close} />,
  passwordPanel: (close) => <PasswordPanel close={close} />,
  workbar: <DemoWorkbar />,
  toolbarActions: [
    {
      code: "timezone",
      label: "时区",
      labelKey: "时区",
      value: ({ timezone }) => timezone || "Asia/Shanghai",
      tooltip: "Switch time zone",
      tooltipKey: "切换时区",
      icon: <Glyph name="clock" />,
      content: (close) => <TimezoneMenu close={close} />,
    },
  ],
};

export default portalSlots;
