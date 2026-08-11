import { Text } from 'ink';
import { Frame } from '../Frame.js';
import type { StatusInfo } from '../StatusLine.js';
import { theme } from '../theme.js';

type MessageScreenProps = {
    message: string;
    status: StatusInfo;
    tone?: 'info' | 'error';
    hint?: string;
};

export function MessageScreen({
    message,
    status,
    tone = 'info',
    hint = 'Enter/Esc · continue',
}: MessageScreenProps) {
    return (
        <Frame hint={hint} status={{ ...status, screen: 'message' }}>
            <Text color={tone === 'error' ? theme.danger : theme.info}>
                {message}
            </Text>
        </Frame>
    );
}
