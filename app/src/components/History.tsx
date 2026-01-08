
interface HistoryProps {
    onClose: () => void;
}

const History = ({ onClose }: HistoryProps) => {
    // Mock history for now since we can't easily read shell history yet
    const mockHistory = [
        { cmd: 'npm run dev', time: '10:45 AM' },
        { cmd: 'git status', time: '10:42 AM' },
        { cmd: 'cargo check', time: '10:40 AM' },
        { cmd: 'cd src-tauri', time: '10:39 AM' },
        { cmd: 'ls -la', time: '10:39 AM' },
        { cmd: 'vim lib.rs', time: '10:35 AM' },
    ];

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: '60px',
            bottom: '28px',
            width: '300px',
            backgroundColor: 'var(--color-glass-panel)',
            borderRight: '1px solid var(--color-border-subtle)',
            backdropFilter: 'blur(10px)',
            padding: '24px',
            zIndex: 20,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-starlight)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--color-electric-cyan)' }}>History</h2>
                <button onClick={onClose} style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-ghost)',
                    cursor: 'pointer',
                    fontSize: '18px'
                }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockHistory.map((item, i) => (
                    <div key={i} style={{
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                    >
                        <span style={{ fontSize: '13px', color: 'var(--color-starlight)' }}>{item.cmd}</span>
                        <span style={{ fontSize: '10px', color: 'var(--color-ghost)' }}>{item.time}</span>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '20px', fontSize: '10px', color: 'var(--color-ghost)', fontStyle: 'italic' }}>
                * Recent local session history
            </div>
        </div>
    );
};

export default History;
