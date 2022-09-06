- npm i -g wasm-pack
- wasm-pack build
- cd frontend
- npm i --legacy-peer-deps
- cd ../pkg
- npm link
- cd ../frontend
- npm link image-editor --legacy-peer-deps
- npm run start
- goto `http://localhost:8080/image-editor`

# run all commands in line to initiate web-app
