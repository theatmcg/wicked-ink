import path from 'node:path';
import { Box, Text } from 'ink';
import { theme } from './theme.js';

export type StatusInfo = {
    journalDir: string;
    entryCount: number;
    screen: string;
    filterCount?: number;
    query?: string;
};

function shortenDir(dir: string): string {
    if (!dir) return '(no JOURNAL_DIR)';
    const home = process.env.HOME;
    const display = home && dir.startsWith(home) ? `~${dir.slice(home.length)}` : dir;
    const parts = display.split(path.sep).filter(Boolean);
    if (parts.length <= 3) return display;
    return `…/${parts.slice(-3).join('/')}`;
}

export function StatusLine({
    journalDir,
    entryCount,
    screen,
    filterCount,
    query,
}: StatusInfo) {
    const today = new Date().toISOString().slice(0, 10);
    const countLabel =
        typeof filterCount === 'number' && query
            ? `${filterCount}/${entryCount} entries`
            : `${entryCount} entries`;

    return (
        <Box
            marginTop={1}
            paddingTop={1}
            borderStyle="single"
            borderColor={theme.border}
            borderDimColor
            borderLeft={false}
            borderRight={false}
            borderBottom={false}
        >
            <Text color={theme.status} dimColor>
                {screen}
                <Text dimColor> · </Text>
                {shortenDir(journalDir)}
                <Text dimColor> · </Text>
                {countLabel}
                <Text dimColor> · </Text>
                {today}
            </Text>
        </Box>
    );
}
