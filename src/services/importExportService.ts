import { SSHConnection, SSHTunnel, SSHAccount, SSHGroup } from '../types';

export interface ImportExportService {
  exportConnectionsToCSV: (connections: SSHConnection[], includePasswords?: boolean) => void;
  exportConnectionsToJSON: (connections: SSHConnection[], includePasswords?: boolean) => void;
  exportTunnelsToCSV: (tunnels: SSHTunnel[], includePasswords?: boolean) => void;
  exportTunnelsToJSON: (tunnels: SSHTunnel[], includePasswords?: boolean) => void;
  exportAccountsToCSV: (accounts: SSHAccount[], includePasswords?: boolean) => void;
  exportAccountsToJSON: (accounts: SSHAccount[], includePasswords?: boolean) => void;
  exportGroupsToCSV: (groups: SSHGroup[]) => void;
  exportGroupsToJSON: (groups: SSHGroup[]) => void;
  importConnectionsFromCSV: (file: File, keepPasswords?: boolean) => Promise<SSHConnection[]>;
  importConnectionsFromJSON: (file: File, keepPasswords?: boolean) => Promise<SSHConnection[]>;
  importTunnelsFromCSV: (file: File, keepPasswords?: boolean) => Promise<SSHTunnel[]>;
  importTunnelsFromJSON: (file: File, keepPasswords?: boolean) => Promise<SSHTunnel[]>;
  importAccountsFromCSV: (file: File, keepPasswords?: boolean) => Promise<SSHAccount[]>;
  importAccountsFromJSON: (file: File, keepPasswords?: boolean) => Promise<SSHAccount[]>;
  importGroupsFromCSV: (file: File) => Promise<SSHGroup[]>;
  importGroupsFromJSON: (file: File) => Promise<SSHGroup[]>;
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
    connection.groupId || '',
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
    tunnel.groupId || '',
    tunnel.createdAt
  ];
  
  return fields.map(field => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }).join(',');
}

