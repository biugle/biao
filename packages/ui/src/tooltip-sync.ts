import { useEffect } from "react";

export function useBiuTooltipSync(onlyOverflow: boolean, placement: string) {
  useEffect(() => {
    const layout = document.querySelector<HTMLElement>(".biu-layout");
    if (!layout) return;
    let active: HTMLElement | undefined;
    let popup: HTMLDivElement | undefined;
    const selectors =
      ".biu-record-item, .biu-menu-label, .biu-menu-group-label, .biu-tab-label, .biu-user-name, .biu-system-label, .biu-breadcrumb-path, .biu-breadcrumb-current, .biu-breadcrumb-node";
    const getAnchor = (element: HTMLElement) =>
      element.matches(selectors) ? element : element.querySelector<HTMLElement>(selectors) || element;
    const hidePopup = () => {
      popup?.remove();
      popup = undefined;
      active = undefined;
    };
    const positionPopup = () => {
      if (!active || !popup) return;
      const rect = getAnchor(active).getBoundingClientRect();
      const tip = popup.getBoundingClientRect();
      const gap = 8;
      const edge = 8;
      const requested = popup.dataset.biuTooltipPlacement || "TOP_RIGHT";
      const candidates = [requested, "BOTTOM_RIGHT", "TOP_LEFT", "BOTTOM_LEFT", "RIGHT", "LEFT"];
      const fits = (candidate: string) =>
        candidate.startsWith("TOP")
          ? rect.top - tip.height - gap >= edge
          : candidate.startsWith("BOTTOM")
            ? rect.bottom + tip.height + gap <= window.innerHeight - edge
            : candidate === "RIGHT"
              ? rect.right + tip.width + gap <= window.innerWidth - edge
              : rect.left - tip.width - gap >= edge;
      const selected = candidates.find(fits) || "BOTTOM_RIGHT";
      const width = tip.width;
      let left = rect.right - width;
      let top = rect.top - tip.height - gap;
      if (selected === "TOP_LEFT" || selected === "BOTTOM_LEFT") left = rect.left;
      if (selected === "BOTTOM_RIGHT" || selected === "BOTTOM_LEFT") top = rect.bottom + gap;
      if (selected === "RIGHT") {
        left = rect.right + gap;
        top = rect.top + (rect.height - tip.height) / 2;
      }
      if (selected === "LEFT") {
        left = rect.left - width - gap;
        top = rect.top + (rect.height - tip.height) / 2;
      }
      popup.dataset.biuTooltipPlacement = selected;
      popup.style.left = `${Math.max(edge, Math.min(left, window.innerWidth - width - edge))}px`;
      popup.style.top = `${Math.max(edge, Math.min(top, window.innerHeight - tip.height - edge))}px`;
    };
    const showPopup = (element: HTMLElement) => {
      const text = element.dataset.biuTooltip;
      if (!text) return;
      hidePopup();
      active = element;
      popup = document.createElement("div");
      popup.className = "biu-tooltip-popup";
      popup.textContent = text;
      popup.dataset.biuTooltipPlacement = element.dataset.biuTooltipPlacement || placement;
      document.body.appendChild(popup);
      positionPopup();
    };
    const sync = () => {
      layout.querySelectorAll<HTMLElement>("[title]").forEach((element) => {
        const value = element.getAttribute("title");
        if (value) {
          element.dataset.biuTooltipContent = value;
          element.removeAttribute("title");
        }
      });
      layout.querySelectorAll<HTMLElement>("[data-biu-tooltip-content]").forEach((element) => {
        const target = element.matches(selectors) ? element : element.querySelector<HTMLElement>(selectors);
        const force = element.dataset.biuTooltipForce === "true";
        const overflowing = Boolean(
          target && (target.scrollWidth > target.clientWidth + 1 || target.scrollHeight > target.clientHeight + 1),
        );
        if (force || !onlyOverflow || overflowing) element.dataset.biuTooltip = element.dataset.biuTooltipContent || "";
        else delete element.dataset.biuTooltip;
        element.dataset.biuTooltipPlacement = placement;
        element.dataset.biuTooltipRuntime = "true";
      });
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(layout, { attributes: true, attributeFilter: ["title"], childList: true, subtree: true });
    const findElement = (target: EventTarget | null) =>
      target instanceof HTMLElement ? target.closest<HTMLElement>("[data-biu-tooltip]") : null;
    const onPointerOver = (event: PointerEvent) => {
      const element = findElement(event.target);
      if (element && !(event.relatedTarget instanceof Node && element.contains(event.relatedTarget)))
        showPopup(element);
    };
    const onPointerOut = (event: PointerEvent) => {
      if (active && !(event.relatedTarget instanceof Node && active.contains(event.relatedTarget))) hidePopup();
    };
    const onFocusIn = (event: FocusEvent) => {
      const element = findElement(event.target);
      if (element) showPopup(element);
    };
    const onFocusOut = () =>
      window.setTimeout(() => {
        if (active && !active.matches(":hover") && document.activeElement !== active) hidePopup();
      }, 0);
    layout.addEventListener("pointerover", onPointerOver);
    layout.addEventListener("pointerout", onPointerOut);
    layout.addEventListener("focusin", onFocusIn);
    layout.addEventListener("focusout", onFocusOut);
    window.addEventListener("resize", positionPopup);
    window.addEventListener("scroll", positionPopup, true);
    return () => {
      hidePopup();
      observer.disconnect();
      layout.removeEventListener("pointerover", onPointerOver);
      layout.removeEventListener("pointerout", onPointerOut);
      layout.removeEventListener("focusin", onFocusIn);
      layout.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("resize", positionPopup);
      window.removeEventListener("scroll", positionPopup, true);
    };
  }, [onlyOverflow, placement]);
}
