# Vercel 原生 Git 部署

本文记录 biu Demo 使用 Vercel 原生 Git 部署的标准配置。部署仓库为：

```text
git@github.com:biugle/biu.git
```

推荐使用 Vercel 的 Git 集成：每个 Project 自动生成 Preview，推送 `main` 后自动生产部署，不需要 `VERCEL_TOKEN`、`VERCEL_ORG_ID` 或 npm Token。

## 一次性创建六个 Project

在 Vercel 中导入同一个 GitHub 仓库，创建以下六个 Project：

| Project          | 域名                   | Demo 项目       | Output Directory                            |
| ---------------- | ---------------------- | --------------- | ------------------------------------------- |
| `biu-portal-a`   | `biu-a.biugle.cn`      | `main-a`        | `examples/dev-demo/apps/main-a/dist`        |
| `biu-portal-b`   | `biu-b.biugle.cn`      | `main-b`        | `examples/dev-demo/apps/main-b/dist`        |
| `biu-react-app`  | `biu-s.biugle.cn`      | `child-app`     | `examples/dev-demo/apps/child-app/dist`     |
| `biu-vue-app`    | `biu-vue.biugle.cn`    | `vue-child`     | `examples/dev-demo/apps/vue-child/dist`     |
| `biu-html-app`   | `biu-html.biugle.cn`   | `html-child`    | `examples/dev-demo/apps/html-child/dist`    |
| `biu-custom-app` | `biu-custom.biugle.cn` | `layout-custom` | `examples/dev-demo/apps/layout-custom/dist` |

## 统一 Project 配置

每个 Project 都使用：

```text
Root Directory: ./
Framework Preset: Other
Node.js: 22
Install Command: pnpm install --frozen-lockfile
```

不要选择 `Node` 预设。`Node` 预设会在静态构建完成后继续寻找 `server.js`、`index.js` 等服务入口，并产生 `No entrypoint found` 错误。

Build Command 按 Project 分别配置：

```bash
# biu-portal-a
pnpm build && pnpm --filter main-a biu build --all --env prod

# biu-portal-b
pnpm build && pnpm --filter main-b biu build --all --env prod

# biu-react-app
pnpm build && pnpm --filter child-app biu build --all --env prod

# biu-vue-app
pnpm build && pnpm --filter vue-child biu build --all --env prod

# biu-html-app
pnpm build && pnpm --filter html-child biu build --all --env prod

# biu-custom-app
pnpm build && pnpm --filter layout-custom biu build --all --env prod
```

`Root Directory` 必须保持仓库根目录 `./`，不能设置为 `examples/dev-demo/apps/main-a` 等子目录，否则无法解析根目录的 workspace 依赖和 `pnpm-lock.yaml`。

## 域名与 DNS

在每个 Project 中打开 `Settings → Domains → Add`，添加对应域名。然后按照 Vercel 页面显示的记录，在 DNS 服务商添加 CNAME。常见形式如下，最终以 Vercel 提示为准：

```text
biu-a       CNAME    cname.vercel-dns.com
biu-b       CNAME    cname.vercel-dns.com
biu-s       CNAME    cname.vercel-dns.com
biu-vue     CNAME    cname.vercel-dns.com
biu-html    CNAME    cname.vercel-dns.com
biu-custom  CNAME    cname.vercel-dns.com
```

## 生产配置检查

Portal A/B 当前生产配置已经使用正式域名：

- 门户切换：`https://biu-a.biugle.cn`、`https://biu-b.biugle.cn`
- React 子应用：`https://biu-s.biugle.cn`
- Vue 子应用：`https://biu-vue.biugle.cn`

远程应用的 `APP_URL` 和 `ALLOWED_ORIGINS` 必须使用实际部署域名，并保持精确匹配。HTML 和 Custom 是独立 Demo，不需要放入 Portal 的 `remoteApps`。

当前菜单配置为 `/api/menu/portal-tree`，正式环境若没有同源后端接口，需要替换为实际 API 地址；仅在 Demo 验收时使用本地 fallback。

仓库根目录已有 `vercel.json`，提供 SPA 深层路径回退，无需为六个 Project 重复创建配置文件。

## 日常部署

六个 Project 配置完成后，日常只需：

```bash
git push origin main
```

Vercel 会分别构建并部署六个 Project，并为 Pull Request 自动生成 Preview。不要同时为同一个 Project 配置 Vercel CLI 部署，避免重复构建。

仓库中的 `.github/workflows/deploy-demo.yml` 仅负责 CI 构建和上传验收产物，不负责调用 Vercel CLI。

## 故障排查

| 现象                  | 检查项                                                         |
| --------------------- | -------------------------------------------------------------- |
| `No entrypoint found` | Framework Preset 改为 `Other`，不要使用 `Node`                 |
| 找不到 workspace 包   | Root Directory 改回 `./`，Install Command 使用 frozen lockfile |
| 刷新深层路径 404      | 确认 Project 使用仓库根目录的 `vercel.json`                    |
| 构建成功但页面空白    | 检查 Output Directory 是否为对应 Demo 的 `dist`                |
| 远程 APP 无法加载     | 检查 `APP_URL`、`ALLOWED_ORIGINS`、域名 HTTPS 和浏览器控制台   |
