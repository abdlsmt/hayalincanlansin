// Favicon PNG üretici: favicon.svg ile aynı lavanta/rounded-square
// tasarımını saf Node (zlib) ile üretir; bağımlılık gerektirmez.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function makePng(size, path) {
  const lavender = [124, 107, 184, 255]; // #7C6BB8
  const cream = [250, 246, 239, 255]; // #FAF6EF
  const radius = size * 0.22;
  const raw = Buffer.alloc((size * 3 + 1) * size);
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      // Yuvarlatılmış köşe mesafesi
      let inside = true;
      const corners = [
        [radius, radius],
        [size - radius, radius],
        [radius, size - radius],
        [size - radius, size - radius],
      ];
      const inCornerRegion =
        (x < radius && y < radius) ||
        (x >= size - radius && y < radius) ||
        (x < radius && y >= size - radius) ||
        (x >= size - radius && y >= size - radius);
      if (inCornerRegion) {
        let ok = false;
        for (const [ccx, ccy] of corners) {
          const dx = x - ccx;
          const dy = y - ccy;
          if (dx * dx + dy * dy <= radius * radius) ok = true;
        }
        inside = ok;
      }
      let color;
      if (!inside) {
        color = [0, 0, 0, 0];
      } else {
        // Yıldız şekli (basit 5 köşeli, merkezli)
        const nx = (x - size / 2) / (size * 0.3);
        const ny = (y - size / 2) / (size * 0.3);
        const angle = Math.atan2(ny, nx);
        const dist = Math.sqrt(nx * nx + ny * ny);
        const star = Math.abs(Math.cos((5 * angle) / 2)) * 0.5 + 0.5; // 5 köşeli yıldız desene yakın
        color = dist < star * 0.9 ? cream : lavender;
      }
      raw[p++] = color[0];
      raw[p++] = color[1];
      raw[p++] = color[2];
      raw[p++] = color[3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
  console.log(`Oluşturuldu: ${path} (${size}x${size})`);
}

makePng(32, 'public/favicon-32.png');
makePng(16, 'public/favicon-16.png');
