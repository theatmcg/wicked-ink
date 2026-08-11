import { Box, Text } from 'ink';
import type { ReactNode } from 'react';
import { StatusLine, type StatusInfo } from './StatusLine.js';
import { theme } from './theme.js';

type FrameProps = {
    subtitle?: string;
    hint?: string;
    status?: StatusInfo;
    children: ReactNode;
};

export function Frame({ subtitle, hint, status, children }: FrameProps) {
    return (
        <Box flexDirection="column" paddingX={1} paddingY={1}>
            <Text bold color={theme.brand}>
                wicked-ink
            </Text>
            {subtitle ? <Text color={theme.muted}>{subtitle}</Text> : null}
            {hint ? (
                <Text color={theme.muted} dimColor>
                    {hint}
                </Text>
            ) : null}
            <Box marginTop={1} flexDirection="column" flexGrow={1}>
                {children}
            </Box>
            {status ? <StatusLine {...status} /> : null}
        </Box>
    );
}
