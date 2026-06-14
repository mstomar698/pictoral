# ADR-0003: PR-Based CI/CD with GitHub Actions

## Status
Accepted

## Context
The repository will become public OSS under `mstomar698/pictoral`. We need reproducible builds, automated testing, and a workflow that treats `main` as protected even before GitHub branch protection is enabled.

## Decision

### Workflow rules
- **All changes go through pull requests** — no direct pushes to `main`
- CI runs on every PR and push to `main`

### CI pipeline (`.github/workflows/ci.yml`)
Three jobs with artifact passing:

| Job | Steps |
|-----|-------|
| `rust` | `cargo test`, `wasm-pack build`, upload `pkg/` artifact |
| `frontend` | download `pkg/`, `npm ci`, typecheck, vitest, production build |
| `e2e` | download `pkg/`, `npm ci`, Playwright against dev server |

### Testing layers
- **Rust unit tests**: `cargo test`
- **Frontend unit tests**: Vitest (reducers, utilities)
- **E2E UI validation**: Playwright (shell, navigation, canvas)

## Consequences

### Positive
- WASM artifact is built once and reused by frontend/e2e jobs
- Contributors get fast feedback on PRs
- Ready for public release with minimal additional setup

### Negative
- CI requires ~3–5 minutes per PR (WASM compile is the bottleneck)
- Playwright needs Chromium in CI (handled via `playwright install --with-deps`)

## Future work
- Add branch protection rules on `main` when repo goes public
- Nightly WASM benchmark job
- GitHub Pages deploy for demo
