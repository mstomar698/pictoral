.PHONY: build-native build-wasm serve clean

build-native:
	cargo build --manifest-path Cargo.toml

build-wasm:
	@which wasm-pack > /dev/null || (echo "wasm-pack not found. Install via: curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh" && exit 1)
	wasm-pack build --target web --out-dir pkg

serve:
	python3 -m http.server 8080 -d frontend

clean:
	cargo clean
	rm -rf frontend/pkg
