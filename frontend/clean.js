const fs = require('fs');
const path = require('path');

const directory = 'public';

const deleteFiles = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      deleteFiles(filePath);
    } else {
      const ext = path.extname(filePath);
      if (
        ext === '.html' ||
        ext === '.js' ||
        ext == '.css' ||
        ext == '.map' ||
        ext == '.wasm' ||
        ext == '.txt'
      ) {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${filePath}`);
      }
    }
  });
};

deleteFiles(directory);
console.log('Cleanup completed.');
