import { useState } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { Plus, Network, Trash2, Edit2 } from 'lucide-react';
import { TunnelForm } from './TunnelForm';

export function TunnelManager() {
  const { tunnels, deleteTunnel } = useConnectionStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tunnel?')) {
      deleteTunnel(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <button
          onClick={() => {
            setEditingId(null);
            setIsFormOpen(true);
          }}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Tunnel</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {tunnels.length === 0 ? (
          <div className="text-center py-12">
            <Network className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No tunnels configured</p>
            <p className="text-slate-600 text-xs mt-1">Add a tunnel for proxy connections</p>
          </div>
        ) : (
          tunnels.map((tunnel) => (
            <div
              key={tunnel.id}
              className="card p-4 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1">
                  <Network className="w-4 h-4 text-primary-400" />
                  <h3 className="font-medium text-white truncate">{tunnel.name}</h3>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(tunnel.id)}
                    className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(tunnel.id)}
                    className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-slate-400">
                <p className="font-mono">
                  {tunnel.username}@{tunnel.host}:{tunnel.port}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <TunnelForm
          tunnelId={editingId}
          onClose={() => {
            setIsFormOpen(false);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}
