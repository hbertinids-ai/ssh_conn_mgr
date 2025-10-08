# SSH Connection Manager

**Version 1.1.0** - A modern, beautiful SSH connection manager built with Electron, React, and TypeScript. Manage multiple SSH sessions with tabs, support for SSH tunnels, unified group management, and a clean user interface.

## Features

- 🖥️ **Tabbed SSH Sessions** - Open and manage multiple SSH connections in tabs
- 🔐 **SSH Tunnel Support** - Connect through SSH tunnels (jump hosts/bastion servers)
- 🔑 **Multiple Authentication** - Support for password and private key authentication
- � **Account Management** - Create reusable accounts with credentials that can be shared across connections
- �💾 **Connection Management** - Full CRUD operations for connections, tunnels, and accounts
- 📁 **Organized Grouping** - Organize connections, tunnels, and accounts into collapsible groups
- 📤 **Import/Export** - Import and export connections, tunnels, and accounts in CSV/JSON formats
- 💾 **Save Session Output** - Export terminal session logs to text files with one click
- 🎨 **Beautiful UI** - Clean, modern interface built with Tailwind CSS
- ⚡ **Fast & Responsive** - Built on Electron with React for optimal performance
- 🎯 **Color-Coded Connections** - Visual distinction between different connections

## Technology Stack

- **Electron** - Cross-platform desktop application framework
- **React** - UI component library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, utility-first CSS framework
- **SSH2** - Pure JavaScript SSH client implementation
- **Xterm.js** - Terminal emulator for the browser
- **Zustand** - Lightweight state management

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ssh_conn_mgr
```

2. Install dependencies:
```bash
npm install
```

3. Start development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm run build:electron
```

## Usage

### Quick Start: Populate CAT1 Connection Data

Want to quickly add 22 pre-configured CAT1 connections? See **[CAT1_DATA_READY.md](CAT1_DATA_READY.md)** for instructions!

### Creating a Connection

1. Click "New Connection" in the sidebar
2. Fill in the connection details:
   - Connection Name
   - Host and Port
   - Username
   - Password or Private Key
   - Optional: Group (e.g., "Production", "Development")
   - Optional: Select an SSH Tunnel
3. Click "Create Connection"

### Creating an SSH Tunnel

1. Click the "Tunnels" tab in the header
2. Click "New Tunnel"
3. Fill in the tunnel details:
   - Tunnel Name
   - Host and Port
   - Username and Password
4. Click "Create Tunnel"

### Managing Accounts

1. Click the "Accounts" tab in the header
2. Click "New Account" to create a reusable account
3. Fill in the account details:
   - Account Name
   - Username
   - Choose authentication method (Password or Private Key)
   - Optional: Group (e.g., "Admin Accounts", "User Accounts")
4. Click "Create Account"

**Using Accounts in Connections and Tunnels:**
- When creating or editing connections/tunnels, select an existing account from the dropdown
- Account dropdown shows: `[Group] / Account Name (username)` for easy identification
- Selecting an account auto-populates username, password, and private key fields
- Credential fields are disabled when an account is selected (to ensure consistency)
- Or choose "Manual entry" to enter credentials directly

**Smart Group Management:**
- All form group dropdowns show existing groups from connections, tunnels, AND accounts
- This ensures consistent organization across all entity types
- Simply start typing to select an existing group or create a new one
- Imported groups are automatically available in dropdowns

### Connecting to a Server

1. Find your connection in the sidebar
2. Click the Play button (▶️)
3. A new tab will open with your SSH session

### Managing Sessions

- Switch between sessions by clicking on tabs
- Close sessions with the X button on each tab
- Status indicators show connection state:
  - 🟡 Yellow = Connecting
  - 🟢 Green = Connected
  - 🔴 Red = Error

### Import/Export Data

You can import and export your data to backup or share configurations:

1. Click "Help" → "Import/Export" in the main menu
2. Choose data type: Connections, Tunnels, or Accounts
3. **Export options:**
   - **CSV**: Spreadsheet-friendly format for editing
   - **JSON**: Complete data backup with all fields
   - **Include passwords**: Toggle to include/exclude passwords and private keys (default: OFF for security)
4. **Import options:**
   - Select a CSV or JSON file to import data
   - **Keep passwords**: Toggle to preserve passwords from file (default: OFF, requires passwords in source file)

**Security Notes:**
- By default, passwords and private keys are NOT included in exports for security
- You'll need to re-enter credentials after importing unless you enabled "Include passwords" during export
- Only enable password export for secure, private backups

**Tip**: Use CSV export to bulk-edit connections in Excel/Google Sheets, then import back!

## Project Structure

```
ssh_conn_mgr/
├── electron/          # Electron main process
│   ├── main.ts       # Main Electron app
│   └── preload.ts    # Preload script for IPC
├── src/              # React application
│   ├── components/   # React components
│   │   ├── App.tsx
│   │   ├── ConnectionManager.tsx
│   │   ├── ConnectionForm.tsx
│   │   ├── TunnelManager.tsx
│   │   ├── TunnelForm.tsx
│   │   ├── AccountManager.tsx
│   │   ├── AccountForm.tsx
│   │   ├── ImportExportModal.tsx
│   │   ├── Terminal.tsx
│   │   └── Tabs.tsx
│   ├── store/        # State management
│   │   └── connectionStore.ts
│   ├── types/        # TypeScript definitions
│   │   └── index.ts
│   ├── index.css     # Global styles
│   └── main.tsx      # React entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the React application
- `npm run build:electron` - Package the Electron app for distribution
- `npm run type-check` - Run TypeScript type checking

### Architecture

The application uses a clean architecture:

1. **Electron Main Process** (`electron/main.ts`) - Handles SSH connections and system integration
2. **React Renderer Process** (`src/`) - UI and user interactions
3. **IPC Communication** - Secure communication between processes via preload script
4. **Zustand Store** - Centralized state management with persistence

## Security Considerations

- Passwords and private keys are stored locally using Electron's secure storage
- All SSH connections use the industry-standard SSH2 protocol
- IPC communication is isolated through context bridge

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Inspired by PuTTY's robust SSH implementation
- Built with modern web technologies for a better user experience
- Thanks to the open-source community for the excellent libraries

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
