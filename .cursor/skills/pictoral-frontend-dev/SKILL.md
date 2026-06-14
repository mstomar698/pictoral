---
name: pictoral-frontend-dev
description: Develop and test the Pictoral React frontend. Use when working on UI, Redux state, TypeScript migration, or Playwright E2E tests.
---

# Pictoral Frontend Development

## Prerequisites
WASM package must exist at `pkg/` (see `pictoral-wasm-build` skill).

## Dev server
```bash
cd frontend
npm ci
npm run dev
```
Opens http://localhost:3000

## Verification checklist
```bash
npm run typecheck   # TypeScript strict mode
npm run test        # Vitest unit tests
npm run build       # Production webpack build
npm run e2e         # Playwright UI tests
```

## TypeScript migration
- New files: use `.ts`/`.tsx`
- Delete stale `.js` when `.tsx` exists (webpack prefers `.ts`)
- WASM types: `src/declarations.d.ts` and `src/types.ts`
- Redux store: `src/store.ts` (canonical)

## Key files
- `src/App.tsx` — root React app
- `src/components/common/imgObj.ts` — WASM Image singleton + undo/redo
- `src/components/Main.js` — editor shell (migrate to TS when touching)
- `e2e/app.spec.ts` — Playwright tests

## Webpack alias
`image-editor-bk-rust` → `../pkg` (local WASM, not npm)
