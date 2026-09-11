# @biugle/biu-preset

Official React layout presets for Portal and independent APP projects.

## Available entry points

- @biugle/biu-preset/sidebar
- @biugle/biu-preset/topbar
- @biugle/biu-preset/blank
- @biugle/biu-preset/dashboard
- @biugle/biu-preset/mobile
- @biugle/biu-preset/custom
- @biugle/biu-preset/toolbar

Each layout has a matching CSS entry point. Runtime capabilities come from biu-runtime; this package provides official layout composition.

## Install

```bash
pnpm add @biugle/biu-preset @biugle/biu-runtime
```

## Usage

```tsx
import { SidebarLayout } from "@biugle/biu-preset/sidebar";
import "@biugle/biu-preset/sidebar.css";

<SidebarLayout>{children}</SidebarLayout>;
```

Choose a preset instead of copying foundation layout or responsive styles into an application.

See the architecture guide in https://github.com/biugle/biu/blob/main/docs/design.md.

## License

MIT
