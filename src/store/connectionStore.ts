import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SSHConnection, SSHSession, SSHTunnel, SSHAccount, SSHGroup } from '../types';

interface ConnectionState {
  connections: SSHConnection[];
  tunnels: SSHTunnel[];
  accounts: SSHAccount[];
  groups: SSHGroup[];
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
  
  // Account CRUD
  addAccount: (account: Omit<SSHAccount, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, account: Partial<SSHAccount>) => void;
  deleteAccount: (id: string) => void;
  
  // Group CRUD
  addGroup: (group: Omit<SSHGroup, 'id' | 'createdAt'>) => void;
  updateGroup: (id: string, group: Partial<SSHGroup>) => void;
  deleteGroup: (id: string) => void;
  
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
      accounts: [],
      groups: [],
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
      
      addAccount: (account) => {
        const newAccount: SSHAccount = {
          ...account,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
      },
      
      updateAccount: (id, updates) => {
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === id ? { ...account, ...updates } : account
          ),
        }));
      },
      
      deleteAccount: (id) => {
        // Remove account references from connections first
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== id),
          connections: state.connections.map((conn) =>
            conn.accountId === id ? { ...conn, accountId: undefined } : conn
          ),
        }));
      },
      
      addGroup: (group) => {
        const newGroup: SSHGroup = {
          ...group,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          groups: [...state.groups, newGroup],
        }));
      },
      
      updateGroup: (id, updates) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id ? { ...group, ...updates } : group
          ),
        }));
      },
      
      deleteGroup: (id) => {
        // Remove group references from all entities
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
          connections: state.connections.map((conn) =>
            conn.groupId === id ? { ...conn, groupId: undefined } : conn
          ),
          tunnels: state.tunnels.map((tunnel) =>
            tunnel.groupId === id ? { ...tunnel, groupId: undefined } : tunnel
          ),
          accounts: state.accounts.map((account) =>
            account.groupId === id ? { ...account, groupId: undefined } : account
          ),
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
        accounts: state.accounts,
        groups: state.groups,
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
