import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ssh: {
    connect: (config: any) => ipcRenderer.invoke('ssh:connect', config),
    write: (id: string, data: string) => ipcRenderer.invoke('ssh:write', { id, data }),
    resize: (id: string, rows: number, cols: number) => 
      ipcRenderer.invoke('ssh:resize', { id, rows, cols }),
    disconnect: (id: string) => ipcRenderer.invoke('ssh:disconnect', { id }),
    onData: (callback: (data: any) => void) => {
      ipcRenderer.on('ssh:data', (event, data) => callback(data));
    },
    onClose: (callback: (data: any) => void) => {
      ipcRenderer.on('ssh:close', (event, data) => callback(data));
    },
  },
});
