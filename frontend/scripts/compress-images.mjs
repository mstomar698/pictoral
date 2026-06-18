import sharp from 'sharp';
import fs from 'fs';

const jobs = [
  ['C:/Users/tomar/.cursor/projects/c-work-mine-pictoral/assets/pictoral-stadium.jpg', 'assets/img/stadium.jpg'],
  ['C:/Users/tomar/.cursor/projects/c-work-mine-pictoral/assets/pictoral-airport.jpg', 'assets/img/airport.jpg'],
  ['C:/Users/tomar/.cursor/projects/c-work-mine-pictoral/assets/pictoral-portrait.jpg', 'assets/img/portrait.jpg'],
];

for (const [src, out] of jobs) {
  await sharp(src).resize(1280).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  console.log(out, fs.statSync(out).size);
}
