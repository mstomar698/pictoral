# ADR-0005: WASM Bundler Target for Webpack

## Status
Accepted

## Context
`wasm-pack --target web` generates ESM output that uses `import.meta.url` to load the `.wasm` file at runtime. Webpack 5's `experiments.asyncWebAssembly` expects the `bundler` target layout, which includes `image_editor_bg.js` as a companion glue file.

Using `--target web` caused production builds to fail:
```
Can't resolve './image_editor_bg.js' in 'pkg/'
```

## Decision
Build WASM with **`wasm-pack build --target bundler --out-dir pkg`** everywhere (local dev, CI, Makefile, scripts).

The bundler target produces:
- `image_editor.js` — re-exports `Image` from bg glue
- `image_editor_bg.js` — wasm-bindgen runtime
- `image_editor_bg.wasm` — compiled binary

## Consequences

### Positive
- Webpack resolves WASM imports without custom plugins
- Works with both dev server and production builds
- Standard approach for webpack-based frontends

### Negative
- Not suitable for bare `<script type="module">` without a bundler
- If we add a no-bundler demo page later, use `--target web` in a separate output dir

## Related changes
- Removed direct `memory` imports from JS; added `Image.pixels_data()` Rust method instead (ADR-0001 supplement)
