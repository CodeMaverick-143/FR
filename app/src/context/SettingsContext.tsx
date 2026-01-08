import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types
export type Theme = 'Cyber Grape' | 'Midnight Neon' | 'Minimal Pro' | 'Sunset Vapor';
export type Shell = 'bash' | 'zsh' | 'fish' | 'powershell' | 'cmd';

export interface SettingsState {
    // Appearance
    theme: Theme;
    fontSize: number;
    lineHeight: number;
    fontFamily: string;
    opacity: number;

    // Terminal
    cursorBlink: boolean;
    defaultShell: Shell;
    closeOnExit: boolean;
    confirmClose: boolean;
    autoSaveHistory: boolean;
    clearOnNewTab: boolean;
    showTimestamps: boolean;

    // Advanced
    historyLimit: number;
    scrollbackBuffer: number;
    enableLigatures: boolean;
    gpuAcceleration: boolean;
    soundEffects: boolean;
}

const defaultSettings: SettingsState = {
    theme: 'Cyber Grape',
    fontSize: 14,
    lineHeight: 1.5,
    fontFamily: 'JetBrains Mono',
    opacity: 0.95,

    cursorBlink: true,
    defaultShell: 'zsh',
    closeOnExit: false,
    confirmClose: true,
    autoSaveHistory: true,
    clearOnNewTab: false,
    showTimestamps: true,

    historyLimit: 1000,
    scrollbackBuffer: 10000,
    enableLigatures: true,
    gpuAcceleration: true,
    soundEffects: false
};

interface SettingsContextType {
    settings: SettingsState;
    updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
    resetSettings: () => void;
    importSettings: (json: string) => boolean;
    exportSettings: () => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SettingsState>(() => {
        const saved = localStorage.getItem('fr_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    });

    // Auto-save debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('fr_settings', JSON.stringify(settings));
        }, 500);
        return () => clearTimeout(timer);
    }, [settings]);

    // Apply global styles (like opacity/theme colors)
    useEffect(() => {
        // Theme Colors Map
        const themes = {
            'Cyber Grape': {
                '--color-glass-panel': 'rgba(23, 20, 36, 0.95)',
                '--color-vibrant-purple': '#8b5cf6',
                '--color-electric-cyan': '#06b6d4'
            },
            'Midnight Neon': {
                '--color-glass-panel': 'rgba(30, 10, 30, 0.95)',
                '--color-vibrant-purple': '#ec4899', // Pink
                '--color-electric-cyan': '#f472b6'
            },
            'Minimal Pro': {
                '--color-glass-panel': 'rgba(15, 25, 20, 0.95)',
                '--color-vibrant-purple': '#10b981', // Green
                '--color-electric-cyan': '#34d399'
            },
            'Sunset Vapor': {
                '--color-glass-panel': 'rgba(30, 15, 10, 0.95)',
                '--color-vibrant-purple': '#f97316', // Orange
                '--color-electric-cyan': '#fb923c'
            }
        };

        const currentTheme = themes[settings.theme];
        const root = document.documentElement;

        Object.entries(currentTheme).forEach(([varName, value]) => {
            root.style.setProperty(varName, value as string);
        });

        // Apply Opacity to glass panel variable specifically if needed, 
        // or ensure components use the setting. 
        // For simplicity, we'll update the variable that controls panel bg
        // But since themes set the color string, we might need a more dynamic approach or just rely on CSS variables updated here.
        // Let's assume the main bg is handled by App.css or similar.

    }, [settings.theme]);

    const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    const exportSettings = () => {
        return JSON.stringify(settings, null, 2);
    };

    const importSettings = (json: string) => {
        try {
            const parsed = JSON.parse(json);
            // Validate basic structure (optional but recommended)
            setSettings(prev => ({ ...prev, ...parsed }));
            return true;
        } catch (e) {
            console.error("Failed to import settings", e);
            return false;
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, resetSettings, importSettings, exportSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
