import { useState, useMemo } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { Plus, User, Trash2, Edit2, ChevronDown, ChevronRight, FileText, Key } from 'lucide-react';
import { AccountForm } from './AccountForm';
import { ImportExportModal } from './ImportExportModal';
import { SSHAccount } from '../types';

export function AccountManager() {
  const { accounts, deleteAccount, addAccount } = useConnectionStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [importExportOpen, setImportExportOpen] = useState(false);

  // Group accounts by group field
  const groupedAccounts = useMemo(() => {
    const groups: Record<string, typeof accounts> = {};
    
    accounts.forEach((account) => {
      const groupName = account.group || 'Ungrouped';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(account);
    });
    
    return groups;
  }, [accounts]);

  // Initialize all groups as collapsed
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const groupNames = new Set<string>();
    accounts.forEach((account) => {
      const groupName = account.group || 'Ungrouped';
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
    if (confirm('Are you sure you want to delete this account? It will be removed from all connections using it.')) {
      deleteAccount(id);
    }
  };

  const handleImport = (importedAccounts: SSHAccount[] | any[]) => {
    (importedAccounts as SSHAccount[]).forEach(account => {
      addAccount(account);
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
          <span>New Account</span>
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
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No Accounts</h3>
            <p className="text-slate-500 text-sm">Create your first account to manage credentials</p>
          </div>
        ) : (
          Object.entries(groupedAccounts).map(([groupName, groupAccounts]) => (
            <div key={groupName} className="space-y-2">
              <button
                onClick={() => toggleGroup(groupName)}
                className="flex items-center space-x-2 w-full text-left py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                {collapsedGroups.has(groupName) ? (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
                <User className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-300">{groupName}</span>
                <span className="text-xs text-slate-500">({groupAccounts.length})</span>
              </button>

              {!collapsedGroups.has(groupName) && (
                <div className="pl-6 space-y-2">
                  {groupAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {account.privateKey ? (
                              <Key className="w-4 h-4 text-amber-400" />
                            ) : (
                              <User className="w-4 h-4 text-blue-400" />
                            )}
                            <h3 className="font-medium text-white break-words">{account.name}</h3>
                          </div>
                          <div className="text-sm text-slate-400 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="w-16 text-slate-500">User:</span>
                              <span className="break-words">{account.username}</span>
                            </div>
                            {account.description && (
                              <div className="flex items-start space-x-2">
                                <span className="w-16 text-slate-500 flex-shrink-0">Desc:</span>
                                <span className="break-words">{account.description}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <span className="w-16 text-slate-500">Auth:</span>
                              <span className="text-xs px-2 py-1 rounded-full bg-slate-700">
                                {account.privateKey ? 'Private Key' : 'Password'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(account.id)}
                            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
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
        <AccountForm
          accountId={editingId}
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
          type="accounts"
          data={accounts}
          onImport={handleImport}
        />
      )}
    </div>
  );
}