import type { LayoutContentProps } from "@biugle/biu-runtime";
import { LayoutFrame } from "./core.js";
export function MobileLayout(props: LayoutContentProps) {
  return <LayoutFrame className="biu-mobile" {...props} />;
}
