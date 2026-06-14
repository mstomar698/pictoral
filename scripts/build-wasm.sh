#!/usr/bin/env bash
set -euo pipefail

if ! command -v wasm-pack >/dev/null 2>&1; then
  echo "wasm-pack not found. Install it with:\n  curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh"
  exit 1
fi

echo "Building WASM package into pkg/ (repo root)..."
wasm-pack build --target bundler --out-dir pkg
echo "WASM build complete: pkg/ contains JS + .wasm files"
