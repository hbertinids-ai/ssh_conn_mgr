import { useState, useEffect } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { X, User, Eye, EyeOff } from 'lucide-react';

interface AccountFormProps {
  accountId?: string | null;
  onClose: () => void;
}

export function AccountForm({ accountId, onClose }: AccountFormProps) {
  const { accounts, connections, tunnels, addAccount, updateAccount } = useConnectionStore();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    privateKey: '',
    description: '',
    group: '',
    authMethod: 'password' as 'password' | 'privateKey'
  });
  const [showPassword, setShowPassword] = useState(false);

  const isEditing = !!accountId;

  // Get unique groups from all entities (connections, tunnels, accounts)
  const existingGroups = Array.from(
    new Set([
      ...connections.map(c => c.group).filter(Boolean),
      ...tunnels.map(t => t.group).filter(Boolean),
      ...accounts.map(a => a.group).filter(Boolean),
    ])
  ) as string[];

  useEffect(() => {
    if (isEditing && accountId) {
      const account = accounts.find((a) => a.id === accountId);
      if (account) {
        setFormData({
          name: account.name,
          username: account.username,
          password: account.password || '',
          privateKey: account.privateKey || '',
          description: account.description || '',
          group: account.group || '',
          authMethod: account.privateKey ? 'privateKey' : 'password'
        });
      }
    }
  }, [isEditing, accountId, accounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const accountData = {
      name: formData.name,
      username: formData.username,
      description: formData.description || undefined,
      group: formData.group || undefined,
      password: formData.authMethod === 'password' ? formData.password : undefined,
      privateKey: formData.authMethod === 'privateKey' ? formData.privateKey : undefined,
    };

    if (isEditing && accountId) {
      updateAccount(accountId, accountData);
    } else {
      addAccount(accountData);
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Account' : 'New Account'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Account Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Production Servers"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., root, admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Authentication Method
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="password"
                  checked={formData.authMethod === 'password'}
                  onChange={(e) => handleInputChange('authMethod', e.target.value)}
                  className="mr-2 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-slate-300">Password</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="privateKey"
                  checked={formData.authMethod === 'privateKey'}
                  onChange={(e) => handleInputChange('authMethod', e.target.value)}
                  className="mr-2 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-slate-300">Private Key</span>
              </label>
            </div>
          </div>

          {formData.authMethod === 'password' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {formData.authMethod === 'privateKey' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Private Key
              </label>
              <textarea
                value={formData.privateKey}
                onChange={(e) => handleInputChange('privateKey', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="-----BEGIN PRIVATE KEY-----"
                rows={6}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Group
            </label>
            <input
              type="text"
              list="account-groups"
              value={formData.group}
              onChange={(e) => handleInputChange('group', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Production, Development"
              title="Select an existing group or type a new group name"
            />
            <datalist id="account-groups">
              {existingGroups.map((group) => (
                <option key={group} value={group} />
              ))}
            </datalist>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {isEditing ? 'Update' : 'Create'} Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}