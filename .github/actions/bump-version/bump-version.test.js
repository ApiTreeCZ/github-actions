import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { bumpVersion, getNextVersion, replaceVersion } from './bump-version.js';

const USES_TARGET = {
  files: ['.github/workflows/*.yml', 'docs/**/*.md'],
  pattern: /uses:\s*ApiTreeCZ\/github-actions\/[^@\s]+@(?<version>v\d+\.\d+\.\d+|main)/g,
  template: 'v{version}',
};

describe('getNextVersion', () => {
  it.each([
    ['1.2.3', 'major', '2.0.0'],
    ['1.2.3', 'minor', '1.3.0'],
    ['1.2.3', 'patch', '1.2.4'],
    ['1.2.3', '2.0.0-rc.1', '2.0.0-rc.1'],
    ['2.0.0-rc.1', '2.0.0', '2.0.0'],
  ])('bumps %s by %s to %s', (current, release, expected) => {
    expect(getNextVersion(current, release)).toBe(expected);
  });

  it('refuses a release type on a prerelease, whose next version is ambiguous', () => {
    expect(() => getNextVersion('2.0.0-beta', 'patch')).toThrow('pass the next version explicitly');
  });

  it.each(['v1.2.4', '1.2', 'latest', '1.2.4-rc.x'])('rejects release %s', (release) => {
    expect(() => getNextVersion('1.2.3', release)).toThrow('is neither major, minor, patch');
  });

  it('rejects the current version as the next one', () => {
    expect(() => getNextVersion('1.2.3', '1.2.3')).toThrow('already the current version');
  });
});

describe('replaceVersion', () => {
  it('replaces only the version group of each match', () => {
    const content = 'uses: a@v1.0.0\nkeep v1.0.0\nuses: b@main\n';
    const result = replaceVersion(content, /uses: \w@(?<version>v1\.0\.0|main)/g, 'v2.0.0');
    expect(result).toEqual({ content: 'uses: a@v2.0.0\nkeep v1.0.0\nuses: b@v2.0.0\n', count: 2 });
  });

  it('replaces only the first match without the g flag', () => {
    const content = '"version": "1.0.0", "x": { "version": "9.9.9" }';
    const result = replaceVersion(content, /"version": "(?<version>[^"]+)"/, '1.0.1');
    expect(result).toEqual({ content: '"version": "1.0.1", "x": { "version": "9.9.9" }', count: 1 });
  });

  it('requires the named version group', () => {
    expect(() => replaceVersion('v1.0.0', /v(\d+\.\d+\.\d+)/g, 'v2.0.0')).toThrow('named group "version"');
  });
});

describe('bumpVersion', () => {
  let cwd;

  const write = async (file, content) => {
    await mkdir(path.dirname(path.join(cwd, file)), { recursive: true });
    await writeFile(path.join(cwd, file), content);
  };
  const read = (file) => readFile(path.join(cwd, file), 'utf8');

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), 'bump-version-'));
    await write('package.json', '{\n  "name": "x",\n  "version": "0.8.1",\n  "engines": { "node": "26.x" }\n}\n');
  });

  afterEach(async () => {
    await rm(cwd, { recursive: true, force: true });
  });

  it('bumps package.json and every targeted reference, reporting only changed files', async () => {
    await write('.github/workflows/ci.yml', 'uses: ApiTreeCZ/github-actions/.github/actions/a@v0.8.1\n');
    await write('docs/actions/a.md', 'uses: ApiTreeCZ/github-actions/.github/actions/a@main\nOther@v0.8.1\n');
    await write('docs/actions/b.md', 'uses: ApiTreeCZ/github-actions/.github/actions/b@v0.9.0\n');

    const result = await bumpVersion({ cwd, release: 'minor', config: { targets: [USES_TARGET] } });

    expect(result).toEqual({
      previousVersion: '0.8.1',
      version: '0.9.0',
      files: ['.github/workflows/ci.yml', 'docs/actions/a.md', 'package.json'],
    });
    expect(await read('package.json')).toBe(
      '{\n  "name": "x",\n  "version": "0.9.0",\n  "engines": { "node": "26.x" }\n}\n',
    );
    expect(await read('.github/workflows/ci.yml')).toBe('uses: ApiTreeCZ/github-actions/.github/actions/a@v0.9.0\n');
    expect(await read('docs/actions/a.md')).toBe(
      'uses: ApiTreeCZ/github-actions/.github/actions/a@v0.9.0\nOther@v0.8.1\n',
    );
  });

  it('applies several targets to the same file', async () => {
    await write('README.md', 'Current: 0.8.1\nuses: ApiTreeCZ/github-actions/.github/actions/a@v0.8.1\n');
    const config = {
      targets: [
        { files: ['README.md'], pattern: /Current: (?<version>\S+)/ },
        { ...USES_TARGET, files: ['README.md'] },
      ],
    };

    await bumpVersion({ cwd, release: 'patch', config });

    expect(await read('README.md')).toBe('Current: 0.8.2\nuses: ApiTreeCZ/github-actions/.github/actions/a@v0.8.2\n');
  });

  it('reads and bumps a custom source instead of package.json', async () => {
    await write('pyproject.toml', '[project]\nversion = "1.4.0"\n\n[tool.x]\nversion = "9.9.9"\n');
    const config = { source: { file: 'pyproject.toml', pattern: /^version = "(?<version>[^"]+)"/m } };

    const result = await bumpVersion({ cwd, release: 'major', config });

    expect(result).toEqual({ previousVersion: '1.4.0', version: '2.0.0', files: ['pyproject.toml'] });
    expect(await read('pyproject.toml')).toBe('[project]\nversion = "2.0.0"\n\n[tool.x]\nversion = "9.9.9"\n');
    expect(await read('package.json')).toContain('"version": "0.8.1"');
  });

  it('fails when the source holds no version', async () => {
    await write('VERSION', 'unversioned\n');
    const config = { source: { file: 'VERSION', pattern: /^(?<version>\d+\.\d+\.\d+)$/m } };

    await expect(bumpVersion({ cwd, release: 'patch', config })).rejects.toThrow('matches no version in VERSION');
  });

  it('fails without writing anything when a target matches no files or no reference', async () => {
    await write('docs/actions/a.md', 'no references here\n');

    await expect(
      bumpVersion({ cwd, release: 'patch', config: { targets: [{ ...USES_TARGET, files: ['missing/*.yml'] }] } }),
    ).rejects.toThrow('Target #0 (missing/*.yml) matches no files');
    await expect(bumpVersion({ cwd, release: 'patch', config: { targets: [USES_TARGET] } })).rejects.toThrow(
      'matches no version reference in docs/actions/a.md',
    );
    expect(await read('package.json')).toContain('"version": "0.8.1"');
  });

  it('rejects a malformed config', async () => {
    await expect(
      bumpVersion({ cwd, release: 'patch', config: { targets: [{ files: ['a.md'], pattern: 'a' }] } }),
    ).rejects.toThrow('Target #0: "pattern" must be a RegExp');
  });
});
