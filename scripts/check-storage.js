/**
 * Diagnostic Script - Check Storage Contents
 * 
 * Run this in the browser console to see what's stored
 */

(function() {
  console.log('🔍 Checking SSH Connection Manager Storage...\n');

  const storageKey = 'ssh-connection-manager-storage';
  const data = localStorage.getItem(storageKey);

  if (!data) {
    console.error('❌ No data found in localStorage!');
    console.log('\n💡 The storage key "' + storageKey + '" is empty.');
    console.log('   This means either:');
    console.log('   1. You haven\'t run the populate script yet');
    console.log('   2. The app uses a different storage key');
    console.log('   3. LocalStorage was cleared');
    return;
  }

  try {
    const parsed = JSON.parse(data);
    
    console.log('✅ Data found!\n');
    console.log('📦 Storage Structure:');
    console.log(JSON.stringify(parsed, null, 2));
    
    const state = parsed.state || {};
    const connections = state.connections || [];
    const tunnels = state.tunnels || [];
    const sessions = state.sessions || [];

    console.log('\n📊 Summary:');
    console.log(`   Total Connections: ${connections.length}`);
    console.log(`   Total Tunnels: ${tunnels.length}`);
    console.log(`   Active Sessions: ${sessions.length}`);

    // Group by group field
    const connectionGroups = {};
    connections.forEach(conn => {
      const group = conn.group || 'Ungrouped';
      connectionGroups[group] = (connectionGroups[group] || 0) + 1;
    });

    const tunnelGroups = {};
    tunnels.forEach(tunnel => {
      const group = tunnel.group || 'Ungrouped';
      tunnelGroups[group] = (tunnelGroups[group] || 0) + 1;
    });

    console.log('\n📁 Connection Groups:');
    Object.entries(connectionGroups).forEach(([group, count]) => {
      console.log(`   ${group}: ${count} connections`);
    });

    console.log('\n🔒 Tunnel Groups:');
    Object.entries(tunnelGroups).forEach(([group, count]) => {
      console.log(`   ${group}: ${count} tunnels`);
    });

    // Show CAT1 details
    const cat1Connections = connections.filter(c => c.group === 'CAT1 Connection');
    const cat1Tunnels = tunnels.filter(t => t.group === 'CAT1 Connection');

    if (cat1Connections.length > 0 || cat1Tunnels.length > 0) {
      console.log('\n🎯 CAT1 Connection Details:');
      
      if (cat1Tunnels.length > 0) {
        console.log('\n   Tunnels:');
        cat1Tunnels.forEach(t => {
          console.log(`   • ${t.name} (${t.host}:${t.port})`);
        });
      }

      if (cat1Connections.length > 0) {
        console.log('\n   Connections:');
        cat1Connections.slice(0, 10).forEach(c => {
          const tunnelInfo = c.tunnelId ? ' [via tunnel]' : ' [direct]';
          console.log(`   • ${c.name} (${c.host}:${c.port})${tunnelInfo}`);
        });
        if (cat1Connections.length > 10) {
          console.log(`   ... and ${cat1Connections.length - 10} more`);
        }
      }
    }

    console.log('\n✅ Storage check complete!');
    console.log('\n💡 If connections aren\'t showing in the UI:');
    console.log('   1. Press F5 to refresh the page');
    console.log('   2. Or run: window.location.reload()');

  } catch (error) {
    console.error('❌ Error parsing storage data:', error);
    console.log('\nRaw data:', data);
  }
})();
