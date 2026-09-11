export function demoText(locale: string | undefined, key: "invalid" | "hint" | "registerHint" | "passwordChanged") {
  const english = locale === "en-US";
  return {
    invalid: english ? "The demo username or password is incorrect." : "演示账号或密码错误",
    hint: english ? "Demo account: admin / admin" : "演示账号：admin / admin",
    registerHint: english
      ? "After registration, the demo identity will open the home page."
      : "注册完成后将使用演示身份进入首页",
    passwordChanged: english
      ? "Password changed. The demo account remains admin / admin."
      : "修改密码成功，演示账号仍为 admin / admin",
  }[key];
}
