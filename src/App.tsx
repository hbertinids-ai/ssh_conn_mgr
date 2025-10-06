import { useState } from 'react';
import { ConnectionManager } from './components/ConnectionManager';
import { Terminal } from './components/Terminal';
import { TunnelManager } from './components/TunnelManager';
import { Tabs } from './components/Tabs';
import { useConnectionStore } from './store/connectionStore';
import { Server, Network, PanelLeftClose, PanelLeft } from 'lucide-react';

function App() {
  const [view, setView] = useState<'connections' | 'tunnels'>('connections');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { activeSessionId } = useConnectionStore();

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center hover:from-primary-600 hover:to-primary-800 transition-all cursor-pointer"
            title={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarVisible ? (
              <PanelLeftClose className="w-6 h-6 text-white" />
            ) : (
              <PanelLeft className="w-6 h-6 text-white" />
            )}
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">SSH Connection Manager</h1>
            <p className="text-sm text-slate-400">Secure terminal sessions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('connections')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              view === 'connections'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Connections</span>
          </button>
          <button
            onClick={() => setView('tunnels')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              view === 'tunnels'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Tunnels</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarVisible && view === 'connections' && (
          <aside className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
            <ConnectionManager />
          </aside>
        )}
        
        {sidebarVisible && view === 'tunnels' && (
          <aside className="w-96 bg-slate-800 border-r border-slate-700 flex flex-col overflow-hidden">
            <TunnelManager />
          </aside>
        )}

        {/* Terminal Area */}
        <main className="flex-1 flex flex-col bg-slate-900">
          {activeSessionId ? (
            <>
              <Tabs />
              <div className="flex-1 overflow-hidden">
                <Terminal />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Server className="w-20 h-20 text-slate-700 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-400 mb-2">No Active Session</h2>
                <p className="text-slate-500">
                  {sidebarVisible && view === 'connections'
                    ? 'Select a connection from the sidebar to start a session'
                    : !sidebarVisible 
                    ? 'Click the icon in the top-left to show connections'
                    : 'Switch to Connections to start a session'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
