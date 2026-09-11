# Biu CLI Agent Contract

代码、Demo、测试、文档和清理规则必须同步更新；每次交付前执行根目录 `pnpm check`、`pnpm test`、Demo 构建和目录产物检查。

## 架构约束

- Portal 与 APP 同级、独立启动、独立构建、独立部署、独立域名；Portal 默认用环境配置的 `remoteApps[APP_ID].APP_URL` iframe 加载 APP，不打包 APP 页面源码。
- `TARGET` 只允许 `APP`/`PORTAL`；`TYPE` 只允许 `DIRECTORY`/`MENU`/`COMPONENT` 权限语义，菜单节点使用 `DIRECTORY`/`MENU`。协议枚举值大写，标题和字段不强制大写。
- 页面在项目内按最终 Code 平铺在 `src/pages/<Code>`；后端虚拟层级只用于筛选、展示和权限，不改变前端目录。
- 运行时菜单/权限优先；`local-routes/index.ts` 是本地开发和受控 fallback，`--all` 仅为排查，不是生产默认。
- 默认 iframe；Runtime 只抽象 Loader 和生命周期边界，不提前安装 qiankun/Wujie。

## 目录约定

```text
apps/<project>/
├── biu.config.ts
├── local-routes/index.ts       # 统一导出 common.ts、business.ts 等
├── config/{local,dev,test,pre,prod}.ts
└── src/pages/<Code>/           # Portal 自有页和 APP 页统一目录
```

项目共享代码使用 workspace package，不强制生成 `src/shared`；业务项目不生成 `src/i18n`，多语言由 `@biugle/biu-runtime` 提供，项目只配置接口或资源。

## 基座维护边界

- `packages/store/src/store/` 分为 `preference-store.ts`、`auth-store.ts`、`menu-store.ts`、`session-store.ts`；Zustand 是唯一状态库，Runtime 只保留兼容导出。
- `packages/router/src/` 负责菜单树、完整层级 URL、权限过滤、菜单接口和导航查询；Runtime 只负责运行时编排。
- `packages/preset/src` 负责 Sidebar、Topbar、Blank、Dashboard、Mobile、Custom、Tabs、Header、菜单配置、多级菜单、遮罩和响应式；样式只放 `styles/tokens.css`、`base.css`、`header.css`、`sidebar.css`、`tabs.css`、`content.css`、`overlays.css`、`responsive.css`、`themes.css`。
- `packages/i18n`、`packages/events`、`packages/bridge`、`packages/router`、`packages/store` 和 `packages/ui` 是可独立复用的公共包；Runtime/Preset 和 Demo 使用这些包的公开入口，禁止再添加第二套转发入口。
- 普通菜单默认无图标；只有目录使用配置图标，无配置使用默认目录图标，禁止通过 Code/标题关键词猜图标。
- Portal 可通过 `portalSlots.workbar`/`toolbar` 插槽扩展或替换工具区；APP 不修改宿主 DOM/CSS。
- 运行模式固定分为：Portal Sidebar、Portal Topbar、独立 APP（可选官方 preset）和 React Custom；Custom 不渲染官方导航，只保留 Runtime、错误边界、更新检查和可选认证出口。
- React Portal 可通过 `portalSlots.toolbarActions` 声明标准化工具项；该契约同时渲染桌面工具栏和窄屏折叠菜单，稳定的基座文案可用 `labelKey`/`tooltipKey` 接入 i18n，任意 ReactNode 插槽不自动推断移动端行为。
- 页面可通过 `useBiuContext()` 的 `navigate`、`setLayoutOverrides`、`resetLayoutOverrides`、`login`、`logout`、`refreshAuth` 和偏好 setters 控制基座；页面离开前由 Runtime 导航自动清理页面级布局覆盖。
- 基座单文件原则上不超过 800 行；超过需拆分，特殊情况必须在文档说明。
- 开发服务使用项目级 `.biu/foundation` 快照解析 `@biugle/*`；修改 foundation 或 CLI 后必须重新构建并重启验收服务，快照不得提交。

## i18n / SSO

