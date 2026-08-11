import { useEffect, useMemo, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Frame } from '../Frame.js';
import type { StatusInfo } from '../StatusLine.js';
import { theme } from '../theme.js';

type SelectScreenProps = {
    entries: string[];
    status: StatusInfo;
    onSelect: (entry: string) => void;
    onCancel: () => void;
};

const PAGE_SIZE = 12;

export function SelectScreen({
    entries,
    status,
    onSelect,
    onCancel,
}: SelectScreenProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return entries;
        return entries.filter((entry) => entry.toLowerCase().includes(needle));
    }, [entries, query]);

    // Prefer the newest match when the filter changes; keep selection in range.
    useEffect(() => {
        if (filtered.length === 0) {
            setSelectedIndex(0);
            return;
        }
        setSelectedIndex(query ? 0 : filtered.length - 1);
    }, [query, filtered.length]);

    const windowStart = useMemo(() => {
        if (filtered.length <= PAGE_SIZE) return 0;
        const mid = Math.floor(PAGE_SIZE / 2);
        return Math.min(
            Math.max(0, selectedIndex - mid),
            filtered.length - PAGE_SIZE
        );
    }, [filtered.length, selectedIndex]);

    const visible = filtered.slice(windowStart, windowStart + PAGE_SIZE);

    useInput((input, key) => {
        if (key.escape) {
            if (query) setQuery('');
            else onCancel();
            return;
        }

        if (key.upArrow) {
            setSelectedIndex((index) => Math.max(0, index - 1));
            return;
        }

        if (key.downArrow) {
            setSelectedIndex((index) =>
                Math.min(Math.max(filtered.length - 1, 0), index + 1)
            );
            return;
        }

        if (key.return) {
            const selected = filtered[selectedIndex];
            if (selected) onSelect(selected);
            return;
        }

        if (key.backspace || key.delete) {
            setQuery((current) => current.slice(0, -1));
            return;
        }

        if (key.ctrl || key.meta || key.tab) return;

        if (input) {
            setQuery((current) => current + input);
        }
    });

    const selectStatus: StatusInfo = {
        ...status,
        screen: 'select',
        filterCount: filtered.length,
        ...(query ? { query } : {}),
    };

    return (
        <Frame
            subtitle="Select a journal entry"
            hint="Type to filter · ↑/↓ · Enter · Esc clears filter / back"
            status={selectStatus}
        >
            <Box flexDirection="column">
                <Box marginBottom={1}>
                    <Text color={theme.muted}>Filter: </Text>
                    <Text color={theme.filter}>{query.length > 0 ? query : ' '}</Text>
                    <Text color={theme.highlight}>▌</Text>
                </Box>

                {filtered.length === 0 ? (
                    <Text color={theme.info}>No entries match “{query}”.</Text>
                ) : (
                    <Box flexDirection="column">
                        {visible.map((entry, offset) => {
                            const index = windowStart + offset;
                            const active = index === selectedIndex;
                            return (
                                <Text
                                    key={entry}
                                    color={active ? theme.brand : theme.accent}
                                    bold={active}
                                >
                                    {active ? '❯ ' : '  '}
                                    {entry}
                                </Text>
                            );
                        })}
                    </Box>
                )}
            </Box>
        </Frame>
    );
}
