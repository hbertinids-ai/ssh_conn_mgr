import { useState, useEffect } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { X } from 'lucide-react';

interface ConnectionFormProps {
  connectionId?: string | null;
  onClose: () => void;
}

export function ConnectionForm({ connectionId, onClose }: ConnectionFormProps) {
  const { connections, tunnels, addConnection, updateConnection } = useConnectionStore();
  const connection = connectionId ? connections.find((c) => c.id === connectionId) : null;

  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 22,
    username: '',
    password: '',
    privateKey: '',
    tunnelId: '',
    group: '',
  });

  // Get unique groups from existing connections
  const existingGroups = Array.from(new Set(connections.map(c => c.group).filter(Boolean))) as string[];

  useEffect(() => {
    if (connection) {
      setFormData({
        name: connection.name,
        host: connection.host,
        port: connection.port,
        username: connection.username,
        password: connection.password || '',
        privateKey: connection.privateKey || '',
        tunnelId: connection.tunnelId || '',
        group: connection.group || '',
      });
    }
  }, [connection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      password: formData.password || undefined,
      privateKey: formData.privateKey || undefined,
      tunnelId: formData.tunnelId || undefined,
      group: formData.group || undefined,
    };

    if (connectionId) {
      updateConnection(connectionId, data);
    } else {
      addConnection(data);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {connectionId ? 'Edit Connection' : 'New Connection'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Connection Name
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Server"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Host</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                placeholder="192.168.1.100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Port</label>
              <input
                type="number"
                required
                className="input-field"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="root"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password (optional)
            </label>
            <input
              type="password"
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Private Key (optional)
            </label>
            <textarea
              className="input-field font-mono text-xs"
              rows={4}
              value={formData.privateKey}
              onChange={(e) => setFormData({ ...formData, privateKey: e.target.value })}
              placeholder="-----BEGIN RSA PRIVATE KEY-----"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Group (optional)
            </label>
            <input
              type="text"
              list="connection-groups"
              className="input-field"
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              placeholder="e.g., Production, Development"
            />
            <datalist id="connection-groups">
              {existingGroups.map((group) => (
                <option key={group} value={group} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              SSH Tunnel (optional)
            </label>
            <select
              className="input-field"
              value={formData.tunnelId}
              onChange={(e) => setFormData({ ...formData, tunnelId: e.target.value })}
            >
              <option value="">No tunnel</option>
              {tunnels.map((tunnel) => (
                <option key={tunnel.id} value={tunnel.id}>
                  {tunnel.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              {connectionId ? 'Save Changes' : 'Create Connection'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
