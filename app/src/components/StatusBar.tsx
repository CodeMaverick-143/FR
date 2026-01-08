
import { useState, useEffect } from 'react';

const StatusBar = () => {
    const [time, setTime] = useState('');

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
            fontSize: '12px',
            color: 'var(--color-ghost)',
            fontFamily: 'var(--font-mono)',
            userSelect: 'none'
        }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ color: 'var(--color-electric-cyan)' }}>~/projects/fr</span>
                <span>✨ Flow State</span>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--color-terminal-green)' }}>●</span>
                    main
                </span>
                <span>{time}</span>
            </div>
        </div>
    );
};

export default StatusBar;
