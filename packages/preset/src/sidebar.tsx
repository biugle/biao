import type { LayoutContentProps } from "@biugle/biu-runtime";
import { LayoutFrame } from "./core.js";
export function SidebarLayout(props: LayoutContentProps) {
  return <LayoutFrame className="biu-sidebar-layout" {...props} />;
}
