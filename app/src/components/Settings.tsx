
interface SettingsProps {
    onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: '60px', // width of SidePanel
            bottom: '28px', // height of StatusBar
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
                <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--color-vibrant-purple)' }}>Settings</h2>
                <button onClick={onClose} style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-ghost)',
                    cursor: 'pointer',
                    fontSize: '18px'
                }}>✕</button>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--color-ghost)', marginBottom: '12px' }}>Appearance</h3>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px' }}>Font Size</label>
                    <input type="range" min="10" max="20" defaultValue="14" style={{ width: '100%', accentColor: 'var(--color-vibrant-purple)' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px' }}>Theme</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0f0f1e', border: '2px solid var(--color-vibrant-purple)' }}></div>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#1e1e2e', border: '1px solid var(--color-border-subtle)' }}></div>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#282c34', border: '1px solid var(--color-border-subtle)' }}></div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--color-ghost)', marginBottom: '12px' }}>Terminal</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-vibrant-purple)' }} />
                    <span style={{ fontSize: '12px' }}>Cursor Blink</span>
                </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--color-border-subtle)', fontSize: '10px', color: 'var(--color-ghost)' }}>
                FR Terminal v0.1.0
            </div>
        </div>
    );
};

export default Settings;
