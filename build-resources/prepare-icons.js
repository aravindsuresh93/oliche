const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Creating application icons directory...');

// Create directories if they don't exist
const iconDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Check if we have ImageMagick installed
try {
  console.log('Checking for ImageMagick...');
  execSync('convert --version', { stdio: 'ignore' });
  console.log('ImageMagick is installed, proceeding with icon generation.');
  
  // Convert our icon.png to various formats and sizes
  const iconPath = path.join(__dirname, '..', 'icon.png');
  
  if (fs.existsSync(iconPath)) {
    console.log('Generating icons from', iconPath);
    
    // For macOS (.icns)
    console.log('- Creating macOS icon (.icns)');
    const icnsDir = path.join(iconDir, 'icons.iconset');
    if (!fs.existsSync(icnsDir)) {
      fs.mkdirSync(icnsDir, { recursive: true });
    }
    
    // Generate different sizes for macOS
    const macSizes = [16, 32, 64, 128, 256, 512, 1024];
    macSizes.forEach(size => {
      const halfSize = size / 2;
      execSync(`convert ${iconPath} -resize ${size}x${size} ${path.join(icnsDir, `icon_${size}x${size}.png`)}`);
      execSync(`convert ${iconPath} -resize ${size}x${size} ${path.join(icnsDir, `icon_${halfSize}x${halfSize}@2x.png`)}`);
    });
    
    // Use IconUtil on macOS or store command for later
    if (process.platform === 'darwin') {
      console.log('- Converting iconset to .icns (macOS only)');
      execSync(`iconutil -c icns -o ${path.join(iconDir, 'icon.icns')} ${icnsDir}`);
    } else {
      console.log('- Not on macOS, skipping .icns conversion');
      console.log('- On macOS, run: iconutil -c icns -o build/icon.icns build/icons.iconset');
    }
    
    // For Windows (.ico)
    console.log('- Creating Windows icon (.ico)');
    const winSizes = [16, 24, 32, 48, 64, 128, 256];
    const winIconPath = path.join(iconDir, 'icon.ico');
    
    execSync(`convert ${iconPath} -define icon:auto-resize=16,24,32,48,64,128,256 ${winIconPath}`);
    
    console.log('Icon generation complete!');
  } else {
    console.error('Error: icon.png not found in root directory');
  }
} catch (error) {
  console.error('Error: ImageMagick is not installed or there was a problem generating icons.');
  console.error('Please install ImageMagick to generate the icons, or manually create:');
  console.error('- build/icon.icns (for macOS)');
  console.error('- build/icon.ico (for Windows)');
  console.error('- PNG files at different resolutions');
  console.error('\nError details:', error.message);
}

console.log('\nIf you have any issues with icon generation, you can manually create/place the icons in the build directory.');
console.log('For more information, see electron-builder documentation on icons: https://www.electron.build/icons'); 