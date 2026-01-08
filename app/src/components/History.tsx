import { useMemo } from 'react';
import { Search, Copy, Check, Trash2, Clipboard, Pin, PinOff } from 'lucide-react';
import { groupHistoryByDate, HistoryItem } from '../utils/historyUtils';
import { useHistory } from '../context/HistoryContext';
import { useState } from 'react';

interface HistoryProps {
    onClose: () => void;
    onInsert: (cmd: string) => void;
}

const History = ({ onClose, onInsert }: HistoryProps) => {
    const { historyItems, clearHistory, searchQuery, setSearchQuery, togglePin } = useHistory();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredHistory = useMemo(() => {
        return historyItems.filter(item =>
            item.cmd.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [historyItems, searchQuery]);

    const pinnedItems = useMemo(() => filteredHistory.filter(i => i.pinned), [filteredHistory]);
    const unpinnedItems = useMemo(() => filteredHistory.filter(i => !i.pinned), [filteredHistory]);

    const groupedHistory = useMemo(() => groupHistoryByDate(unpinnedItems), [unpinnedItems]);

    const handleCopy = async (e: React.MouseEvent, item: HistoryItem) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(item.cmd);
            setCopiedId(item.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handlePin = (e: React.MouseEvent, item: HistoryItem) => {
        e.stopPropagation();
        togglePin(item.id);
    };

    const handleInsert = (cmd: string) => {
        onInsert(cmd);
        onClose();
    };

    const handleClearHistory = () => {
        if (window.confirm('Are you sure you want to clear all history?')) {
            clearHistory();
        }
    };

    const renderItem = (item: HistoryItem) => (
        <div
            key={item.id}
            className="history-item"
            onDoubleClick={() => handleInsert(item.cmd)}
            style={{
                padding: '10px 12px',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                position: 'relative',
                background: item.pinned ? 'rgba(var(--color-electric-cyan-rgb), 0.03)' : 'transparent'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', flex: 1 }}>
                {/* Pin Icon Component */}
                <button
                    className={`pin-btn ${item.pinned ? 'pinned' : ''}`}
                    onClick={(e) => handlePin(e, item)}
                    title={item.pinned ? "Unpin command" : "Pin command"}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.pinned ? 'var(--color-electric-cyan)' : 'var(--color-ghost)',
                        transition: 'all 0.2s',
                        borderRadius: '4px',
                        flexShrink: 0
                    }}
                >
                    {item.pinned ? <PinOff size={13} /> : <Pin size={13} />}
                </button>

                <span style={{
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: item.pinned ? 'var(--color-starlight)' : 'inherit'
                }} title={item.cmd}>
                    {item.cmd}
                </span>
            </div>

            <button
                className="copy-btn"
                onClick={(e) => handleCopy(e, item)}
                style={{
                    marginLeft: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: copiedId === item.id ? 'var(--color-neon-mint, #34d399)' : 'var(--color-ghost)',
                    flexShrink: 0
                }}
            >
                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
            </button>
        </div>
    );

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: '60px',
            bottom: '28px',
            width: '320px',
            backgroundColor: 'var(--color-glass-panel)',
            borderRight: '1px solid var(--color-border-subtle)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 20,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-starlight)',
            boxShadow: '4px 0 24px rgba(0,0,0,0.2)'
        }}>
            {/* Header */}
            <div style={{
                padding: '24px 24px 16px',
                borderBottom: '1px solid var(--color-border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clipboard size={18} color="var(--color-electric-cyan)" />
                    <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>History</h2>
                </div>
                <button onClick={onClose} style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-ghost)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    ✕
                </button>
            </div>

            <div style={{ padding: '16px 24px', position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '34px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ghost)' }} />
                <input
                    type="text"
                    placeholder="Search commands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: '6px',
                        padding: '8px 12px 8px 32px',
                        color: 'var(--color-starlight)',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>

                {/* Pinned Section */}
                {pinnedItems.length > 0 && (
                    <div key="Pinned" style={{ marginBottom: '20px' }}>
                        <div style={{
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'var(--color-electric-cyan)',
                            letterSpacing: '0.05em',
                            margin: '0 12px 8px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <Pin size={10} /> Pinned
                        </div>
                        {pinnedItems.map(renderItem)}
                    </div>
                )}

                {/* Chronological Groups */}
                {groupedHistory.map((group) => (
                    <div key={group.label} style={{ marginBottom: '20px' }}>
                        <div style={{
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'var(--color-ghost)',
                            letterSpacing: '0.05em',
                            margin: '0 12px 8px',
                            fontWeight: 600
                        }}>
                            {group.label}
                        </div>
                        {group.items.map(renderItem)}
                    </div>
                ))}

                {filteredHistory.length === 0 && (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-ghost)', fontSize: '13px' }}>
                        No history found
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--color-border-subtle)',
                marginTop: 'auto'
            }}>
                <button
                    onClick={handleClearHistory}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-sunset-orange, #fbbf24)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: 0,
                        opacity: 0.8,
                        transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
                >
                    <Trash2 size={12} />
                    Clear History
                </button>
            </div>

            <style>{`
                .history-item:hover {
                    background-color: rgba(255,255,255,0.06) !important;
                }
                /* Show unpinned state on hover */
                .history-item .pin-btn:not(.pinned) {
                    opacity: 0;
                    transform: translateX(-4px);
                }
                .history-item:hover .pin-btn:not(.pinned) {
                    opacity: 1;
                    transform: translateX(0);
                }
                .pin-btn:hover {
                    background-color: rgba(255,255,255,0.1) !important;
                    color: var(--color-starlight) !important;
                }

                .history-item .copy-btn {
                    opacity: 0;
                    transition: opacity 0.2s, color 0.2s;
                }
                .history-item:hover .copy-btn {
                    opacity: 1;
                }
                .history-item:hover .copy-btn:hover {
                    color: var(--color-electric-cyan);
                }
            `}</style>
        </div>
    );
};

export default History;
