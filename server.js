// 🚀 Hostinger Entry Point
// This file allows Hostinger to start the app directly from the root if needed.

// Ensure we are using the built server
try {
    console.log('Starting Diafat Khulud Server...');
    require('./server/dist/index.js');
} catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
}
