# Populating CAT1 Connection Data

This guide explains how to add the CAT1 connection configurations to your SSH Connection Manager.

## Quick Start

### Method 1: Browser Console (Recommended)

1. **Start the application:**
   ```powershell
   npm run dev
   ```

2. **Open the app in your browser** (it should open automatically at http://localhost:5173)

3. **Open Developer Tools:**
   - Press `F12`, or
   - Right-click → "Inspect", or
   - Press `Ctrl+Shift+I`

4. **Go to the Console tab** in Developer Tools

5. **Copy the entire contents** of `scripts/populate-cat1-data.js`

6. **Paste into the console** and press `Enter`

7. **Refresh the page** (`F5`)

8. **Check the sidebar** - you should see a new group called "CAT1 Connection" with all the connections!

## What Gets Added

The script will add **1 tunnel** and **22 connections** to the "CAT1 Connection" group:

### Tunnel (1)
- **CAT Legacy Env Tunnel** - SSH tunnel/jump host for main connections (⚠️ requires configuration)

### Main Connections (16)
Each uses the "host ip" column and connects through the tunnel:

- Aurora Ops Automation GUI (10.6.54.224)
- Aurora DB1 (10.6.53.91)
- Aurora DB2 (10.6.53.92)
- Aurora Navigator 1 (10.6.52.77)
- Aurora Navigator 2 (10.6.52.78)
- Aurora Navigator VIP (10.6.52.240)
- Aurora Navigator Proxy 1 (10.6.51.219)
- Aurora Navigator Proxy 2 (10.6.51.220)
- Aurora Navigator Proxy VIP (10.6.51.240)
- ARTE 1 (10.6.43.10)
- ARTE 2 (10.6.43.11)
- ARTE VIP (10.6.43.240)
- Identity Manager 1 (10.6.54.48)
- Identity Manager 2 (10.6.54.49)
- IGT Gateway (10.6.46.198)
- SYSLOG (10.6.54.196)

### Direct Connections (6)
For servers with NATed IPs, a second connection is created with " direct" suffix:

- ptlc1s1ardb21 direct (10.93.1.190)
- ptlc1s1ardb22 direct (10.93.1.191)
- ptlc1s1arte21 direct (10.93.1.192)
- ptlc1s1arte22 direct (10.93.1.193)
- ptlc1s1igtgw21 direct (10.93.1.200)

## Default Configuration

### Tunnel Configuration:
- **Name:** CAT Legacy Env Tunnel
- **Host:** (empty - ⚠️ YOU MUST SET THIS)
- **Port:** 22
- **Username:** root
- **Password:** (empty - you'll need to set this)
- **Group:** CAT1 Connection

### Connection Configuration:
All connections are created with:
- **Port:** 22 (SSH default)
- **Username:** root
- **Auth Method:** password
- **Password:** (empty - you'll need to set this)
- **Group:** CAT1 Connection
- **Tunnel:** Main connections use "CAT Legacy Env Tunnel", direct connections don't

## After Adding Connections

1. **⚠️ CONFIGURE THE TUNNEL FIRST**: Go to Tunnels tab, edit "CAT Legacy Env Tunnel", set host/username/password
2. **Set connection passwords**: Edit each connection and add the appropriate password
3. **Update usernames**: If you use a different username, edit the tunnel and connections
4. **Test connections**: Click the Play button (▶) on any connection to test

## Troubleshooting

### Script doesn't run
- Make sure you copied the **entire** script file
- Check that the app is running in the browser
- Look for error messages in the console

### Connections don't appear
- Did you refresh the page after running the script?
- Check the browser console for error messages
- Try closing and reopening the app

### Duplicate connections
The script will add connections every time you run it. To remove duplicates:
1. Go to the Connections tab
2. Expand the "CAT1 Connection" group
3. Delete unwanted duplicates using the trash icon

### Reset all data
To start fresh:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Run: `localStorage.clear()`
4. Refresh the page

## Source Data

The connections are based on this table:

| Host name | host ip | NATed ip | description |
|-----------|---------|----------|-------------|
| ptlc1s1araut21 | 10.6.54.224 | - | Aurora Ops Automation GUI |
| ptlc1s1ardb21 | 10.6.53.91 | 10.93.1.190 | Aurora DB1 |
| ptlc1s1ardb22 | 10.6.53.92 | 10.93.1.191 | Aurora DB2 |
| ptlc1s1arnapp21 | 10.6.52.77 | - | Aurora Navigator 1 |
| ptlc1s1arnapp22 | 10.6.52.78 | - | Aurora Navigator 2 |
| ptlc1s1arnappvip | 10.6.52.240 | - | Aurora Navigator VIP |
| ptlc1s1arnp21 | 10.6.51.219 | - | Aurora Navigator Proxy 1 |
| ptlc1s1arnp22 | 10.6.51.220 | - | Aurora Navigator Proxy 2 |
| ptlc1s1arnpvip | 10.6.51.240 | - | Aurora Navigator Proxy VIP |
| ptlc1s1arte21 | 10.6.43.10 | 10.93.1.192 | ARTE 1 |
| ptlc1s1arte22 | 10.6.43.11 | 10.93.1.193 | ARTE 2 |
| ptlc1s1artevip | 10.6.43.240 | - | ARTE VIP |
| ptlc1s1idm21 | 10.6.54.48 | - | Identity Manager 1 |
| ptlc1s1idm22 | 10.6.54.49 | - | Identity Manager 2 |
| ptlc1s1igtgw21 | 10.6.46.198 | 10.93.1.200 | IGT Gateway |
| ptlc1s1syslog21 | 10.6.54.196 | - | SYSLOG |

## Need Help?

- Check the browser console for error messages
- Make sure the app is running (`npm run dev`)
- Verify localStorage is enabled in your browser
- Try running the script again (it's safe to run multiple times, just creates duplicates)
