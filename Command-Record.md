- npm i -g wasm-pack
- cd frontend
- npm i --legacy-peer-deps
- cd ..
- wasm-pack build
- cd pkg
- npm link
- cd ../frontend
- npm link image-editor
- npm run start

# run all commands in line to initiate web-app
