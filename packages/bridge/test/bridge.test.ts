import assert from "node:assert/strict";
import test from "node:test";
import {
  isAppEventPayload,
  isAuthContext,
  isBridgeMessage,
  isHostContextPayload,
  isSafeRemoteUrl,
  normalizeOrigin,
  publicAuthContext,
} from "../src/index.js";

test("normalizes only http and https origins", () => {
  assert.equal(normalizeOrigin("https://example.test/path"), "https://example.test");
  assert.equal(normalizeOrigin("javascript:alert(1)"), undefined);
});

test("validates bridge payloads", () => {
  assert.equal(isBridgeMessage({ CHANNEL: "BIU", TYPE: "READY" }), true);
  assert.equal(isBridgeMessage({ CHANNEL: "OTHER", TYPE: "READY" }), false);
  assert.equal(isAppEventPayload({ name: "refresh", payload: { id: 1 } }), true);
  assert.equal(isAppEventPayload({ name: "" }), false);
  assert.equal(isAuthContext({ mode: "NONE", authenticated: false }), true);
  assert.equal(isHostContextPayload({ THEME: "dark", DIRECTION: "ltr" }), true);
});

test("redacts credentials by construction and validates remote origins", () => {
  const value = publicAuthContext({
    mode: "SSO",
    authenticated: true,
    user: { name: "Admin", extra: { department: "platform" } },
  });
  assert.deepEqual(value?.user, { name: "Admin", extra: { department: "platform" } });
  assert.equal(isSafeRemoteUrl("https://child.example.test", ["https://child.example.test"]), true);
  assert.equal(isSafeRemoteUrl("javascript:alert(1)", ["https://child.example.test"]), false);
});
