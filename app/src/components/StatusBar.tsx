
import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useHistory } from '../context/HistoryContext';
import { Palette, Type, Clock, TerminalSquare } from 'lucide-react';

const StatusBar = () => {
    const [time, setTime] = useState('');
    const { settings } = useSettings();
    const { historyItems } = useHistory();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            height: '32px',
            backgroundColor: 'var(--color-void-dark)',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            fontSize: '11px',
            color: 'var(--color-ghost)',
            fontFamily: 'var(--font-mono)',
            userSelect: 'none',
            zIndex: 10
        }}>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Current Theme">
                    <Palette size={12} color="var(--color-electric-cyan)" />
                    <span>{settings.theme}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Font Configuration">
                    <Type size={12} color="var(--color-neon-mint)" />
                    <span>{settings.fontFamily} · {settings.fontSize}px</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Total Commands in History">
                    <TerminalSquare size={12} color="var(--color-sunset-orange)" />
                    <span>{historyItems.length} cmds</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={12} />
                    <span>{time}</span>
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
