import React from "react";
import { createRoot } from "react-dom/client";
import { BiuDrawer } from "./drawer.js";
import { BiuModal } from "./modal.js";

export type FireControlledProps = { open: boolean; onClose: () => void };
export type FireComponent<Props extends object = Record<string, never>> = React.ComponentType<Props>;
export type FireHandle = { close: () => void };
type RuntimeComponent = React.ComponentType<FireControlledProps & Record<string, unknown>>;

function mount(render: (close: () => void) => React.ReactNode): FireHandle {
  if (typeof document === "undefined") return { close: () => undefined };
  const container = document.createElement("div");
  container.dataset.biuFire = "true";
  document.body.appendChild(container);
  let closed = false;
  const root = createRoot(container);
  const close = () => {
    if (closed) return;
    closed = true;
    root?.unmount();
    container.remove();
  };
  root.render(<>{render(close)}</>);
  return { close };
}

function mountComponent(Component: RuntimeComponent, props: object): FireHandle {
  return mount((close) =>
    React.createElement(Component, {
      ...(props as Record<string, unknown>),
      open: true,
      onClose: close,
    }),
  );
}

/** Mount any React node or component under body and return an imperative close handle. */
export function fire<Props extends FireControlledProps>(
  Component: FireComponent<Props>,
): (props: Omit<Props, keyof FireControlledProps>) => FireHandle;
export function fire<Props extends object>(Component: FireComponent<Props>): (props: Props) => FireHandle;
export function fire(node: React.ReactNode): FireHandle;
export function fire(target: React.ReactNode | FireComponent): FireHandle | ((props: object) => FireHandle) {
  if (typeof target === "function") {
    return (props: object = {}) => mountComponent(target as unknown as RuntimeComponent, props);
  }
  return mount(() => target);
}

export function fireRender(render: (close: () => void) => React.ReactNode): FireHandle {
  return mount(render);
}

export function fireNode(node: React.ReactNode): FireHandle {
  return fire(node);
}

export const modal = BiuModal;
export const drawer = BiuDrawer;
export const fireModal = fire(BiuModal);
export const fireDrawer = fire(BiuDrawer);
