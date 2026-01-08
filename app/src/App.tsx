import { useState } from "react";
import Terminal from "./components/Terminal";
import SidePanel from "./components/SidePanel";
import StatusBar from "./components/StatusBar";
import Settings from "./components/Settings";
import History from "./components/History";
import "./App.css";

function App() {
  const [activePanel, setActivePanel] = useState<'none' | 'history' | 'settings'>('none');

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
        {activePanel === 'history' && <History onClose={() => setActivePanel('none')} />}
        <Terminal />
      </div>
      <StatusBar />
    </main>
  );
}

export default App;
