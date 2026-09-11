# Portal Demo: main-a and main-b

This Demo contains two peer Portals and independent APPs:

- `main-a`: Sidebar Portal with Tabs enabled, default port 9001.
- `main-b`: Topbar Portal, default port 9002.
- `child-app`: React APP with PageA and PageB, default port 8001.
- `vue-child`: Vue 3 APP with VuePage, default port 8002.
- `html-child`: native HTML APP, default port 8003.
- `layout-custom`: independent React Custom APP, default port 8007.

Start the two Portals and local APPs with:

```bash
pnpm start --filter main-a -- --apps ../child-app,../vue-child
pnpm start --filter main-b
pnpm start --filter layout-custom
```

Portal does not bundle APP source. It reads `remoteApps.APP_URL` from the current environment and loads the independent APP boundary. Every project emits its own `dist/index.html` and can be deployed to a separate domain.
