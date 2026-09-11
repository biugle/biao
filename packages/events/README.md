# @biugle/biu-events

A small, typed, framework-agnostic event bus for communication inside a Portal, APP or shared runtime.

## What it provides

- Typed event envelopes with name, payload and source.
- createBiuEventBus for isolated buses.
- biuEventBus for a shared default bus.
- Subscription cleanup through an unsubscribe function.

## Install

```bash
pnpm add @biugle/biu-events
```

## Usage

```ts
import { createBiuEventBus } from "@biugle/biu-events";

const events = createBiuEventBus();
const unsubscribe = events.subscribe("demo:ready", (event) => {
  console.log(event.payload);
});
events.publish("demo:ready", { source: "portal" });
unsubscribe();
```

Use biu-bridge when an event must cross an iframe or browser-window boundary.

See the data contracts in https://github.com/biugle/biu/blob/main/docs/data-contracts.md.

## License

MIT
