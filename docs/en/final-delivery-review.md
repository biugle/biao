# Biu Final Delivery Review

This document records the final pre-release audit, score, completed items, remaining TODOs and GitHub Actions requirements. It is not a production deployment guarantee; authentication, permissions, gateways, domains and deployment security remain project responsibilities.

## Conclusion

Biu is ready as a first open-source release candidate. The foundation, demos, public packages, CLI, documentation, quality gates and release workflows form a complete delivery loop.

The latest fix unified the collapsed state of the standalone HTML APP. HTML, React and Vue APPs use the same `@biugle/biu-preset/sidebar` and `LayoutFrame`; collapse now means one 60px icon rail with one footer control. The header restore control appears only when the menu bar is hidden, avoiding duplicated controls and misalignment.

## Automated regression

| Check                                             | Result                                             |
| ------------------------------------------------- | -------------------------------------------------- |
| Public package build and typecheck                | PASS                                               |
| Portal A/B, React, Vue, HTML and Custom typecheck | PASS                                               |
| Unit tests                                        | PASS, 37 tests                                     |
| ESLint                                            | PASS                                               |
| Prettier                                          | PASS                                               |
| Knip                                              | PASS                                               |
| Production dependency audit                       | PASS, no known vulnerabilities                     |
| CLI/project scenarios                             | PASS, 100 scenarios                                |
| Representative builds                             | PASS, 7 scenarios                                  |
| Full Demo build                                   | PASS                                               |
| Local HTTP smoke test                             | PASS, all six endpoints returned 200               |
| Chinese/English resource keys                     | PASS, shared `MessageKey` plus regression coverage |
| Legacy fixtures/layout/brand references           | PASS                                               |

## Completed checklist

- [x] Portal Sidebar and Topbar layouts
- [x] Independent React, Vue and HTML APP integration
- [x] Independent React Custom mode
- [x] Hierarchical URLs, permission filtering and duplicate Code isolation
- [x] Zustand stores for preferences, auth, menus and tab sessions
- [x] Public `@biugle/biu-i18n`, `events`, `bridge`, `router`, `store` and `ui` packages
- [x] Runtime, Preset and Demo consume public package entries
- [x] Message, Tooltip, Modal, Drawer, `fire()`, error boundary and copy details
- [x] Lifecycle, navigation hooks, application events and Origin-validated Bridge
- [x] Startup/user-action update checks without polling or forced refresh
- [x] Changesets, npm release workflow, native Vercel Git deployment guide, Demo build workflow and CI workflow
- [x] ESLint, Prettier, EditorConfig, Husky, lint-staged and Knip
- [x] Chinese/English README, docs, contracts and production checklist
- [x] Logo, screenshots, Issue/PR templates, LICENSE, contribution and security policy
- [x] Demo fixture and obsolete workspace cleanup
- [x] Clean generated-artifact rebuild

## Remaining TODO

### Before first commit

- [ ] Inspect staged diff for tokens, cookies, passwords, internal domains and local user data
- [ ] Create the first `main` commit and push to `git@github.com:biugle/biu.git`
- [ ] Confirm GitHub Actions is enabled
- [ ] Configure `NPM_GIT_BIUGLE`; native Vercel Git deployment needs no Vercel token
- [ ] Protect `main` and require the CI `validate` job

### Open-source hardening

- [ ] Enable Dependabot or Renovate
- [ ] Enable CodeQL
- [ ] Enable Secret Scanning and Push Protection
- [ ] Move npm publishing to Trusted Publishing/provenance later
- [ ] Add Playwright browser-level automation

### Production integration

- [ ] Connect real SSO, auth, permissions and menu APIs
- [ ] Configure HTTPS, CSP, `frame-ancestors` and SPA fallback
- [ ] Configure domains, CDN caching, old-asset retention and rollback
- [ ] Connect `onMonitorEvent` or `window.__BIU_MONITOR__`
- [ ] Verify exact `APP_URL` and `ALLOWED_ORIGINS` matches

## GitHub Actions configuration

Required repository secrets:

| Secret           | Purpose                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| `NPM_GIT_BIUGLE` | npm granular token for publishing `@biugle/*`, preferably publish-only |
| `GITHUB_TOKEN`   | Automatically provided by GitHub Actions                               |

Vercel uses native Git deployment, so `VERCEL_PROJECT_ID` and Vercel secrets are not required. Create six Vercel Projects linked to the repository and configure their domains, build commands and output directories. Fork PRs do not receive the npm publishing secret.

## Score

**88/100.** The deductions are for real-account release, production deployment/security integration and browser-level automation not yet executed; source quality gates pass.

## Agent archive rules

- Foundation capabilities must come from the matching public `@biugle/*` entry; Runtime, Preset and Demo must not duplicate implementations.
- HTML, Vue and React APPs share `LayoutFrame`/Preset. Differences belong to the Adapter or business page, never copied menu/collapse logic or responsive CSS.
- After Runtime, Preset, CLI or public package changes, rebuild and restart acceptance services; `.biu` is a temporary snapshot and is never committed.
- New UI text must update both locale resources and pass resource-key regression tests.
- Demo mocks belong under each app's `src/mock/`; the foundation only owns production contracts.
- Before delivery run `pnpm check`, `pnpm test`, `pnpm lint`, `pnpm format:check`, `pnpm audit:unused`, `pnpm verify:scenarios` and `pnpm build:demo:all`.
