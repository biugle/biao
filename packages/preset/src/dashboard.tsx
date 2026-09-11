import type { LayoutContentProps } from "@biugle/biu-runtime";
import { LayoutFrame } from "./core.js";
export function DashboardLayout(props: LayoutContentProps) {
  return <LayoutFrame className="biu-dashboard" {...props} />;
}
