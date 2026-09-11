import type { LayoutContentProps } from "@biugle/biu-runtime";
import { LayoutFrame } from "./core.js";
export function BlankLayout(props: LayoutContentProps) {
  return <LayoutFrame className="biu-blank" {...props} />;
}