- React 页面使用 `useBiuI18n().$t("中文 key")`；非 Hook 使用 `i18n.$t("中文 key")`。
- 配置、sessionStorage 和 Bridge 的语言值必须先经过 `normalizeBiuLocale`；空值、空白和非法值回退到合法中文，不能把原始非法值渲染到选择器。
- 中文和英文资源独立维护；目标语言缺失时回退英文、中文、key。
- Bridge 只传语言、主题、时区、方向、环境、门户 Code 和非敏感用户身份；Token/session id 不传递，SSO Cookie/网关负责鉴权。
- 主题、方向、时区等来自配置、sessionStorage 或 Bridge 的值必须先归一化；非法值分别回退浅色、LTR、Asia/Shanghai。`system` 主题必须监听 `prefers-color-scheme`。
- 全局提示统一从 `@biugle/biu-ui` 使用 `biuMessage.success/info/warning/error`。Runtime/Preset 不转发 UI API；React、Vue、HTML APP 都可调用；不得复制各框架的消息实现。
- Runtime 可通过 `updateCheck` 在首次加载建立 manifest 基线，并在用户导航时单次检查远程更新；不做轮询，不自动刷新，发现更新使用 Message 提示用户。Bridge 协议本身由 `@biugle/biu-bridge` 独立维护。
- `auth.enabled=false` 完全关闭基座默认认证入口；`@biugle/biu-ui` 提供顶部居中 `biuMessage`、React `BiuModal`/`BiuDrawer` 和 `fire(Component)(props)` body 挂载能力。复杂业务内容由项目负责。
- Shell 生命周期使用 `MOUNT`/`UNMOUNT`，导航生命周期使用 `BEFORE`/`AFTER`/`ERROR`；`BEFORE` 返回 `false` 可取消。应用通信使用类型化事件总线，iframe 通过 Origin 校验的 `APP_EVENT` 转发。
- CLI 支持 `biu init` 交互式创建多个 Portal/APP，并可选择 Portal Sidebar/Topbar、APP preset/Custom React；非交互式仍使用 `biu create <name> --type ... --preset ...`。公开包通过 Changesets 发布。

## 最终交付归档

- 首版发布前的回归结果、评分、已完成项、TODO、GitHub Secrets 和生产接入边界统一记录在 `docs/final-delivery-review.md` 及 `docs/en/final-delivery-review.md`。
- HTML、Vue、React 独立 APP 必须共用 `@biugle/biu-preset` 的 `LayoutFrame`；收起状态统一为 60px 图标栏和底部单一控制按钮，顶部恢复按钮只用于“隐藏菜单栏”，禁止 Adapter 或 Demo 自行复制收起逻辑。
- 当前已完成自动化交付门禁：公共包/Demo 类型检查、37 个单测、ESLint、Prettier、Knip、生产依赖审计、100 个 CLI 场景、7 个代表性构建和全量 Demo 构建；正式 npm/Vercel 发布仍需配置仓库 Secrets 后由 GitHub Actions 执行。
- 首次提交前必须检查 staged diff，确保无 Token、Cookie、密码、内部域名或本地用户数据；不要提交 `dist/`、`.biu/`、`node_modules/`、缓存和 `.husky/_/`。

## 产物与 Git

- `.biu/`、`dist/`、coverage、缓存、日志、临时错误记录、`node_modules/` 和 `.husky/_/` 不提交。
- 保留源码 `.husky/pre-commit`；不保留自动生成的 `.husky/_/`。
- 不提交构建产物、截图、调试入口、废弃目录和无效记录；验收前清理明确的历史产物。
- 每次改动必须同步实现文档、使用手册、开发文档、Demo/测试和 Agent 约束；新增基座文案必须同时更新中英文资源。
- Demo mock 必须集中在项目 `src/mock/` 并按 auth、notifications、profile 等职责拆分；基座只提供生产级数据契约和能力，不内置 Demo 账号逻辑。
- 数据字段、接口响应、Bridge、更新清单和脱敏规则统一维护在 `docs/data-contracts.md`；代码或契约变化必须同步更新该文档及对外 API 文档。

## 常用命令

```bash
pnpm start --filter main-a
pnpm start --filter child-app
pnpm start --filter main-a -- --apps ../child-app,../vue-child
pnpm --filter main-a biu build --all
pnpm check && pnpm test
```
