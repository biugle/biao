import assert from "node:assert/strict";
import { test } from "node:test";
import { annotateMenuKeys, filterMenus, findMenuByPath, menuPath } from "../src/index.js";

test("router keeps duplicate page codes distinct by complete menu path", () => {
  const menus = annotateMenuKeys([
    { code: "system", type: "DIRECTORY", children: [{ code: "settings", type: "MENU" }] },
    { code: "operations", type: "DIRECTORY", children: [{ code: "settings", type: "MENU" }] },
  ]);

  const systemPage = findMenuByPath(menus, "/system/settings");
  const operationsPage = findMenuByPath(menus, "/operations/settings");
  assert.equal(systemPage?.meta?.__BIU_MENU_KEY, "system/settings");
  assert.equal(operationsPage?.meta?.__BIU_MENU_KEY, "operations/settings");
  assert.equal(menuPath(systemPage!), "/system/settings");
  assert.equal(findMenuByPath(menus, "/settings"), undefined);
});

test("router applies permission filtering without orphan directories", () => {
  const menus = annotateMenuKeys([
    {
      code: "admin",
      type: "DIRECTORY",
      children: [{ code: "users", type: "MENU", permissionCode: "users:read" }],
    },
  ]);

  assert.deepEqual(filterMenus(menus, new Set(["other:read"])), []);
  assert.deepEqual(
    filterMenus(menus, new Set(["users:read"])).map((item) => item.code),
    ["admin"],
  );
});
