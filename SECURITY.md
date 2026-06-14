# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| main    | ✅ Active development |

## Reporting a vulnerability

If you discover a security vulnerability in Pictoral:

1. **Do not** open a public GitHub issue
2. Email or DM the maintainer via GitHub (`mstomar698`)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We aim to acknowledge reports within 48 hours and provide a fix timeline within 7 days for confirmed issues.

## Scope

### In scope
- Rust/WASM image processing core (`src/`)
- React frontend (`frontend/src/`)
- CI/CD pipeline (`.github/workflows/`)
- Dependency vulnerabilities surfaced by `npm audit` / `cargo audit`

### Out of scope
- Third-party npm/Rust crate vulnerabilities already tracked upstream
- Denial-of-service via intentionally large image uploads (client-side only)

## Dependency management

- Frontend dependencies are audited via `npm audit` in CI
- Legacy packages (`babel-polyfill`, `babel-preset-env`) have been removed
- See [ADR-0004](docs/adr/0004-dependency-modernization.md) for the modernization strategy
