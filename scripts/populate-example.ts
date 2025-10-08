/**
 * EXAMPLE: Script to populate connection data
 * 
 * This is a TEMPLATE file with FAKE data for demonstration purposes.
 * To use this for real connections:
 * 
 * 1. Copy this file to: populate-your-data.ts (it will be git-ignored)
 * 2. Replace the EXAMPLE_CONNECTIONS with your real server data
 * 3. Update usernames and other details as needed
 * 4. Run in browser console after opening the app
 * 
 * ⚠️ SECURITY WARNING:
 * - DO NOT commit files with real server data to git
 * - All populate-*.ts files are automatically ignored by .gitignore
 * - Keep your connection data files LOCAL ONLY
 */

// Example connection data (FAKE - for demonstration only)
const EXAMPLE_CONNECTIONS = [
  {
    hostname: "server1.example.com",
    hostIp: "192.0.2.10", // TEST-NET-1 (documentation/example IP range)
    natedIp: null,
    description: "Example Web Server 1"
  },
  {
    hostname: "server2.example.com",
    hostIp: "192.0.2.11",
    natedIp: "203.0.113.10", // TEST-NET-3 (documentation/example IP range)
    description: "Example Web Server 2"
  },
  {
    hostname: "db1.example.com",
    hostIp: "192.0.2.20",
    natedIp: null,
    description: "Example Database Server"
  },
  {
    hostname: "lb1.example.com",
    hostIp: "192.0.2.30",
    natedIp: null,
    description: "Example Load Balancer"
  }
];

const colors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateConnections() {
  const connections: any[] = [];
  const now = new Date().toISOString();

  EXAMPLE_CONNECTIONS.forEach((config) => {
    // Main connection (using hostIp)
    connections.push({
      id: crypto.randomUUID(),
      name: config.description,
      host: config.hostIp,
      port: 22,
      username: "admin", // Change to your actual username
      authMethod: "password" as const,
      password: "", // Add password manually or use SSH keys
      groupId: "", // Assign to a group ID if needed
      color: getRandomColor(),
      createdAt: now
    });

    // If there's a NATed IP, create a "direct" connection
    if (config.natedIp) {
      connections.push({
        id: crypto.randomUUID(),
        name: `${config.hostname} (direct)`,
        host: config.natedIp,
        port: 22,
        username: "admin", // Change to your actual username
        authMethod: "password" as const,
        password: "", // Add password manually or use SSH keys
        groupId: "", // Assign to a group ID if needed
        color: getRandomColor(),
        createdAt: now
      });
    }
  });

  return connections;
}

// Function to add connections to localStorage
export function populateExampleData() {
  try {
    // Get existing data from localStorage
    const storageKey = 'ssh-connection-manager-storage';
    const existingData = localStorage.getItem(storageKey);
    const parsedData = existingData 
      ? JSON.parse(existingData) 
      : { state: { connections: [], tunnels: [], accounts: [], groups: [], sessions: [], activeSessionId: null }, version: 0 };

    // Generate new connections
    const newConnections = generateConnections();

    // Merge with existing connections
    parsedData.state.connections = [
      ...parsedData.state.connections,
      ...newConnections
    ];

    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(parsedData));

    console.log(`✅ Successfully added ${newConnections.length} example connections!`);
    console.log('🔄 Refresh the page to see the changes.');
    console.log('⚠️ Remember: This uses FAKE data. Replace with your real servers.');
    
    return newConnections;
  } catch (error) {
    console.error('❌ Error populating data:', error);
    throw error;
  }
}

// Browser console instructions
console.log(`
╔════════════════════════════════════════════════════════════╗
║  Connection Data Population Script (EXAMPLE)              ║
╚════════════════════════════════════════════════════════════╝

⚠️ THIS IS AN EXAMPLE WITH FAKE DATA ⚠️

To use with your real connection data:

1. Copy this file to a new name (e.g., populate-myservers.ts)
2. Replace EXAMPLE_CONNECTIONS with your real servers
3. Update usernames and authentication details
4. Open the application in your browser
5. Open Developer Tools (F12) → Console tab
6. Paste the script and press Enter
7. Run: populateExampleData()
8. Refresh the page

SECURITY NOTES:
- Files named populate-*.ts are automatically git-ignored
- Keep your real connection data LOCAL ONLY
- Never commit real server information to git

This example will add ${EXAMPLE_CONNECTIONS.length} connections.
`);

// Alternative: Export as module for TypeScript projects
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { populateExampleData, EXAMPLE_CONNECTIONS };
}
