# Native Git Deployment on Vercel

This document defines the standard Vercel Git deployment for biu demos.

Repository:

```text
git@github.com:biugle/biu.git
```

Use Vercel's native Git integration. Each Project gets Preview deployments automatically, and pushes to `main` create Production deployments. No `VERCEL_TOKEN`, `VERCEL_ORG_ID` or npm token is needed by Vercel.

## Projects

Create six Vercel Projects from the same repository:

| Project          | Domain                 | Demo            | Output Directory                            |
| ---------------- | ---------------------- | --------------- | ------------------------------------------- |
| `biu-portal-a`   | `biu-a.biugle.cn`      | `main-a`        | `examples/dev-demo/apps/main-a/dist`        |
| `biu-portal-b`   | `biu-b.biugle.cn`      | `main-b`        | `examples/dev-demo/apps/main-b/dist`        |
| `biu-react-app`  | `biu-s.biugle.cn`      | `child-app`     | `examples/dev-demo/apps/child-app/dist`     |
| `biu-vue-app`    | `biu-vue.biugle.cn`    | `vue-child`     | `examples/dev-demo/apps/vue-child/dist`     |
| `biu-html-app`   | `biu-html.biugle.cn`   | `html-child`    | `examples/dev-demo/apps/html-child/dist`    |
| `biu-custom-app` | `biu-custom.biugle.cn` | `layout-custom` | `examples/dev-demo/apps/layout-custom/dist` |

## Shared settings

```text
Root Directory: ./
Framework Preset: Other
Node.js: 22
Install Command: pnpm install --frozen-lockfile
```

Use this Build Command for each Project, replacing `<demo-name>` with the matching Demo name:

```bash
pnpm build && pnpm --filter <demo-name> biu build --all --env prod
```

Keep the Output Directory from the table above. Do not select the `Node` preset. It makes Vercel look for a server entrypoint after the static build and causes `No entrypoint found` errors. Keep Root Directory at `./`; changing it to an app subdirectory breaks workspace dependency and lockfile resolution.

The repository already contains a root `vercel.json` with an SPA fallback for deep links.

## Domains and deployment

Add each domain under `Settings → Domains`, then create the CNAME record shown by Vercel at your DNS provider. The target is commonly `cname.vercel-dns.com`, but the Vercel-provided value is authoritative.

After the six Projects are configured:

```bash
git push origin main
```

Vercel deploys all six Projects and creates Preview deployments for Pull Requests. Do not also configure Vercel CLI deployment for the same Project. `deploy-demo.yml` only builds and uploads CI artifacts.

## Production checks

Portal production configuration uses `biu-a.biugle.cn`, `biu-b.biugle.cn`, `biu-s.biugle.cn` and `biu-vue.biugle.cn`. Remote app `APP_URL` and `ALLOWED_ORIGINS` must exactly match the deployed HTTPS origins. HTML and Custom are standalone demos and are not listed in Portal `remoteApps`.

If `/api/menu/portal-tree` is not provided by a production backend, replace it with the real API URL. The local fallback is for demo acceptance only.
