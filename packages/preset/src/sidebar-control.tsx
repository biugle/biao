import { Glyph } from "./layout-components.js";

export function SidebarHeaderControl({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: "forward" | "back";
  onClick: () => void;
}) {
  return (
    <button type="button" className="biu-sidebar-header-control" aria-label={label} title={label} onClick={onClick}>
      <Glyph name={icon} />
    </button>
  );
}
