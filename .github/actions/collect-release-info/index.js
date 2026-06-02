#!/usr/bin/env node

/**
 * Extracts release changes from CHANGELOG.md files for the release PR body.
 *
 * This script:
 * - Finds all modified CHANGELOG.md files
 * - Extracts the latest version entry from each
 * - Filters out private packages
 * - Groups changes by bump type (major/minor/patch)
 * - Formats output for GitHub PR body
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { appendFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';

/**
 * Get list of modified CHANGELOG.md files from git diff
 */
function getModifiedChangelogs() {
  try {
    const output = execSync('git diff --name-only HEAD', { encoding: 'utf-8' });
    return output
      .split('\n')
      .filter((line) => line.trim())
      .filter((line) => line.endsWith('CHANGELOG.md'))
      .filter((line) => !line.includes('node_modules'))
      .filter((line) => !line.includes('.github'));
  } catch (error) {
    process.stderr.write(`::error::${error.message}\n`);
    return [];
  }
}

/**
 * Extract the latest version section from a CHANGELOG.md file
 */
async function extractLatestChangelog(changelogPath) {
  if (!existsSync(changelogPath)) {
    return null;
  }

  const content = await readFile(changelogPath, 'utf-8');
  const lines = content.split('\n');

  let inVersionSection = false;
  let versionLines = [];
  let version = null;

  for (const line of lines) {
    // Match version header like "## 1.2.3" or "## 1.2.3-next.abc"
    if (line.match(/^##\s+\d+\.\d+\.\d+/)) {
      if (!inVersionSection) {
        // First version header - start capturing
        version = line.replace(/^##\s+/, '').trim();
        inVersionSection = true;
        continue;
      } else {
        // Second version header - stop capturing
        break;
      }
    }

    if (inVersionSection && line.trim()) {
      versionLines.push(line);
    }
  }

  return {
    version,
    changes: versionLines.filter((l) => l.trim()).join('\n'),
  };
}

/**
 * Get package info from package.json
 */
async function getPackageInfo(changelogPath) {
  const packageDirectory = dirname(changelogPath);
  const packageJsonPath = join(packageDirectory, 'package.json');

  if (!existsSync(packageJsonPath)) {
    return null;
  }

  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));

  return {
    name: packageJson.name,
    version: packageJson.version,
    private: packageJson.private || false,
    isApp: changelogPath.startsWith('apps/'),
  };
}

/**
 * Parse bump type from changelog content
 */
function parseBumpType(changes) {
  const lowerChanges = changes.toLowerCase();

  if (lowerChanges.includes('major') || lowerChanges.includes('breaking')) {
    return 'major';
  } else if (lowerChanges.includes('minor')) {
    return 'minor';
  } else if (lowerChanges.includes('patch')) {
    return 'patch';
  }

  // Heuristic: if it mentions new features, likely minor
  if (lowerChanges.includes('add ') || lowerChanges.includes('new ')) {
    return 'minor';
  }

  // Otherwise, assume patch
  return 'patch';
}

/**
 * Format changes for display
 */
function formatChanges(changes) {
  // Remove bump type headings and extra whitespace
  return changes
    .replace(/###\s+(Major|Minor|Patch)\s+Changes?\s*/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Main function
 */
async function run() {
  const outputFile = process.env.GITHUB_OUTPUT;

  if (!outputFile) {
    throw new Error('GITHUB_OUTPUT environment variable is not defined');
  }

  const modifiedChangelogs = getModifiedChangelogs();

  if (modifiedChangelogs.length === 0) {
    process.stdout.write('::warning::No changes found\n');
    await appendFile(outputFile, 'result=');

    return;
  }

  const packages = {
    major: [],
    minor: [],
    patch: [],
  };

  // Process each changelog
  for (const changelogPath of modifiedChangelogs) {
    const packageInfo = await getPackageInfo(changelogPath);
    if (!packageInfo) continue;

    const changelog = await extractLatestChangelog(changelogPath);
    if (!changelog || !changelog.changes) continue;

    const entry = {
      name: packageInfo.name,
      version: packageInfo.version,
      changes: formatChanges(changelog.changes),
    };

    // Determine bump type and categorize
    const bumpType = parseBumpType(changelog.changes);
    packages[bumpType].push(entry);
  }

  // Generate PR body
  const sections = [];

  // Count total packages
  const totalPackages = packages.major.length + packages.minor.length + packages.patch.length;

  if (totalPackages > 0) {
    sections.push(
      `## 🔖 Release Summary\n\nThis release includes changes to **${totalPackages} package${totalPackages === 1 ? '' : 's'}**.\n`,
    );
  }

  // Major changes
  if (packages.major.length > 0) {
    sections.push('### ⚠️ Major Changes (Breaking)\n');
    for (const package_ of packages.major) {
      sections.push(`**${package_.name}** \`${package_.version}\`\n${package_.changes}\n`);
    }
  }

  // Minor changes
  if (packages.minor.length > 0) {
    sections.push('### 🚀 Minor Changes\n');
    for (const package_ of packages.minor) {
      sections.push(`**${package_.name}** \`${package_.version}\`\n${package_.changes}\n`);
    }
  }

  // Patch changes
  if (packages.patch.length > 0) {
    sections.push('### 🐛 Patch Changes\n');
    for (const package_ of packages.patch) {
      sections.push(`**${package_.name}** \`${package_.version}\`\n${package_.changes}\n`);
    }
  }

  // Footer
  if (totalPackages > 0) {
    sections.push('\n---\n\n✅ **After approval**: Merging this PR will tag and publish all changes as stable release');
    sections.push('\n---\n\n🦋 Created by [Changesets](https://github.com/changesets/changesets/)');
  }

  // Write to GITHUB_OUTPUT
  await appendFile(outputFile, `result<<EOF_RELEASE_INFO\n${sections.join('\n')}\nEOF_RELEASE_INFO\n`);
}

try {
  await run();
} catch (error) {
  process.stderr.write(`::error::${error.message}\n`);
  process.exit(1);
}
