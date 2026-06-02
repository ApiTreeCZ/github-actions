import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { appendFile, readFile } from 'node:fs/promises';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('node:child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
}));

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  appendFile: vi.fn(),
}));

describe('collect-release-info-action', () => {
  let exitSpy;
  let stdoutSpy;
  let stderrSpy;
  const originalEnvironment = { ...process.env };
  let mockGitDiffOutput = '';
  let virtualFiles = {};

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    process.env = { ...originalEnvironment };
    delete process.env.GITHUB_OUTPUT;

    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    mockGitDiffOutput = '';
    virtualFiles = {};

    vi.mocked(execSync).mockImplementation((cmd) => {
      if (cmd === 'git diff --name-only HEAD') {
        return mockGitDiffOutput;
      }
      throw new Error(`Unexpected command: ${cmd}`);
    });

    vi.mocked(existsSync).mockImplementation((path) => path in virtualFiles);

    vi.mocked(readFile).mockImplementation(async (path) => {
      if (path in virtualFiles) {
        return virtualFiles[path];
      }
      throw new Error(`ENOENT: no such file or directory, open '${path}'`);
    });
  });

  afterEach(() => {
    exitSpy.mockRestore();
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it('should throw error and exit if GITHUB_OUTPUT is not defined', async () => {
    await import('./index.js');

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(stderrSpy).toHaveBeenCalledWith('::error::GITHUB_OUTPUT environment variable is not defined\n');
  });

  it('should handle no modified changelogs gracefully', async () => {
    process.env.GITHUB_OUTPUT = 'mock-output-file.txt';
    mockGitDiffOutput = '';

    await import('./index.js');

    expect(stdoutSpy).toHaveBeenCalledWith('::warning::No changes found\n');
    expect(appendFile).toHaveBeenCalledWith('mock-output-file.txt', 'result=');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('should handle git diff execution errors gracefully', async () => {
    process.env.GITHUB_OUTPUT = 'mock-output-file.txt';
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('git command failed');
    });

    await import('./index.js');

    expect(stderrSpy).toHaveBeenCalledWith('::error::git command failed\n');
    expect(stdoutSpy).toHaveBeenCalledWith('::warning::No changes found\n');
    expect(appendFile).toHaveBeenCalledWith('mock-output-file.txt', 'result=');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('should skip changelogs if package.json does not exist', async () => {
    process.env.GITHUB_OUTPUT = 'mock-output-file.txt';
    mockGitDiffOutput = 'packages/pkg-a/CHANGELOG.md\n';

    // virtualFiles does not have package.json or CHANGELOG.md

    await import('./index.js');

    expect(stdoutSpy).not.toHaveBeenCalled();
    expect(appendFile).toHaveBeenCalledWith('mock-output-file.txt', 'result<<EOF_RELEASE_INFO\n\nEOF_RELEASE_INFO\n');
  });

  it('should skip changelogs if latest changelog header cannot be extracted or is empty', async () => {
    process.env.GITHUB_OUTPUT = 'mock-output-file.txt';
    mockGitDiffOutput = 'packages/pkg-a/CHANGELOG.md\n';

    virtualFiles['packages/pkg-a/package.json'] = JSON.stringify({
      name: 'pkg-a',
      version: '1.0.0',
    });
    virtualFiles['packages/pkg-a/CHANGELOG.md'] = '# Changelog\n\nNo versions here yet.';

    await import('./index.js');

    expect(stdoutSpy).not.toHaveBeenCalled();
    expect(appendFile).toHaveBeenCalledWith('mock-output-file.txt', 'result<<EOF_RELEASE_INFO\n\nEOF_RELEASE_INFO\n');
  });

  it('should successfully group, format and write changes to GITHUB_OUTPUT', async () => {
    process.env.GITHUB_OUTPUT = 'mock-output-file.txt';
    mockGitDiffOutput = [
      'packages/major-pkg/CHANGELOG.md',
      'packages/minor-pkg/CHANGELOG.md',
      'packages/patch-pkg/CHANGELOG.md',
      'packages/heuristic-pkg/CHANGELOG.md',
    ].join('\n');

    // Setup virtual files for major package (detects 'breaking' -> major)
    virtualFiles['packages/major-pkg/package.json'] = JSON.stringify({
      name: 'major-pkg',
      version: '2.0.0',
    });
    virtualFiles['packages/major-pkg/CHANGELOG.md'] = [
      '# Changelog',
      '',
      '## 2.0.0',
      '',
      '### Major Changes',
      '',
      '- Breaking change details',
      '',
      '## 1.1.0',
    ].join('\n');

    // Setup virtual files for minor package (detects 'minor' -> minor)
    virtualFiles['packages/minor-pkg/package.json'] = JSON.stringify({
      name: 'minor-pkg',
      version: '1.1.0',
    });
    virtualFiles['packages/minor-pkg/CHANGELOG.md'] = [
      '# Changelog',
      '',
      '## 1.1.0',
      '',
      '### Minor Changes',
      '',
      '- Added a new feature details',
      '',
      '## 1.0.0',
    ].join('\n');

    // Setup virtual files for patch package (detects 'patch' -> patch)
    virtualFiles['packages/patch-pkg/package.json'] = JSON.stringify({
      name: 'patch-pkg',
      version: '1.0.1',
    });
    virtualFiles['packages/patch-pkg/CHANGELOG.md'] = [
      '# Changelog',
      '',
      '## 1.0.1',
      '',
      '### Patch Changes',
      '',
      '- Fixed a bug details',
      '',
      '## 1.0.0',
    ].join('\n');

    // Setup virtual files for heuristic package (detects 'add' -> minor)
    virtualFiles['packages/heuristic-pkg/package.json'] = JSON.stringify({
      name: 'heuristic-pkg',
      version: '1.2.0',
      private: true, // Should still run as code doesn't filter it out
    });
    virtualFiles['packages/heuristic-pkg/CHANGELOG.md'] = [
      '# Changelog',
      '',
      '## 1.2.0',
      '',
      '- Add some utility function',
      '',
      '## 1.1.0',
    ].join('\n');

    await import('./index.js');

    expect(appendFile).toHaveBeenCalledTimes(1);
    const [[filePath, content]] = vi.mocked(appendFile).mock.calls;
    expect(filePath).toBe('mock-output-file.txt');

    // Let's assert that the content starts with the result delimiter output format
    expect(content).toContain('result<<EOF_RELEASE_INFO');
    expect(content).toContain('EOF_RELEASE_INFO');

    // Let's verify release summary
    expect(content).toContain('## 🔖 Release Summary\n\nThis release includes changes to **4 packages**.\n');

    // Let's verify major section
    expect(content).toContain('### ⚠️ Major Changes (Breaking)\n');
    expect(content).toContain('**major-pkg** `2.0.0`\n- Breaking change details\n');

    // Let's verify minor section contains minor-pkg and heuristic-pkg
    expect(content).toContain('### 🚀 Minor Changes\n');
    expect(content).toContain('**minor-pkg** `1.1.0`\n- Added a new feature details\n');
    expect(content).toContain('**heuristic-pkg** `1.2.0`\n- Add some utility function\n');

    // Let's verify patch section
    expect(content).toContain('### 🐛 Patch Changes\n');
    expect(content).toContain('**patch-pkg** `1.0.1`\n- Fixed a bug details\n');

    // Let's verify footer
    expect(content).toContain(
      '✅ **After approval**: Merging this PR will tag and publish all changes as stable release',
    );
    expect(content).toContain('🦋 Created by [Changesets]');
  });
});
