import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type BiuDrawerPlacement = "left" | "right" | "top" | "bottom";

export interface BiuDrawerProps {
  open: boolean;
  title?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  placement?: BiuDrawerPlacement;
  size?: string | number;
  closeOnOutside?: boolean;
  closeLabel?: string;
}

/** A framework-level drawer. Its content and data-loading lifecycle stay app-owned. */
export function BiuDrawer({
  open,
  title,
  children,
  onClose,
  placement = "right",
  size = 420,
  closeOnOutside = true,
  closeLabel = "Close",
}: BiuDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div
      className="biu-drawer-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (closeOnOutside && event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`biu-drawer biu-drawer-${placement}`}
        style={{
          [placement === "left" || placement === "right" ? "width" : "height"]:
            typeof size === "number" ? `${size}px` : size,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
      >
        <header className="biu-drawer-header">
          <h2>{title}</h2>
          <button type="button" className="biu-modal-close" aria-label={closeLabel} onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="biu-drawer-body">{children}</div>
      </section>
    </div>,
    document.body,
  );
}
