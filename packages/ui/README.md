# @biugle/biu-ui

Reusable React UI primitives that can be used with or without a biu layout.

## What it provides

- Centered Message notifications.
- Tooltip with overflow-aware display.
- Modal and Drawer primitives.
- fire helpers that mount arbitrary React content to body.
- Copy-friendly, controlled overlay APIs.

## Install

```bash
pnpm add @biugle/biu-ui react react-dom
```

## Usage

```tsx
import { biuMessage, fireModal } from "@biugle/biu-ui";
import "@biugle/biu-ui/styles.css";

biuMessage.success("Saved");
const handle = fireModal({ title: "Details", children: <Details /> });
handle.close();
```

Use this package when a Custom application needs shared UI without importing an official layout.

See the usage guide in https://github.com/biugle/biu/blob/main/docs/usage.md.

## License

MIT
