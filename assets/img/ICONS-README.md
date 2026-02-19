# DVMReady Brand Icons

## Icon Files

### Source Files (SVG)
- `dvmready-icon.svg` - Main brand icon for PWA (512x512 base)
- `dvmready-favicon.svg` - Simplified icon for browser favicon

### Generated PNG Files (Run `node scripts/generate-icons.js`)
- `icon-72x72.png` - Android launcher small
- `icon-96x96.png` - Android launcher
- `icon-128x128.png` - Chrome Web Store
- `icon-144x144.png` - Windows tile
- `icon-152x152.png` - iPad touch
- `icon-192x192.png` - Android launcher large
- `icon-384x384.png` - PWA splash screen
- `icon-512x512.png` - PWA main icon
- `favicon-16x16.png` - Browser tab
- `favicon-32x32.png` - Browser tab retina
- `favicon-48x48.png` - Windows taskbar
- `apple-touch-icon.png` - iOS home screen (180x180)

## Design Elements

### Colors
- Primary: `#0c607d` (Teal blue)
- Secondary: `#14a3c7` (Light cyan)
- Background: `#0f1b2d` (Dark navy)
- Accent: `#ffffff` (White)

### Icon Concept
The icon combines:
1. **Paw print** - Veterinary/pet care
2. **Medical cross** - Healthcare/emergency
3. **Calculator lines** - Clinical tools/calculations
4. **Rounded square** - Modern app icon shape

## Generating Icons

```bash
# Install dependencies
npm install sharp --save-dev

# Generate all PNG icons from SVG
node scripts/generate-icons.js
```

## Usage in HTML

```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/assets/img/dvmready-favicon.svg">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">

<!-- Manifest (for PWA) -->
<link rel="manifest" href="/manifest.json">
```

## Updating Icons

1. Edit the SVG source files
2. Run `node scripts/generate-icons.js`
3. Commit all generated PNG files
4. Update version reference if needed
