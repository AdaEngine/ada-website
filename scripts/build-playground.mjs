// Package one Playground shell, its shared Cloud panels and authentication assets.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const source = resolve(process.env.ADA_PLAYGROUND_SOURCE || '../../AdaEngine/Editor/WebUI');
const panels = resolve('dist-panels');
execFileSync('npm', ['run', 'build'], { cwd: source, env: { ...process.env, ADA_CLOUD_PANELS_DIST: panels }, stdio: 'inherit' });
const out = resolve('dist-cloud');
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
cpSync(resolve(source, 'dist'), resolve(out, 'studio'), { recursive: true });
writeFileSync(resolve(out, 'index.html'), readFileSync(resolve(source, 'dist/index.html')));
for (const name of ['fonts', 'images/auth']) {
  if (name === 'fonts' && !existsSync(resolve('public', name))) continue;
  mkdirSync(resolve(out, name, '..'), { recursive: true });
  cpSync(resolve('public', name), resolve(out, name), { recursive: true });
}
console.log('Unified Ada Playground → dist-cloud/ (shared /studio/ assets, one HTML entry)');
