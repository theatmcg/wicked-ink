import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { Command } from 'commander';
import { read } from './commands/read.js';
import { shell } from './commands/shell.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(root, '.env'), quiet: true });

const program = new Command();

program
    .name('wicked')
    .description('A dark-gothic journaling companion')
    .action(shell);

program
    .command('read [nameOrPath]')
    .description('Read a reflection by name/path, or interactively select one')
    .action(read);

await program.parseAsync();
