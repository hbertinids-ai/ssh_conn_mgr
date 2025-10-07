# ✅ CAT1 Connection Data - Ready to Use!

## 🎯 Summary

I've created a **browser console script** that will automatically populate your SSH Connection Manager with all 22 CAT1 connections and 1 tunnel.

## 📦 What's Been Created

### Files:
1. **`scripts/populate-cat1-data.js`** - Main script (paste this in browser console)
2. **`scripts/populate-cat1-data.ts`** - TypeScript version (for reference)
3. **`scripts/README.md`** - Detailed documentation
4. **`CAT1_SETUP_GUIDE.md`** - Quick setup guide

### Data Structure:
- **1 tunnel**: "CAT Legacy Env Tunnel" (in "CAT1 Connection" group)
- **22 total connections** in "CAT1 Connection" group
- **16 main connections** (using host IP addresses, via tunnel)
- **6 "direct" connections** (for servers with NATed IPs, no tunnel)
- All connections use:
  - Port: 22
  - Username: root (you can change this)
  - Auth: password (empty by default - you'll need to set passwords)
  - Group: "CAT1 Connection"
  - Tunnel: Main connections use "CAT Legacy Env Tunnel"

---

## 🚀 Quick Start (3 Steps)

### 1. Open the App
The app is running at: http://localhost:5173

### 2. Run the Script
1. Press **F12** (opens Developer Tools)
2. Click **Console** tab
3. Open **`scripts/populate-cat1-data.js`** in VS Code
4. Copy the **entire file** (Ctrl+A, Ctrl+C)
5. Paste in the browser console (Ctrl+V)
6. Press **Enter**

### 3. Refresh
Press **F5** to reload the page

---

## ✨ Result

You'll see in the sidebar:

**Connections Tab:**
```
┌─────────────────────────────┐
│ 📁 CAT1 Connection (22)     │ ← Click to collapse/expand
├─────────────────────────────┤
│ Aurora Ops Automation GUI   │ [via tunnel]
│ Aurora DB1                  │ [via tunnel]
│ ptlc1s1ardb21 direct        │ [direct]
│ Aurora DB2                  │ [via tunnel]
│ ptlc1s1ardb22 direct        │ [direct]
│ Aurora Navigator 1          │ [via tunnel]
│ Aurora Navigator 2          │ [via tunnel]
│ ... (and 15 more)           │
└─────────────────────────────┘
```

**Tunnels Tab:**
```
┌─────────────────────────────┐
│ 📁 CAT1 Connection (1)      │
├─────────────────────────────┤
│ CAT Legacy Env Tunnel       │ ⚠️ Configure this first!
└─────────────────────────────┘
```

---

## 🔑 Connection Mapping

| Description | Host IP | Direct (NATed) |
|-------------|---------|----------------|
| Aurora Ops Automation GUI | 10.6.54.224 | - |
| Aurora DB1 | 10.6.53.91 | 10.93.1.190 ✓ |
| Aurora DB2 | 10.6.53.92 | 10.93.1.191 ✓ |
| Aurora Navigator 1 | 10.6.52.77 | - |
| Aurora Navigator 2 | 10.6.52.78 | - |
| Aurora Navigator VIP | 10.6.52.240 | - |
| Aurora Navigator Proxy 1 | 10.6.51.219 | - |
| Aurora Navigator Proxy 2 | 10.6.51.220 | - |
| Aurora Navigator Proxy VIP | 10.6.51.240 | - |
| ARTE 1 | 10.6.43.10 | 10.93.1.192 ✓ |
| ARTE 2 | 10.6.43.11 | 10.93.1.193 ✓ |
| ARTE VIP | 10.6.43.240 | - |
| Identity Manager 1 | 10.6.54.48 | - |
| Identity Manager 2 | 10.6.54.49 | - |
| IGT Gateway | 10.6.46.198 | 10.93.1.200 ✓ |
| SYSLOG | 10.6.54.196 | - |

**✓** = Has a "direct" connection for NATed IP access

---

## 📝 Next Steps

1. **Configure the Tunnel**: Edit "CAT Legacy Env Tunnel" to set:
   - Host (jump server/bastion host address)
   - Username
   - Password
2. **Set Connection Passwords**: Edit each connection to add SSH passwords
3. **Update Usernames**: Change from "root" if needed
4. **Test Connections**: Click play (▶️) to connect
5. **Enjoy**: Use the grouping feature to organize your connections!

---

## 📚 Documentation

- **Quick Guide**: `CAT1_SETUP_GUIDE.md`
- **Detailed Docs**: `scripts/README.md`
- **Script Source**: `scripts/populate-cat1-data.js`

---

## 🎉 Features You'll Love

### Grouping
All 22 connections are automatically grouped under "CAT1 Connection"
- Click the group name to collapse/expand
- Shows connection count: "CAT1 Connection (22)"

### Color Coding
Each connection gets a random color for easy tab identification

### Multiple Tabs
Open the same connection multiple times in different tabs

### Search
Type "CAT1" when creating new connections to see this group

---

## 💡 Tips

- **Collapse groups** you're not using to keep the sidebar clean
- **Use "direct" connections** when you need to bypass tunnels
- **Open multiple tabs** for different sessions on the same server
- **Edit connections** anytime - your changes are saved automatically

---

## 🆘 Troubleshooting

### Script doesn't work?
- Make sure you copied the ENTIRE file
- Check the console for red error messages
- Ensure the app is running in the browser

### Don't see connections?
- Did you press F5 to refresh?
- Check if the group is collapsed (click the chevron)

### Have duplicates?
- You can safely delete them (trash icon)
- Or clear everything: `localStorage.clear()` in console

---

## ✅ Ready to Go!

Your SSH Connection Manager is ready with the grouping feature, and you have a script ready to populate all 22 CAT1 connections. Just follow the Quick Start above!

**Current Status:**
- ✅ App is running (http://localhost:5173)
- ✅ Grouping feature implemented
- ✅ Population script ready
- ✅ Documentation complete

**What's Next:**
Run the script and start managing your SSH connections! 🚀
