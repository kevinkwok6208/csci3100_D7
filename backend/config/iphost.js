const os = require('os');

/**
 * Gets the server's primary IPv4 address
 * @returns {string|null} The primary IPv4 address or null if not found
 */
function getIpv4Address() {
  const networkInterfaces = os.networkInterfaces();
  
  // Loop through all network interfaces
  for (const interfaceName of Object.keys(networkInterfaces)) {
    const interfaces = networkInterfaces[interfaceName];
    
    // Find the first non-internal IPv4 address
    for (const iface of interfaces) {
      // Check if it's IPv4 and not an internal/loopback interface
      if ((iface.family === 'IPv4' || iface.family === 4) && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  // Return null if no IPv4 address is found
  return null;
}

/**
 * Prints and returns the server's primary IPv4 address
 * @returns {string|null} The primary IPv4 address or null if not found
 */
function printIpAddress() {
  const ipv4Address = getIpv4Address();
  
  console.log('Server IPv4 Address:');
  console.log('-------------------');
  
  if (ipv4Address) {
    console.log(`IPv4: ${ipv4Address}`);
  } else {
    console.log('No IPv4 address found');
  }
  
  return ipv4Address;
}

// Execute the function immediately
const ipv4Address = printIpAddress();

// Export both the function and the IPv4 address
module.exports = { 
  printIpAddress,
  getIpv4Address,
  ipv4Address
};
