# Biu 最终交付审计

本文件记录首次开源发布前的最终回归结果、交付评分、已完成事项、剩余 TODO 和 GitHub Actions 配置要求。它不是业务系统上线承诺；生产认证、权限、网关、域名和部署安全仍由项目方负责。

## 当前结论

基座已达到“首版开源交付候选”标准，可以进入人工验收和首次提交。代码、Demo、公共包、CLI、文档、质量门禁和发布工作流已形成闭环。

本轮重点修复了独立 HTML APP 收起态：HTML、React、Vue APP 共用 `@biugle/biu-preset/sidebar` 和 `LayoutFrame`，收起时统一为 60px 图标栏，底部只保留一个收起/展开按钮；顶部恢复按钮只在“隐藏菜单栏”状态出现，避免两套按钮叠加导致菜单错位。

## 自动化回归结果

| 检查项                                        | 结果                                                             |
| --------------------------------------------- | ---------------------------------------------------------------- |
| 公共包构建和类型检查                          | PASS                                                             |
| Portal A/B、React、Vue、HTML、Custom 类型检查 | PASS                                                             |
| 单元测试                                      | PASS，37 个测试                                                  |
| ESLint                                        | PASS，无 warning                                                 |
| Prettier                                      | PASS                                                             |
| Knip                                          | PASS                                                             |
| 生产依赖漏洞审计                              | PASS，未发现已知漏洞                                             |
| CLI/project 场景                              | PASS，100 个场景                                                 |
| 代表性构建                                    | PASS，7 个场景                                                   |
| 全量 Demo 构建                                | PASS，Portal A/B、React/Vue/HTML APP、Custom                     |
| 本地 HTTP 冒烟                                | PASS，9001、9002、8001、8002、8003、8007 返回 200                |
| 中英文资源 key                                | PASS，默认资源由同一 `MessageKey` 类型约束，并有实际调用回归测试 |
| 旧 fixtures、旧布局名、旧品牌遗留             | PASS，未发现源码/文档引用                                        |

## 已完成 checklist

- [x] Portal Sidebar 与 Topbar 布局
- [x] 独立 React、Vue、HTML APP 接入
- [x] React Custom 独立自定义模式
- [x] 完整菜单层级 URL、权限过滤和重复 Code 隔离
- [x] Zustand Store：偏好、认证、菜单、Tabs 会话状态
- [x] `@biugle/biu-i18n`、`@biugle/biu-events`、`@biugle/biu-bridge`、`@biugle/biu-router`、`@biugle/biu-store`、`@biugle/biu-ui` 独立包
- [x] Runtime/Preset/Demo 从公开包入口使用能力
- [x] Message、Tooltip、Modal、Drawer、`fire()`、错误边界、复制详情
- [x] 生命周期、导航钩子、应用通信、Origin 校验 Bridge
- [x] 运行时更新检查：启动建立基线，用户操作时单次检查，不轮询、不强刷
- [x] Changesets、npm 发布 workflow、Vercel 原生 Git 部署说明、Demo 构建 workflow、CI workflow
- [x] ESLint、Prettier、EditorConfig、Husky、lint-staged、Knip
- [x] 中文/英文 README、文档、数据规范、生产 checklist
- [x] Logo、截图、Issue/PR 模板、LICENSE、贡献与安全策略
- [x] Demo fixtures 和无效旧 workspace 配置清理
- [x] 生成物清理后重新构建验证

## 待完成 TODO

### 首次提交前

- [ ] `git add` 后检查 staged diff，确认没有 Token、Cookie、密码、内部域名或本地用户数据
- [ ] 创建首个 `main` commit 并推送到 `git@github.com:biugle/biu.git`
- [ ] 在 GitHub Settings/Actions 中确认 Actions 已启用
- [ ] 配置 `NPM_GIT_BIUGLE`；Vercel 使用原生 Git，无需 Vercel Token
- [ ] 设置 `main` 分支保护并要求 CI `validate` job 通过

### 开源增强项

- [ ] 启用 Dependabot 或 Renovate
- [ ] 启用 CodeQL
- [ ] 启用 Secret Scanning 和 Push Protection
- [ ] npm 后续切换 Trusted Publishing 与 provenance
- [ ] 补充 Playwright 浏览器级自动化验收

