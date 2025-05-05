# Oliche Password Manager

A secure desktop application for storing and managing passwords locally.

## Features

- Store website credentials securely
- Search and filter saved passwords
- Copy passwords to clipboard with a single click
- Drag and rearrange your passwords in edit mode
- Simple and intuitive user interface

## Security

Oliche stores passwords locally on your computer using encrypted storage. Your data never leaves your device.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation for Development

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Start the application in development mode:

```bash
npm start
```

### Development

To run the application in development mode with auto-restart:

```bash
npm run dev
```

## Building for Distribution

### Prerequisites for Building

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later)
- [ImageMagick](https://imagemagick.org/script/download.php) (optional, for icon generation)

### Building Distributables

#### Install Dependencies

First, install all required dependencies:

```bash
npm install
```

#### Generate Icons (Optional)

If you have ImageMagick installed, you can generate platform-specific icons:

```bash
node build-resources/prepare-icons.js
```

#### Build for All Platforms

Build for all platforms (if supported by your OS):

```bash
npm run dist
```

#### Platform-Specific Builds

Build specifically for macOS:

```bash
npm run dist:mac
```

Build specifically for Windows:

```bash
npm run dist:win
```

Build specifically for Linux:

```bash
npm run dist:linux
```

### Output Files

The packaged applications will be available in the `dist` folder:

- macOS: `dist/Oliche-1.0.0.dmg` and `dist/mac`
- Windows: `dist/Oliche Setup 1.0.0.exe` and `dist/win-unpacked`
- Linux: `dist/oliche_1.0.0_amd64.deb`, `dist/Oliche-1.0.0.AppImage`, and `dist/linux-unpacked`

## Publishing Your App

### App Stores

- **macOS App Store**: Requires an Apple Developer account ($99/year)
  - Follow [Apple's guidelines](https://developer.apple.com/app-store/submissions/) for app submission
  - You'll need to configure code signing in your electron-builder setup

- **Microsoft Store**: Requires a Microsoft Developer account ($19 one-time fee)
  - Follow [Microsoft's guidelines](https://docs.microsoft.com/en-us/windows/uwp/publish/) for app submission
  - Additional packaging as MSIX may be required

### Self-Publishing

You can distribute your builds directly from your own website:

1. Create installable packages using `npm run dist`
2. Host the files on your website
3. Consider using auto-update functionality by setting up a proper update server

For auto-updates, check the [electron-builder documentation](https://www.electron.build/auto-update).

## Important Security Note

In a production environment, you should replace the hardcoded encryption key in `main.js` with a secure key management solution.

## License

MIT 