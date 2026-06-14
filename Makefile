.PHONY: build-native build-wasm serve clean test e2e typecheck

build-native:
	cargo build --manifest-path Cargo.toml

build-wasm:
	@command -v wasm-pack >/dev/null 2>&1 || (echo "wasm-pack not found. Install: cargo install wasm-pack" && exit 1)
	wasm-pack build --target bundler --out-dir pkg

serve:
	cd frontend && npm run dev

clean:
	cargo clean
	rm -rf pkg frontend/public/bootstrap.js

test:
	cargo test
	cd frontend && npm run test

e2e:
	cd frontend && npm run e2e

typecheck:
	cd frontend && npm run typecheck
