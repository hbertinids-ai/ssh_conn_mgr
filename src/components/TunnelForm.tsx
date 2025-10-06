import { useState, useEffect } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { X } from 'lucide-react';

interface TunnelFormProps {
  tunnelId?: string | null;
  onClose: () => void;
}

export function TunnelForm({ tunnelId, onClose }: TunnelFormProps) {
  const { tunnels, addTunnel, updateTunnel } = useConnectionStore();
  const tunnel = tunnelId ? tunnels.find((t) => t.id === tunnelId) : null;

  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 22,
    username: '',
    password: '',
    privateKey: '',
    group: '',
  });

  // Get unique groups from existing tunnels
  const existingGroups = Array.from(new Set(tunnels.map(t => t.group).filter(Boolean))) as string[];

  useEffect(() => {
    if (tunnel) {
      setFormData({
        name: tunnel.name,
        host: tunnel.host,
        port: tunnel.port,
        username: tunnel.username,
        password: tunnel.password || '',
        privateKey: tunnel.privateKey || '',
        group: tunnel.group || '',
      });
    }
  }, [tunnel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      password: formData.password || undefined,
      privateKey: formData.privateKey || undefined,
      group: formData.group || undefined,
    };

    if (tunnelId) {
      updateTunnel(tunnelId, data);
    } else {
      addTunnel(data);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {tunnelId ? 'Edit Tunnel' : 'New Tunnel'}
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
              Tunnel Name
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Jump Server"
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
                placeholder="jump.example.com"
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
              placeholder="user"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Group (optional)
            </label>
            <input
              type="text"
              list="tunnel-groups"
              className="input-field"
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              placeholder="e.g., Production, Development"
            />
            <datalist id="tunnel-groups">
              {existingGroups.map((group) => (
                <option key={group} value={group} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
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

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              {tunnelId ? 'Save Changes' : 'Create Tunnel'}
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
