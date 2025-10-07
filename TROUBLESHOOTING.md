# 🔧 Troubleshooting: Connections Not Appearing

## Problem
The script runs successfully and shows "✅ SUCCESS!" but the connections don't appear in the UI.

## Why This Happens
The data is saved to `localStorage`, but the React/Zustand state hasn't picked up the changes yet. This is a common issue with persisted state.

## ✅ Solutions (Try in Order)

### Solution 1: Updated Script (Auto-Reload) ⭐ RECOMMENDED
The script has been updated to automatically reload the page after adding data.

**Steps:**
1. Open the app (http://localhost:5173)
2. Press F12 → Console
3. Copy and paste `scripts/populate-cat1-data.js`
4. Press Enter
5. **Wait 1 second** - the page will reload automatically
6. Check the sidebar for "CAT1 Connection" group

---

### Solution 2: Manual Refresh
If the auto-reload doesn't work:

**Steps:**
1. After running the script, press **F5** or **Ctrl+R**
2. The page will reload and pick up the new data

---

### Solution 3: Force Store Reload
Use the helper script to force Zustand to reload:

**Steps:**
1. In the browser console, run:
```javascript
// Copy and paste scripts/force-reload-store.js
```
2. The page will reload automatically

---

### Solution 4: Check Storage Contents
Verify the data was actually saved:

**Steps:**
1. In the browser console, run:
```javascript
// Copy and paste scripts/check-storage.js
```
2. This will show you what's in localStorage
3. If you see "CAT1 Connection: X connections", the data is there
4. Just refresh the page (F5)

---

### Solution 5: Manual Storage Check
Check if data exists manually:

**In browser console:**
```javascript
// Check if data exists
const data = JSON.parse(localStorage.getItem('ssh-connection-manager-storage'));
console.log('Connections:', data.state.connections.length);
console.log('Tunnels:', data.state.tunnels.length);

// Filter CAT1 items
const cat1Conns = data.state.connections.filter(c => c.group === 'CAT1 Connection');
const cat1Tunnels = data.state.tunnels.filter(t => t.group === 'CAT1 Connection');
console.log('CAT1 Connections:', cat1Conns.length);
console.log('CAT1 Tunnels:', cat1Tunnels.length);
```

If you see numbers, the data is there - just refresh!

---

### Solution 6: Hard Refresh
Clear the cache and reload:

**Steps:**
- Windows: **Ctrl + Shift + R** or **Ctrl + F5**
- This forces a complete reload ignoring cache

---

### Solution 7: Clear and Re-run
If nothing works, start fresh:

**Steps:**
1. Clear storage:
```javascript
localStorage.clear();
```
2. Refresh the page (F5)
3. Run the populate script again
4. Wait for auto-reload or press F5

---

## 🔍 Diagnostic Commands

Run these in the browser console to diagnose issues:

### Check if data exists:
```javascript
localStorage.getItem('ssh-connection-manager-storage') !== null
```

### Count items:
```javascript
const data = JSON.parse(localStorage.getItem('ssh-connection-manager-storage'));
console.log('Total connections:', data.state.connections.length);
console.log('Total tunnels:', data.state.tunnels.length);
```

### List all groups:
```javascript
const data = JSON.parse(localStorage.getItem('ssh-connection-manager-storage'));
const groups = [...new Set(data.state.connections.map(c => c.group))];
console.log('Groups:', groups);
```

### Force reload:
```javascript
window.location.reload();
```

---

## 🎯 Expected Results

After the script runs successfully, you should see:

### In the Console:
```
✅ Created tunnel: "CAT Legacy Env Tunnel"
✅ SUCCESS!
📊 Added to the "CAT1 Connection" group:
   🔒 1 tunnel: "CAT Legacy Env Tunnel"
   🖥️  16 main connections (via tunnel)
   🔗 5 "direct" connections (no tunnel)
   📦 Total: 21 connections + 1 tunnel
🔄 Reloading the page now...
```

### In the UI (after reload):

**Connections Tab:**
```
📁 CAT1 Connection (21)
  ├── Aurora Ops Automation GUI
  ├── Aurora DB1
  ├── ptlc1s1ardb21 direct
  └── ... (18 more)
```

**Tunnels Tab:**
```
📁 CAT1 Connection (1)
  └── CAT Legacy Env Tunnel
```

---

## ⚠️ Common Mistakes

### 1. Not waiting for reload
The script now auto-reloads after 1 second. Wait for it!

### 2. Running in wrong browser tab
Make sure you're in the app tab (localhost:5173), not a different site.

### 3. App not running
Make sure `npm run dev` is running and the app is accessible.

### 4. Browser cache issues
Try a hard refresh (Ctrl+Shift+R) or incognito mode.

### 5. LocalStorage disabled
Check if your browser allows localStorage:
```javascript
typeof(Storage) !== "undefined"
```

---

## 📝 Helper Scripts

I've created three helper scripts in the `scripts/` folder:

1. **`populate-cat1-data.js`** - Main script (auto-reloads now)
2. **`force-reload-store.js`** - Force Zustand to reload
3. **`check-storage.js`** - Diagnostic tool to check what's stored

---

## 🆘 Still Not Working?

### Step-by-step debug:

1. **Verify app is running:**
   - Go to http://localhost:5173
   - You should see the SSH Connection Manager

2. **Open DevTools:**
   - Press F12
   - Go to Console tab

3. **Check for errors:**
   - Look for red error messages
   - If you see errors, share them

4. **Run diagnostic script:**
   ```javascript
   // Paste scripts/check-storage.js here
   ```

5. **Check Application tab:**
   - In DevTools, go to "Application" tab
   - Click "Local Storage" → http://localhost:5173
   - Look for `ssh-connection-manager-storage`
   - Expand it and see if it has data

6. **Manual reload:**
   - Press F5
   - Hard refresh: Ctrl+Shift+R

7. **Last resort - Start fresh:**
   ```javascript
   // Clear everything
   localStorage.clear();
   
   // Refresh
   location.reload();
   
   // Then run populate script again
   ```

---

## 💡 Pro Tip

After running the script, you can verify it worked by checking the Application tab in DevTools:
1. F12 → Application tab
2. Local Storage → http://localhost:5173
3. Click `ssh-connection-manager-storage`
4. You should see a large JSON object with connections and tunnels

If you see the data there but not in the UI, just press F5!

---

## 📞 Need More Help?

If none of these solutions work:
1. Run `scripts/check-storage.js` and share the output
2. Check the browser console for any errors
3. Verify the app is running on http://localhost:5173
4. Try in a different browser or incognito mode
