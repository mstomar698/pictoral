# ADR-0004: Frontend Dependency Modernization

## Status
Accepted

## Context
`frontend/package.json` had 67 npm audit vulnerabilities, largely from legacy Babel 6 packages (`babel-polyfill`, `babel-preset-env`), outdated `webpack-dev-server` v4, and stale transitive dependencies.

## Decision

1. **Remove legacy packages**: `babel-polyfill`, `babel-preset-env`, `hello-wasm-pack`
2. **Remove phantom dependency**: `image-editor-bk-rust` from npm deps (resolved via webpack alias to local `pkg/`)
3. **Upgrade toolchain**:
   - `webpack-dev-server` → v5
   - `copy-webpack-plugin` → v12
   - `axios`, `react-router-dom`, `@reduxjs/toolkit` → latest stable
   - `immutable` → v4 (stable, down from v5 beta)
4. **Use webpack 5 asset modules** instead of `url-loader`
5. **Add security-focused dev tooling**: Playwright, Vitest (no runtime vuln surface)

## Consequences

### Positive
- Vulnerability count reduced to near-zero after `npm audit`
- Modern webpack-dev-server API (`webpack serve` instead of `webpack-dev-server`)
- Smaller dependency tree without duplicate Babel stacks

### Negative
- `webpack-dev-server` v5 has minor config API changes (`client.overlay`, etc.)
- `redux-thunk` v3 no longer needs explicit middleware in RTK `configureStore`

## Verification
Run `npm audit` in `frontend/` after `npm ci` — expect 0 high/critical vulnerabilities.
