import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as dns from 'dns';
import { Client, ClientChannel } from 'ssh2';

// Use system DNS resolver
dns.setDefaultResultOrder('ipv4first');

let mainWindow: BrowserWindow | null = null;

// Store active SSH connections
const sshConnections = new Map<string, Client>();
const sshChannels = new Map<string, ClientChannel>();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false, // Disable sandbox for network access
    },
    frame: true,
    titleBarStyle: 'default',
    backgroundColor: '#1e293b',
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    // Clean up all SSH connections
    sshConnections.forEach(conn => conn.end());
    sshConnections.clear();
    sshChannels.clear();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for SSH operations

ipcMain.handle('ssh:connect', async (event, config) => {
  const { id, host, port, username, password, privateKey, tunnel } = config;
  
  console.log('SSH Connection request:', { id, host, port, username, hasTunnel: !!tunnel });
  
  return new Promise((resolve, reject) => {
    const conn = new Client();
    
    conn.on('ready', () => {
      sshConnections.set(id, conn);
      
      conn.shell((err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        
        sshChannels.set(id, stream);
        
        stream.on('data', (data: Buffer) => {
          if (mainWindow) {
            mainWindow.webContents.send('ssh:data', { id, data: data.toString() });
          }
        });
        
        stream.on('close', () => {
          sshChannels.delete(id);
          sshConnections.delete(id);
          if (mainWindow) {
            mainWindow.webContents.send('ssh:close', { id });
          }
        });
        
        resolve({ success: true, id });
      });
    });
    
    conn.on('error', (err) => {
      reject(err);
    });
    
    // Handle tunnel connection if specified
    if (tunnel) {
      // First connect to tunnel
      const tunnelConn = new Client();
      
      tunnelConn.on('ready', () => {
        tunnelConn.forwardOut(
          '127.0.0.1',
          0,
          host,
          parseInt(port),
          (err, stream) => {
            if (err) {
              console.error('Tunnel forward error:', err);
              reject(err);
              return;
            }
            
            // Connect through tunnel
            const targetConfig: any = {
              sock: stream,
              username,
              readyTimeout: 20000,
              keepaliveInterval: 10000,
            };

            if (password) {
              targetConfig.password = password;
            }
            if (privateKey) {
              targetConfig.privateKey = privateKey;
            }

            conn.connect(targetConfig);
          }
        );
      });

      tunnelConn.on('error', (err) => {
        console.error('Tunnel connection error:', err);
        reject(err);
      });
      
      const tunnelConfig: any = {
        host: tunnel.host,
        port: parseInt(tunnel.port),
        username: tunnel.username,
        readyTimeout: 20000,
        keepaliveInterval: 10000,
      };

      if (tunnel.password) {
        tunnelConfig.password = tunnel.password;
      }
      if (tunnel.privateKey) {
        tunnelConfig.privateKey = tunnel.privateKey;
      }

      tunnelConn.connect(tunnelConfig);
    } else {
      // Direct connection
      const connectConfig: any = {
        host,
        port: parseInt(port),
        username,
        readyTimeout: 20000,
        keepaliveInterval: 10000,
        debug: (info: string) => {
          console.log('SSH Debug:', info);
        },
      };

      // Add authentication
      if (password) {
        connectConfig.password = password;
      }
      if (privateKey) {
        connectConfig.privateKey = privateKey;
      }

      // If no auth provided, try agent
      if (!password && !privateKey) {
        connectConfig.tryKeyboard = true;
      }

      try {
        conn.connect(connectConfig);
      } catch (err) {
        console.error('Connection error:', err);
        reject(err);
      }
    }
  });
});

ipcMain.handle('ssh:write', async (event, { id, data }) => {
  const channel = sshChannels.get(id);
  if (channel) {
    channel.write(data);
    return { success: true };
  }
  return { success: false, error: 'Channel not found' };
});

ipcMain.handle('ssh:resize', async (event, { id, rows, cols }) => {
  const channel = sshChannels.get(id);
  if (channel) {
    channel.setWindow(rows, cols, 0, 0);
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('ssh:disconnect', async (event, { id }) => {
  const conn = sshConnections.get(id);
  if (conn) {
    conn.end();
    sshConnections.delete(id);
    sshChannels.delete(id);
    return { success: true };
  }
  return { success: false };
});
