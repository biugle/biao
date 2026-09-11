export const demoCredentials = { username: "admin", password: "admin" } as const;

export const demoAuth = {
  mode: "SSO" as const,
  required: true,
  loginRoute: "/Login",
  registerRoute: "/Login",
  authenticated: true,
  user: { id: "demo-user", name: "演示用户", role: "Portal User", extra: { source: "dev-demo" } },
};
