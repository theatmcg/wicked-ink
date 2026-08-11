#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = path.join(root, 'src/index.ts');
const tsxCli = path.join(root, 'node_modules/tsx/dist/cli.mjs');

const result = spawnSync(process.execPath, [tsxCli, entry, ...process.argv.slice(2)], {
    stdio: 'inherit',
    cwd: root,
    env: process.env,
});

process.exit(result.status ?? 1);
