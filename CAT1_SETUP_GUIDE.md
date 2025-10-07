# CAT1 Connection Data - Quick Setup Guide

## ✅ Ready to Populate Data

I've created a script that will automatically add 1 tunnel and 22 CAT1 connections to your SSH Connection Manager.

## 📋 What You're Getting

### Total: 1 Tunnel + 22 Connections in "CAT1 Connection" Group

**1 SSH Tunnel:**
- CAT Legacy Env Tunnel (configured for all main connections)

**16 Main Connections** (using host ip, via tunnel):
1. Aurora Ops Automation GUI → 10.6.54.224 🔒
2. Aurora DB1 → 10.6.53.91 🔒
3. Aurora DB2 → 10.6.53.92 🔒
4. Aurora Navigator 1 → 10.6.52.77 🔒
5. Aurora Navigator 2 → 10.6.52.78 🔒
6. Aurora Navigator VIP → 10.6.52.240 🔒
7. Aurora Navigator Proxy 1 → 10.6.51.219 🔒
8. Aurora Navigator Proxy 2 → 10.6.51.220 🔒
9. Aurora Navigator Proxy VIP → 10.6.51.240 🔒
10. ARTE 1 → 10.6.43.10 🔒
11. ARTE 2 → 10.6.43.11 🔒
12. ARTE VIP → 10.6.43.240 🔒
13. Identity Manager 1 → 10.6.54.48 🔒
14. Identity Manager 2 → 10.6.54.49 🔒
15. IGT Gateway → 10.6.46.198 🔒
16. SYSLOG → 10.6.54.196 🔒

🔒 = Uses "CAT Legacy Env Tunnel"

**6 Direct Connections** (using NATed ip, no tunnel):
1. ptlc1s1ardb21 direct → 10.93.1.190 🔗
2. ptlc1s1ardb22 direct → 10.93.1.191 🔗
3. ptlc1s1arte21 direct → 10.93.1.192 🔗
4. ptlc1s1arte22 direct → 10.93.1.193 🔗
5. ptlc1s1igtgw21 direct → 10.93.1.200 🔗

🔗 = Direct connection (bypasses tunnel)

---

## 🚀 5-Step Installation

### Step 1: Start the App
The app should already be running at: **http://localhost:5173**

If not, run:
```powershell
npm run dev
```

### Step 2: Open Developer Tools
Press `F12` on your keyboard

### Step 3: Go to Console Tab
Click on the "Console" tab in the Developer Tools

### Step 4: Run the Script
1. Open the file: `scripts/populate-cat1-data.js`
2. Copy **everything** (Ctrl+A, Ctrl+C)
3. Paste into the browser console (Ctrl+V)
4. Press `Enter`

You should see:
```
🚀 Starting CAT1 Connection Data Population...
✅ SUCCESS!
📊 Added 22 connections to the "CAT1 Connection" group:
   - 16 main connections
   - 6 "direct" connections (for NATed IPs)

🔄 Please refresh the page (F5) to see the new connections.
```

### Step 5: Refresh
Press `F5` to refresh the page

---

## 🎉 You're Done!

Look at the left sidebar - you should now see:

```
📁 CAT1 Connection (22)
  └── All your connections listed here!
```

Click the chevron (▼) next to "CAT1 CONNECTION" to expand/collapse the group.

---

## ⚙️ Next Steps

### 1. Configure the Tunnel FIRST! ⚠️
The tunnel is created with placeholder values. You must configure it:
- Go to the **Tunnels** tab in the header
- Expand "CAT1 Connection" group
- Click the pencil icon (✏️) on "CAT Legacy Env Tunnel"
- Set:
  - **Host**: Your jump server/bastion host IP or hostname
  - **Username**: Your username for the tunnel
  - **Password**: Your password for the tunnel
- Click "Save"

### 2. Set Connection Passwords
All connections are created with empty passwords. Edit each one to add credentials:
- Go to the **Connections** tab
- Expand "CAT1 Connection" group
- Click the pencil icon (✏️) on any connection
- Enter the password
- Click "Save"

### 3. Update Usernames (if needed)
Default username is "root". Change if you use something else:
- Click the pencil icon (✏️) on the connection
- Change username field
- Click "Save"

### 4. Test Connections
- Click the play button (▶️) on any connection
- A new terminal tab will open
- The main connections will automatically connect through the tunnel
- The "direct" connections bypass the tunnel

---

## 🔧 Troubleshooting

### "Nothing happened after pasting the script"
- Make sure you copied the **entire** file
- Check for error messages in red in the console
- Try copying and pasting again

### "I don't see the new connections"
- Did you press F5 to refresh?
- Open Console (F12) and look for error messages

### "I see duplicates!"
You can safely delete duplicates:
- Expand the CAT1 Connection group
- Click the trash icon (🗑️) on unwanted connections

### "I want to start over"
Clear all data:
1. Press F12 (Developer Tools)
2. Go to Console
3. Type: `localStorage.clear()`
4. Press Enter
5. Refresh the page (F5)

---

## 📁 Files Created

- `scripts/populate-cat1-data.js` - The main script (paste this in browser console)
- `scripts/populate-cat1-data.ts` - TypeScript version (for reference)
- `scripts/README.md` - Detailed documentation

---

## 💡 Pro Tips

1. **Organize**: The grouping feature automatically organizes these 22 connections
2. **Collapse**: Click the group header to collapse/expand all CAT1 connections
3. **Search**: Use the autocomplete when creating new connections - type "CAT1" to see the group
4. **Color-coded**: Each connection gets a random color for easy identification in tabs
5. **Multiple Tabs**: You can open the same connection multiple times in different tabs

---

## 📞 Need Help?

Check the detailed README in `scripts/README.md` for more information!
