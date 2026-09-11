import test from "node:test";
import assert from "node:assert/strict";
import { createBiuEventBus } from "../src/index.js";

test("event bus publishes typed envelopes and unsubscribes cleanly", () => {
  const bus = createBiuEventBus();
  const received: number[] = [];
  const unsubscribe = bus.subscribe<{ value: number }>("demo", (event) => {
    received.push(event.payload.value);
  });

  bus.publish("demo", { value: 1 }, "test");
  unsubscribe();
  bus.publish("demo", { value: 2 });

  assert.deepEqual(received, [1]);
});
