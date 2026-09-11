import { useState } from "react";
import { useBiuContext, useBiuI18n, type BiuAuthPageMode, type BiuAuthPageProps } from "@biugle/biu-runtime";
import { biuMessage } from "@biugle/biu-ui";
import { demoCredentials } from "../mock/auth";
import { demoText } from "../mock/copy";
import "./Login.css";

export function DemoAuthPage({ mode, onModeChange }: BiuAuthPageProps) {
  const { $t, locale } = useBiuI18n();
  const { setAuth, navigateByKey } = useBiuContext();
  const [username, setUsername] = useState<string>(demoCredentials.username);
  const [password, setPassword] = useState<string>(demoCredentials.password);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === "LOGIN" && (username !== demoCredentials.username || password !== demoCredentials.password)) {
      biuMessage.error(demoText(locale, "invalid"));
      return;
    }
    setAuth({
      mode: "SSO",
      authenticated: true,
      user: { id: "demo-user", name: "演示用户", role: "Portal User", extra: { source: "dev-demo" } },
    });
    biuMessage.success($t(mode === "LOGIN" ? "登录成功" : "注册成功，已进入首页"));
    navigateByKey("Overview", { replace: true });
  };
  return (
    <section className="biu-login-page">
      <form className="biu-login-card" onSubmit={submit}>
        <p className="biu-login-eyebrow">BIU AUTH</p>
        <h1>{$t(mode === "LOGIN" ? "登录" : "注册")}</h1>
        <p>{mode === "LOGIN" ? demoText(locale, "hint") : demoText(locale, "registerHint")}</p>
        <label>
          {$t("账号")}
          <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        </label>
        <label>
          {$t("密码")}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button type="submit">{$t(mode === "LOGIN" ? "登录" : "注册")}</button>
        <button
          type="button"
          className="biu-login-link"
          onClick={() => onModeChange((mode === "LOGIN" ? "REGISTER" : "LOGIN") as BiuAuthPageMode)}
        >
          {$t(mode === "LOGIN" ? "注册新账号" : "返回登录")}
        </button>
      </form>
    </section>
  );
}

export default DemoAuthPage;
