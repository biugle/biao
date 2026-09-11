# Clean Acceptance

## Purpose

Review source, configuration, documentation and the latest verification output. `.biu/` and `dist/` are generated and ignored; they are not source or release files.

## Recommended sequence

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm lint
pnpm format:check
pnpm audit:unused
pnpm verify:scenarios
pnpm build:demo:all
```

Start Portal A/B, React APP, Vue APP, HTML APP and Custom React independently or use the Portal `--apps` local orchestration. Verify root deep links, complete menu URLs, auth, locale/theme/timezone/direction, Tabs, Breadcrumbs, menus, overlays and responsive behavior.

Before release, remove local `node_modules`, `dist`, `.biu`, logs and coverage only after stopping services. CI installs again from the frozen lockfile. Do not commit generated `.husky/_` directories.
