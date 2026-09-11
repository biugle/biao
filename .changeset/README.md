# Changesets

每个影响公开包的变更提交一个 changeset：

```bash
pnpm changeset
```

合并到主分支后，Release workflow 会创建 Version PR；合并 Version PR 后自动构建并发布受影响的 `@biugle/*` 包。
