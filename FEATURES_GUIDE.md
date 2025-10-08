# SSH Connection Manager - Features Guide

## Accessing Key Features

### 📥 Import/Export Data

**Location:** Click the **"Import/Export"** button in the top navigation bar (next to Help button)

**What you can do:**
- Export Connections, Tunnels, or Accounts to CSV or JSON
- Import data from CSV or JSON files
- Toggle password inclusion (security feature)

**How to use:**

1. **Export Data:**
   - Click "Import/Export" button in header
   - Make sure you're on the correct tab (Connections/Tunnels/Accounts)
   - Click "Export" tab
   - ✅ Check "Include passwords and private keys" if you want to backup credentials (default: OFF)
   - Click "Export as CSV" or "Export as JSON"
   - File downloads automatically with timestamp

2. **Import Data:**
   - Click "Import/Export" button in header
   - Make sure you're on the correct tab (Connections/Tunnels/Accounts)
   - Click "Import" tab
   - ✅ Check "Keep passwords and private keys from file" if importing from a password-enabled export (default: OFF)
   - Click "Import CSV" or "Import JSON"
   - Select your file
   - Data is imported and merged with existing items

**Security Notes:**
- 🔒 Passwords are NOT included in exports by default
- 🔒 Imported passwords are NOT preserved by default
- ✅ Enable checkboxes only for secure, private backups
- 💡 This allows safe sharing of connection configs without credentials

---

### 📚 Help & Documentation

**Location:** Click the **"Help"** button in the top navigation bar (right side)

**What you can see:**
- Complete features list
- Installation instructions  
- Step-by-step usage guide
- Technology stack information
- Pro tips and best practices

**Sections available:**
- **Features**: All capabilities of the application
- **Installation**: How to set up for development
- **Usage Guide**: Quick start guide for common tasks

---

### 👤 Accounts Management

**Location:** Click the **"Accounts"** tab in the top navigation bar

**What you can do:**
- Create reusable SSH accounts with credentials
- Group accounts for organization
- Use accounts across multiple connections
- Import/Export accounts with optional password inclusion

**How to use:**
1. Click "Accounts" tab in header
2. Click "New Account" button
3. Fill in account details:
   - Name (e.g., "AWS Production Admin")
   - Username
   - Choose: Password or Private Key
   - Optional: Group name
4. Click "Create Account"
5. When creating connections, select the account from dropdown to auto-populate credentials

---

### 🔌 Creating Connections with Accounts

**Location:** Connections tab → Click "New Connection"

**Using an account:**
1. Click "Connections" tab
2. Click "New Connection"
3. Enter Name, Host, Port
4. **Account dropdown:** Select an existing account
   - Username, password, and private key fields auto-populate and become read-only
5. Click "Create Connection"

**Manual credentials:**
- Leave "Account" dropdown set to "Manual entry"
- Enter username, password, or private key manually

---

### 🌐 Navigation Overview

**Top Navigation Bar (Header):**
```
[☰ Toggle Sidebar] SSH Connection Manager
                                    [Connections] [Tunnels] [Accounts] | [Import/Export] [Help]
```

- **Left Side:**
  - Toggle button to show/hide sidebar
  - Application title

- **Center/Right:**
  - Connections tab - Manage SSH connections
  - Tunnels tab - Manage SSH tunnels (jump hosts)
  - Accounts tab - Manage reusable account credentials
  - Import/Export button - Data management
  - Help button - Documentation

**Sidebar (when visible):**
- Shows management panel for current tab
- Connections: List of SSH connections with connect buttons
- Tunnels: List of SSH tunnels
- Accounts: List of saved accounts

**Main Area:**
- Active terminal sessions with tabs
- Or "No Active Session" message when nothing connected

---

## Quick Tips

💡 **Account Credentials Reuse**
- Create one account, use in multiple connections
- Change password once, updates everywhere

💡 **Secure Export/Import**
- Export without passwords for team sharing
- Everyone re-enters their own credentials

💡 **Private Backup**
- Enable password export for personal backups
- Store file securely
- Import with password checkbox enabled

💡 **Bulk Editing**
- Export to CSV
- Edit in Excel/Google Sheets
- Import back (passwords cleared by default)

💡 **Groups for Organization**
- Use groups: "Production", "Development", "Testing"
- Applies to Connections, Tunnels, and Accounts
- Groups are collapsible for cleaner view

---

## Troubleshooting

**Q: I can't see the Import/Export button**
- A: Look in the top navigation bar, to the left of the Help button
- Should see: `[Import/Export] [Help]`

**Q: Where is the Help documentation?**
- A: Click the "Help" button in the top-right of the navigation bar
- Opens a modal with Features, Installation, and Usage tabs

**Q: Passwords aren't being imported**
- A: By default, passwords are NOT preserved during import for security
- Enable "Keep passwords and private keys from file" checkbox when importing
- Only works if the source file was exported with "Include passwords" enabled

**Q: I want to share connections without passwords**
- A: Perfect! That's the default behavior
- Export normally (password checkbox unchecked)
- Share the CSV/JSON file
- Recipients import and enter their own credentials

**Q: How do I backup everything including passwords?**
- A: When exporting:
  1. Check "Include passwords and private keys" ✅
  2. Export to JSON (preserves all fields)
  3. Store file securely
  4. When importing: Check "Keep passwords" ✅

---

## New in This Version

✨ **Password Toggle Feature**
- Choose whether to include passwords in exports
- Choose whether to keep passwords when importing
- Defaults to OFF for maximum security
- Clearly labeled with warnings and explanations

✨ **Account System**
- Reusable credentials across multiple connections
- Grouped organization
- Full import/export support

✨ **Enhanced Navigation**
- Dedicated Import/Export button in header
- Always accessible from any view
- Context-aware (imports/exports current tab's data)

---

## Getting Started

1. ✅ Click **"Help"** button to read full documentation
2. ✅ Create an **Account** with your credentials (optional but recommended)
3. ✅ Create a **Connection** using the account or manual entry
4. ✅ Click **"Connect"** to start an SSH session
5. ✅ Use **"Import/Export"** to backup your configuration

Enjoy secure, organized SSH session management! 🚀
