---
name: pictoral-pr-workflow
description: Open and verify pull requests for Pictoral. Use when creating PRs, preparing releases, or ensuring CI passes before merge.
---

# Pictoral PR Workflow

## Rules
- **Never push directly to `main`**
- All changes via feature branches + PRs to `mstomar698/pictoral`

## Create a PR
```bash
git checkout -b feat/your-change
# ... make changes ...
git add -A && git commit -m "describe the why"
git push -u origin HEAD
gh pr create --fill
```

## Pre-push verification
```bash
cargo test
wasm-pack build --target web --out-dir pkg
cd frontend
npm run typecheck
npm run test
npm run build
npm run e2e
```

## CI jobs (auto on PR)
1. **rust** — cargo test + wasm-pack build
2. **frontend** — typecheck, vitest, production build
3. **e2e** — Playwright

## PR template
Fill out `.github/pull_request_template.md` checklist.

## Architecture changes
Add or update an ADR in `docs/adr/` for significant decisions.
