# React-WASM-Rust template

- A web-app that provide image manipulation and processing functionalities with the help of rust and wasm-pack.

###### By: Mayank Singh Tomar

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
git clone https://github.com/edwardwohaijun/image-editor.git
```

#### In source folder `./image-editor`

```bash
wasm-pack build
```

#### Then in Frontend folder `./image-editor/frontend`

```bash
npm install --legacy-peer-deps
```

#### To run:

###### Then in pkg folder `./image-editor/pkg`

```bash
npm link
```

###### and in frontend folder `./image-editor/frontend`

```bash
npm link image-editor
```

###### and finally in frontend folder `./image-editor/frontend`

```bash
npm run start
```

To make it run on `http://localhost:8080/image-editor`

### License

This project is licensed under [MIT](https://www.mit.edu/~amini/LICENSE.md)
