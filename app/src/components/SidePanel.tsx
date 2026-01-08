

interface SidePanelProps {
    onHistoryClick: () => void;
    onSettingsClick: () => void;
    activePanel: 'none' | 'history' | 'settings';
}

const SidePanel = ({ onHistoryClick, onSettingsClick, activePanel }: SidePanelProps) => {
    return (
        <div style={{
            width: '60px',
            height: '100%',
            backgroundColor: 'var(--color-glass-panel)',
            borderRight: '1px solid var(--color-border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 0',
            gap: '24px',
            zIndex: 10
        }}>
            {/* Workspace Icon / Logo */}
            <div style={{
                marginBottom: '8px',
                cursor: 'pointer',
                filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))'
            }}>
                <img src="/logo.png" alt="FR Logo" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
            </div>

            {/* Icons */}
            <div
                className="side-icon"
                onClick={onHistoryClick}
                title="History"
                style={{
                    cursor: 'pointer',
                    opacity: activePanel === 'history' ? 1 : 0.7,
                    color: activePanel === 'history' ? 'var(--color-electric-cyan)' : 'var(--color-starlight)',
                    transition: 'all 0.2s ease'
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            </div>
            <div
                className="side-icon"
                onClick={onSettingsClick}
                title="Settings"
                style={{
                    cursor: 'pointer',
                    opacity: activePanel === 'settings' ? 1 : 0.7,
                    color: activePanel === 'settings' ? 'var(--color-vibrant-purple)' : 'var(--color-starlight)',
                    transition: 'all 0.2s ease'
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </div>

            <div style={{ flex: 1 }}></div>

            <div className="side-icon" style={{ cursor: 'pointer', opacity: 0.5, fontSize: '10px', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>v1.0</div>
        </div>
    );
};

export default SidePanel;
