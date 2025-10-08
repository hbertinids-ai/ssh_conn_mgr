# UI/UX Improvements - Change Log

## Latest Changes - UI Cleanup & Form Enhancements (2025-10-07)

### UI Cleanup
- **Removed Import/Export button from top bar** - Simplified the header by removing the Import/Export button
- Import/Export functionality remains fully accessible via the buttons in each entity's left sidebar
- Cleaner, less cluttered interface with focus on core navigation

---

## Form Enhancements (2025-10-07)

### Enhanced Form Features

#### Account Dropdown Improvements
1. **Connection Form**: Account dropdown now displays group name alongside account name
   - Format: `[Group] / Account Name (username)`
   - Example: `Production / Web Server Admin (admin)`
   
2. **Tunnel Form**: Added account dropdown with same group/name display format
   - Allows credential reuse across tunnels
   - Auto-populates username, password, and private key fields
   - Disables credential fields when account is selected

#### Group Dropdown Enhancements (All Forms)
3. **Connection Form**: Group dropdown now shows all existing groups from:
   - All connections
   - All tunnels
   - All accounts
   - Still allows typing new group names (datalist functionality)

4. **Tunnel Form**: Added comprehensive group dropdown
   - Shows groups from connections, tunnels, and accounts
   - Allows typing new group names
   - Same functionality as connection form

5. **Account Form**: Added comprehensive group dropdown
   - Shows groups from connections, tunnels, and accounts
   - Allows typing new group names
   - Consistent with other forms

6. **Import Integration**: Groups from imported connections, tunnels, and accounts are automatically included in respective dropdowns

#### Technical Changes
- Added `accountId?: string` field to `SSHTunnel` interface
- Updated `ConnectionForm.tsx` to display grouped account names
- Updated `TunnelForm.tsx` to include account dropdown and unified group dropdown
- Updated `AccountForm.tsx` to include unified group dropdown
- Enhanced group collection to aggregate from all entity types (connections, tunnels, accounts)
- All forms now use datalist for group suggestions while allowing custom input

#### Benefits
- **Reduced Errors**: Reusing accounts reduces typos in credentials
- **Faster Setup**: Group suggestions speed up entity organization
- **Better Management**: Cross-entity group visibility improves organization
- **Consistent UX**: Same patterns across connections and tunnels
- **Import Friendly**: Imported groups immediately available in dropdowns

---

## Previous Changes Implemented

### 1. ✅ Removed Settings Button
- Removed the "Settings" button from the header
- Simplified the UI to focus on Connections and Tunnels only
- Updated the view state type to only include 'connections' and 'tunnels'

### 2. ✅ Toggle Sidebar with Top-Left Icon
- Converted the top-left icon from static to an interactive button
- **Click the icon** to show/hide the left sidebar
- Visual feedback with icon change:
  - `PanelLeftClose` icon when sidebar is visible
  - `PanelLeft` icon when sidebar is hidden
- Smooth transition with hover effects
- Added helpful tooltip on hover

### 3. ✅ Multiple Tabs for Same Connection - **FIXED!**
- **Issue identified and resolved!** The previous implementation was disposing terminals on tab switch
- **Root cause:** Each render was creating/disposing the terminal for the active session only
- **Solution:** Completely rewrote the Terminal component to:
  - Maintain separate terminal instances for ALL active sessions
  - Only show/hide terminals instead of creating/destroying them
  - Use a Map to track terminal instances by session ID
  - Properly manage SSH connections for each session independently
- **How to use:**
  1. Click the Play button (▶️) on any connection
  2. A new tab opens
  3. Click the Play button again on the same connection
  4. Another independent tab opens for that connection
  5. Both tabs remain active - switch between them freely!
  6. Each tab maintains its own terminal state and SSH connection

## Technical Details

### Files Modified
- `src/App.tsx` - Main application component
  - Added `sidebarVisible` state
  - Removed Settings button and view
  - Made sidebar conditionally render based on state
  - Connected toggle button to sidebar visibility

### Benefits
1. **Cleaner UI** - Less clutter without the unused Settings button
2. **More screen space** - Toggle sidebar when you need more terminal space
3. **Multiple sessions** - Open multiple tabs to the same server (e.g., different directories)
4. **Better UX** - Clear visual feedback for sidebar state

## How to Use

### Toggle Sidebar
- Click the colorful icon in the top-left corner
- Icon changes to indicate current state
- Sidebar slides in/out smoothly

### Open Multiple Tabs to Same Connection
1. Go to Connections view
2. Click Play (▶️) on a connection → Tab 1 opens
3. Click Play (▶️) on the same connection again → Tab 2 opens
4. Repeat as needed!
5. Each tab is independent with its own terminal session

### Example Use Cases for Multiple Tabs
- Monitor logs in one tab, edit files in another
- Run a long process in one tab, work in another
- Multiple directories on the same server
- Separate sessions for different tasks

## Bug Fixes

### Multiple Tabs Issue
- **Problem:** Opening multiple tabs caused the first tab to close
- **Console Error:** `Cannot read properties of undefined (reading 'dimensions')`
- **Root Cause:** Terminal instances were being disposed on every tab switch
- **Solution:** Rewrote Terminal component with proper multi-instance management

## Testing
✅ Build successful
✅ All components updated
✅ TypeScript errors resolved
✅ Multiple terminal instances working correctly
✅ No more dimension errors
✅ Ready to use with `npm run dev`
