export type HistoryItem = {
    id: string;
    cmd: string;
    timestamp: number;
    pinned?: boolean;
};

export type GroupedHistory = {
    label: string;
    items: HistoryItem[];
};

export const groupHistoryByDate = (history: HistoryItem[]): GroupedHistory[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups: { [key: string]: HistoryItem[] } = {
        'Today': [],
        'Yesterday': [],
        'Last 7 Days': [],
        'Older': []
    };

    history.forEach(item => {
        const date = new Date(item.timestamp);
        date.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) {
            groups['Today'].push(item);
        } else if (date.getTime() === yesterday.getTime()) {
            groups['Yesterday'].push(item);
        } else if (date > lastWeek) {
            groups['Last 7 Days'].push(item);
        } else {
            groups['Older'].push(item);
        }
    });

    return Object.entries(groups)
        .filter(([_, items]) => items.length > 0)
        .map(([label, items]) => ({
            label,
            items: items.sort((a, b) => b.timestamp - a.timestamp)
        }));
};

export const generateMockHistory = (): HistoryItem[] => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    return [
        { id: '1', cmd: 'npm run dev', timestamp: now - 1000 * 60 * 5 }, // 5 mins ago
        { id: '2', cmd: 'git status', timestamp: now - 1000 * 60 * 15 }, // 15 mins ago
        { id: '3', cmd: 'cargo check', timestamp: now - day + 1000 * 60 * 60 }, // Yesterday
        { id: '4', cmd: 'cd src-tauri', timestamp: now - day * 2 }, // 2 days ago
        { id: '5', cmd: 'ls -la', timestamp: now - day * 5 }, // 5 days ago
        { id: '6', cmd: 'vim lib.rs', timestamp: now - day * 8 }, // 8 days ago
    ];
};
