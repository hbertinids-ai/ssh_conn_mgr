import { useState, useMemo } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { Plus, Server, Trash2, Edit2, Play, ChevronDown, ChevronRight } from 'lucide-react';
import { ConnectionForm } from './ConnectionForm';

export function ConnectionManager() {
  const { connections, deleteConnection, createSession } = useConnectionStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Group connections by group field
  const groupedConnections = useMemo(() => {
    const groups: Record<string, typeof connections> = {};
    
    connections.forEach((conn) => {
      const groupName = conn.group || 'Ungrouped';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(conn);
    });
    
    return groups;
  }, [connections]);

  // Initialize all groups as collapsed
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const groupNames = new Set<string>();
    connections.forEach((conn) => {
      const groupName = conn.group || 'Ungrouped';
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

  const handleConnect = (connectionId: string) => {
    createSession(connectionId);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this connection?')) {
      deleteConnection(id);
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
          <span>New Connection</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {connections.length === 0 ? (
          <div className="text-center py-12">
            <Server className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No connections yet</p>
            <p className="text-slate-600 text-xs mt-1">Click "New Connection" to get started</p>
          </div>
        ) : (
          Object.entries(groupedConnections).map(([groupName, groupConnections]) => (
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
                  ({groupConnections.length})
                </span>
              </button>

              {/* Group Connections */}
              {!collapsedGroups.has(groupName) && (
                <div className="space-y-2 ml-2">
                  {groupConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className="card p-4 hover:border-slate-600 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex items-start space-x-2 flex-1 min-w-0">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                            style={{ backgroundColor: connection.color }}
                          />
                          <h3 className="font-medium text-white break-words">{connection.name}</h3>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => handleConnect(connection.id)}
                            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                            title="Connect"
                          >
                            <Play className="w-4 h-4 text-green-400" />
                          </button>
                          <button
                            onClick={() => handleEdit(connection.id)}
                            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(connection.id)}
                            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-slate-400 space-y-1">
                        <p className="font-mono">
                          {connection.username}@{connection.host}:{connection.port}
                        </p>
                        {connection.tunnelId && (
                          <p className="text-xs text-primary-400">via tunnel</p>
                        )}
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
        <ConnectionForm
          connectionId={editingId}
          onClose={() => {
            setIsFormOpen(false);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}
