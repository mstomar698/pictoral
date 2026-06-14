---
name: pictoral-wasm-build
description: Build and verify the Pictoral Rust/WASM core. Use when working on Rust image processing, wasm-pack builds, or debugging the JS/WASM boundary.
---

# Pictoral WASM Build

## When to use
- Changes in `src/` (Rust core)
- WASM not loading in the frontend
- Before running frontend dev server or E2E tests

## Steps

1. Ensure wasm target is installed:
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

2. Build the WASM package:
   ```bash
   wasm-pack build --target web --out-dir pkg
   ```

3. Verify output exists:
   - `pkg/image_editor.js`
   - `pkg/image_editor_bg.wasm`
   - `pkg/image_editor.d.ts`

4. Run Rust tests:
   ```bash
   cargo test
   ```

## Troubleshooting
- `wasm-pack not found` → `cargo install wasm-pack`
- Frontend import errors → rebuild `pkg/` and restart dev server
- Windows: use Git Bash or PowerShell; `scripts/build-wasm.sh` works in Git Bash
