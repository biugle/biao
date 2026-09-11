import React from "react";
import { createRoot, type Root } from "react-dom/client";

export interface ReactBiuAdapter {
  framework: "react";
  mount(container: Element, node: React.ReactNode): Root;
}

export const reactAdapter: ReactBiuAdapter = {
  framework: "react",
  mount(container, node) {
    const root = createRoot(container);
    root.render(node);
    return root;
  },
};

export function mountReactBiuApp(container: Element, node: React.ReactNode) {
  return reactAdapter.mount(container, node);
}
