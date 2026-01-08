
import { useEffect, useRef } from 'react';
import { Terminal as XTerm, ITerminalOptions } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useSettings, Theme } from '../context/SettingsContext';
import { useHistory } from '../context/HistoryContext';
import '@xterm/xterm/css/xterm.css';

// Theme configurations
const themes: Record<Theme, ITerminalOptions['theme']> = {
    'Cyber Grape': {
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
    'Midnight Neon': {
        background: '#1e0a1e',
        foreground: '#fce7f3',
        cursor: '#f472b6',
        cursorAccent: '#1e0a1e',
        selectionBackground: '#4a044e',
        black: '#2e0a2e',
        red: '#fb7185',
        green: '#34d399',
        yellow: '#facc15',
        blue: '#c084fc',
        magenta: '#f472b6',
        cyan: '#22d3ee',
        white: '#fce7f3',
        brightBlack: '#831843',
        brightRed: '#fb7185',
        brightGreen: '#34d399',
        brightYellow: '#facc15',
        brightBlue: '#c084fc',
        brightMagenta: '#f472b6',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff'
    },
    'Minimal Pro': {
        background: '#0f1914',
        foreground: '#e2e8f0',
        cursor: '#34d399',
        cursorAccent: '#0f1914',
        selectionBackground: '#064e3b',
        black: '#022c22',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#8b5cf6',
        cyan: '#14b8a6',
        white: '#f1f5f9',
        brightBlack: '#334155',
        brightRed: '#ef4444',
        brightGreen: '#10b981',
        brightYellow: '#f59e0b',
        brightBlue: '#60a5fa',
        brightMagenta: '#a78bfa',
        brightCyan: '#2dd4bf',
        brightWhite: '#ffffff'
    },
    'Sunset Vapor': {
        background: '#1e0f0a',
        foreground: '#ffedd5',
        cursor: '#fb923c',
        cursorAccent: '#1e0f0a',
        selectionBackground: '#7c2d12',
        black: '#431407',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#d946ef',
        cyan: '#06b6d4',
        white: '#ffedd5',
        brightBlack: '#78350f',
        brightRed: '#ef4444',
        brightGreen: '#22c55e',
        brightYellow: '#f59e0b',
        brightBlue: '#60a5fa',
        brightMagenta: '#e879f9',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff'
    }
};

interface TerminalProps {
    sessionId: string;
}

const Terminal = ({ sessionId }: TerminalProps) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const { settings } = useSettings();
    const { addToHistory } = useHistory();
    const lineBuffer = useRef('');

    // Initialize Logic
    useEffect(() => {
        if (!terminalRef.current) return;
        if (xtermRef.current) return;

        const term = new XTerm({
            cursorBlink: settings.cursorBlink,
            cursorStyle: 'bar',
            theme: themes[settings.theme],
            fontFamily: `"${settings.fontFamily}", monospace`,
            fontSize: settings.fontSize,
            lineHeight: settings.lineHeight,
            fontWeight: 500,
            letterSpacing: settings.enableLigatures ? 0 : 0,
            allowProposedApi: true,
            scrollback: settings.scrollbackBuffer,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        fitAddonRef.current = fitAddon;

        term.options.theme = { ...themes[settings.theme], background: 'transparent' };

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;

        // Initialize backend session
        // Calculate initial rows/cols
        invoke('create_session', {
            id: sessionId,
            rows: term.rows,
            cols: term.cols
        }).catch(err => {
            console.error('Failed to create session:', err);
            term.write('\r\n\x1b[31mFailed to start terminal session.\x1b[0m\r\n');
        });

        const handleResize = () => {
            fitAddon.fit();
            invoke('resize_session', {
                id: sessionId,
                rows: term.rows,
                cols: term.cols
            }).catch(console.error);
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        terminalRef.current.addEventListener('click', () => term.focus());
        term.focus();

        const onDataDisposable = term.onData((data) => {
            invoke('write_to_session', { id: sessionId, data }).catch(console.error);

            // Simple command capture
            for (const char of data) {
                if (char === '\r') {
                    const cmd = lineBuffer.current.trim();
                    if (cmd) {
                        addToHistory(cmd);
                    }
                    lineBuffer.current = '';
                } else if (char === '\u007f') {
                    lineBuffer.current = lineBuffer.current.slice(0, -1);
                } else if (char >= ' ') {
                    lineBuffer.current += char;
                }
            }
        });

        const onResizeDisposable = term.onResize((size) => {
            invoke('resize_session', {
                id: sessionId,
                rows: size.rows,
                cols: size.cols
            }).catch(console.error);
        });

        let unlisten: () => void;
        listen<string>(`pty-output:${sessionId}`, (event) => {
            term.write(event.payload);
        }).then((u) => {
            unlisten = u;
        }).catch(console.error);

        return () => {
            onDataDisposable.dispose();
            onResizeDisposable.dispose();
            term.dispose();
            xtermRef.current = null;
            fitAddonRef.current = null;
            window.removeEventListener('resize', handleResize);
            if (unlisten) unlisten();
        };
    }, [sessionId]); // Only run once on mount

    // React to settings updates
    useEffect(() => {
        if (!xtermRef.current) return;
        const term = xtermRef.current;

        term.options.fontSize = settings.fontSize;
        term.options.lineHeight = settings.lineHeight;
        term.options.fontFamily = `"${settings.fontFamily}", monospace`;
        term.options.cursorBlink = settings.cursorBlink;
        term.options.scrollback = settings.scrollbackBuffer;

        term.options.theme = {
            ...themes[settings.theme],
            background: 'transparent'
        };

        if (fitAddonRef.current) {
            fitAddonRef.current.fit();
            invoke('resize_session', {
                id: sessionId,
                rows: term.rows,
                cols: term.cols
            }).catch(console.error);
        }

    }, [settings, sessionId]);

    return (
        <div
            ref={terminalRef}
            className="terminal-container"
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                padding: '32px',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        />
    );
};

export default Terminal;
