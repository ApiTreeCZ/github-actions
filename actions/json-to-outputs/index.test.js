import { appendFile } from 'node:fs/promises';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('node:fs/promises', () => ({
  appendFile: vi.fn(),
}));

describe('json-to-outputs-action', () => {
  let exitSpy;
  let stderrSpy;
  const originalEnvironment = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    // Reset process.env to original state
    process.env = { ...originalEnvironment };
    delete process.env.INPUT_JSON;
    delete process.env.GITHUB_OUTPUT;

    // Spy on process methods and mock implementation to prevent exit/console output
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    exitSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it('should successfully parse JSON and write outputs to GITHUB_OUTPUT', async () => {
    process.env.INPUT_JSON = JSON.stringify({ key1: 'value1', key2: 'value2' });
    process.env.GITHUB_OUTPUT = 'mock-output-file.txt';

    await import('./index.js');

    expect(appendFile).toHaveBeenCalledTimes(1);
    const [[filePath, content]] = vi.mocked(appendFile).mock.calls;
    expect(filePath).toBe('mock-output-file.txt');

    // Parse the output content to verify multiline output formatting
    const lines = content.trim().split('\n');

    // We expect format:
    // key1<<EOF_xxxx
    // value1
    // EOF_xxxx
    // key2<<EOF_yyyy
    // value2
    // EOF_yyyy

    const EXPECTED_LINE_COUNT = 6;
    expect(lines.length).toBe(EXPECTED_LINE_COUNT);

    const [key1Start, key1Value, key1End, key2Start, key2Value, key2End] = lines;

    expect(key1Start).toMatch(/^key1<<EOF_[a-z0-9]+$/);
    const [, delimiter1] = key1Start.split('<<');
    expect(key1Value).toBe('value1');
    expect(key1End).toBe(delimiter1);

    expect(key2Start).toMatch(/^key2<<EOF_[a-z0-9]+$/);
    const [, delimiter2] = key2Start.split('<<');
    expect(key2Value).toBe('value2');
    expect(key2End).toBe(delimiter2);

    expect(exitSpy).not.toHaveBeenCalled();
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it('should throw error and exit if INPUT_JSON is not provided', async () => {
    process.env.GITHUB_OUTPUT = 'mock-output-file.txt';

    await import('./index.js');

    expect(appendFile).not.toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    const [[firstStderrCallArgument]] = stderrSpy.mock.calls;
    expect(firstStderrCallArgument).toBe('::error::Input "json" is required\n');
  });

  it('should throw error and exit if GITHUB_OUTPUT is not defined', async () => {
    process.env.INPUT_JSON = JSON.stringify({ key1: 'value1' });

    await import('./index.js');

    expect(appendFile).not.toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    const [[firstStderrCallArgument]] = stderrSpy.mock.calls;
    expect(firstStderrCallArgument).toBe('::error::GITHUB_OUTPUT environment variable is not defined\n');
  });

  it('should throw error and exit if INPUT_JSON is invalid JSON', async () => {
    process.env.INPUT_JSON = 'invalid-json';
    process.env.GITHUB_OUTPUT = 'mock-output-file.txt';

    await import('./index.js');

    expect(appendFile).not.toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    const [[firstStderrCallArgument]] = stderrSpy.mock.calls;
    expect(firstStderrCallArgument).toMatch(/^::error::/);
  });
});
