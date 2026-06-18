# OSS Public Release Checklist

Use this checklist before making the repository public and cutting a v1 release.

## Branch protection on `main`

In **Settings → Branches → Add branch protection rule** for `main`:

- [ ] Require a pull request before merging
- [ ] Require approvals: 1 (or more for team repos)
- [ ] Dismiss stale pull request approvals when new commits are pushed
- [ ] Require status checks to pass before merging
  - [ ] `Rust / WASM`
  - [ ] `Frontend build & unit tests`
  - [ ] `Playwright E2E`
- [ ] Require branches to be up to date before merging
- [ ] Do not allow bypassing the above settings
- [ ] Restrict who can push to matching branches (optional: maintainers only)

## GitHub Pages demo (optional)

1. **Settings → Pages → Build and deployment**: Source = **GitHub Actions**
2. Push to `main` triggers `.github/workflows/deploy-pages.yml`
3. Demo URL: `https://mstomar698.github.io/pictoral/`

Primary production URL: [pictoral.vercel.app](https://pictoral.vercel.app)

## npm WASM package

The Rust core publishes as `@pictoral/wasm-core` from the `pkg/` directory:

```bash
wasm-pack build --target bundler --out-dir pkg
node scripts/prepare-wasm-pkg.js
cd pkg && npm publish --access public
```

Consumers install with:

```bash
npm install @pictoral/wasm-core
```

## Pre-release verification

```bash
cargo test
wasm-pack test --headless --chrome
cargo bench --bench image_ops
cd frontend && npm run typecheck && npm run test && npm run e2e && npm run build
```

## Public launch

- [ ] All Dependabot alerts resolved
- [ ] README links to live demo and npm package
- [ ] Repository visibility set to **Public**
- [ ] Create GitHub release `v1.0.0` with WASM + frontend build artifacts
