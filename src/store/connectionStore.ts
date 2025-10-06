import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SSHConnection, SSHSession, SSHTunnel } from '../types';

interface ConnectionState {
  connections: SSHConnection[];
  tunnels: SSHTunnel[];
  sessions: SSHSession[];
  activeSessionId: string | null;
  
  // Connection CRUD
  addConnection: (connection: Omit<SSHConnection, 'id' | 'createdAt'>) => void;
  updateConnection: (id: string, connection: Partial<SSHConnection>) => void;
  deleteConnection: (id: string) => void;
  
  // Tunnel CRUD
  addTunnel: (tunnel: Omit<SSHTunnel, 'id' | 'createdAt'>) => void;
  updateTunnel: (id: string, tunnel: Partial<SSHTunnel>) => void;
  deleteTunnel: (id: string) => void;
  
  // Session management
  createSession: (connectionId: string) => void;
  setSessionStatus: (id: string, status: SSHSession['status'], error?: string) => void;
  closeSession: (id: string) => void;
  setActiveSession: (id: string | null) => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      connections: [],
      tunnels: [],
      sessions: [],
      activeSessionId: null,
      
      addConnection: (connection) => {
        const newConnection: SSHConnection = {
          ...connection,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          color: getRandomColor(),
        };
        set((state) => ({
          connections: [...state.connections, newConnection],
        }));
      },
      
      updateConnection: (id, updates) => {
        set((state) => ({
          connections: state.connections.map((conn) =>
            conn.id === id ? { ...conn, ...updates } : conn
          ),
        }));
      },
      
      deleteConnection: (id) => {
        set((state) => ({
          connections: state.connections.filter((conn) => conn.id !== id),
          sessions: state.sessions.filter((sess) => sess.connectionId !== id),
        }));
      },
      
      addTunnel: (tunnel) => {
        const newTunnel: SSHTunnel = {
          ...tunnel,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          tunnels: [...state.tunnels, newTunnel],
        }));
      },
      
      updateTunnel: (id, updates) => {
        set((state) => ({
          tunnels: state.tunnels.map((tunnel) =>
            tunnel.id === id ? { ...tunnel, ...updates } : tunnel
          ),
        }));
      },
      
      deleteTunnel: (id) => {
        set((state) => ({
          tunnels: state.tunnels.filter((tunnel) => tunnel.id !== id),
        }));
      },
      
      createSession: (connectionId) => {
        const connection = get().connections.find((c) => c.id === connectionId);
        if (!connection) return;
        
        const newSession: SSHSession = {
          id: crypto.randomUUID(),
          connectionId,
          connection,
          status: 'connecting',
        };
        
        set((state) => ({
          sessions: [...state.sessions, newSession],
          activeSessionId: newSession.id,
        }));
      },
      
      setSessionStatus: (id, status, error) => {
        set((state) => ({
          sessions: state.sessions.map((sess) =>
            sess.id === id ? { ...sess, status, error } : sess
          ),
        }));
      },
      
      closeSession: (id) => {
        set((state) => {
          const newSessions = state.sessions.filter((sess) => sess.id !== id);
          const newActiveId =
            state.activeSessionId === id
              ? newSessions[0]?.id || null
              : state.activeSessionId;
          
          return {
            sessions: newSessions,
            activeSessionId: newActiveId,
          };
        });
      },
      
      setActiveSession: (id) => {
        set({ activeSessionId: id });
      },
    }),
    {
      name: 'ssh-connection-storage',
      partialize: (state) => ({
        connections: state.connections,
        tunnels: state.tunnels,
      }),
    }
  )
);

const colors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
