import { X, Plus } from 'lucide-react';
import { useRef, useEffect } from 'react';

export interface Tab {
    id: string;
    title: string;
    active: boolean;
}

interface TabBarProps {
    tabs: Tab[];
    onSwitch: (id: string) => void;
    onClose: (id: string) => void;
    onNew: () => void;
}

const TabBar = ({ tabs, onSwitch, onClose, onNew }: TabBarProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Scroll active tab into view
    useEffect(() => {
        const activeTab = tabs.find(t => t.active);
        if (activeTab && scrollContainerRef.current) {
            // Simple approach: find the element via ID or index? 
            // We'll rely on user interaction for now, or add sophisticated scrolling logic later.
        }
    }, [tabs]);

    return (
        <div style={{
            height: '40px',
            backgroundColor: 'rgba(0,0,0,0.2)', // Slightly darker than main bg
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            gap: '8px',
            userSelect: 'none',
            zIndex: 10
        }}>
            <div
                ref={scrollContainerRef}
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-end',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    height: '100%',
                    gap: '2px'
                }}
            >
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        onClick={() => onSwitch(tab.id)}
                        className={`tab-item ${tab.active ? 'active' : ''}`}
                        title={tab.title}
                        style={{
                            minWidth: '120px',
                            maxWidth: '200px',
                            height: '32px',
                            backgroundColor: tab.active ? 'var(--color-glass-panel)' : 'transparent',
                            color: tab.active ? 'var(--color-starlight)' : 'var(--color-ghost)',
                            borderTopLeftRadius: '6px',
                            borderTopRightRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 12px',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.15s ease',
                            fontSize: '12px',
                            border: tab.active ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
                            borderBottom: tab.active ? 'none' : '1px solid transparent', // Trick to blend with content
                            marginBottom: tab.active ? '-1px' : '0', // Overlap bottom border
                        }}
                    >
                        <span style={{
                            flex: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginRight: '8px'
                        }}>
                            {tab.title || 'Terminal'}
                        </span>

                        <div
                            className="close-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose(tab.id);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                            }}
                        >
                            <X size={10} />
                        </div>

                        {/* Active Indicator Line */}
                        {tab.active && (
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '2px', // Thin line
                                backgroundColor: 'var(--color-vibrant-purple)', // Use accent color
                                borderRadius: '2px'
                            }} />
                        )}
                    </div>
                ))}

                {/* New Tab Button - Moved Inline */}
                <button
                    onClick={onNew}
                    style={{
                        width: '32px',
                        height: '28px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-ghost)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        alignSelf: 'center',
                        marginLeft: '2px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="New Tab (⌘T)"
                >
                    <Plus size={16} />
                </button>
            </div>

            <style>{`
                .tab-item:hover {
                    background-color: rgba(255,255,255,0.05);
                }
                .tab-item.active {
                    background-color: var(--color-glass-panel) !important;
                }
                .tab-item .close-btn {
                    opacity: 0;
                }
                .tab-item:hover .close-btn, .tab-item.active .close-btn {
                    opacity: 1;
                }
                .close-btn:hover {
                    background-color: rgba(239, 68, 68, 0.2);
                    color: #f87171;
                }
            `}</style>
        </div>
    );
};

export default TabBar;
