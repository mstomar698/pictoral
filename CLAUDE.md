# Pictoral — AI Assistant Guide

This file helps AI coding assistants (Claude, Cursor, etc.) work effectively in this repository.

## Project overview

**Pictoral** is a browser-based image editor:
- **Rust core** (`src/`) compiled to **WebAssembly** via `wasm-pack`
- **React + Redux** frontend (`frontend/`) consuming the WASM package
- **Tailwind CSS** for styling

## Repository layout

```
pictoral/
├── src/                  # Rust image processing core
├── pkg/                  # Generated WASM bindings (gitignored, built by CI)
├── frontend/
│   ├── src/              # React app (TS migration in progress)
│   ├── e2e/              # Playwright end-to-end tests
│   └── public/           # Webpack output
├── docs/adr/             # Architecture Decision Records
├── scripts/              # Build helpers
├── .github/workflows/    # CI pipeline
└── Makefile              # Convenience targets (Unix)
```

## Build commands

| Task | Command |
|------|---------|
| Rust tests | `cargo test` |
| WASM build | `wasm-pack build --target bundler --out-dir pkg` |
| Dev server | `cd frontend && npm run dev` |
| Typecheck | `cd frontend && npm run typecheck` |
| Unit tests | `cd frontend && npm run test` |
| E2E tests | `cd frontend && npm run e2e` |
| Production build | `cd frontend && npm run build` |

## Critical conventions

1. **Never push to `main`** — always use feature branches and PRs.
2. **WASM must be built before frontend** — the webpack alias points `image-editor-bk-rust` to `../pkg`.
3. **TypeScript migration is incremental** — new code should be `.ts`/`.tsx`; convert touched `.js` files when practical.
4. **Redux uses Immutable.js** — state slices like `imgStat` return Immutable maps.
5. **imgObj singleton** (`frontend/src/components/common/imgObj.ts`) manages the WASM `Image` instance and undo/redo history.

## WASM ↔ JS boundary

- Rust exports `Image` class via `wasm-bindgen` in `src/image/mod.rs`
- Frontend imports: `import { Image } from 'image-editor-bk-rust/image_editor'`
- Webpack alias resolves this to the local `pkg/` directory
- Type declarations in `frontend/src/declarations.d.ts`

## Testing strategy

- **Rust**: `cargo test` for core logic
- **Frontend unit**: Vitest (`frontend/src/**/*.test.ts`)
- **E2E**: Playwright (`frontend/e2e/`) — validates UI shell, navigation, canvas presence

## CI pipeline

Three parallel jobs on every PR to `main`:
1. `rust` — cargo test + wasm-pack build
2. `frontend` — typecheck, vitest, production build
3. `e2e` — Playwright against dev server

## When making changes

- Read relevant ADRs in `docs/adr/` before architectural changes
- Update ADRs when introducing new patterns
- Run full local verification before suggesting PR is ready
- Keep diffs focused — don't refactor unrelated files

## Common pitfalls

- `pkg/` doesn't exist → run `wasm-pack build` first
- Duplicate `.js`/`.tsx` files → webpack resolves `.ts` first; delete stale `.js` duplicates
- `store.ts` is canonical; don't recreate `store.js`
- Production webpack config must include `ts-loader` (same as dev)

## Dependencies

- Frontend deps are in `frontend/package.json` (not root)
- Legacy `babel-polyfill` and `babel-preset-env` were removed — use `@babel/preset-*` only
- `image-editor-bk-rust` is NOT an npm package — it's a webpack alias to local `pkg/`
