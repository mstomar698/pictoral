# ADR-0001: Rust/WASM Architecture for Image Processing

## Status
Accepted

## Context
Pictoral needs performant, client-side image manipulation (blur, crop, scale, color adjustments) without round-tripping pixels to a server. The original implementation used Rust compiled to WebAssembly.

## Decision
Keep the **Rust → WASM → JavaScript** architecture:

1. Image processing algorithms live in `src/image/` (Rust)
2. `wasm-bindgen` exposes an `Image` class to JavaScript
3. `wasm-pack build --target bundler --out-dir pkg` produces the JS/WASM bundle
4. The React frontend imports the WASM module via webpack alias (`image-editor-bk-rust` → `../pkg`)

## Consequences

### Positive
- Near-native performance for pixel operations in the browser
- Single codebase for algorithms; no duplicate JS implementations
- Rust's type safety catches buffer/overflow errors at compile time

### Negative
- Build toolchain requires Rust + wasm-pack on every dev machine and in CI
- WASM binary size adds to initial page load
- Debugging across the JS/WASM boundary is harder than pure JS

## Alternatives considered
- **Pure JavaScript (Canvas API / WebGL)**: Simpler toolchain but slower for heavy filters
- **Web Workers + OffscreenCanvas**: Could complement WASM but doesn't replace the need for fast pixel math
- **Server-side processing**: Rejected for privacy and latency reasons

## References
- [wasm-pack documentation](https://rustwasm.github.io/docs/wasm-pack/)
- `scripts/build-wasm.sh`, `Makefile`, `.github/workflows/ci.yml`
