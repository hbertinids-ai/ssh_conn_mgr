import { useState } from 'react';
import { X, Book, Wrench, HelpCircle, Download } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'installation' | 'usage'>('features');

  if (!isOpen) return null;

  const features = [
    '🖥️ Tabbed SSH Sessions - Open and manage multiple SSH connections in tabs',
    '🔐 SSH Tunnel Support - Connect through SSH tunnels (jump hosts/bastion servers)',
    '🔑 Multiple Authentication - Support for password and private key authentication',
    '� Account Management - Create reusable accounts with credentials for multiple connections',
    '💾 Complete Data Management - Full CRUD operations for connections, tunnels, and accounts',
    '📁 Smart Grouping - Organize connections, tunnels, and accounts into collapsible groups',
    '💾 Save Session Output - Export terminal session logs to text files with one click',
    '📥 Import/Export - CSV and JSON import/export for all data types',
    '🔒 Security Options - Toggle password/key inclusion in exports (default: OFF for security)',
    '🎨 Beautiful UI - Clean, modern interface built with Tailwind CSS',
    '⚡ Fast & Responsive - Built on Electron with React for optimal performance',
    '🎯 Color-Coded Connections - Visual distinction between different connections'
  ];

  const installationSteps = [
    {
      title: 'Prerequisites',
      items: ['Node.js (v18 or higher)', 'npm or yarn']
    },
    {
      title: 'Development Setup',
      items: [
        'Clone the repository',
        'Run: npm install',
        'Run: npm run dev'
      ]
    },
    {
      title: 'Windows Executable',
      items: [
        'Download the release folder',
        'Run ssh-connection-manager.exe',
        'No installation required!'
      ]
    }
  ];

  const usageSteps = [
    {
      title: '1. Create SSH Tunnel (Optional)',
      description: 'If connecting through a jump host:',
      steps: [
        'Click "Tunnels" in the header',
        'Click "New Tunnel"',
        'Fill in tunnel details (host, username, password)',
        'Click "Create Tunnel"'
      ]
    },
    {
      title: '2. Create SSH Connection',
      description: 'Add your SSH servers:',
      steps: [
        'Click "Connections" in the header',
        'Click "New Connection"',
        'Fill in connection details',
        'Select tunnel if needed',
        'Click "Create Connection"'
      ]
    },
    {
      title: '3. Connect',
      description: 'Start your SSH session:',
      steps: [
        'Click the "Connect" button on any connection',
        'Wait for connection to establish',
        'Use the terminal normally',
        'Download session output using the download button'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Help & Documentation</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            title="Close help"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('features')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'features'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Book className="w-4 h-4" />
            <span>Features</span>
          </button>
          <button
            onClick={() => setActiveTab('installation')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'installation'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Installation</span>
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'usage'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Usage Guide</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'features' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Application Features</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-300 leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-slate-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">Technology Stack</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                  <div>• Electron - Desktop app framework</div>
                  <div>• React - UI component library</div>
                  <div>• TypeScript - Type-safe development</div>
                  <div>• Tailwind CSS - Modern CSS framework</div>
                  <div>• SSH2 - SSH client implementation</div>
                  <div>• Xterm.js - Terminal emulator</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'installation' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Installation & Setup</h3>
              <div className="space-y-6">
                {installationSteps.map((section, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <h4 className="text-blue-400 font-medium mb-2">Quick Start Commands</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-slate-900 p-2 rounded text-green-400">npm run dev</div>
                  <div className="bg-slate-900 p-2 rounded text-green-400">npm run build:exe</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Usage Guide</h3>
              <div className="space-y-6">
                {usageSteps.map((section, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">{section.title}</h4>
                    <p className="text-slate-400 text-sm mb-3">{section.description}</p>
                    <ol className="space-y-2">
                      {section.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start space-x-3">
                          <span className="text-blue-400 font-medium text-sm mt-1">{stepIndex + 1}.</span>
                          <span className="text-slate-300">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-900/20 border border-amber-700 rounded-lg">
                <h4 className="text-amber-400 font-medium mb-2">Pro Tips</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• Use accounts to reuse credentials across multiple connections</li>
                  <li>• Use groups to organize connections, tunnels, and accounts</li>
                  <li>• Download session output for logging and auditing</li>
                  <li>• Use tunnels for secure connections through jump hosts</li>
                  <li>• Export data without passwords by default for safe sharing</li>
                  <li>• Enable password export only for secure, private backups</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 text-center">
          <p className="text-slate-500 text-sm">
            SSH Connection Manager - Modern terminal session management
          </p>
        </div>
      </div>
    </div>
  );
}