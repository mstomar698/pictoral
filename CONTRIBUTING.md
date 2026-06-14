# Contributing to Pictoral

Thank you for contributing to Pictoral. This project uses a **PR-only workflow** — never push directly to `main`.

## Getting started

### Prerequisites

- Rust stable (`rustup` recommended)
- `wasm-pack` ([install guide](https://rustwasm.github.io/wasm-pack/installer/))
- Node.js 20+
- GitHub CLI (`gh`) for opening PRs

### Local setup

```bash
# 1. Clone and install WASM target
git clone https://github.com/mstomar698/pictoral.git
cd pictoral
rustup target add wasm32-unknown-unknown

# 2. Build the Rust/WASM core
wasm-pack build --target bundler --out-dir pkg

# 3. Start the frontend
cd frontend
npm ci
npm run dev
```

Open http://localhost:3000

### Running tests

```bash
# Rust unit tests
cargo test

# Frontend typecheck + unit tests
cd frontend
npm run typecheck
npm run test

# Playwright E2E (starts dev server automatically)
npm run e2e
```

## Development workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout main && git pull
   git checkout -b feat/your-feature
   ```

2. **Make changes** following existing code style.

3. **Verify locally** — all CI checks must pass:
   - `cargo test`
   - `wasm-pack build --target bundler --out-dir pkg`
   - `cd frontend && npm run typecheck && npm run test && npm run build`
   - `cd frontend && npm run e2e` (for UI changes)

4. **Open a PR** via GitHub CLI:
   ```bash
   git push -u origin HEAD
   gh pr create --fill
   ```

5. **Wait for CI** — all three jobs (Rust/WASM, Frontend, E2E) must be green before merge.

## Architecture decisions

Significant technical decisions are recorded as ADRs in [`docs/adr/`](docs/adr/). Add a new ADR when you:

- Change the WASM build or packaging strategy
- Introduce a new framework or major dependency
- Alter the CI/CD pipeline structure
- Change the frontend state management approach

## TypeScript migration

The frontend is being migrated from JavaScript to TypeScript incrementally. When touching a file:

- Prefer converting `.js` → `.ts`/`.tsx` in the same PR if the change is small
- Add types to `src/types.ts` for shared interfaces
- Run `npm run typecheck` before pushing

## Code of conduct

Be respectful and constructive. This project will be made public — write code and comments you'd be comfortable sharing openly.

## Questions?

Open a GitHub issue or start a discussion on your PR.
