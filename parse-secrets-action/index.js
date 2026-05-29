import { appendFile } from 'node:fs/promises';

async function run() {
  try {
    const json = process.env.INPUT_JSON;
    if (!json) {
      throw new Error('Input "json" is required');
    }
    const data = JSON.parse(json);
    const outputFile = process.env.GITHUB_OUTPUT;

    if (!outputFile) {
      throw new Error('GITHUB_OUTPUT environment variable is not defined');
    }

    const RADIX_BASE = 36;
    const SUBSTRING_START = 2;
    const SUBSTRING_END = 15;

    let outputContent = '';

    for (const [key, value] of Object.entries(data)) {
      const delimiter = `EOF_${Math.random().toString(RADIX_BASE).substring(SUBSTRING_START, SUBSTRING_END)}`;
      outputContent += `${key}<<${delimiter}\n${value}\n${delimiter}\n`;
    }

    await appendFile(outputFile, outputContent);
  } catch (error) {
    process.stderr.write(`::error::${error.message}\n`);
    process.exit(1);
  }
}

await run();
