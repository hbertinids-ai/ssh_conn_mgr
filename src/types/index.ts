export interface SSHTunnel {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  group?: string;
  createdAt: string;
}

export interface SSHAccount {
  id: string;
  name: string;
  username: string;
  password?: string;
  privateKey?: string;
  description?: string;
  group?: string;
  createdAt: string;
}

export interface SSHConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  accountId?: string; // Reference to SSHAccount
  tunnelId?: string;
  group?: string;
  color?: string;
  createdAt: string;
}

export interface SSHSession {
  id: string;
  connectionId: string;
  connection: SSHConnection;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  error?: string;
}

declare global {
  interface Window {
    electron: {
      ssh: {
        connect: (config: any) => Promise<any>;
        write: (id: string, data: string) => Promise<any>;
        resize: (id: string, rows: number, cols: number) => Promise<any>;
        disconnect: (id: string) => Promise<any>;
        onData: (callback: (data: any) => void) => void;
        onClose: (callback: (data: any) => void) => void;
      };
    };
  }
}
