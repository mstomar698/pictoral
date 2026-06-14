# Pictoral — Stabilization & Roadmap

## Objective
Make Pictoral a reproducible, easy-to-build web image editor by: producing a stable WASM build for the Rust core, adding a minimal frontend to exercise the WASM package, and adding CI and docs so other contributors can reproduce and extend the project.

## Current status (quick facts)
- Rust core crate (`image-editor`) compiles for the host (dev profile) — native build succeeded locally.
- `wasm-pack` is not present in this environment; a wasm packaging step is required to produce JS bindings.
- The `frontend/` directory is currently empty (no React/JS app checked in).
- `Cargo.toml` was updated to bump `wasm-bindgen` to a compatible release to allow compilation.

## Assumptions
- Contributor has `rustup` and `cargo` installed.
- For convenient WASM packaging we prefer `wasm-pack`; alternatively `cargo build --target wasm32-unknown-unknown` + `wasm-bindgen-cli` works.

## Phase 0 — Triage & Reproducible Build
1. Add clear reproducible build commands and small helper scripts.
   - Add `Makefile` or `scripts/` with targets: `make build-native`, `make build-wasm`, `make clean`.
   - Document exact tool versions used (Rust stable, wasm-pack version).
2. Ensure required Rust targets/tools installed (commands to run):
   - `rustup target add wasm32-unknown-unknown`
   - `cargo install wasm-bindgen-cli` (optional)
   - `curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh` (to install `wasm-pack`)
3. Produce a wasm artifact for consumption by JS — automated:
   - `wasm-pack build --target web --out-dir frontend/pkg`
   - If `wasm-pack` is unavailable: `cargo build --target wasm32-unknown-unknown --release` then `wasm-bindgen --out-dir frontend/pkg --target web target/wasm32-unknown-unknown/release/image_editor.wasm`

## Phase 1 — Minimal Frontend & Integration
1. Add a minimal `demo/` or `frontend/` scaffold to load the produced `pkg/`:
   - Simple HTML page with `<input type="file">` and canvas to show images.
   - Minimal JS to instantiate `wasm_bindgen` and call `Image::new`/manipulation functions from Rust.
2. Add an npm `package.json` for dev server (optional). Quick start: `serve`, `http-server`, or simple `parcel/webpack` dev script.
3. Add example flows: load image, apply a single filter (blur), display result, save/export.

## Phase 2 — Tests & CI
1. Add `wasm-bindgen-test`-based tests for core numerical routines (where feasible).
2. Add a GitHub Actions workflow that:
   - Installs Rust toolchain and adds wasm target.
   - Installs `wasm-pack` (or `wasm-bindgen-cli`).
   - Runs `wasm-pack build` and builds the frontend (if present).
   - Optionally publishes a built demo artifact or deploys to GitHub Pages for a nightly demo.

## Phase 3 — Stabilize & Improve
1. Add undo/redo non-destructive editing and robust state management for image buffers.
2. Add benchmarks and profiling for heavy ops (blur, resize) and optimize hotspots.
3. Add memory/edge-case tests (tiny images, very large images) and defensive checks.

## Phase 4 — Product & Delivery
1. Document API (Rust->WASM) surface and provide a small JS wrapper to simplify usage.
2. Publish as an npm-scoped package or static WASM artifacts for consumption.
3. Prepare a contributor guide and a release checklist.

## First concrete tasks (prioritized)
1. Add `Makefile` + `scripts/` and update `README.md` with exact commands.
2. Install `wasm-pack` locally and run `wasm-pack build --target web --out-dir frontend/pkg` to produce `pkg/`.
3. Add a minimal `frontend/demo/index.html` + `demo/main.js` showing how to load the WASM and call a sample filter.
4. Add a GitHub Actions workflow to build WASM and run `cargo test`.

## Local run commands (quick)
1. Build native (quick):
   - `cargo build --manifest-path Cargo.toml`
2. Build WASM (recommended):
   - `wasm-pack build --target web --out-dir frontend/pkg`
3. Serve demo:
   - `cd frontend && npx http-server .`

## Notes / Risks
- The frontend is missing; to make a runnable demo we must either import an existing frontend or scaffold a minimal demo.
- Installing `wasm-pack` or `wasm-bindgen-cli` is required on CI/dev machines.

---

If you want, I can:
- scaffold `frontend/demo` (HTML + JS) that loads the WASM and demonstrates `scale` and `blur` operations, or
- add `Makefile` + GitHub Actions workflow to automate building and publishing the demo.
