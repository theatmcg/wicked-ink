import { Box } from 'ink';
import SelectInput from 'ink-select-input';
import { Frame } from '../Frame.js';
import type { StatusInfo } from '../StatusLine.js';

export type MenuAction = 'read' | 'exit';

type MenuScreenProps = {
    status: StatusInfo;
    onSelect: (action: MenuAction) => void;
};

export function MenuScreen({ status, onSelect }: MenuScreenProps) {
    const items: Array<{ label: string; value: MenuAction }> = [
        { label: 'Read a reflection', value: 'read' },
        { label: 'Exit', value: 'exit' },
    ];

    return (
        <Frame
            subtitle="A dark-gothic journaling companion"
            hint="↑/↓ · Enter · Esc/q to exit"
            status={{ ...status, screen: 'menu' }}
        >
            <Box>
                <SelectInput
                    items={items}
                    onSelect={(item) => onSelect(item.value)}
                />
            </Box>
        </Frame>
    );
}
