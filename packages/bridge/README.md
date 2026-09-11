# @biugle/biu-bridge

Secure, framework-agnostic protocol helpers for communication between a Portal and an independent APP or iframe.

## What it provides

- Origin normalization and parent-origin resolution.
- Safe remote URL validation.
- Typed checks for auth, overlay, host-context and application-event messages.
- Safe public auth context serialization.

## Install

```bash
pnpm add @biugle/biu-bridge
```

## Usage

```ts
import { isSafeRemoteUrl, postBiuMessage } from "@biugle/biu-bridge";

if (isSafeRemoteUrl(remoteUrl, ["https://biu-a.biugle.cn"])) {
  postBiuMessage({ type: "APP_EVENT", payload: event }, "https://biu-a.biugle.cn");
}
```

Always configure an explicit allowlist for production origins. Runtime owns application-specific wiring.

See the Adapter guide and data contracts in https://github.com/biugle/biu/blob/main/docs/.

## License

MIT
