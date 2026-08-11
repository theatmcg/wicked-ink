/** Central color/look tokens for the wicked-ink TUI. */
export const theme = {
    brand: 'magenta',
    accent: 'white',
    muted: 'gray',
    info: 'yellow',
    danger: 'red',
    success: 'green',
    highlight: 'cyan',
    border: 'gray',
    status: 'gray',
    filter: 'magentaBright',
} as const;

export type ThemeColor = (typeof theme)[keyof typeof theme];
