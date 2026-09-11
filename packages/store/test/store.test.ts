import assert from "node:assert/strict";
import { test } from "node:test";
import { useBiuMenuStore } from "../src/index.js";

test("store keeps directory actions scoped to the current tree", () => {
  const store = useBiuMenuStore;
  store.setState({
    directoryCodes: [],
    directoryParents: {},
    collapsedCodes: [],
    accordion: false,
    showMenuTitle: true,
    menuMode: "STANDARD",
    showTopSearch: false,
    selectedGroupCode: undefined,
    storageScope: "test-store",
    favorites: [],
    recent: [],
  });

  store.getState().setTree([
    {
      code: "system",
      type: "DIRECTORY",
      children: [
        { code: "basic", type: "DIRECTORY" },
        { code: "users", type: "MENU" },
      ],
    },
  ]);
  store.getState().setAllCollapsed();
  assert.equal(store.getState().isExpanded("system"), false);
  assert.equal(store.getState().isExpanded("system/basic"), false);

  store
    .getState()
    .setDirectoryScope([{ code: "system", type: "DIRECTORY", children: [{ code: "basic", type: "DIRECTORY" }] }]);
  store.getState().setAllExpanded();
  assert.equal(store.getState().isExpanded("system/basic"), true);
});
