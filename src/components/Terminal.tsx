import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { useConnectionStore } from '../store/connectionStore';
import '@xterm/xterm/css/xterm.css';

interface TerminalInstance {
  term: XTerm;
  fitAddon: FitAddon;
  element: HTMLDivElement;
  outputBuffer: string[]; // Store all output for saving
}

export function Terminal() {
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const terminalsRef = useRef<Map<string, TerminalInstance>>(new Map());
  const { sessions, activeSessionId, setSessionStatus, closeSession } = useConnectionStore();

  // Function to save terminal output
  const saveOutput = (sessionId: string) => {
    const termInstance = terminalsRef.current.get(sessionId);
    const session = sessions.find(s => s.id === sessionId);
    
    if (!termInstance || !session) return;

    try {
      // Get terminal buffer content (visible content)
      const buffer = termInstance.term.buffer.active;
      const lines: string[] = [];
      
      for (let i = 0; i < buffer.length; i++) {
        const line = buffer.getLine(i);
        if (line) {
          lines.push(line.translateToString(true));
        }
      }

      const content = lines.join('\n');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T');
      const date = timestamp[0];
      const time = timestamp[1].substring(0, 8);
      const filename = `${session.connection.name}_${date}_${time}.txt`;

      // Create blob and download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      console.log(`Saved session output to ${filename}`);
    } catch (error) {
      console.error('Error saving output:', error);
    }
  };

  // Expose save function globally for tabs to use
  useEffect(() => {
    (window as any).saveTerminalOutput = saveOutput;
    return () => {
      delete (window as any).saveTerminalOutput;
    };
  }, [sessions]);

  // Setup global SSH event handlers once
  useEffect(() => {
    const handleData = (data: any) => {
      const termInstance = terminalsRef.current.get(data.id);
      if (termInstance) {
        termInstance.term.write(data.data);
        // Capture received data in buffer
        termInstance.outputBuffer.push(data.data);
      }
    };

    const handleClose = (data: any) => {
      const termInstance = terminalsRef.current.get(data.id);
      if (termInstance) {
        termInstance.term.writeln('\r\n\x1b[1;33mConnection closed\x1b[0m\r\n');
      }
      closeSession(data.id);
    };

    window.electron.ssh.onData(handleData);
    window.electron.ssh.onClose(handleClose);
  }, [closeSession]);

  // Manage terminal instances for all sessions
  useEffect(() => {
    if (!terminalContainerRef.current) return;

    const container = terminalContainerRef.current;

    // Create terminals for new sessions
    sessions.forEach((session) => {
      if (!terminalsRef.current.has(session.id)) {
        const terminalDiv = document.createElement('div');
        terminalDiv.className = 'h-full w-full absolute top-0 left-0';
        terminalDiv.style.display = 'none';

        const term = new XTerm({
          cursorBlink: true,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          theme: {
            background: '#0f172a',
            foreground: '#e2e8f0',
            cursor: '#38bdf8',
            cursorAccent: '#0f172a',
            selectionBackground: '#334155',
            black: '#1e293b',
            red: '#ef4444',
            green: '#10b981',
            yellow: '#f59e0b',
            blue: '#3b82f6',
            magenta: '#8b5cf6',
            cyan: '#06b6d4',
            white: '#cbd5e1',
            brightBlack: '#475569',
            brightRed: '#f87171',
            brightGreen: '#34d399',
            brightYellow: '#fbbf24',
            brightBlue: '#60a5fa',
            brightMagenta: '#a78bfa',
            brightCyan: '#22d3ee',
            brightWhite: '#f1f5f9',
          },
        });

        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();
        
        term.loadAddon(fitAddon);
        term.loadAddon(webLinksAddon);
        term.open(terminalDiv);
        setTimeout(() => fitAddon.fit(), 0);

        container.appendChild(terminalDiv);
        
        const outputBuffer: string[] = [];
        terminalsRef.current.set(session.id, { term, fitAddon, element: terminalDiv, outputBuffer });

        // Connect to SSH
        const connectSSH = async () => {
          try {
            const { connection } = session;
            const tunnels = useConnectionStore.getState().tunnels;
            const tunnel = connection.tunnelId
              ? tunnels.find((t) => t.id === connection.tunnelId)
              : undefined;

            term.writeln(`\r\nConnecting to ${connection.username}@${connection.host}:${connection.port}...\r\n`);

            const config = {
              id: session.id,
              host: connection.host.trim(),
              port: connection.port,
              username: connection.username.trim(),
              password: connection.password,
              privateKey: connection.privateKey,
              tunnel: tunnel
                ? {
                    host: tunnel.host.trim(),
                    port: tunnel.port,
                    username: tunnel.username.trim(),
                    password: tunnel.password,
                  }
                : undefined,
            };

            console.log('Connecting with config:', { 
              sessionId: session.id,
              host: config.host, 
              port: config.port, 
              username: config.username,
              hasTunnel: !!config.tunnel 
            });

            await window.electron.ssh.connect(config);
            setSessionStatus(session.id, 'connected');
            term.writeln(`\r\n\x1b[1;32mConnected successfully!\x1b[0m\r\n`);
          } catch (error: any) {
            console.error('SSH Connection error:', error);
            setSessionStatus(session.id, 'error', error.message);
            term.writeln(`\r\n\x1b[1;31mConnection Error: ${error.message || error}\x1b[0m\r\n`);
            term.writeln(`\r\nPlease check:\r\n`);
            term.writeln(`- Host address is correct (${session.connection.host})\r\n`);
            term.writeln(`- Port is correct (${session.connection.port})\r\n`);
            term.writeln(`- Credentials are valid\r\n`);
            term.writeln(`- Firewall allows the connection\r\n`);
          }
        };

        connectSSH();

        // Handle terminal input - only send to SSH, don't capture locally
        // The server will echo back, and we'll capture that in handleData
        term.onData((data) => {
          window.electron.ssh.write(session.id, data);
        });

        // Handle terminal resize
        const handleResize = () => {
          if (session.id === activeSessionId) {
            fitAddon.fit();
            window.electron.ssh.resize(session.id, term.rows, term.cols);
          }
        };

        window.addEventListener('resize', handleResize);
      }
    });

    // Remove terminals for closed sessions
    const sessionIds = new Set(sessions.map(s => s.id));
    terminalsRef.current.forEach((instance, id) => {
      if (!sessionIds.has(id)) {
        instance.term.dispose();
        instance.element.remove();
        terminalsRef.current.delete(id);
        window.electron.ssh.disconnect(id);
      }
    });

    // Show/hide terminals based on active session
    terminalsRef.current.forEach((instance, id) => {
      instance.element.style.display = id === activeSessionId ? 'block' : 'none';
      if (id === activeSessionId) {
        setTimeout(() => {
          instance.fitAddon.fit();
          instance.term.focus(); // Auto-focus the terminal
        }, 0);
      }
    });
  }, [sessions, activeSessionId]);

  // Cleanup all terminals on unmount
  useEffect(() => {
    return () => {
      terminalsRef.current.forEach((instance, id) => {
        instance.term.dispose();
        instance.element.remove();
        window.electron.ssh.disconnect(id);
      });
      terminalsRef.current.clear();
    };
  }, []);

  return (
    <div ref={terminalContainerRef} className="h-full bg-slate-900 p-4 relative" />
  );
}
