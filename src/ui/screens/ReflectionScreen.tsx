import { Box, Text } from 'ink';
import { Frame } from '../Frame.js';
import type { StatusInfo } from '../StatusLine.js';
import { theme } from '../theme.js';

type ReflectionScreenProps = {
    title: string;
    reflection: string;
    status: StatusInfo;
    footerHint?: string;
};

export function ReflectionScreen({
    title,
    reflection,
    status,
    footerHint = 'Enter/Esc · back to menu',
}: ReflectionScreenProps) {
    return (
        <Frame
            subtitle={title}
            hint={footerHint}
            status={{ ...status, screen: 'reflection' }}
        >
            <Text color={theme.border}>
                {'─'.repeat(Math.min(40, title.length + 8))}
            </Text>
            <Box marginTop={1} flexDirection="column">
                {reflection.split('\n').map((line, index) => (
                    <Text key={`${index}-${line.slice(0, 16)}`} color={theme.accent}>
                        {line || ' '}
                    </Text>
                ))}
            </Box>
        </Frame>
    );
}
