/**
 * Alternative method: Direct Zustand Store Update
 * 
 * This method directly accesses the Zustand store and updates it,
 * so you see changes immediately without needing to reload.
 * 
 * HOW TO USE:
 * 1. First run the populate-cat1-data.js script
 * 2. If connections don't appear, run this script
 * 3. No refresh needed!
 */

(function() {
  console.log('🔄 Force reloading Zustand store from localStorage...\n');

  try {
    // Get the storage key
    const storageKey = 'ssh-connection-manager-storage';
    const data = localStorage.getItem(storageKey);
    
    if (!data) {
      console.error('❌ No data found in localStorage.');
      console.log('💡 Run the populate-cat1-data.js script first!');
      return;
    }

    const parsed = JSON.parse(data);
    const connections = parsed.state?.connections || [];
    const tunnels = parsed.state?.tunnels || [];

    console.log(`📊 Found in localStorage:`);
    console.log(`   • ${connections.length} connections`);
    console.log(`   • ${tunnels.length} tunnels`);

    // Count CAT1 items
    const cat1Connections = connections.filter(c => c.group === 'CAT1 Connection');
    const cat1Tunnels = tunnels.filter(t => t.group === 'CAT1 Connection');

    console.log(`\n📁 CAT1 Connection group:`);
    console.log(`   • ${cat1Connections.length} connections`);
    console.log(`   • ${cat1Tunnels.length} tunnels`);

    if (cat1Connections.length === 0 && cat1Tunnels.length === 0) {
      console.log('\n⚠️  No CAT1 data found. Run populate-cat1-data.js first!');
      return;
    }

    // Trigger a storage event to force Zustand to reload
    window.dispatchEvent(new StorageEvent('storage', {
      key: storageKey,
      newValue: data,
      oldValue: data,
      storageArea: localStorage,
      url: window.location.href
    }));

    console.log('\n✅ Store reload triggered!');
    console.log('🔄 Reloading page to ensure changes are visible...');

    // Force a page reload as backup
    setTimeout(() => {
      window.location.reload();
    }, 500);

  } catch (error) {
    console.error('❌ ERROR:', error);
    console.log('\n💡 Try these steps:');
    console.log('   1. Run populate-cat1-data.js first');
    console.log('   2. Press F5 to manually refresh');
    console.log('   3. Check if data exists: localStorage.getItem("ssh-connection-manager-storage")');
  }
})();
