# Pictoral

- A web-app that provide image manipulation and processing functionalities with the help of rust and wasm-pack.
- It makes image transformation quick and secure with the help of webassembly.


# Installation

## Prerequisites

Upgrade npm, install Rust and wasm-pack(a one-stop shop for building and working with Rust-generated WebAssembly that you would like to interop with JavaScript).

```bash
npm install npm@latest -g
curl https://sh.rustup.rs -sSf | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

## To run locally

### Clone the repo

```bash
git clone https://github.com/mstomar698/pictoral
#### In source folder 
wasm-pack build
#### Then in Frontend folder 
npm install --legacy-peer-deps
# setup
npm run start
```

To make it run on `http://localhost:8080/image-editor`

