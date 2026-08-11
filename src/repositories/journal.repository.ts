import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseJournalEntry } from '../parsers/journal.parser.js';

export class JournalRepository {
    getDir(): string {
        return process.env.JOURNAL_DIR ?? '';
    }

    list(): string[] {
        const dir = this.getDir();

        if (!fs.existsSync(dir)) return [];
        return fs
            .readdirSync(dir)
            .filter((file) => file.endsWith('.md'))
            .sort()
            .map((file) => path.basename(file, '.md'));
    }

    /** Accepts a bare date name, `file.md`, or an absolute/relative path. */
    resolveEntryPath(nameOrPath: string): string {
        if (path.isAbsolute(nameOrPath)) return nameOrPath;
        if (nameOrPath.includes('/') || nameOrPath.includes('\\')) {
            return path.resolve(nameOrPath);
        }

        const fileName = nameOrPath.endsWith('.md') ? nameOrPath : `${nameOrPath}.md`;
        return path.join(process.env.JOURNAL_DIR ?? '', fileName);
    }

    read(fullPath: string): string {
        if (!fs.existsSync(fullPath)) return '';
        const raw = fs.readFileSync(fullPath, 'utf8');
        const fileName = path.basename(fullPath);
        return parseJournalEntry(fileName, raw).reflection;
    }
}
