const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Oliche Application Build Script');
console.log('==============================\n');

// Detect platform
const platform = process.platform;
console.log(`Detected platform: ${platform}`);

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  console.log('Creating build directory...');
  fs.mkdirSync(buildDir, { recursive: true });
}

try {
  // Install dependencies if node_modules doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('\nInstalling dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Prepare resources (icons and DMG background)
  console.log('\nPreparing build resources...');
  execSync('npm run prepare-all', { stdio: 'inherit' });

  // Build for the current platform
  console.log('\nBuilding application...');
  
  switch (platform) {
    case 'darwin': // macOS
      console.log('Building for macOS...');
      execSync('npx electron-builder --mac', { stdio: 'inherit' });
      break;
    case 'win32': // Windows
      console.log('Building for Windows...');
      execSync('npx electron-builder --win', { stdio: 'inherit' });
      break;
    case 'linux': // Linux
      console.log('Building for Linux...');
      execSync('npx electron-builder --linux', { stdio: 'inherit' });
      break;
    default:
      console.log(`Unknown platform: ${platform}`);
      console.log('Attempting to build for all platforms...');
      execSync('npx electron-builder', { stdio: 'inherit' });
  }

  console.log('\nBuild completed successfully! 🎉');
  console.log('\nDistributable files can be found in the dist/ directory.');
  
  // Show the contents of the dist directory
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    console.log('\nAvailable distributables:');
    const files = fs.readdirSync(distDir);
    files.forEach(file => {
      console.log(`- ${file}`);
    });
  }
  
} catch (error) {
  console.error('\nBuild failed:', error.message);
  process.exit(1);
} 