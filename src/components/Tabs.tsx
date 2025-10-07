import { MouseEvent } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { X, Download } from 'lucide-react';

export function Tabs() {
  const { sessions, activeSessionId, setActiveSession, closeSession } = useConnectionStore();

  const handleClose = (e: MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm('Close this session?')) {
      closeSession(sessionId);
    }
  };

  const handleSave = (e: MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if ((window as any).saveTerminalOutput) {
      (window as any).saveTerminalOutput(sessionId);
    }
  };

  return (
    <div className="bg-slate-800 border-b border-slate-700 flex items-center overflow-x-auto scrollbar-thin">
      {sessions.map((session) => (
        <div
          key={session.id}
          onClick={() => setActiveSession(session.id)}
          className={`flex items-center space-x-2 px-4 py-3 cursor-pointer border-r border-slate-700 hover:bg-slate-700/50 transition-colors min-w-[200px] max-w-[250px] ${
            activeSessionId === session.id
              ? 'bg-slate-900 border-b-2 border-b-primary-500'
              : ''
          }`}
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: session.connection.color }}
          />
          <span className="flex-1 truncate text-sm text-slate-200">
            {session.connection.name}
          </span>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {session.status === 'connecting' && (
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            )}
            {session.status === 'connected' && (
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            )}
            {session.status === 'error' && (
              <div className="w-2 h-2 bg-red-400 rounded-full" />
            )}
            <button
              onClick={(e) => handleSave(e, session.id)}
              className="p-1 hover:bg-slate-600 rounded transition-colors"
              title="Save output to file"
            >
              <Download className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleClose(e, session.id)}
              className="p-1 hover:bg-slate-600 rounded transition-colors"
              title="Close session"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
