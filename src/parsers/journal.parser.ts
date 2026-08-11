export type JournalEntry = {
    name: string;
    reflection: string;
};

function extractReflectionSection(raw: string): string | null {
    const reflectionMatch = raw.match(
        /^#{1,6}\s+.*Reflection.*\n([\s\S]*?)```dataviewjs/im
    );
    if (!reflectionMatch?.[1]) return null;

    return reflectionMatch[1]
        .replace(/\n?\*\*\*\s*$/, '')
        .trim();
}

/** Older notes store the day's prose between the first pair of *** markers. */
function extractProseBetweenSeparators(raw: string): string | null {
    const proseMatch = raw.match(/\*\*\*\s*\n([\s\S]*?)\n\*\*\*/);
    if (!proseMatch?.[1]) return null;

    const prose = proseMatch[1].trim();
    // Skip if this block is just a checklist/heading with no journal prose
    if (!prose || prose.startsWith('###')) return null;

    return prose;
}

export function parseJournalEntry(fileName: string, raw: string): JournalEntry {
    const reflection =
        extractReflectionSection(raw) ??
        extractProseBetweenSeparators(raw) ??
        '';

    return {
        name: fileName,
        reflection,
    };
}
