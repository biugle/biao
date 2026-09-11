# @biugle/biu-adapter-react

React integration utilities for biu applications.

## What it provides

- A typed React adapter contract.
- mountReactBiuApp for mounting React content into a DOM element.
- reactAdapter for explicit framework integrations.

## Install

```bash
pnpm add @biugle/biu-adapter-react react react-dom
```

## Usage

```tsx
import { mountReactBiuApp } from "@biugle/biu-adapter-react";

mountReactBiuApp(document.getElementById("app")!, <App />);
```

Use this package when a project needs the official React adapter without importing the full Portal layout.

See the Adapter guide in https://github.com/biugle/biu/blob/main/docs/adapters.md.

## License

MIT
