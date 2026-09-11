export type DemoDeploymentKind = "PORTAL" | "APP";

export function isSafeCode(value: string) {
  return /^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/.test(value);
}
