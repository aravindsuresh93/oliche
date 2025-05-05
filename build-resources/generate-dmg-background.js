const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Creating DMG background image...');

// Check if we have tools to generate the background
try {
  console.log('Looking for available tools...');
  
  const htmlFile = path.join(__dirname, 'create-dmg-background.html');
  const outputPng = path.join(__dirname, 'background.png');
  
  // Try to find a way to render the HTML to an image
  let toolFound = false;
  
  // Try wkhtmltoimage first
  try {
    execSync('which wkhtmltoimage', { stdio: 'ignore' });
    console.log('- Found wkhtmltoimage, using it to generate background');
    execSync(`wkhtmltoimage --width 600 --height 400 ${htmlFile} ${outputPng}`);
    toolFound = true;
  } catch (err) {
    console.log('- wkhtmltoimage not found, trying other methods');
  }
  
  // Try Chrome headless if wkhtmltoimage is not available
  if (!toolFound) {
    try {
      // Different commands for different platforms
      if (process.platform === 'darwin') {
        execSync('which google-chrome || which chromium || which chrome', { stdio: 'ignore' });
        console.log('- Found Chrome/Chromium, using it to generate background');
        execSync(`google-chrome --headless --screenshot=${outputPng} --window-size=600,400 --default-background-color=0 file://${htmlFile}`);
        toolFound = true;
      } else if (process.platform === 'win32') {
        // On Windows, check for Chrome in standard locations
        const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
        if (fs.existsSync(chromePath)) {
          console.log('- Found Chrome, using it to generate background');
          execSync(`"${chromePath}" --headless --screenshot=${outputPng} --window-size=600,400 --default-background-color=0 file://${htmlFile}`);
          toolFound = true;
        }
      } else if (process.platform === 'linux') {
        execSync('which google-chrome || which chromium-browser', { stdio: 'ignore' });
        console.log('- Found Chrome/Chromium, using it to generate background');
        execSync(`google-chrome --headless --screenshot=${outputPng} --window-size=600,400 --default-background-color=0 file://${htmlFile}`);
        toolFound = true;
      }
    } catch (err) {
      console.log('- Chrome/Chromium not found or failed to use');
    }
  }
  
  if (toolFound) {
    console.log('Successfully generated DMG background at', outputPng);
  } else {
    console.log('Could not find a suitable tool to generate the DMG background.');
    console.log('Please manually create a DMG background image and save it as:');
    console.log(outputPng);
    
    // Create a basic fallback image with color
    console.log('Creating a simple fallback background...');
    const simpleHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; width: 600px; height: 400px; background-color: #f5f5f7; }
        .title { font-family: sans-serif; font-size: 40px; text-align: center; padding-top: 150px; color: #333; }
      </style>
    </head>
    <body>
      <div class="title">Oliche</div>
    </body>
    </html>`;
    
    const simpleHtmlPath = path.join(__dirname, 'simple-background.html');
    fs.writeFileSync(simpleHtmlPath, simpleHtml);
    console.log('Created a simple HTML file at', simpleHtmlPath);
    console.log('Please convert this to an image manually if possible.');
  }
} catch (error) {
  console.error('Error generating DMG background:', error.message);
}

console.log('DMG background generation process complete.'); 