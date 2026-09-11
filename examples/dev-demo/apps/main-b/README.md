# main-b

独立 Portal Demo，使用 Topbar Layout，展示 Portal 自有页面以及独立 APP 的加载入口。

```bash
pnpm start --filter main-b
pnpm --filter main-b build
```

Portal 页面统一位于 `src/pages`，环境地址位于 `config/<ENV>.ts`，菜单入口位于根目录 `local-routes/index.ts`。顶部菜单额外通过 `biu.config.ts` 的 `localMenuTree` 模拟多个目录、目录下拉和同级菜单；大屏横向平铺并在超出时滚动，小屏通过目录下拉选择。
