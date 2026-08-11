import { runApp } from '../ui/App.js';

/** Always-on interactive app. Screens replace each other in place. */
export async function shell() {
    await runApp({ startAt: 'menu', persistent: true });
}
