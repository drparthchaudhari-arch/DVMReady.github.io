#!/usr/bin/env node
/**
 * Generate PNG icons from SVG for PWA
 * Usage: node scripts/generate-icons.js
 * Requires: sharp (npm install sharp)
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
try {
  var sharp = require('sharp');
} catch (e) {
  console.log('Installing sharp...');
  require('child_process').execSync('npm install sharp --save-dev', { stdio: 'inherit' });
  sharp = require('sharp');
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../assets/img/dvmready-icon.svg');
const outputDir = path.join(__dirname, '../assets/img');

async function generateIcons() {
  console.log('Generating PWA icons from SVG...\n');
  
  const svgBuffer = fs.readFileSync(inputSvg);
  
  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputFile);
    
    console.log(`✓ Generated icon-${size}x${size}.png`);
  }
  
  // Generate favicon sizes
  const faviconSizes = [16, 32, 48];
  const faviconSvg = fs.readFileSync(path.join(__dirname, '../assets/img/dvmready-favicon.svg'));
  
  for (const size of faviconSizes) {
    const outputFile = path.join(outputDir, `favicon-${size}x${size}.png`);
    
    await sharp(faviconSvg)
      .resize(size, size)
      .png()
      .toFile(outputFile);
    
    console.log(`✓ Generated favicon-${size}x${size}.png`);
  }
  
  // Generate Apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(outputDir, 'apple-touch-icon.png'));
  console.log(`✓ Generated apple-touch-icon.png`);
  
  console.log('\n✅ All icons generated successfully!');
  console.log('\nNext steps:');
  console.log('1. Update manifest.json to reference the new PNG icons');
  console.log('2. Update HTML files to use the new favicon');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
