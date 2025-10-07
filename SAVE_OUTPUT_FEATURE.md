# 💾 Save Session Output Feature

## Overview
The SSH Connection Manager now includes the ability to save terminal session output to a text file. This is useful for:
- Keeping logs of SSH sessions
- Documenting troubleshooting steps
- Saving command outputs for later reference
- Creating audit trails

## How to Use

### Quick Start
1. **Open an SSH session** by clicking the play button (▶️) on any connection
2. **Interact with the terminal** - run commands, see output
3. **Click the download icon** (💾) in the tab header
4. **File is automatically downloaded** to your Downloads folder

### Features

#### Automatic Filename
Files are automatically named using this pattern:
```
{connection-name}_{YYYY-MM-DD}_{HH-MM-SS}.txt
```

**Examples:**
- `Aurora_DB1_2025-10-07_14-30-45.txt`
- `ARTE_1_2025-10-07_09-15-22.txt`
- `ptlc1s1ardb21_direct_2025-10-07_16-42-18.txt`

#### What Gets Saved
- All visible terminal output (current buffer)
- Commands you typed
- Server responses
- Error messages
- Status messages

#### What Doesn't Get Saved
- Terminal color codes are converted to plain text
- Hidden/scrolled-off content beyond the buffer limit

## UI Elements

### Tab Interface
Each SSH session tab now has two buttons:

```
┌─────────────────────────────────┐
│ 🔵 Aurora DB1     💾  ✕        │
│                   ↑   ↑         │
│              Save  Close        │
└─────────────────────────────────┘
```

- **💾 Download Icon**: Click to save the current session output
- **✕ Close Icon**: Close the session (unchanged)

### Visual Indicators
- **Green dot** (🟢): Session is connected - you can save output
- **Yellow dot** (🟡): Session is connecting - no output yet
- **Red dot** (🔴): Connection error - may have partial output

## Technical Details

### File Format
- **Format**: Plain text (.txt)
- **Encoding**: UTF-8
- **Line Endings**: Unix-style (LF)
- **Size**: Depends on terminal buffer size

### Terminal Buffer
The xterm.js terminal maintains a buffer of visible content. The default buffer size captures:
- Approximately 1000-1500 lines of history
- Current visible content
- Recent scrollback

### Browser Download
Files are downloaded using the browser's native download mechanism:
- No server roundtrip required
- Instant download
- Saves to default Downloads folder
- Can be configured in browser settings

## Use Cases

### 1. Troubleshooting Documentation
```
Steps:
1. Connect to server
2. Run diagnostic commands
3. Save output (💾)
4. Share file with team
```

### 2. Command History
```
- Save successful command sequences
- Reference later for automation
- Document procedures
```

### 3. Audit Trail
```
- Keep records of administrative tasks
- Document configuration changes
- Compliance requirements
```

### 4. Error Logging
```
- Capture error messages
- Save for bug reports
- Reference for troubleshooting
```

## Keyboard Shortcuts

Currently, the save feature is only available via the download button. Future versions may include:
- `Ctrl+S` - Save current session
- `Ctrl+Shift+S` - Save all sessions
- Right-click context menu

## Tips & Best Practices

### 1. Save Regularly
For long sessions, save output periodically to avoid losing data if the session crashes.

### 2. Clear Terminal Before Important Commands
```bash
clear  # Clear screen before running important commands
# Makes saved output easier to read
```

### 3. Add Markers
```bash
echo "=== Starting Database Backup ==="
# Your commands here
echo "=== Backup Complete ==="
```

### 4. File Organization
Create folders in your Downloads for different purposes:
```
Downloads/
├── ssh-logs/
│   ├── production/
│   ├── development/
│   └── troubleshooting/
```

### 5. Review Before Important Actions
Save output before running potentially destructive commands, so you have a record if something goes wrong.

## Limitations

### Buffer Size
Only the current terminal buffer is saved. Very long sessions may have early content scrolled out of the buffer.

**Workaround**: Save output periodically during long sessions.

### No Automatic Saving
Sessions are not automatically saved. You must manually click the download button.

**Future Feature**: Auto-save option may be added.

### Single Session
The download button saves only the current tab's output.

**Future Feature**: "Save All Sessions" option may be added.

## Troubleshooting

### "Nothing downloads"
- Check if your browser is blocking downloads
- Check browser's download settings
- Look for download prompt in browser bar

### "File is empty"
- Session may not have produced any output yet
- Try typing a command first (e.g., `ls`)
- Check if session is actually connected (green dot)

### "Downloaded file has weird characters"
- Some server outputs may include special characters
- Open with a text editor that supports UTF-8
- Try Notepad++, VS Code, or similar

### "Can't find downloaded file"
- Check your browser's Downloads folder
- Check browser download history (Ctrl+J in most browsers)
- Look for download notification

## Examples

### Example 1: Basic Session Save
```
1. Connect to "Aurora DB1"
2. Run: ls -la
3. Run: df -h
4. Click download icon (💾)
5. File saved: Aurora_DB1_2025-10-07_14-30-45.txt
```

### Example 2: Troubleshooting Session
```
1. Connect to "ARTE 1"
2. Run diagnostic commands:
   - systemctl status app
   - journalctl -xe
   - tail /var/log/app.log
3. Save output for team review
4. Share file via email/Slack
```

### Example 3: Multiple Connections
```
1. Open tabs for Aurora DB1, DB2, and DB3
2. Run "SELECT VERSION()" on each
3. Save each session separately
4. Compare versions across servers
```

## Future Enhancements

Planned features for future versions:

- **Auto-save**: Automatically save on disconnect
- **Save format options**: JSON, HTML, ANSI-colored text
- **Session recording**: Record entire session from start
- **Search in output**: Search saved files
- **Compression**: Save large outputs as .zip
- **Cloud storage**: Upload to Dropbox/Drive
- **Annotations**: Add notes to saved output

## Implementation Details

### Code Location
- **Terminal.tsx**: `saveOutput()` function
- **Tabs.tsx**: Download button UI
- **Buffer reading**: Uses xterm.js buffer API

### Data Flow
```
Terminal Buffer
    ↓
Read all lines
    ↓
Convert to string
    ↓
Create Blob
    ↓
Generate download URL
    ↓
Trigger browser download
    ↓
Cleanup URL
```

## Summary

The save session output feature provides a simple, effective way to capture and preserve SSH session content. With one click, you can download complete session logs for documentation, troubleshooting, or compliance purposes.

**Key Points:**
- ✅ One-click download via tab button
- ✅ Automatic filename with timestamp
- ✅ Plain text format (universal compatibility)
- ✅ No server-side processing required
- ✅ Instant download to Downloads folder

Start saving your SSH session outputs today! 💾
