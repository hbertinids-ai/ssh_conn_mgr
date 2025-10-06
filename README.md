# SSH Connection Manager

A modern, beautiful SSH connection manager built with Electron, React, and TypeScript. Manage multiple SSH sessions with tabs, support for SSH tunnels, and a clean user interface.

## Features

- 🖥️ **Tabbed SSH Sessions** - Open and manage multiple SSH connections in tabs
- 🔐 **SSH Tunnel Support** - Connect through SSH tunnels (jump hosts/bastion servers)
- 🔑 **Multiple Authentication** - Support for password and private key authentication
- 💾 **Connection Management** - Full CRUD operations for connections and tunnels
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

### Creating a Connection

1. Click "New Connection" in the sidebar
2. Fill in the connection details:
   - Connection Name
   - Host and Port
   - Username
   - Password or Private Key
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
