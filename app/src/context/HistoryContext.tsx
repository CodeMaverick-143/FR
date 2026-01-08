import React, { createContext, useContext, useState, useEffect } from 'react';
import { HistoryItem } from '../utils/historyUtils';

interface HistoryContextType {
    historyItems: HistoryItem[];
    addToHistory: (cmd: string) => void;
    clearHistory: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    togglePin: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('fr_history');
        if (saved) {
            try {
                setHistoryItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load history", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('fr_history', JSON.stringify(historyItems));
    }, [historyItems]);

    const addToHistory = (cmd: string) => {
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            cmd,
            timestamp: Date.now(),
            pinned: false
        };
        // Add to beginning, prevent duplicates if needed (optional)
        setHistoryItems(prev => [newItem, ...prev]);
    };

    const togglePin = (id: string) => {
        setHistoryItems(prev => prev.map(item =>
            item.id === id ? { ...item, pinned: !item.pinned } : item
        ));
    };

    const clearHistory = () => {
        setHistoryItems([]);
    };

    return (
        <HistoryContext.Provider value={{
            historyItems,
            addToHistory,
            clearHistory,
            searchQuery,
            setSearchQuery,
            togglePin
        }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};
