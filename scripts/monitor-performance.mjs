#!/usr/bin/env node
/**
 * Performance Monitoring Script for DVMReady
 * Tracks Core Web Vitals and key performance metrics
 * 
 * Usage: node scripts/monitor-performance.mjs [url]
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Configuration
const PAGES_TO_TEST = [
  { url: 'https://dvmready.com/', name: 'Homepage' },
  { url: 'https://dvmready.com/tools/dose-calculator.html', name: 'Dose Calculator' },
  { url: 'https://dvmready.com/tools/fluid-calculator.html', name: 'Fluid Calculator' },
  { url: 'https://dvmready.com/tools/', name: 'Tools Index' },
  { url: 'https://dvmready.com/study/', name: 'Study Hub' },
];

const REPORTS_DIR = join(projectRoot, 'docs', 'performance-reports');

// Ensure reports directory exists
if (!existsSync(REPORTS_DIR)) {
  mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Run Lighthouse audit for a single URL
 */
async function runLighthouse(url, name) {
  console.log(`\n🔍 Auditing: ${name}`);
  console.log(`   URL: ${url}`);
  
  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = join(REPORTS_DIR, `${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.json`);
  
  try {
    // Run Lighthouse with specific settings
    const command = `npx lighthouse ${url} \
      --only-categories=performance,accessibility,best-practices,seo \
      --output=json \
      --output-path=${outputFile} \
      --chrome-flags="--headless --no-sandbox" \
      --preset=desktop \
      --quiet`;
    
    execSync(command, { stdio: 'ignore', timeout: 120000 });
    
    // Parse results
    const results = JSON.parse(readFileSync(outputFile, 'utf8'));
    
    const summary = {
      url,
      name,
      timestamp,
      scores: {
        performance: results.categories.performance?.score * 100 || 0,
        accessibility: results.categories.accessibility?.score * 100 || 0,
        bestPractices: results.categories['best-practices']?.score * 100 || 0,
        seo: results.categories.seo?.score * 100 || 0,
      },
      coreWebVitals: {
        lcp: results.audits['largest-contentful-paint']?.numericValue || 0,
        fid: results.audits['max-potential-fid']?.numericValue || 0,
        cls: results.audits['cumulative-layout-shift']?.numericValue || 0,
        ttfb: results.audits['server-response-time']?.numericValue || 0,
      },
      metrics: {
        fcp: results.audits['first-contentful-paint']?.numericValue || 0,
        si: results.audits['speed-index']?.numericValue || 0,
        tti: results.audits['interactive']?.numericValue || 0,
        tbt: results.audits['total-blocking-time']?.numericValue || 0,
      },
    };
    
    return summary;
  } catch (error) {
    console.error(`   ❌ Failed to audit ${name}: ${error.message}`);
    return null;
  }
}

/**
 * Format metric value with unit
 */
function formatMetric(value, unit = 'ms') {
  if (value === 0) return 'N/A';
  if (unit === 's') return `${(value / 1000).toFixed(2)}s`;
  if (unit === 'ms') return `${Math.round(value)}ms`;
  return value.toFixed(3);
}

/**
 * Get status indicator for metric
 */
function getStatus(value, thresholds) {
  const { good, poor } = thresholds;
  if (value <= good) return '✅';
  if (value <= poor) return '⚠️';
  return '❌';
}

/**
 * Generate report
 */
