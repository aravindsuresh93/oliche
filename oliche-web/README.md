# Oliche Website

A minimal landing page for the Oliche password manager.

## Quick Start

The website is a simple static site built with HTML and CSS. No build steps or JavaScript dependencies are required.

### Local Development

To preview the site locally, you can use any local server. For example:

```bash
# Using Python's built-in HTTP server
python -m http.server

# Or with Node.js and npx
npx serve
```

Then open your browser to `http://localhost:8000` or the port shown in your terminal.

## Deployment to Vercel

### Option 1: Deploying with Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the website directory:
   ```bash
   cd oliche-web
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```

4. Follow the prompts to complete the deployment.

### Option 2: Deploying via GitHub Integration

1. Push this directory to a GitHub repository:
   ```bash
   # Initialize a git repository if needed
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/oliche-web.git
   git push -u origin main
   ```

2. Log in to [Vercel](https://vercel.com/)

3. Click "New Project" and import your GitHub repository

4. Configure the project:
   - Set the framework preset to "Other"
   - Root directory should be set to the folder containing the website files
   - Build and output settings can be left at default

5. Click "Deploy"

## Customization

### Download Links

Update the download links in `index.html` to point to your actual release files:

```html
<a href="YOUR_ACTUAL_DMG_LINK" class="download-button">
  <span class="platform-icon">Mac</span>
  <span class="download-text">Download .dmg</span>
  <span class="version">v1.0.0</span>
</a>
```

### GitHub Repository

Update the GitHub repository link in `index.html`:

```html
<a href="https://github.com/YOUR_USERNAME/oliche" class="button secondary" target="_blank">View on GitHub</a>
```

## Structure

- `index.html` - Main HTML file
- `styles.css` - CSS styles
- `icon.png` - Application icon (used for favicon)
- `vercel.json` - Vercel deployment configuration 