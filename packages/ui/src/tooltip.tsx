import React, { useLayoutEffect, useRef, useState } from "react";

export type BiuTooltipPlacement = "TOP_RIGHT" | "TOP_LEFT" | "BOTTOM_RIGHT" | "BOTTOM_LEFT" | "RIGHT" | "LEFT";

export interface BiuTooltipOptions {
  /** Only show the tooltip when the wrapped text is actually clipped. */
  onlyOverflow?: boolean;
  placement?: BiuTooltipPlacement;
}

export interface BiuTooltipProps {
  content: string;
  children: React.ReactNode;
  onlyOverflow?: boolean;
  placement?: BiuTooltipPlacement;
}

/** Tooltip host. The layout-level synchronizer provides viewport collision avoidance. */
export function BiuTooltip({ content, children, onlyOverflow = true, placement = "TOP_RIGHT" }: BiuTooltipProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(!onlyOverflow);
  useLayoutEffect(() => {
    const update = () => {
      if (!onlyOverflow) {
        setVisible(true);
        return;
      }
      const host = hostRef.current;
      const target = host?.firstElementChild instanceof HTMLElement ? host.firstElementChild : host;
      setVisible(
        Boolean(
          target && (target.scrollWidth > target.clientWidth + 1 || target.scrollHeight > target.clientHeight + 1),
        ),
      );
    };
    update();
    const observedHost = hostRef.current;
    const observedTarget =
      observedHost?.firstElementChild instanceof HTMLElement ? observedHost.firstElementChild : observedHost;
    const observer = typeof ResizeObserver === "undefined" || !observedHost ? undefined : new ResizeObserver(update);
    if (observer && observedHost) {
      observer.observe(observedHost);
      if (observedTarget && observedTarget !== observedHost) observer.observe(observedTarget);
    }
    return () => observer?.disconnect();
  }, [content, onlyOverflow]);
  return (
    <span
      ref={hostRef}
      className="biu-tooltip-host"
      data-biu-tooltip={visible ? content : undefined}
      data-biu-tooltip-content={content}
      data-biu-tooltip-force={onlyOverflow ? undefined : "true"}
      data-biu-tooltip-placement={placement}
    >
      {children}
    </span>
  );
}
