import { useRef } from 'react';
import { useSettings, Theme, Shell } from '../context/SettingsContext';
import { Download, Upload, RefreshCw, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';

interface SettingsProps {
    onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
    const { settings, updateSetting, resetSettings, importSettings, exportSettings } = useSettings();
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (importSettings(content)) {
                alert('Settings imported successfully!');
            } else {
                alert('Failed to import settings.');
            }
        };
        reader.readAsText(file);
    };

    const handleExport = () => {
        const data = exportSettings();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fr-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            resetSettings();
        }
    };

    const ThemeOption = ({ name, color }: { name: Theme, color: string }) => (
        <div
            onClick={() => updateSetting('theme', name)}
            title={name}
            style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#0f0f1e', // Base dark
                border: settings.theme === name ? `2px solid var(--color-electric-cyan)` : '2px solid var(--color-border-subtle)',
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
            }}
        >
            <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: color
            }} />
            {settings.theme === name && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Check size={14} color="white" />
                </div>
            )}
        </div>
    );

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: '60px',
            bottom: '28px',
            width: '340px',
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
                padding: '24px',
                borderBottom: '1px solid var(--color-border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--color-vibrant-purple)' }}>Settings</h2>
                <button onClick={onClose} style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-ghost)',
                    cursor: 'pointer',
                    fontSize: '18px'
                }}>✕</button>
            </div>

            {/* Content - Scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

                {/* Appearance */}
                <div className="settings-section" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '13px', color: 'var(--color-ghost)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Appearance</h3>

                    <div className="control-group">
                        <label>Font Size <span style={{ color: 'var(--color-electric-cyan)' }}>{settings.fontSize}px</span></label>
                        <input
                            type="range"
                            min="10"
                            max="24"
                            value={settings.fontSize}
                            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-vibrant-purple)' }}
                        />
                    </div>

                    <div className="control-group">
                        <label>Line Height <span style={{ color: 'var(--color-electric-cyan)' }}>{settings.lineHeight}</span></label>
                        <input
                            type="range"
                            min="1.2"
                            max="2.0"
                            step="0.1"
                            value={settings.lineHeight}
                            onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-vibrant-purple)' }}
                        />
                    </div>

                    <div className="control-group">
                        <label>Opacity <span style={{ color: 'var(--color-electric-cyan)' }}>{(settings.opacity * 100).toFixed(0)}%</span></label>
                        <input
                            type="range"
                            min="0.8"
                            max="1.0"
                            step="0.05"
                            value={settings.opacity}
                            onChange={(e) => updateSetting('opacity', parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-vibrant-purple)' }}
                        />
                    </div>

                    <div className="control-group">
                        <label>Theme</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <ThemeOption name="Cyber Grape" color="#8b5cf6" />
                            <ThemeOption name="Midnight Neon" color="#ec4899" />
                            <ThemeOption name="Minimal Pro" color="#10b981" />
                            <ThemeOption name="Sunset Vapor" color="#f97316" />
                        </div>
                    </div>

                    <div className="control-group">
                        <label>Font Family</label>
                        <select
                            value={settings.fontFamily}
                            onChange={(e) => updateSetting('fontFamily', e.target.value)}
                            style={{
                                width: '100%',
                                marginTop: '8px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--color-border-subtle)',
                                color: 'var(--color-starlight)',
                                padding: '8px',
                                borderRadius: '4px',
                                outline: 'none'
                            }}
                        >
                            <option value="JetBrains Mono">JetBrains Mono</option>
                            <option value="Fira Code">Fira Code</option>
                            <option value="Cascadia Code">Cascadia Code</option>
                            <option value="Menlo">Menlo</option>
                            <option value="Monaco">Monaco</option>
                            <option value="Consolas">Consolas</option>
                        </select>
                    </div>
                </div>

                {/* Terminal */}
                <div className="settings-section" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '13px', color: 'var(--color-ghost)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Terminal</h3>

                    <div className="control-group">
                        <label>Default Shell</label>
                        <select
                            value={settings.defaultShell}
                            onChange={(e) => updateSetting('defaultShell', e.target.value as Shell)}
                            style={{
                                width: '100%',
                                marginTop: '8px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--color-border-subtle)',
                                color: 'var(--color-starlight)',
                                padding: '8px',
                                borderRadius: '4px',
                                outline: 'none'
                            }}
                        >
                            <option value="zsh">zsh</option>
                            <option value="bash">bash</option>
                            <option value="fish">fish</option>
                            <option value="powershell">powershell</option>
                            <option value="cmd">cmd</option>
                        </select>
                    </div>

                    <div className="checkbox-group">
                        <input type="checkbox" checked={settings.cursorBlink} onChange={(e) => updateSetting('cursorBlink', e.target.checked)} />
                        <span>Cursor Blink</span>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" checked={settings.closeOnExit} onChange={(e) => updateSetting('closeOnExit', e.target.checked)} />
                        <span>Close tab on exit</span>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" checked={settings.autoSaveHistory} onChange={(e) => updateSetting('autoSaveHistory', e.target.checked)} />
                        <span>Auto-save history</span>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" checked={settings.showTimestamps} onChange={(e) => updateSetting('showTimestamps', e.target.checked)} />
                        <span>Show command timestamps</span>
                    </div>
                </div>

                {/* Shortcuts */}
                <div className="settings-section" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '13px', color: 'var(--color-ghost)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Keyboard Shortcuts</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '12px', color: 'var(--color-ghost)' }}>
                        <span>New Tab</span> <span style={{ color: 'var(--color-electric-cyan)' }}>⌘T</span>
                        <span>Close Tab</span> <span style={{ color: 'var(--color-electric-cyan)' }}>⌘W</span>
                        <span>Next Tab</span> <span style={{ color: 'var(--color-electric-cyan)' }}>⌘{'}'}</span>
                        <span>Prev Tab</span> <span style={{ color: 'var(--color-electric-cyan)' }}>⌘{'{'}</span>
                        <span>Clear</span> <span style={{ color: 'var(--color-electric-cyan)' }}>⌘K</span>
                    </div>
                </div>

                {/* Advanced */}
                <div className="settings-section" style={{ marginBottom: '32px' }}>
                    <div
                        onClick={() => setAdvancedOpen(!advancedOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            marginBottom: '16px',
                            userSelect: 'none'
                        }}
                    >
                        {advancedOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <h3 style={{ fontSize: '13px', color: 'var(--color-ghost)', margin: '0 0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Advanced</h3>
                    </div>

                    {advancedOpen && (
                        <div>
                            <div className="control-group">
                                <label>Scrollback Buffer</label>
                                <input type="number" value={settings.scrollbackBuffer} onChange={(e) => updateSetting('scrollbackBuffer', parseInt(e.target.value))}
                                    style={{ width: '100%', padding: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-starlight)' }} />
                            </div>
                            <div className="checkbox-group">
                                <input type="checkbox" checked={settings.enableLigatures} onChange={(e) => updateSetting('enableLigatures', e.target.checked)} />
                                <span>Enable Ligatures</span>
                            </div>
                            <div className="checkbox-group">
                                <input type="checkbox" checked={settings.gpuAcceleration} onChange={(e) => updateSetting('gpuAcceleration', e.target.checked)} />
                                <span>GPU Acceleration</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <button className="secondary-btn" onClick={handleExport}>
                        <Download size={12} /> Export
                    </button>
                    <button className="secondary-btn" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={12} /> Import
                    </button>
                    <input type="file" ref={fileInputRef} hidden accept=".json" onChange={handleFileUpload} />
                </div>
                <button className="danger-btn" onClick={handleReset} style={{ width: '100%' }}>
                    <RefreshCw size={12} /> Reset to Defaults
                </button>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border-subtle)', fontSize: '10px', color: 'var(--color-ghost)', textAlign: 'center' }}>
                FR Terminal v0.1.0
            </div>

            <style>{`
                .control-group { margin-bottom: 20px; }
                .control-group label { display: block; font-size: 12px; margin-bottom: 8px; font-weight: 500; display: flex; justify-content: space-between; }
                .checkbox-group { display: flex; alignItems: center; gap: 10px; margin-bottom: 12px; font-size: 12px; cursor: pointer; }
                .checkbox-group input { accent-color: var(--color-vibrant-purple); }
                
                .secondary-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--color-border-subtle);
                    color: var(--color-starlight);
                    padding: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                    gap: 6px;
                    font-size: 11px;
                    transition: all 0.2s;
                }
                .secondary-btn:hover { background: rgba(255,255,255,0.1); }
                
                .danger-btn {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #f87171;
                    padding: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                    gap: 6px;
                    font-size: 11px;
                    transition: all 0.2s;
                }
                .danger-btn:hover { background: rgba(239, 68, 68, 0.2); }
            `}</style>
        </div>
    );
};

export default Settings;
