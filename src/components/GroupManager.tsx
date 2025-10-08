import { useState } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { Folder, Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { GroupForm } from './GroupForm';
import { ImportExportModal } from './ImportExportModal';

export function GroupManager() {
  const { groups, connections, tunnels, accounts, deleteGroup, addGroup } = useConnectionStore();
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);

  const handleDelete = (id: string) => {
    const group = groups.find(g => g.id === id);
    if (!group) return;
    
    // Count items in this group
    const connCount = connections.filter(c => c.groupId === id).length;
    const tunnelCount = tunnels.filter(t => t.groupId === id).length;
    const accountCount = accounts.filter(a => a.groupId === id).length;
    const totalItems = connCount + tunnelCount + accountCount;
    
    if (totalItems > 0) {
      if (!confirm(`Group "${group.name}" contains ${totalItems} item(s). These items will be ungrouped. Continue?`)) {
        return;
      }
    } else {
      if (!confirm(`Delete group "${group.name}"?`)) {
        return;
      }
    }
    
    deleteGroup(id);
  };

  const handleEdit = (id: string) => {
    setEditingGroupId(id);
    setIsFormOpen(true);
  };

  const handleImport = (items: any[]) => {
    items.forEach(item => addGroup(item));
  };

  // Sort groups alphabetically
  const sortedGroups = [...groups].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 space-y-2">
        <button
          onClick={() => {
            setEditingGroupId(null);
            setIsFormOpen(true);
          }}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Group</span>
        </button>
        
        <button
          onClick={() => setImportExportOpen(true)}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>Import/Export</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sortedGroups.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No groups yet</p>
            <p className="text-sm mt-1">Create groups to organize your connections</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedGroups.map((group) => {
              const connCount = connections.filter(c => c.groupId === group.id).length;
              const tunnelCount = tunnels.filter(t => t.groupId === group.id).length;
              const accountCount = accounts.filter(a => a.groupId === group.id).length;
              const totalItems = connCount + tunnelCount + accountCount;
              
              return (
                <div
                  key={group.id}
                  className="card p-3 hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: group.color || '#64748b' }}
                        />
                        <h3 className="font-medium text-white truncate">{group.name}</h3>
                      </div>
                      {group.description && (
                        <p className="text-sm text-slate-400 mt-1">{group.description}</p>
                      )}
                      <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500">
                        {connCount > 0 && <span>{connCount} connection{connCount !== 1 ? 's' : ''}</span>}
                        {tunnelCount > 0 && <span>{tunnelCount} tunnel{tunnelCount !== 1 ? 's' : ''}</span>}
                        {accountCount > 0 && <span>{accountCount} account{accountCount !== 1 ? 's' : ''}</span>}
                        {totalItems === 0 && <span className="text-slate-600">No items</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => handleEdit(group.id)}
                        className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                        title="Edit group"
                      >
                        <Edit2 className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(group.id)}
                        className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                        title="Delete group"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isFormOpen && (
        <GroupForm
          groupId={editingGroupId}
          onClose={() => {
            setIsFormOpen(false);
            setEditingGroupId(null);
          }}
        />
      )}

      {importExportOpen && (
        <ImportExportModal
          isOpen={importExportOpen}
          type="groups"
          data={groups}
          onClose={() => setImportExportOpen(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
}
