# Quick Start Guide

## Running the Application

### Development Mode

To start the application in development mode with hot reload:

```powershell
npm run dev
```

This will:
1. Start the Vite development server (React UI)
2. Launch the Electron application
3. Enable hot module replacement for fast development

The application will open automatically in a new window.

### Building for Production

To build the application for production:

```powershell
# Build both renderer and main process
npm run build

# Package as executable (Windows/Mac/Linux)
npm run build:electron
```

The packaged application will be in the `release/` directory.

## Using the Application

### 1. Create Your First SSH Tunnel (Optional)

If you need to connect through a jump host:

1. Click **"Tunnels"** in the header
2. Click **"New Tunnel"**
3. Fill in the tunnel details:
   - Name: "Jump Server"
   - Host: your.jumphost.com
   - Port: 22
   - Username: your_username
   - Password: your_password
4. Click **"Create Tunnel"**

### 2. Create an SSH Connection

1. Click **"Connections"** in the header
2. Click **"New Connection"**
3. Fill in the connection details:
   - Connection Name: "My Server"
   - Host: 192.168.1.100
   - Port: 22
   - Username: root
   - Password: your_password (or use Private Key)
   - SSH Tunnel: Select a tunnel if needed
4. Click **"Create Connection"**

### 3. Connect to a Server

1. Find your connection in the sidebar
2. Click the **Play button** (▶️)
3. Wait for the connection to establish (yellow → green indicator)
4. Your terminal session is ready!

### 4. Manage Multiple Sessions

- **Open multiple tabs**: Connect to different servers simultaneously
- **Switch tabs**: Click on any tab to switch between sessions
- **Close sessions**: Click the **X** button on any tab
- **Status indicators**:
  - 🟡 Yellow = Connecting
  - 🟢 Green = Connected
  - 🔴 Red = Error

## Keyboard Shortcuts

- **Ctrl+C** - Copy selected text in terminal
- **Ctrl+V** - Paste in terminal
- Terminal standard shortcuts work as expected

## Troubleshooting

### Connection Issues

If you can't connect:
1. Verify host and port are correct
2. Check username and password
3. Ensure the SSH server is running
4. Check firewall settings

### Tunnel Connection Issues

If tunnel connection fails:
1. Verify tunnel host is accessible
2. Check tunnel credentials
3. Ensure your target host is accessible from the tunnel

### Application Won't Start

If the app doesn't start:
1. Delete `node_modules/` folder
2. Run `npm install` again
3. Try `npm run build` before `npm run dev`

## Tips

- **Color-coded connections**: Each connection gets a unique color for easy identification
- **Persistent storage**: Connections and tunnels are saved automatically
- **Private keys**: Paste your entire private key (including headers) into the Private Key field
- **Tunnel chains**: You can connect through a tunnel to access servers behind firewalls

## Development

### Project Structure

```
ssh_conn_mgr/
├── electron/          # Electron main process
├── src/              # React application
│   ├── components/   # UI components
│   ├── store/        # State management
│   └── types/        # TypeScript types
├── dist/             # Build output
└── release/          # Packaged executables
```

### Available Scripts

- `npm run dev` - Development mode
- `npm run build` - Build for production
- `npm run build:renderer` - Build React app only
- `npm run build:main` - Build Electron main only
- `npm run build:electron` - Package application
- `npm run type-check` - Check TypeScript types

## Need Help?

Check the main README.md for more detailed information or open an issue on GitHub.
