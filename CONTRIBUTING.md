# Contributing to Biu

感谢参与 Biu 基座和 CLI 的建设。提交代码前请先阅读 AGENTS.md、docs/development.md 和 docs/production-checklist.md。

## 开发流程

1. 使用 Node.js 22+ 和 pnpm 9+。
2. 执行 pnpm install --frozen-lockfile。
3. 修改源码、测试、Demo 和对应文档。
4. 执行 pnpm check、pnpm test、pnpm lint、pnpm format:check。
5. 涉及 CLI 或项目模板时执行 pnpm verify:scenarios。
6. 不提交 node_modules、dist、.biu、日志、覆盖率和 .husky/_。

## Pull Request 要求

- 说明变更目的、影响范围和回滚方式。
- 提供测试命令和结果；UI 变更附带桌面和窄屏验收说明。
- 新增公开 API 必须同步 docs/data-contracts.md、使用文档和实现对照表。
- 不在前端配置、Bridge、Demo 以外的代码中写入 Token、Cookie、密码或长期凭证。
- 基座能力与 Demo mock 分离；Demo 账号只用于本地演示。

提交信息建议使用 feat:、fix:、docs:、test:、refactor:、chore: 前缀。
