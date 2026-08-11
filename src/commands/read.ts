import { runApp } from '../ui/App.js';

export async function read(nameOrPath?: string) {
    const target = nameOrPath?.trim();

    if (target) {
        await runApp({
            startAt: 'reflection',
            initialTarget: target,
            persistent: false,
        });
        return;
    }

    await runApp({ startAt: 'select', persistent: false });
}
