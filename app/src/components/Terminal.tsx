
import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import '@xterm/xterm/css/xterm.css';

const Terminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            cursorStyle: 'bar',
            theme: {
                background: '#0f0f1e', // Void Dark
                foreground: '#e4e4ff', // Starlight
                cursor: '#06b6d4',     // Electric Cyan
                cursorAccent: '#0f0f1e',
                selectionBackground: '#2d2640', // Highlight
                black: '#1a1625',
                red: '#f87171',
                green: '#34d399',
                yellow: '#fbbf24',
                blue: '#8b5cf6',
                magenta: '#b794f6',
                cyan: '#06b6d4',
                white: '#e4e4ff',
                brightBlack: '#7c7c99',
                brightRed: '#f87171',
                brightGreen: '#34d399',
                brightYellow: '#fbbf24',
                brightBlue: '#8b5cf6',
                brightMagenta: '#b794f6',
                brightCyan: '#06b6d4',
                brightWhite: '#e4e4ff'
            },
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: 13,
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: 0,
            allowProposedApi: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;

        const handleResize = () => {
            fitAddon.fit();
            invoke('resize_pty', {
                rows: term.rows,
                cols: term.cols
            }).catch(console.error);
        };
        window.addEventListener('resize', handleResize);

        handleResize();

        terminalRef.current.addEventListener('click', () => term.focus());
        term.focus();

        const onDataDisposable = term.onData((data) => {
            invoke('write_to_pty', { data }).catch(console.error);
        });
        const onResizeDisposable = term.onResize((size) => {
            invoke('resize_pty', {
                rows: size.rows,
                cols: size.cols
            }).catch(console.error);
        });

        let unlisten: () => void;
        listen<string>('pty-output', (event) => {
            term.write(event.payload);
        }).then((u) => {
            unlisten = u;
        }).catch(console.error);

        return () => {
            onDataDisposable.dispose();
            onResizeDisposable.dispose();
            term.dispose();
            window.removeEventListener('resize', handleResize);
            if (unlisten) unlisten();
        };
    }, []);

    return (
        <div
            ref={terminalRef}
            className="terminal-container"
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--color-void-dark)',
                padding: '32px', // More generous padding
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        />
    );
};

export default Terminal;