### 生产接入项

- [ ] 接入真实 SSO、认证、权限和菜单接口
- [ ] 配置生产 HTTPS、CSP、`frame-ancestors`、SPA fallback
- [ ] 配置正式域名、CDN 缓存、旧资源保留和回滚策略
- [ ] 接入生产监控 `onMonitorEvent` 或 `window.__BIU_MONITOR__`
- [ ] 验证远程 APP 的 `APP_URL` 与 `ALLOWED_ORIGINS` 精确匹配

## GitHub Actions 配置

必须配置的 Repository Secrets：

| Secret           | 用途                                                                    |
| ---------------- | ----------------------------------------------------------------------- |
| `NPM_GIT_BIUGLE` | Changesets 发布 `@biugle/*` 包的 npm granular token，建议只授予发布权限 |
| `GITHUB_TOKEN`   | GitHub Actions 自动提供，无需手工创建                                   |

Vercel 使用原生 Git 部署，不需要 `VERCEL_PROJECT_ID` 或其他 Vercel Secret。需要预先创建以下六个 Project，并分别绑定域名、构建命令和产物目录：

```text
biu-portal-a
biu-portal-b
biu-react-app
biu-vue-app
biu-html-app
biu-custom-app
```

外部 Fork PR 不会获得 npm 发布 Secret。发布前还需要确保仓库存在首个 `main` 提交，Actions 启用且分支保护要求 CI 通过。

## 评分

| 维度                | 得分 | 说明                                                                   |
| ------------------- | ---: | ---------------------------------------------------------------------- |
| 架构边界与可扩展性  | 9/10 | 包边界清晰，Runtime/Preset 保留统一入口；生产插件生态仍可继续扩展      |
| 多框架兼容          | 9/10 | React/Vue/HTML/iframe 已验证，其他框架依赖 Adapter Contract            |
| 路由、菜单与权限    | 9/10 | 完整链路 URL、权限过滤和 store 隔离已覆盖                              |
| 状态与通信          | 9/10 | Zustand、事件总线、Origin 校验 Bridge 已覆盖                           |
| UI 基础能力         | 9/10 | Message、Tooltip、Modal、Drawer、fire 和错误态已具备                   |
| CLI、构建与开发体验 | 9/10 | init/create、端口治理、Rsbuild、场景工厂已验证                         |
| 测试与质量门禁      | 9/10 | 类型、单测、Lint、格式、Knip、100 场景均通过                           |
| 发布与 CI/CD        | 8/10 | Changesets/Actions 完整，尚未在真实 GitHub/npm/Vercel 账号上跑正式发布 |
| 安全边界            | 8/10 | 前端敏感信息边界和依赖审计完成，生产 CSP/SSO/网关仍需接入              |
| 文档与开源资产      | 9/10 | 中英文文档、模板、Logo、截图和清单齐全                                 |

**总评分：88/100。**

扣分主要来自真实发布账号、生产部署、安全策略和浏览器级自动化尚未执行；不代表当前源码质量门禁失败。

## Agent 归档规则

- 基座公共能力必须从对应 `@biugle/*` 公共包公开入口获取，禁止 Runtime/Preset/Demo 复制第二套实现。
- HTML、Vue、React APP 统一使用 `LayoutFrame`/Preset；差异只允许来自 Adapter 和业务页面，不能复制菜单、收起按钮或响应式 CSS。
- 修改 Runtime、Preset、CLI 或公共包后，必须重新 `pnpm build` 并重启本地验收服务；`.biu` 是临时快照，不提交。
- 新增页面或 UI 文案必须同时更新中英文资源，并通过资源 key 回归测试。
- Demo mock 只放 `examples/dev-demo/apps/*/src/mock/`；基座只提供生产级契约，不内置 Demo 账号或业务数据。
- 交付前必须执行 `pnpm check`、`pnpm test`、`pnpm lint`、`pnpm format:check`、`pnpm audit:unused`、`pnpm verify:scenarios` 和 `pnpm build:demo:all`。
- 清理只针对明确生成物和临时目录；不要在服务运行中删除 `.biu`/`dist`，不要删除 `node_modules`，不要 reset 或 checkout 用户工作区。
