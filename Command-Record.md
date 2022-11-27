##### Req:

```bash
 npm i -g wasm-pack
```

```bash
wasm-pack build

cd frontend && npm i --legacy-peer-deps
cd ../pkg && npm link
cd ../frontend && npm link image-editor --legacy-peer-deps

clear
npm run start

cd .. && clear 
exit
```

# run all commands in line to initiate web-app
