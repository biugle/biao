import type { LayoutContentProps } from "@biugle/biu-runtime";
import { LayoutFrame } from "./core.js";
export function TopbarLayout(props: LayoutContentProps) {
  return <LayoutFrame className="biu-topbar" {...props} />;
}
