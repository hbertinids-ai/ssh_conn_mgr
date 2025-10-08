import { useState } from 'react';
import { Upload, Download, FileText, File, AlertCircle, CheckCircle } from 'lucide-react';
import { importExportService } from '../services/importExportService';
import { SSHConnection, SSHTunnel, SSHAccount, SSHGroup } from '../types';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'connections' | 'tunnels' | 'accounts' | 'groups';
  data: SSHConnection[] | SSHTunnel[] | SSHAccount[] | SSHGroup[];
  onImport: (items: SSHConnection[] | SSHTunnel[] | SSHAccount[] | SSHGroup[]) => void;
}

export function ImportExportModal({ isOpen, onClose, type, data, onImport }: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [includePasswords, setIncludePasswords] = useState(false);
  const [keepPasswords, setKeepPasswords] = useState(false);

  if (!isOpen) return null;

  const isConnections = type === 'connections';
  const isAccounts = type === 'accounts';
  const isGroups = type === 'groups';
  const title = isConnections ? 'Connections' : isAccounts ? 'Accounts' : isGroups ? 'Groups' : 'Tunnels';

  const handleExportCSV = () => {
    if (isConnections) {
      importExportService.exportConnectionsToCSV(data as SSHConnection[], includePasswords);
    } else if (isAccounts) {
      importExportService.exportAccountsToCSV(data as SSHAccount[], includePasswords);
    } else if (isGroups) {
      importExportService.exportGroupsToCSV(data as SSHGroup[]);
    } else {
      importExportService.exportTunnelsToCSV(data as SSHTunnel[], includePasswords);
    }
  };

  const handleExportJSON = () => {
    if (isConnections) {
      importExportService.exportConnectionsToJSON(data as SSHConnection[], includePasswords);
    } else if (isAccounts) {
      importExportService.exportAccountsToJSON(data as SSHAccount[], includePasswords);
    } else if (isGroups) {
      importExportService.exportGroupsToJSON(data as SSHGroup[]);
    } else {
      importExportService.exportTunnelsToJSON(data as SSHTunnel[], includePasswords);
    }
  };

  const handleFileImport = async (file: File, format: 'csv' | 'json') => {
    setImportStatus('loading');
    setImportMessage('Processing file...');

    try {
      let importedItems: SSHConnection[] | SSHTunnel[] | SSHAccount[] | SSHGroup[];

      if (isConnections) {
        if (format === 'csv') {
          importedItems = await importExportService.importConnectionsFromCSV(file, keepPasswords);
        } else {
          importedItems = await importExportService.importConnectionsFromJSON(file, keepPasswords);
        }
      } else if (isAccounts) {
        if (format === 'csv') {
          importedItems = await importExportService.importAccountsFromCSV(file, keepPasswords);
        } else {
          importedItems = await importExportService.importAccountsFromJSON(file, keepPasswords);
        }
      } else if (isGroups) {
        if (format === 'csv') {
          importedItems = await importExportService.importGroupsFromCSV(file);
        } else {
          importedItems = await importExportService.importGroupsFromJSON(file);
        }
      } else {
        if (format === 'csv') {
          importedItems = await importExportService.importTunnelsFromCSV(file, keepPasswords);
        } else {
          importedItems = await importExportService.importTunnelsFromJSON(file, keepPasswords);
        }
      }

      onImport(importedItems);
      setImportStatus('success');
      setImportMessage(`Successfully imported ${importedItems.length} ${type}!`);
      
      setTimeout(() => {
        setImportStatus('idle');
        onClose();
      }, 2000);

    } catch (error) {
      setImportStatus('error');
      setImportMessage(`Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFileUpload = (format: 'csv' | 'json') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = format === 'csv' ? '.csv' : '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileImport(file, format);
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <File className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Import/Export {title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'export' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Export {title} ({data.length} items)
              </h3>
              <p className="text-slate-400 mb-4">
                Download your {type} in CSV or JSON format for backup or sharing.
              </p>

              {/* Password option - hide for groups */}
              {!isGroups && (
                <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePasswords}
                      onChange={(e) => setIncludePasswords(e.target.checked)}
                      className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div>
                      <div className="text-white font-medium">Include passwords and private keys</div>
                      <div className="text-slate-400 text-sm">
                        Export credentials (not recommended for shared files)
                      </div>
                  </div>
                </label>
              </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center justify-center space-x-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                >
                  <FileText className="w-8 h-8 text-green-400" />
                  <div className="text-left">
                    <div className="text-white font-medium">Export as CSV</div>
                    <div className="text-slate-400 text-sm">Spreadsheet format</div>
                  </div>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex items-center justify-center space-x-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                >
                  <File className="w-8 h-8 text-blue-400" />
                  <div className="text-left">
                    <div className="text-white font-medium">Export as JSON</div>
                    <div className="text-slate-400 text-sm">Machine readable</div>
                  </div>
                </button>
              </div>

              {!includePasswords && !isGroups && (
                <div className="mt-6 p-4 bg-amber-900/20 border border-amber-700 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <div className="text-amber-400 font-medium text-sm">Security Note</div>
                      <div className="text-amber-300 text-sm">
                        Passwords and private keys will not be included in exports.
                        You'll need to re-enter them after importing.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'import' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Import {title}</h3>
              <p className="text-slate-400 mb-4">
                Upload a CSV or JSON file to import {type}. Existing items will not be overwritten.
              </p>

              {/* Password option - hide for groups */}
              {!isGroups && (
                <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keepPasswords}
                      onChange={(e) => setKeepPasswords(e.target.checked)}
                      className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div>
                      <div className="text-white font-medium">Keep passwords and private keys from file</div>
                      <div className="text-slate-400 text-sm">
                        Import credentials if they exist in the file (only if previously exported with passwords)
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {importStatus === 'idle' && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleFileUpload('csv')}
                    className="flex items-center justify-center space-x-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                  >
                    <FileText className="w-8 h-8 text-green-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">Import CSV</div>
                      <div className="text-slate-400 text-sm">From spreadsheet</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleFileUpload('json')}
                    className="flex items-center justify-center space-x-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                  >
                    <File className="w-8 h-8 text-blue-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">Import JSON</div>
                      <div className="text-slate-400 text-sm">From backup file</div>
                    </div>
                  </button>
                </div>
              )}

              {importStatus === 'loading' && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-4"></div>
                  <p className="text-slate-400">{importMessage}</p>
                </div>
              )}

              {importStatus === 'success' && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-400 font-medium">{importMessage}</p>
                  <p className="text-slate-400 text-sm mt-2">Window will close automatically...</p>
                </div>
              )}

              {importStatus === 'error' && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400 font-medium">{importMessage}</p>
                  <button
                    onClick={() => setImportStatus('idle')}
                    className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-blue-400 font-medium text-sm">Import Notes</div>
                    <ul className="text-blue-300 text-sm mt-1 space-y-1">
                      <li>• New IDs will be generated for imported items</li>
                      <li>• Passwords and keys must be re-entered for security</li>
                      <li>• Malformed rows in CSV files will be skipped</li>
                      <li>• Existing {type} will not be affected</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}