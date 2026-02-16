#!/usr/bin/env node
/**
 * PWA Icon Generator Script
 * Generates various icon sizes from the source logo for PWA manifest
 * 
 * Requires ImageMagick to be installed: sudo apt-get install imagemagick
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_LOGO = join(projectRoot, 'assets/img/dvmready-logo.png');
const OUTPUT_DIR = join(projectRoot, 'assets/img');

function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  if (!existsSync(SOURCE_LOGO)) {
    console.error(`❌ Source logo not found: ${SOURCE_LOGO}`);
    console.log('Using SVG fallback...');
    return generateIconsFromSVG();
  }

  for (const size of ICON_SIZES) {
    const outputFile = join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    try {
      // Generate icon with padding for maskable support
      const command = `convert "${SOURCE_LOGO}" -resize ${size}x${size}^ -gravity center -extent ${size}x${size} -background none "${outputFile}"`;
      execSync(command, { stdio: 'ignore' });
      console.log(`  ✅ ${size}x${size}`);
    } catch (error) {
      console.error(`  ❌ Failed to generate ${size}x${size}: ${error.message}`);
    }
  }

  // Generate shortcut icons
  const shortcutIcons = [
    { name: 'shortcut-dose', emoji: '💊' },
    { name: 'shortcut-fluid', emoji: '💧' },
    { name: 'shortcut-emergency', emoji: '⚡' },
    { name: 'shortcut-cri', emoji: '💉' },
  ];

  console.log('\n📱 Generating shortcut icons...\n');
  for (const { name, emoji } of shortcutIcons) {
    const outputFile = join(OUTPUT_DIR, `${name}.png`);
    try {
      // Create a simple colored background with emoji
      const command = `convert -size 96x96 xc:#0c607d -pointsize 48 -fill white -gravity center -annotate +0+0 "${emoji}" "${outputFile}"`;
      execSync(command, { stdio: 'ignore' });
      console.log(`  ✅ ${name}.png`);
    } catch (error) {
      console.error(`  ❌ Failed to generate ${name}: ${error.message}`);
    }
  }

  console.log('\n✨ PWA icon generation complete!');
  console.log(`📁 Icons saved to: ${OUTPUT_DIR}`);
}

function generateIconsFromSVG() {
  const sourceSVG = join(projectRoot, 'assets/img/dvmready-logo-pro.svg');
  
  if (!existsSync(sourceSVG)) {
    console.error('❌ No source image found for icon generation');
    console.log('Please ensure assets/img/dvmready-logo.png or dvmready-logo-pro.svg exists');
    process.exit(1);
  }

  for (const size of ICON_SIZES) {
    const outputFile = join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    try {
      const command = `convert -background none -size ${size}x${size} "${sourceSVG}" "${outputFile}"`;
      execSync(command, { stdio: 'ignore' });
      console.log(`  ✅ ${size}x${size} (from SVG)`);
    } catch (error) {
      console.error(`  ❌ Failed to generate ${size}x${size}: ${error.message}`);
    }
  }
}

// Check if ImageMagick is installed
try {
  execSync('which convert', { stdio: 'ignore' });
  generateIcons();
} catch (error) {
  console.log('⚠️  ImageMagick not found. Installing instructions:');
  console.log('   Ubuntu/Debian: sudo apt-get install imagemagick');
  console.log('   macOS: brew install imagemagick');
  console.log('\n📋 Manual icon generation checklist:');
  console.log('   Create the following icon files in assets/img/:');
  for (const size of ICON_SIZES) {
    console.log(`   - icon-${size}x${size}.png (${size}x${size}px)`);
  }
  process.exit(1);
}
