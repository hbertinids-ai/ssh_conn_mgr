import { useState, useMemo } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { Plus, Network, Trash2, Edit2, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { TunnelForm } from './TunnelForm';
import { ImportExportModal } from './ImportExportModal';
import { SSHTunnel } from '../types';

export function TunnelManager() {
  const { tunnels, deleteTunnel, addTunnel } = useConnectionStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [importExportOpen, setImportExportOpen] = useState(false);

  // Group tunnels by group field
  const groupedTunnels = useMemo(() => {
    const groups: Record<string, typeof tunnels> = {};
    
    tunnels.forEach((tunnel) => {
      const groupName = tunnel.group || 'Ungrouped';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(tunnel);
    });
    
    return groups;
  }, [tunnels]);

  // Initialize all groups as collapsed
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const groupNames = new Set<string>();
    tunnels.forEach((tunnel) => {
      const groupName = tunnel.group || 'Ungrouped';
      groupNames.add(groupName);
    });
    return groupNames;
  });

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tunnel?')) {
      deleteTunnel(id);
    }
  };

  const handleImport = (importedTunnels: SSHTunnel[] | any[]) => {
    (importedTunnels as SSHTunnel[]).forEach(tunnel => {
      addTunnel(tunnel);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 space-y-2">
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
        
        <button
          onClick={() => setImportExportOpen(true)}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>Import/Export</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tunnels.length === 0 ? (
          <div className="text-center py-12">
            <Network className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No tunnels configured</p>
            <p className="text-slate-600 text-xs mt-1">Add a tunnel for proxy connections</p>
          </div>
        ) : (
          Object.entries(groupedTunnels).map(([groupName, groupTunnels]) => (
            <div key={groupName} className="space-y-2">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(groupName)}
                className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-slate-700/50 rounded transition-colors"
              >
                {collapsedGroups.has(groupName) ? (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  {groupName}
                </span>
                <span className="text-xs text-slate-500">
                  ({groupTunnels.length})
                </span>
              </button>

              {/* Group Tunnels */}
              {!collapsedGroups.has(groupName) && (
                <div className="space-y-2 ml-2">
                  {groupTunnels.map((tunnel) => (
                    <div
                      key={tunnel.id}
                      className="card p-4 hover:border-slate-600 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex items-start space-x-2 flex-1 min-w-0">
                          <Network className="w-4 h-4 text-primary-400 flex-shrink-0 mt-1" />
                          <h3 className="font-medium text-white break-words">{tunnel.name}</h3>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
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
                  ))}
                </div>
              )}
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

      {importExportOpen && (
        <ImportExportModal
          isOpen={importExportOpen}
          onClose={() => setImportExportOpen(false)}
          type="tunnels"
          data={tunnels}
          onImport={handleImport}
        />
      )}
    </div>
  );
}
