# biu CLI Demo Workspace

This is the shared development and regression workspace, not a deployable business project. The default acceptance projects are under `apps/` and keep Portal and APP deployment independent:

- `apps/main-a`: Portal A, Sidebar layout, default port 9001.
- `apps/main-b`: Portal B, Topbar layout, default port 9002.
- `apps/child-app`: independent React APP, default port 8001.
- `apps/vue-child`: independent Vue 3 APP, default port 8002.
- `apps/html-child`: independent HTML APP, default port 8003.
- `apps/layout-custom`: independent React Custom APP, default port 8007.
- `packages/shared`: shared Demo types and helpers.

```bash
pnpm start --filter main-a
pnpm start --filter main-b
pnpm start --filter child-app
pnpm start --filter vue-child
pnpm start --filter html-child
pnpm start --filter layout-custom
pnpm start --filter main-a -- --apps ../child-app,../vue-child
```

This workspace can be installed independently. Its workspace file includes `apps/*`, `packages/*` and local `@biugle/*` foundation packages. Do not treat `.biu/` or `dist/` as source code.
