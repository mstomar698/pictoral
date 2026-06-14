# Pictoral — Stabilization & Roadmap

> **Last updated:** 2026-06-14 — OSS platform setup in progress on `feat/oss-platform-setup`

## Objective
Make Pictoral a reproducible, production-ready OSS web image editor with Rust/WASM core, TypeScript frontend, full test coverage, and PR-based CI/CD.

## Current status

| Area | Status |
|------|--------|
| Rust/WASM core | ✅ Compiles, `wasm-pack build` produces `pkg/` |
| Frontend | ✅ React + Redux, TS migration in progress |
| Unit tests | ✅ Rust (`cargo test`) + Vitest (reducers) |
| E2E tests | ✅ Playwright (UI shell, navigation, canvas) |
| CI/CD | ✅ GitHub Actions (rust, frontend, e2e jobs) |
| Docs | ✅ ADRs, CONTRIBUTING, CLAUDE.md, Cursor skills |
| Vulnerabilities | ✅ Legacy deps removed, packages upgraded |
| OSS readiness | 🔄 PR workflow enforced; branch protection pending public release |

## Architecture

```
Browser (React/Redux/TS)
    ↓ webpack alias
pkg/ (wasm-bindgen JS glue)
    ↓
image_editor_bg.wasm (Rust image algorithms)
```

See [docs/adr/](docs/adr/) for decision records.

## Quick start

```bash
# Build WASM
wasm-pack build --target bundler --out-dir pkg

# Frontend
cd frontend && npm ci && npm run dev
# → http://localhost:3000
```

## Development workflow

1. Branch from `main`: `git checkout -b feat/my-change`
2. Verify: `cargo test`, `wasm-pack build`, `cd frontend && npm run typecheck && npm run test && npm run e2e`
3. Open PR: `gh pr create --fill`
4. Wait for CI (3 jobs) → merge

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

## Phase tracker

### Phase 0 — Triage & Reproducible Build ✅
- [x] Makefile + `scripts/build-wasm.sh`
- [x] `.gitignore` for `target/`, `pkg/`, `node_modules/`
- [x] Documented tool versions in README

### Phase 1 — Frontend & Integration ✅
- [x] React frontend with WASM integration
- [x] Webpack dev server + production build
- [x] Undo/redo history in `imgObj.ts`

### Phase 2 — Tests & CI ✅
- [x] `cargo test` for Rust
- [x] Vitest unit tests
- [x] Playwright E2E tests
- [x] GitHub Actions CI pipeline
- [x] PR template + CONTRIBUTING guide

### Phase 3 — Stabilize & Improve (next)
- [ ] Complete TypeScript migration (remaining `.js` components)
- [ ] WASM integration tests with `wasm-bindgen-test`
- [ ] Benchmarks for blur/resize
- [ ] Memory/edge-case tests (tiny/large images)

### Phase 4 — Product & Delivery (future)
- [ ] npm package for WASM artifacts
- [ ] GitHub Pages demo deploy
- [ ] Public release with branch protection
- [ ] Contributor onboarding guide

## Local commands

| Task | Command |
|------|---------|
| Rust tests | `cargo test` |
| WASM build | `wasm-pack build --target bundler --out-dir pkg` |
| Dev server | `cd frontend && npm run dev` |
| Typecheck | `cd frontend && npm run typecheck` |
| Unit tests | `cd frontend && npm run test` |
| E2E | `cd frontend && npm run e2e` |
| Production | `cd frontend && npm run build` |

## Notes / Risks
- `pkg/` is gitignored — CI builds it; devs must run `wasm-pack build` locally
- TypeScript migration is incremental; some `.js` files remain
- Repo is private; treat `main` as protected until public launch
