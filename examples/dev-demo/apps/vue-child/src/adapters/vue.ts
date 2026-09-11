import { createApp, type Component } from "vue";
import type { BiuFrameworkAdapter } from "@biugle/biu-runtime";

const vueAdapter: BiuFrameworkAdapter = {
  framework: "vue",
  loadPage(module) {
    if (module && typeof module === "object" && "default" in module) return (module as { default: unknown }).default;
    return module;
  },
  renderPage(container, page, context) {
    if (!page || typeof page !== "object") throw new Error(`Vue 页面模块无效：${context.code}`);
    const app = createApp(page as Component, { context });
    app.mount(container);
    return () => app.unmount();
  },
};

export default vueAdapter;
