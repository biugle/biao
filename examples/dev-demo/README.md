# Biu CLI 开发验收工作区

[English README](README.en.md)

这里是开发和回归用的统一工作区，不是一个待部署的业务项目。默认验收项目位于 `apps/` 下，并且保持 Portal / APP 独立部署：

- `apps/main-a`：Portal A，配置默认 9001，端口占用时递增。
- `apps/main-b`：Portal B，配置默认 9002，端口占用时递增。
- `apps/child-app`：React APP，配置默认 8001，端口占用时递增。
- `apps/vue-child`：Vue 3 APP，配置默认 8002，端口占用时递增。
- `apps/layout-custom`：React Custom 独立模式，配置默认 8007。
- `apps/html-child`：HTML Adapter 独立 APP，配置默认 8003。
- `packages/shared`：Demo 可复用类型、工具和校验规则的 workspace package。

这个目录本身也是一个可独立安装的 pnpm workspace：`pnpm-workspace.yaml` 会把 `apps/*`、`packages/*` 和本地 `@biugle/*` 基座包纳入工作区。进入本目录后可以直接执行下面的命令，不依赖根目录的 filter 状态。

Demo app 通过 `@biugle/dev-demo-shared` workspace 依赖引用共享工具，业务代码不使用跨项目的深层相对路径。

```bash
pnpm start --filter main-a
pnpm start --filter main-b
pnpm start --filter child-app
pnpm start --filter vue-child
pnpm start --filter html-child
pnpm start --filter layout-custom
pnpm start --filter main-a -- --apps ../child-app,../vue-child
```

`pnpm start --filter <项目>` 会按项目类型从 Portal `9001–9999`、APP `8001–8888` 中选择可用端口；不会根据当前已启动的进程猜测门户，端口和 APP_URL 仍由环境配置决定。

首次在这个目录独立运行时，`start`、`check` 和 `build` 会先构建本地 `@biugle/*` 基座包，不要求预先执行根工作区的 build。

在仓库根目录和 `examples/dev-demo` 目录执行上述命令，启动转发器行为一致，均按显式 filter 选择项目。

不要把 `.biu/`、`dist/` 生成物当作源代码修改；页面、路由和环境配置分别维护在各自 app 目录中。
