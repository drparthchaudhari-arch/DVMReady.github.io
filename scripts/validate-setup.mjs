#!/usr/bin/env node
/**
 * Setup Validation Script
 * Verifies that all enhancements are properly configured
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

let exitCode = 0;

function check(name, condition, message) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    return true;
  } else {
    console.log(`  ❌ ${name}`);
    if (message) console.log(`     ${message}`);
    exitCode = 1;
    return false;
  }
}

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║     DVMReady Setup Validation                          ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Security Headers
console.log('🔒 Security Headers');
console.log('-'.repeat(50));
const headersPath = join(projectRoot, '_headers');
if (existsSync(headersPath)) {
  const headers = readFileSync(headersPath, 'utf8');
  check('Headers file exists', true);
  check('HSTS header', headers.includes('Strict-Transport-Security'), 'Add HSTS for HTTPS enforcement');
  check('X-Frame-Options', headers.includes('X-Frame-Options'), 'Add X-Frame-Options to prevent clickjacking');
  check('X-XSS-Protection', headers.includes('X-XSS-Protection'), 'Add XSS protection header');
  check('Permissions-Policy', headers.includes('Permissions-Policy'), 'Add Permissions-Policy header');
  check('CSP header', headers.includes('Content-Security-Policy'), 'Add Content Security Policy');
} else {
  check('Headers file exists', false, 'Create _headers file');
}

// PWA
console.log('\n📱 PWA (Progressive Web App)');
console.log('-'.repeat(50));
const manifestPath = join(projectRoot, 'manifest.json');
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  check('Manifest exists', true);
  check('Manifest has name', !!manifest.name);
  check('Manifest has icons', !!manifest.icons && manifest.icons.length > 0);
  check('Manifest has shortcuts', !!manifest.shortcuts && manifest.shortcuts.length > 0);
  check('Manifest has theme_color', !!manifest.theme_color);
  check('Manifest has start_url', !!manifest.start_url);
} else {
  check('Manifest exists', false, 'Create manifest.json');
}

// Service Worker
console.log('\n⚙️  Service Worker');
console.log('-'.repeat(50));
const swPath = join(projectRoot, 'service-worker.js');
if (existsSync(swPath)) {
  const sw = readFileSync(swPath, 'utf8');
  check('Service Worker exists', true);
  check('SW has install event', sw.includes('install'));
  check('SW has fetch handler', sw.includes('fetch'));
  check('SW caches calculators', sw.includes('calculator') || sw.includes('tools/'));
  check('SW has activate cleanup', sw.includes('activate'));
} else {
  check('Service Worker exists', false, 'Create service-worker.js');
}

// SEO
console.log('\n🔍 SEO');
console.log('-'.repeat(50));
const sitemapPath = join(projectRoot, 'sitemap.xml');
const robotsPath = join(projectRoot, 'robots.txt');

check('Sitemap exists', existsSync(sitemapPath));
check('Robots.txt exists', existsSync(robotsPath));

if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const urlCount = (sitemap.match(/<url>/g) || []).length;
  check(`Sitemap has ${urlCount} URLs`, urlCount > 50, 'Add more URLs to sitemap');
  check('Sitemap includes tools', sitemap.includes('/tools/'));
}

if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8');
  check('Robots allows root', robots.includes('Allow: /'));
  check('Robots has sitemap', robots.includes('Sitemap:'));
}

// Schema Markup
console.log('\n🏷️  Schema Markup');
console.log('-'.repeat(50));
const calculatorPages = [
  'tools/dose-calculator.html',
  'tools/fluid-calculator.html',
  'tools/cri-calculator.html',
  'tools/emergency-drug-chart.html',
];

for (const page of calculatorPages) {
  const pagePath = join(projectRoot, page);
  if (existsSync(pagePath)) {
    const content = readFileSync(pagePath, 'utf8');
    const hasSchema = content.includes('application/ld+json') && content.includes('SoftwareApplication');
    check(`${page} has schema`, hasSchema, 'Add SoftwareApplication schema');
  } else {
    check(`${page} exists`, false);
  }
}

// Homepage
console.log('\n🏠 Homepage');
console.log('-'.repeat(50));
const indexPath = join(projectRoot, 'index.html');
if (existsSync(indexPath)) {
  const index = readFileSync(indexPath, 'utf8');
  check('Manifest link', index.includes('manifest.json'));
  check('Theme color meta', index.includes('theme-color'));
  check('Apple mobile meta tags', index.includes('apple-mobile-web-app'));
  check('Canonical URL', index.includes('canonical'));
  check('Open Graph tags', index.includes('og:'));
} else {
  check('Homepage exists', false);
}

// Summary
console.log('\n' + '='.repeat(50));
if (exitCode === 0) {
  console.log('✅ All checks passed! Setup is complete.');
} else {
  console.log('⚠️  Some checks failed. Review the issues above.');
}
console.log('='.repeat(50));

process.exit(exitCode);
