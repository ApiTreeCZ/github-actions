import { randomUUID } from 'node:crypto';
import { appendFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

import { bumpVersion } from './bump-version.js';

const USAGE = 'Usage: index.js <major|minor|patch|X.Y.Z[-pre]> [--config release.config.js]';

/**
 * Reads the action inputs, or the CLI arguments when run locally (e.g. `pnpm run release:bump minor`).
 *
 * @returns {{ release: string, config: string }}
 */
function getInputs() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: { config: { type: 'string' } },
  });
  const release = process.env.INPUT_RELEASE || positionals[0];
  if (!release) {
    throw new Error(`Input "release" is required. ${USAGE}`);
  }
  return { release, config: process.env.INPUT_CONFIG || values.config || 'release.config.js' };
}

/**
 * @param {string} file
 * @param {Record<string, string>} outputs
 */
async function writeOutputs(file, outputs) {
  let content = '';
  for (const [key, value] of Object.entries(outputs)) {
    const delimiter = `EOF_${randomUUID()}`;
    content += `${key}<<${delimiter}\n${value}\n${delimiter}\n`;
  }
  await appendFile(file, content);
}

async function run() {
  const { release, config: configFile } = getInputs();
  const configPath = path.resolve(configFile);
  const { default: config } = await import(pathToFileURL(configPath).href);

  const { previousVersion, version, files } = await bumpVersion({
    cwd: path.dirname(configPath),
    release,
    config,
  });

  process.stdout.write(`Bumped ${previousVersion} → ${version} in ${files.length} files:\n`);
  for (const file of files) {
    process.stdout.write(`  ${file}\n`);
  }

  if (process.env.GITHUB_OUTPUT) {
    await writeOutputs(process.env.GITHUB_OUTPUT, {
      version,
      'previous-version': previousVersion,
      files: files.join('\n'),
    });
  }
}

try {
  await run();
} catch (error) {
  process.stderr.write(`::error::${error.message}\n`);
  process.exit(1);
}
