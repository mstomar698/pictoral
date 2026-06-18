# Pictoral

A browser-based image editor powered by **Rust + WebAssembly** for high-performance pixel processing and a **React + Redux** frontend for UI and workflow controls.

**Live:** [pictoral.vercel.app](https://pictoral.vercel.app)

[![CI](https://github.com/mstomar698/pictoral/actions/workflows/ci.yml/badge.svg)](https://github.com/mstomar698/pictoral/actions/workflows/ci.yml)

## Features

- Load and edit images in the browser (no server upload required)
- Image filters: Gaussian blur, bilateral filter, sharpen, motion blur, pixelate, miniaturize, cartoonify
- Transform tools: crop, scale, rotate, flip
- Color adjustments: exposure, basic color controls
- Text overlay tool
- Undo/redo history (up to 20 states) with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- Zoom and canvas auto-fit
- Responsive layout (desktop, tablet, mobile)
- Optional sign-in: Google, GitHub, or guest mode
- Privacy, terms, and cookie consent pages

## Architecture

```
┌─────────────────────────────────────┐
│  React + Redux + TypeScript (UI)    │
│  frontend/src/                      │
└──────────────┬──────────────────────┘
               │ webpack alias
┌──────────────▼──────────────────────┐
│  wasm-bindgen JS glue (pkg/)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Rust image algorithms (WASM)       │
│  src/image/                         │
└─────────────────────────────────────┘
```

See [Architecture Decision Records](docs/adr/) for detailed design decisions.

## Prerequisites

- [Rust](https://rustup.rs/) (stable)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- [Node.js](https://nodejs.org/) 20+
- [GitHub CLI](https://cli.github.com/) (for PR workflow)

## Quick start

```bash
# Clone
git clone https://github.com/mstomar698/pictoral.git
cd pictoral

# Add WASM target and build
rustup target add wasm32-unknown-unknown
wasm-pack build --target bundler --out-dir pkg

# Frontend
cd frontend
npm ci
npm run dev
```

Open http://localhost:3000

## Development

```bash
# Rust tests
cargo test

# Frontend typecheck + unit tests
cd frontend
npm run typecheck
npm run test

# E2E UI tests (Playwright)
npm run e2e

# Production build
npm run build
```

## Deployment

Production deploys to **Vercel** via `.github/workflows/deploy-vercel.yml` on pushes to `main`.

Set these environment variables in Vercel for OAuth (guest mode works without them):

| Variable | Purpose |
|----------|---------|
| `GOOGLE_CLIENT_ID` | Google sign-in button |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | Server-side token exchange (`/api/auth/github`) |

GitHub OAuth callback URL: `https://pictoral.vercel.app/auth/callback/github`

Copy `frontend/.env.example` for local development.

## Contributing

All changes go through **pull requests** — never push directly to `main`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow, and [CLAUDE.md](CLAUDE.md) for AI assistant guidance.

## Project structure

```
pictoral/
├── src/                  # Rust image processing core
├── pkg/                  # Generated WASM bindings (build artifact)
├── frontend/
│   ├── src/              # React application
│   └── e2e/              # Playwright tests
├── docs/adr/             # Architecture Decision Records
├── .github/workflows/    # CI pipeline
└── .cursor/skills/       # Cursor agent skills
```

## License

MIT — see [LICENSE](LICENSE) for details.

## Roadmap

See [plan.md](plan.md) for the full stabilization roadmap and phase tracker.
