import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const envPath = resolve(root, '.env');
const outputPath = resolve(root, 'public', 'runtime-config.js');

const content = await readFile(envPath, 'utf8');
const values = new Map();

for (const line of content.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  const separator = trimmed.indexOf('=');
  if (separator < 1) continue;

  const key = trimmed.slice(0, separator).trim();
  const value = trimmed.slice(separator + 1).trim();
  values.set(key, value);
}

const apiUrl = values.get('BOMBERMAN_API_URL');
const hubUrl = values.get('BOMBERMAN_HUB_URL');

if (!apiUrl || !hubUrl) {
  throw new Error('El archivo .env debe definir BOMBERMAN_API_URL y BOMBERMAN_HUB_URL.');
}

const runtimeConfig = { apiUrl, hubUrl };
const output = `globalThis.__BOMBERMAN_CONFIG__ = ${JSON.stringify(runtimeConfig)};\n`;

await writeFile(outputPath, output, 'utf8');
