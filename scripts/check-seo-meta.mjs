#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

const ROOT = process.cwd()
const EXCLUDED_DIRS = new Set([
  '.git',
  '.vscode',
  'node_modules',
  'dist',
  'archive',
])

const canonicalRegex = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i
const descriptionRegex = /<meta\s+[^>]*name=["']description["'][^>]*>/i

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name.startsWith('.DS_Store')) {
      continue
    }

    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(ROOT, fullPath)

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) {
        continue
      }
      files.push(...(await walk(fullPath)))
      continue
    }

    if (entry.isFile() && relativePath.endsWith('.html')) {
      files.push(relativePath)
    }
  }

  return files
}

async function checkFile(relativePath) {
  const fullPath = path.join(ROOT, relativePath)
  const html = await fs.readFile(fullPath, 'utf8')

  return {
    file: relativePath,
    hasCanonical: canonicalRegex.test(html),
    hasDescription: descriptionRegex.test(html),
  }
}

function printList(title, files) {
  console.log(`\n${title}: ${files.length}`)
  for (const file of files) {
    console.log(`- ${file}`)
  }
}

async function main() {
  const strict = process.argv.includes('--strict')
  const htmlFiles = await walk(ROOT)
  const checks = await Promise.all(htmlFiles.map(checkFile))

  const missingCanonical = checks
    .filter((result) => !result.hasCanonical)
    .map((result) => result.file)
    .sort()

  const missingDescription = checks
    .filter((result) => !result.hasDescription)
    .map((result) => result.file)
    .sort()

  console.log(`SEO meta report for ${htmlFiles.length} HTML files`)
  printList('Missing canonical', missingCanonical)
  printList('Missing description', missingDescription)

  if (strict && (missingCanonical.length > 0 || missingDescription.length > 0)) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error('Failed to run SEO meta check:', error)
  process.exit(1)
})
