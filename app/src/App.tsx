import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import Terminal from "./components/Terminal";
import SidePanel from "./components/SidePanel";
import StatusBar from "./components/StatusBar";
import Settings from "./components/Settings";
import History from "./components/History";
import TabBar, { Tab } from "./components/TabBar";
import "./App.css";

function App() {
  const [activePanel, setActivePanel] = useState<'none' | 'history' | 'settings'>('none');
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Helper to generate UUIDs
  const generateId = () => crypto.randomUUID();

  const createTab = useCallback(() => {
    const id = generateId();
    const newTab: Tab = {
      id,
      title: 'Terminal', // Ideally we'd update this from shell title events
      active: true
    };

    setTabs(prev => {
      const updated = prev.map(t => ({ ...t, active: false }));
      return [...updated, newTab];
    });
    setActiveTabId(id);
  }, []);

  const closeTab = useCallback((id: string) => {
    // Call backend to cleanup session
    invoke('close_session', { id }).catch(console.error);

    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== id);

      // If we closed the active tab, switch to another
      if (id === activeTabId) {
        if (newTabs.length > 0) {
          // Switch to last tab or adjacent? Last is common.
          const nextTab = newTabs[newTabs.length - 1];
          setActiveTabId(nextTab.id);
          nextTab.active = true;
        } else {
          setActiveTabId(null);
        }
      }
      return newTabs;
    });
  }, [activeTabId]);

  const switchTab = useCallback((id: string) => {
    setActiveTabId(id);
    setTabs(prev => prev.map(t => ({ ...t, active: t.id === id })));
  }, []);

  const handleCommandInsert = (cmd: string) => {
    if (activeTabId) {
      invoke('write_to_session', { id: activeTabId, data: cmd }).catch(console.error);
    }
  };

  // Initial tab
  useEffect(() => {
    if (tabs.length === 0) {
      createTab();
    }
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        createTab();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        if (activeTabId) closeTab(activeTabId);
      } else if ((e.metaKey || e.ctrlKey) && e.key === '}') {
        e.preventDefault();
        // Next tab logic
      } else if ((e.metaKey || e.ctrlKey) && e.key === '{') {
        e.preventDefault();
        // Prev tab logic
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createTab, closeTab, activeTabId]);

  const togglePanel = (panel: 'history' | 'settings') => {
    setActivePanel(current => current === panel ? 'none' : panel);
  };

  return (
    <main className="app-container">
      <div className="main-content">
        <SidePanel
          onHistoryClick={() => togglePanel('history')}
          onSettingsClick={() => togglePanel('settings')}
          activePanel={activePanel}
        />

        {activePanel === 'settings' && <Settings onClose={() => setActivePanel('none')} />}
        {activePanel === 'history' && (
          <History
            onClose={() => setActivePanel('none')}
            onInsert={handleCommandInsert}
          />
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TabBar
            tabs={tabs}
            onSwitch={switchTab}
            onClose={closeTab}
            onNew={createTab}
          />

          <div style={{ flex: 1, position: 'relative' }}>
            {tabs.map(tab => (
              <div
                key={tab.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  visibility: tab.active ? 'visible' : 'hidden',
                  zIndex: tab.active ? 1 : 0
                }}
              >
                <Terminal sessionId={tab.id} />
              </div>
            ))}

            {tabs.length === 0 && (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-ghost)',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '14px' }}>No open tabs</div>
                <button
                  onClick={createTab}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-starlight)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Open Terminal (⌘T)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <StatusBar />
    </main>
  );
}

export default App;