async function generateReport() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     DVMReady Performance Monitoring Report             ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n📅 Date: ${new Date().toLocaleString()}`);
  console.log(`📊 Testing ${PAGES_TO_TEST.length} pages...\n`);
  
  const results = [];
  
  for (const page of PAGES_TO_TEST) {
    const result = await runLighthouse(page.url, page.name);
    if (result) {
      results.push(result);
    }
  }
  
  // Display results
  console.log('\n' + '='.repeat(70));
  console.log('PERFORMANCE SCORES');
  console.log('='.repeat(70));
  
  for (const result of results) {
    console.log(`\n📄 ${result.name}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Performance:     ${result.scores.performance.toFixed(0)}/100 ${getStatus(100 - result.scores.performance, { good: 10, poor: 25 })}`);
    console.log(`   Accessibility:   ${result.scores.accessibility.toFixed(0)}/100 ${getStatus(100 - result.scores.accessibility, { good: 5, poor: 15 })}`);
    console.log(`   Best Practices:  ${result.scores.bestPractices.toFixed(0)}/100 ${getStatus(100 - result.scores.bestPractices, { good: 5, poor: 15 })}`);
    console.log(`   SEO:             ${result.scores.seo.toFixed(0)}/100 ${getStatus(100 - result.scores.seo, { good: 5, poor: 15 })}`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('CORE WEB VITALS');
  console.log('='.repeat(70));
  console.log('\nThresholds: LCP <2.5s, FID <100ms, CLS <0.1');
  
  for (const result of results) {
    const { lcp, fid, cls } = result.coreWebVitals;
    console.log(`\n📄 ${result.name}`);
    console.log(`   LCP: ${formatMetric(lcp, 's').padEnd(10)} ${getStatus(lcp, { good: 2500, poor: 4000 })} (Largest Contentful Paint)`);
    console.log(`   FID: ${formatMetric(fid).padEnd(10)} ${getStatus(fid, { good: 100, poor: 300 })} (First Input Delay)`);
    console.log(`   CLS: ${cls.toFixed(3).padEnd(10)} ${getStatus(cls, { good: 0.1, poor: 0.25 })} (Cumulative Layout Shift)`);
    console.log(`   TTFB: ${formatMetric(result.coreWebVitals.ttfb).padEnd(10)} (Time to First Byte)`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('OTHER METRICS');
  console.log('='.repeat(70));
  
  for (const result of results) {
    const { fcp, si, tti, tbt } = result.metrics;
    console.log(`\n📄 ${result.name}`);
    console.log(`   FCP:  ${formatMetric(fcp, 's').padEnd(10)} (First Contentful Paint)`);
    console.log(`   SI:   ${formatMetric(si, 's').padEnd(10)} (Speed Index)`);
    console.log(`   TTI:  ${formatMetric(tti, 's').padEnd(10)} (Time to Interactive)`);
    console.log(`   TBT:  ${formatMetric(tbt).padEnd(10)} (Total Blocking Time)`);
  }
  
  // Save summary report
  const summaryFile = join(REPORTS_DIR, `summary-${new Date().toISOString().split('T')[0]}.json`);
  writeFileSync(summaryFile, JSON.stringify(results, null, 2));
  
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`\n✅ Audited ${results.length} pages`);
  console.log(`📁 Full reports saved to: ${REPORTS_DIR}`);
  console.log(`📝 Summary saved to: ${summaryFile}`);
  
  // Calculate averages
  if (results.length > 0) {
    const avgPerformance = results.reduce((sum, r) => sum + r.scores.performance, 0) / results.length;
    const avgAccessibility = results.reduce((sum, r) => sum + r.scores.accessibility, 0) / results.length;
    
    console.log(`\n📊 Average Scores:`);
    console.log(`   Performance:    ${avgPerformance.toFixed(0)}/100`);
    console.log(`   Accessibility:  ${avgAccessibility.toFixed(0)}/100`);
    
    if (avgPerformance >= 90) {
      console.log('\n🎉 Excellent performance across all pages!');
    } else if (avgPerformance >= 70) {
      console.log('\n👍 Good performance with room for improvement.');
    } else {
      console.log('\n⚠️ Performance needs attention.');
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('RECOMMENDATIONS');
  console.log('='.repeat(70));
  
  console.log(`
1. Monitor Core Web Vitals in Google Search Console
2. Set up real user monitoring (RUM) for field data
3. Implement performance budgets in CI/CD
4. Regular audits (weekly/monthly)
5. Optimize images and lazy load below-fold content
`);
}

// Check if Lighthouse is available
try {
  execSync('npx lighthouse --version', { stdio: 'ignore' });
} catch (error) {
  console.log('Installing Lighthouse...');
  try {
    execSync('npm install -g lighthouse', { stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to install Lighthouse. Please install manually:');
    console.error('npm install -g lighthouse');
    process.exit(1);
  }
}

// Run the report
generateReport().catch(console.error);
