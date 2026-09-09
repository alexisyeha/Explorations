import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(here, '../assets/chimes');
const sampleRate = 44100;
const duration = 1.35;
const frames = Math.floor(sampleRate * duration);

const tones = {
  clay: 523.25,
  dots: 659.25,
  cobalt: 392.0,
  crescent: 783.99,
  pebble: 880.0,
  star: 1174.66,
};

const writeWav = (name, frequency) => {
  const dataSize = frames * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let previous = 0;
  for (let frame = 0; frame < frames; frame += 1) {
    const time = frame / sampleRate;
    const attack = Math.min(1, time / 0.012);
    const envelope = attack * Math.exp(-time * 3.4);
    const shimmer =
      Math.sin(Math.PI * 2 * frequency * time) * 0.58 +
      Math.sin(Math.PI * 2 * frequency * 2.01 * time) * 0.24 +
      Math.sin(Math.PI * 2 * frequency * 3.93 * time) * 0.12 +
      Math.sin(Math.PI * 2 * frequency * 5.44 * time) * 0.06;
    const softened = previous * 0.18 + shimmer * 0.82;
    previous = softened;
    const sample = Math.max(-1, Math.min(1, softened * envelope * 0.72));
    buffer.writeInt16LE(Math.round(sample * 32767), 44 + frame * 2);
  }

  fs.writeFileSync(path.join(output, `${name}.wav`), buffer);
};

fs.mkdirSync(output, { recursive: true });
Object.entries(tones).forEach(([name, frequency]) =>
  writeWav(name, frequency),
);
