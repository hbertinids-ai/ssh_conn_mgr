import { SSHConnection, SSHTunnel } from '../types';

export interface ImportExportService {
  exportConnectionsToCSV: (connections: SSHConnection[]) => void;
  exportConnectionsToJSON: (connections: SSHConnection[]) => void;
  exportTunnelsToCSV: (tunnels: SSHTunnel[]) => void;
  exportTunnelsToJSON: (tunnels: SSHTunnel[]) => void;
  importConnectionsFromCSV: (file: File) => Promise<SSHConnection[]>;
  importConnectionsFromJSON: (file: File) => Promise<SSHConnection[]>;
  importTunnelsFromCSV: (file: File) => Promise<SSHTunnel[]>;
  importTunnelsFromJSON: (file: File) => Promise<SSHTunnel[]>;
}

// CSV conversion utilities
function connectionToCSVRow(connection: SSHConnection): string {
  const authMethod = connection.privateKey ? 'privateKey' : 'password';
  const fields = [
    connection.name,
    connection.host,
    connection.port.toString(),
    connection.username,
    authMethod,
    connection.group || '',
    connection.color || '',
    connection.tunnelId || '',
    connection.createdAt
  ];
  
  // Escape fields that contain commas or quotes
  return fields.map(field => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }).join(',');
}

function tunnelToCSVRow(tunnel: SSHTunnel): string {
  const fields = [
    tunnel.name,
    tunnel.host,
    tunnel.port.toString(),
    tunnel.username,
    tunnel.group || '',
    tunnel.createdAt
  ];
  
  return fields.map(field => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }).join(',');
}

function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < row.length) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i += 2;
      } else {
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  result.push(current);
  return result;
}

// Download utility
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// File reading utility
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export const importExportService: ImportExportService = {
  // Connection exports
  exportConnectionsToCSV: (connections: SSHConnection[]) => {
    const header = 'Name,Host,Port,Username,Auth Method,Group,Color,Tunnel ID,Created At\n';
    const rows = connections.map(connectionToCSVRow).join('\n');
    const content = header + rows;
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `ssh-connections-${timestamp}.csv`, 'text/csv');
  },

  exportConnectionsToJSON: (connections: SSHConnection[]) => {
    const content = JSON.stringify(connections, null, 2);
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `ssh-connections-${timestamp}.json`, 'application/json');
  },

  // Tunnel exports
  exportTunnelsToCSV: (tunnels: SSHTunnel[]) => {
    const header = 'Name,Host,Port,Username,Group,Created At\n';
    const rows = tunnels.map(tunnelToCSVRow).join('\n');
    const content = header + rows;
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `ssh-tunnels-${timestamp}.csv`, 'text/csv');
  },

  exportTunnelsToJSON: (tunnels: SSHTunnel[]) => {
    const content = JSON.stringify(tunnels, null, 2);
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `ssh-tunnels-${timestamp}.json`, 'application/json');
  },

  // Connection imports
  importConnectionsFromCSV: async (file: File): Promise<SSHConnection[]> => {
    const content = await readFileAsText(file);
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must contain a header row and at least one data row');
    }
    
    // Skip header row
    const dataLines = lines.slice(1);
    const connections: SSHConnection[] = [];
    
    for (let i = 0; i < dataLines.length; i++) {
      const row = parseCSVRow(dataLines[i]);
      
      if (row.length < 9) {
        console.warn(`Skipping row ${i + 2}: insufficient columns`);
        continue;
      }
      
      const isPrivateKey = row[4] === 'privateKey';
      const connection: SSHConnection = {
        id: crypto.randomUUID(),
        name: row[0],
        host: row[1],
        port: parseInt(row[2]) || 22,
        username: row[3],
        password: isPrivateKey ? undefined : '', // Passwords are not exported for security
        privateKey: isPrivateKey ? '' : undefined, // Private keys are not exported for security
        group: row[5] || undefined,
        color: row[6] || '#3b82f6',
        tunnelId: row[7] || undefined,
        createdAt: row[8] || new Date().toISOString()
      };
      
      connections.push(connection);
    }
    
    return connections;
  },

  importConnectionsFromJSON: async (file: File): Promise<SSHConnection[]> => {
    const content = await readFileAsText(file);
    const data = JSON.parse(content);
    
    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of connections');
    }
    
    return data.map((item: any) => ({
      id: crypto.randomUUID(), // Generate new ID
      name: item.name || 'Imported Connection',
      host: item.host || 'localhost',
      port: item.port || 22,
      username: item.username || 'root',
      password: item.authMethod === 'privateKey' ? undefined : '', // Reset for security
      privateKey: item.authMethod === 'privateKey' ? '' : undefined, // Reset for security
      group: item.group,
      color: item.color || '#3b82f6',
      tunnelId: item.tunnelId,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  },

  // Tunnel imports
  importTunnelsFromCSV: async (file: File): Promise<SSHTunnel[]> => {
    const content = await readFileAsText(file);
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must contain a header row and at least one data row');
    }
    
    const dataLines = lines.slice(1);
    const tunnels: SSHTunnel[] = [];
    
    for (let i = 0; i < dataLines.length; i++) {
      const row = parseCSVRow(dataLines[i]);
      
      if (row.length < 6) {
        console.warn(`Skipping row ${i + 2}: insufficient columns`);
        continue;
      }
      
      const tunnel: SSHTunnel = {
        id: crypto.randomUUID(),
        name: row[0],
        host: row[1],
        port: parseInt(row[2]) || 22,
        username: row[3],
        password: '', // Passwords are not exported for security
        group: row[4] || undefined,
        createdAt: row[5] || new Date().toISOString()
      };
      
      tunnels.push(tunnel);
    }
    
    return tunnels;
  },

  importTunnelsFromJSON: async (file: File): Promise<SSHTunnel[]> => {
    const content = await readFileAsText(file);
    const data = JSON.parse(content);
    
    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of tunnels');
    }
    
    return data.map((item: any) => ({
      id: crypto.randomUUID(),
      name: item.name || 'Imported Tunnel',
      host: item.host || 'localhost',
      port: item.port || 22,
      username: item.username || 'root',
      password: '', // Reset for security
      group: item.group,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  }
};