import { useMemo, useState } from 'react';
import { useApp, useInput, render } from 'ink';
import path from 'node:path';
import { JournalRepository } from '../repositories/journal.repository.js';
import { MenuScreen, type MenuAction } from './screens/MenuScreen.js';
import { SelectScreen } from './screens/SelectScreen.js';
import { ReflectionScreen } from './screens/ReflectionScreen.js';
import { MessageScreen } from './screens/MessageScreen.js';
import type { StatusInfo } from './StatusLine.js';

type Screen =
    | { name: 'menu' }
    | { name: 'select' }
    | { name: 'reflection'; title: string; body: string }
    | { name: 'message'; text: string; tone?: 'info' | 'error'; returnTo: 'menu' | 'exit' };

type AppProps = {
    /** When set, skip the main menu and jump straight into this flow. */
    startAt?: 'menu' | 'select' | 'reflection';
    /** Used with startAt="reflection" for one-shot `wicked read <path>`. */
    initialTarget?: string;
    /** If false, leaving reflection/message exits the process instead of returning to menu. */
    persistent?: boolean;
};

function resolveInitialScreen(
    journal: JournalRepository,
    startAt: AppProps['startAt'],
    initialTarget?: string,
    persistent = true
): Screen {
    if (startAt === 'reflection' && initialTarget) {
        const filePath = journal.resolveEntryPath(initialTarget);
        const body = journal.read(filePath);
        if (!body) {
            return {
                name: 'message',
                text: `Journal entry "${initialTarget}" not found or reflection is empty.`,
                tone: 'error',
                returnTo: persistent ? 'menu' : 'exit',
            };
        }
        return {
            name: 'reflection',
            title: path.basename(filePath, '.md'),
            body,
        };
    }

    if (startAt === 'select') {
        return { name: 'select' };
    }

    return { name: 'menu' };
}

function App({
    startAt = 'menu',
    initialTarget,
    persistent = true,
}: AppProps) {
    const { exit } = useApp();
    const journal = useMemo(() => new JournalRepository(), []);
    const entries = useMemo(() => journal.list(), [journal]);
    const [screen, setScreen] = useState<Screen>(() =>
        resolveInitialScreen(journal, startAt, initialTarget, persistent)
    );

    const status: StatusInfo = {
        journalDir: journal.getDir(),
        entryCount: entries.length,
        screen: screen.name,
    };

    const goHome = () => {
        if (persistent) setScreen({ name: 'menu' });
        else exit();
    };

    const openEntry = (entryName: string) => {
        const filePath = journal.resolveEntryPath(entryName);
        const body = journal.read(filePath);
        if (!body) {
            setScreen({
                name: 'message',
                text: `Journal entry "${entryName}" not found or reflection is empty.`,
                tone: 'error',
                returnTo: persistent ? 'menu' : 'exit',
            });
            return;
        }
        setScreen({
            name: 'reflection',
            title: path.basename(filePath, '.md'),
            body,
        });
    };

    const handleMenu = (action: MenuAction) => {
        if (action === 'exit') {
            exit();
            return;
        }
        if (entries.length === 0) {
            setScreen({
                name: 'message',
                text: 'No journal entries found.',
                tone: 'info',
                returnTo: 'menu',
            });
            return;
        }
        setScreen({ name: 'select' });
    };

    useInput((input, key) => {
        // Select screen owns its own keys (filter + Esc).
        if (screen.name === 'select') return;

        if (screen.name === 'menu') {
            if (key.escape || input === 'q') exit();
            return;
        }

        if (screen.name === 'reflection') {
            if (key.escape || key.return || input === 'q' || input === 'b') {
                goHome();
            }
            return;
        }

        if (screen.name === 'message') {
            if (key.escape || key.return || input === 'q') {
                if (screen.returnTo === 'exit') exit();
                else goHome();
            }
        }
    });

    if (screen.name === 'menu') {
        return <MenuScreen status={status} onSelect={handleMenu} />;
    }

    if (screen.name === 'select') {
        if (entries.length === 0) {
            return (
                <MessageScreen
                    status={status}
                    message="No journal entries found."
                    hint="Enter/Esc · back"
                />
            );
        }
        return (
            <SelectScreen
                entries={entries}
                status={status}
                onSelect={openEntry}
                onCancel={goHome}
            />
        );
    }

    if (screen.name === 'reflection') {
        return (
            <ReflectionScreen
                title={screen.title}
                reflection={screen.body}
                status={status}
                footerHint={
                    persistent
                        ? 'Enter/Esc · back to menu'
                        : 'Enter/Esc · exit'
                }
            />
        );
    }

    return (
        <MessageScreen
            status={status}
            message={screen.text}
            {...(screen.tone ? { tone: screen.tone } : {})}
            hint={
                screen.returnTo === 'exit'
                    ? 'Enter/Esc · exit'
                    : 'Enter/Esc · back to menu'
            }
        />
    );
}

export async function runApp(props: AppProps = {}): Promise<void> {
    const instance = render(<App {...props} />, {
        alternateScreen: true,
    });
    await instance.waitUntilExit();
}
