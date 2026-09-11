import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface BiuModalProps {
  open: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  closeOnOutside?: boolean;
  ariaLabel?: string;
  closeLabel?: string;
}

/** A framework-level modal. Business forms and data remain application-owned. */
export function BiuModal({
  open,
  title,
  children,
  onClose,
  closeOnOutside = true,
  ariaLabel,
  closeLabel = "Close",
}: BiuModalProps) {
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
      className="biu-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (closeOnOutside && event.target === event.currentTarget) onClose();
      }}
    >
      <section className="biu-modal" role="dialog" aria-modal="true" aria-label={ariaLabel}>
        <header className="biu-modal-header">
          <h2>{title}</h2>
          <button type="button" className="biu-modal-close" aria-label={closeLabel} onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="biu-modal-body">{children}</div>
      </section>
    </div>,
    document.body,
  );
}