function accountToCSVRow(account: SSHAccount): string {
  const authMethod = account.privateKey ? 'privateKey' : 'password';
  const fields = [
    account.name,
    account.username,
    authMethod,
    account.description || '',
    account.groupId || '',
    account.createdAt
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
  exportConnectionsToCSV: (connections: SSHConnection[], includePasswords = false) => {
    const header = 'Name,Host,Port,Username,Auth Method,Group,Color,Tunnel ID,Created At\n';
    const exportData = includePasswords ? connections : connections.map(conn => ({
      ...conn,
      password: undefined,
      privateKey: undefined
    }));
    const rows = exportData.map(connectionToCSVRow).join('\n');
    const content = header + rows;
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `ssh-connections-${timestamp}.csv`, 'text/csv');
  },

  exportConnectionsToJSON: (connections: SSHConnection[], includePasswords = false) => {
    const exportData = includePasswords ? connections : connections.map(conn => ({
      ...conn,
      password: undefined,
      privateKey: undefined
    }));
    const content = JSON.stringify(exportData, null, 2);
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `ssh-connections-${timestamp}.json`, 'application/json');
  },

  // Tunnel exports
  exportTunnelsToCSV: (tunnels: SSHTunnel[], includePasswords = false) => {
    const header = 'Name,Host,Port,Username,Group,Created At\n';
    const exportData = includePasswords ? tunnels : tunnels.map(tunnel => ({
      ...tunnel,
      password: undefined
    }));
    const rows = exportData.map(tunnelToCSVRow).join('\n');
    const content = header + rows;
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `ssh-tunnels-${timestamp}.csv`, 'text/csv');
  },

  exportTunnelsToJSON: (tunnels: SSHTunnel[], includePasswords = false) => {
    const exportData = includePasswords ? tunnels : tunnels.map(tunnel => ({
      ...tunnel,
      password: undefined
    }));
    const content = JSON.stringify(exportData, null, 2);
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `ssh-tunnels-${timestamp}.json`, 'application/json');
  },

  // Connection imports
  importConnectionsFromCSV: async (file: File, keepPasswords = false): Promise<SSHConnection[]> => {
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
        password: keepPasswords && !isPrivateKey ? '' : undefined,
        privateKey: keepPasswords && isPrivateKey ? '' : undefined,
        groupId: row[5] || undefined,
        color: row[6] || '#3b82f6',
        tunnelId: row[7] || undefined,
        createdAt: row[8] || new Date().toISOString()
      };
      
      connections.push(connection);
    }
    
    return connections;
  },

  importConnectionsFromJSON: async (file: File, keepPasswords = false): Promise<SSHConnection[]> => {
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
      password: keepPasswords && item.password ? item.password : undefined,
      privateKey: keepPasswords && item.privateKey ? item.privateKey : undefined,
      accountId: item.accountId,
      groupId: item.groupId,
      color: item.color || '#3b82f6',
      tunnelId: item.tunnelId,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  },

  // Tunnel imports
  importTunnelsFromCSV: async (file: File, keepPasswords = false): Promise<SSHTunnel[]> => {
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
        password: keepPasswords ? '' : undefined,
        groupId: row[4] || undefined,
        createdAt: row[5] || new Date().toISOString()
      };
      
      tunnels.push(tunnel);
    }
    
    return tunnels;
  },

  importTunnelsFromJSON: async (file: File, keepPasswords = false): Promise<SSHTunnel[]> => {
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
      password: keepPasswords && item.password ? item.password : undefined,
      groupId: item.groupId,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  },

  // Account exports
  exportAccountsToCSV: (accounts: SSHAccount[], includePasswords = false) => {
    const header = 'Name,Username,Auth Method,Description,Group,Created At\n';
    const exportData = includePasswords ? accounts : accounts.map(account => ({
      ...account,
      password: undefined,
      privateKey: undefined
    }));
    const rows = exportData.map(accountToCSVRow).join('\n');
    const content = header + rows;
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `ssh-accounts-${timestamp}.csv`, 'text/csv');
  },

  exportAccountsToJSON: (accounts: SSHAccount[], includePasswords = false) => {
    const exportData = includePasswords ? accounts : accounts.map(account => ({
      ...account,
      password: undefined,
      privateKey: undefined
    }));
    const content = JSON.stringify(exportData, null, 2);
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `ssh-accounts-${timestamp}.json`, 'application/json');
  },

  // Account imports
  importAccountsFromCSV: async (file: File, keepPasswords = false): Promise<SSHAccount[]> => {
    const content = await readFileAsText(file);
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must contain a header row and at least one data row');
    }
    
    const dataLines = lines.slice(1);
    const accounts: SSHAccount[] = [];
    
    for (let i = 0; i < dataLines.length; i++) {
      const row = parseCSVRow(dataLines[i]);
      
      if (row.length < 6) {
        console.warn(`Skipping row ${i + 2}: insufficient columns`);
        continue;
      }
      
      const isPrivateKey = row[2] === 'privateKey';
      const account: SSHAccount = {
        id: crypto.randomUUID(),
        name: row[0],
        username: row[1],
        password: keepPasswords && !isPrivateKey ? '' : undefined,
        privateKey: keepPasswords && isPrivateKey ? '' : undefined,
        description: row[3] || undefined,
        groupId: row[4] || undefined,
        createdAt: row[5] || new Date().toISOString()
      };
      
      accounts.push(account);
    }
    
    return accounts;
  },

  importAccountsFromJSON: async (file: File, keepPasswords = false): Promise<SSHAccount[]> => {
    const content = await readFileAsText(file);
    const data = JSON.parse(content);
    
    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of accounts');
    }
    
    return data.map((item: any) => ({
      id: crypto.randomUUID(),
      name: item.name || 'Imported Account',
      username: item.username || 'root',
      password: keepPasswords && item.password ? item.password : undefined,
      privateKey: keepPasswords && item.privateKey ? item.privateKey : undefined,
      description: item.description,
      groupId: item.groupId,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  },

  exportGroupsToCSV: (groups: SSHGroup[]) => {
    const csvContent = [
      'Name,Description,Color,Created At',
      ...groups.map(group => {
        return [
          `"${group.name}"`,
          `"${group.description || ''}"`,
          group.color || '',
          group.createdAt
        ].join(',');
      })
    ].join('\n');

    downloadFile(csvContent, 'groups.csv', 'text/csv');
  },

  exportGroupsToJSON: (groups: SSHGroup[]) => {
    const json = JSON.stringify(groups, null, 2);
    downloadFile(json, 'groups.json', 'application/json');
  },

  importGroupsFromCSV: async (file: File): Promise<SSHGroup[]> => {
    const content = await file.text();
    const rows = content.split('\n').filter(row => row.trim());
    
    // Skip header
    return rows.slice(1).map((row) => {
      const cols = parseCSVRow(row);
      return {
        id: crypto.randomUUID(),
        name: cols[0] || 'Imported Group',
        description: cols[1] || undefined,
        color: cols[2] || undefined,
        createdAt: cols[3] || new Date().toISOString()
      };
    });
  },

  importGroupsFromJSON: async (file: File): Promise<SSHGroup[]> => {
    const content = await file.text();
    const data = JSON.parse(content);
    
    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of groups');
    }
    
    return data.map((item: any) => ({
      id: crypto.randomUUID(),
      name: item.name || 'Imported Group',
      description: item.description,
      color: item.color,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  }
};
