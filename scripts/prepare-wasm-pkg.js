// Patches wasm-pack output for npm publishing under the @pictoral scope.
const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'pkg', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

pkg.name = '@pictoral/wasm-core';
pkg.description = 'WASM image processing core for Pictoral';
pkg.publishConfig = { access: 'public' };
pkg.keywords = ['wasm', 'image-editor', 'rust', 'pictoral'];

fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log('Prepared npm package: @pictoral/wasm-core');
