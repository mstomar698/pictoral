# Pictoral

Pictoral is a web image editor powered by Rust + WebAssembly for image processing and a JavaScript frontend for UI/workflow controls.

## Current code snapshot
- Rust core crate compiled to WASM (`image-editor`).
- Frontend uses React/Redux and custom canvas/tooling stack.
- Core editor shell exists (tool pane, canvas, zoom, file loading).

## Serviceability roadmap
1. **Toolchain modernization:** simplify build/dev scripts and lock reproducible WASM builds.
2. **Editing reliability:** undo/redo history, non-destructive edits, and robust import/export.
3. **Product features:** batch operations, presets, and metadata-aware processing.
4. **Delivery quality:** performance profiling and compatibility testing across browsers/devices.

## Client-ready enhancement scope
- Plugin architecture for custom filters/effects.
- Team workflow with shared presets.
- SaaS mode for quick online editing.
- API offering for server-side transformations.

## Local setup
```bash
# Rust/WASM build
wasm-pack build

# frontend
cd frontend
npm install --legacy-peer-deps
npm run start
```
