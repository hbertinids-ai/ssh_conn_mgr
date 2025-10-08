import { useState } from 'react';
import { ConnectionManager } from './components/ConnectionManager';
import { Terminal } from './components/Terminal';
import { TunnelManager } from './components/TunnelManager';
import { AccountManager } from './components/AccountManager';
import { Tabs } from './components/Tabs';
import { HelpModal } from './components/HelpModal';
import { ImportExportModal } from './components/ImportExportModal';
import { useConnectionStore } from './store/connectionStore';
import { Server, Network, PanelLeftClose, PanelLeft, HelpCircle, User } from 'lucide-react';
import { SSHConnection, SSHTunnel, SSHAccount } from './types';

function App() {
  const [view, setView] = useState<'connections' | 'tunnels' | 'accounts'>('connections');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [importExportModalOpen, setImportExportModalOpen] = useState(false);
  const { activeSessionId, connections, tunnels, accounts, addConnection, addTunnel, addAccount } = useConnectionStore();

  const handleImport = (items: SSHConnection[] | SSHTunnel[] | SSHAccount[]) => {
    if (view === 'connections') {
      (items as SSHConnection[]).forEach(conn => addConnection(conn));
    } else if (view === 'tunnels') {
      (items as SSHTunnel[]).forEach(tunnel => addTunnel(tunnel));
    } else if (view === 'accounts') {
      (items as SSHAccount[]).forEach(account => addAccount(account));
    }
  };

  const getCurrentData = () => {
    if (view === 'connections') return connections;
    if (view === 'tunnels') return tunnels;
    return accounts;
  };

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
          <button
            onClick={() => setView('accounts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              view === 'accounts'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Accounts</span>
          </button>
          
          <div className="w-px h-6 bg-slate-600 mx-2"></div>
          
          <button
            onClick={() => setHelpModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-slate-700 text-slate-300 hover:bg-slate-600"
            title="Help & Documentation"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
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

        {sidebarVisible && view === 'accounts' && (
          <aside className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
            <AccountManager />
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
                    : view === 'accounts'
                    ? 'Switch to Connections to start a session'
                    : 'Switch to Connections to start a session'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Help Modal */}
      <HelpModal 
        isOpen={helpModalOpen} 
        onClose={() => setHelpModalOpen(false)} 
      />

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={importExportModalOpen}
        onClose={() => setImportExportModalOpen(false)}
        type={view}
        data={getCurrentData()}
        onImport={handleImport}
      />
    </div>
  );
}

export default App;
