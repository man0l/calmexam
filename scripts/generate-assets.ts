import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

type RGBA = [number, number, number, number];

const TEAL: RGBA = [0x2e, 0x6e, 0x68, 255];
const CREAM: RGBA = [0xf5, 0xf3, 0xee, 255];
const CLEAR: RGBA = [0, 0, 0, 0];

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function encodePng(size: number, pixels: Uint8Array): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    Buffer.from(pixels.buffer, y * size * 4, size * 4).copy(raw, y * (size * 4 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

interface Spec {
  size: number;
  background: RGBA;
  tile: { inset: number; radius: number } | null;
  markScale: number;
}

function roundedRectDistance(x: number, y: number, x0: number, y0: number, x1: number, y1: number, r: number): number {
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const hx = (x1 - x0) / 2 - r;
  const hy = (y1 - y0) / 2 - r;
  const qx = Math.abs(x - cx) - hx;
  const qy = Math.abs(y - cy) - hy;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

function segmentDistance(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function wavePolylines(size: number, scale: number): number[][] {
  const c = size / 2;
  const half = size * 0.24 * scale;
  const amp = size * 0.05 * scale;
  const gap = size * 0.095 * scale;
  const steps = 160;
  return [-gap, gap].map((off) => {
    const pts: number[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pts.push(c - half + t * 2 * half, c + off - amp * Math.sin(t * 2 * Math.PI));
    }
    return pts;
  });
}

function coverage(d: number): number {
  return Math.max(0, Math.min(1, 0.5 - d));
}

function blend(under: RGBA, over: RGBA, a: number): RGBA {
  const oa = (over[3] / 255) * a;
  const ua = under[3] / 255;
  const outA = oa + ua * (1 - oa);
  if (outA === 0) return CLEAR;
  const ch = (i: number) => Math.round((over[i] * oa + under[i] * ua * (1 - oa)) / outA);
  return [ch(0), ch(1), ch(2), Math.round(outA * 255)];
}

function render(spec: Spec): Buffer {
  const { size } = spec;
  const px = new Uint8Array(size * size * 4);
  const lines = wavePolylines(size, spec.markScale);
  const thick = size * 0.036 * spec.markScale;
  const minX = size * (0.5 - 0.24 * spec.markScale) - thick - 2;
  const maxX = size - minX;
  const minY = size * (0.5 - 0.15 * spec.markScale) - thick - 2;
  const maxY = size - minY;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const fx = x + 0.5;
      const fy = y + 0.5;
      let col: RGBA = spec.background;
      if (spec.tile) {
        const i = spec.tile.inset * size;
        col = blend(col, TEAL, coverage(roundedRectDistance(fx, fy, i, i, size - i, size - i, spec.tile.radius * size)));
      }
      if (fx >= minX && fx <= maxX && fy >= minY && fy <= maxY) {
        let d = Infinity;
        for (const pts of lines) {
          for (let k = 0; k + 3 < pts.length; k += 2) {
            d = Math.min(d, segmentDistance(fx, fy, pts[k], pts[k + 1], pts[k + 2], pts[k + 3]));
          }
        }
        col = blend(col, CREAM, coverage(d - thick));
      }
      px.set(col, (y * size + x) * 4);
    }
  }
  return encodePng(size, px);
}

const out = join(__dirname, '..', 'assets');
const files: [string, Spec][] = [
  ['icon.png', { size: 1024, background: TEAL, tile: null, markScale: 1 }],
  ['adaptive-icon.png', { size: 1024, background: CLEAR, tile: null, markScale: 0.72 }],
  ['splash-icon.png', { size: 512, background: CLEAR, tile: { inset: 0.06, radius: 0.2 }, markScale: 0.9 }],
  ['favicon.png', { size: 64, background: CLEAR, tile: { inset: 0.02, radius: 0.22 }, markScale: 1 }],
];

for (const [name, spec] of files) {
  writeFileSync(join(out, name), render(spec));
  console.log('wrote', name);
}
