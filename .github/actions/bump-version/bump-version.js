import { glob, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * @typedef {object} VersionSource
 * @property {string} file File holding the current version, relative to the config file, e.g. `pyproject.toml`.
 * @property {RegExp} pattern Must capture the version in a named group `version`; the first match is the current
 *   version and the only one bumped (unless the pattern has the `g` flag).
 * @property {string} [template] Replacement for the `version` group; `{version}` is the new `X.Y.Z`. Defaults to
 *   `{version}`.
 */

/**
 * @typedef {object} ReleaseTarget
 * @property {string[]} files Globs relative to the config file, e.g. `docs/actions/*.md`.
 * @property {RegExp} pattern Must capture the version in a named group `version`. Without the `g` flag only the
 *   first match per file is replaced.
 * @property {string} [template] Replacement for the `version` group; `{version}` is the new `X.Y.Z`. Defaults to
 *   `{version}`.
 */

/**
 * @typedef {object} ReleaseConfig
 * @property {VersionSource} [source] Where the current version lives. Defaults to the root `package.json` version.
 * @property {ReleaseTarget[]} [targets] Version references to update besides the source.
 */

const RELEASE_TYPES = new Set(['major', 'minor', 'patch']);

// Same shape as the tag format `.github/workflows/release.yml` accepts (without the `v`).
const VERSION_REGEX = /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(?<prerelease>-[a-zA-Z0-9]+(?:\.\d+)?)?$/;

/** @type {VersionSource} */
const PACKAGE_JSON_SOURCE = {
  file: 'package.json',
  pattern: /"version"\s*:\s*"(?<version>[^"]+)"/,
};

/**
 * @param {string} current Current `X.Y.Z` version.
 * @param {string} release `major`, `minor`, `patch` or an explicit `X.Y.Z` / `X.Y.Z-pre` version.
 * @returns {string} The next version.
 */
export function getNextVersion(current, release) {
  const match = VERSION_REGEX.exec(current);
  if (!match) {
    throw new Error(`Current version "${current}" is not in the X.Y.Z or X.Y.Z-pre format`);
  }

  if (!RELEASE_TYPES.has(release)) {
    if (!VERSION_REGEX.test(release)) {
      throw new Error(`Release "${release}" is neither major, minor, patch nor an X.Y.Z or X.Y.Z-pre version`);
    }
    if (release === current) {
      throw new Error(`Version ${release} is already the current version`);
    }
    return release;
  }

  if (match.groups.prerelease) {
    throw new Error(`Current version ${current} is a prerelease, pass the next version explicitly`);
  }

  const major = Number(match.groups.major);
  const minor = Number(match.groups.minor);
  const patch = Number(match.groups.patch);

  switch (release) {
    case 'major': {
      return `${major + 1}.0.0`;
    }
    case 'minor': {
      return `${major}.${minor + 1}.0`;
    }
    default: {
      return `${major}.${minor}.${patch + 1}`;
    }
  }
}

/**
 * @param {RegExp} pattern
 * @returns {RegExp} `pattern` with the `g` and `d` flags, for iterating matches with group indices.
 */
function withIndices(pattern) {
  const flags = new Set([...pattern.flags, 'g', 'd']);
  return new RegExp(pattern.source, [...flags].join(''));
}

/**
 * @param {RegExpExecArray} match
 * @param {RegExp} pattern
 * @returns {[number, number]}
 */
function versionIndices(match, pattern) {
  const indices = match.indices.groups?.version;
  if (!indices) {
    throw new Error(`Pattern ${pattern} must capture the version in a named group "version"`);
  }
  return indices;
}

/**
 * Replaces the `version` named group of every `pattern` match (first match only without the `g` flag).
 *
 * @param {string} content
 * @param {RegExp} pattern
 * @param {string} value
 * @returns {{ content: string, count: number }}
 */
export function replaceVersion(content, pattern, value) {
  const isGlobal = pattern.flags.includes('g');

  let result = '';
  let cursor = 0;
  let count = 0;

  for (const match of content.matchAll(withIndices(pattern))) {
    const [start, end] = versionIndices(match, pattern);
    result += content.slice(cursor, start) + value;
    cursor = end;
    count += 1;
    if (!isGlobal) {
      break;
    }
  }

  return { content: result + content.slice(cursor), count };
}

/**
 * @param {unknown} template
 * @param {string} label
 */
function validateTemplate(template, label) {
  if (template !== undefined && typeof template !== 'string') {
    throw new TypeError(`${label}: "template" must be a string`);
  }
}

/**
 * @param {unknown} config
 * @returns {{ source: VersionSource, targets: ReleaseTarget[] }}
 */
function validateConfig(config) {
  if (typeof config !== 'object' || config === null) {
    throw new TypeError('Release config must export an object');
  }

  const source = config.source ?? PACKAGE_JSON_SOURCE;
  if (typeof source.file !== 'string' || source.file === '') {
    throw new TypeError('Source: "file" must be a file path');
  }
  if (!(source.pattern instanceof RegExp)) {
    throw new TypeError('Source: "pattern" must be a RegExp');
  }
  validateTemplate(source.template, 'Source');

  const targets = config.targets ?? [];
  if (!Array.isArray(targets)) {
    throw new TypeError('Release config "targets" must be an array');
  }
  for (const [index, target] of targets.entries()) {
    const files = target?.files;
    if (!Array.isArray(files) || files.length === 0 || !files.every((file) => typeof file === 'string')) {
      throw new TypeError(`Target #${index}: "files" must be a non-empty array of globs`);
    }
    if (!(target.pattern instanceof RegExp)) {
      throw new TypeError(`Target #${index}: "pattern" must be a RegExp`);
    }
    validateTemplate(target.template, `Target #${index}`);
  }

  return { source, targets };
}

/**
 * @param {string} cwd
 * @param {string[]} patterns
 * @returns {Promise<string[]>}
 */
async function resolveFiles(cwd, patterns) {
  const files = new Set();
  for (const pattern of patterns) {
    for await (const file of glob(pattern, { cwd, exclude: (name) => name === 'node_modules' })) {
      files.add(file);
    }
  }
  return [...files].toSorted();
}

/**
 * Bumps the source version and every version reference the config targets.
 *
 * @param {{ cwd: string, release: string, config: ReleaseConfig }} options `cwd` resolves the config's paths.
 * @returns {Promise<{ previousVersion: string, version: string, files: string[] }>} `files` lists the changed files.
 */
export async function bumpVersion({ cwd, release, config }) {
  const { source, targets } = validateConfig(config);

  const sourceContent = await readFile(path.join(cwd, source.file), 'utf8');
  const [sourceMatch] = sourceContent.matchAll(withIndices(source.pattern));
  if (!sourceMatch) {
    throw new Error(`Source pattern ${source.pattern} matches no version in ${source.file}`);
  }
  const [start, end] = versionIndices(sourceMatch, source.pattern);
  const previousVersion = sourceContent.slice(start, end);
  const version = getNextVersion(previousVersion, release);

  /** @type {Map<string, { original: string, content: string }>} */
  const contents = new Map();
  const allTargets = [
    { label: `Source (${source.file})`, files: [source.file], pattern: source.pattern, template: source.template },
    ...targets.map((target, index) => ({ label: `Target #${index} (${target.files.join(', ')})`, ...target })),
  ];

  for (const { label, files: patterns, pattern, template } of allTargets) {
    const files = await resolveFiles(cwd, patterns);
    if (files.length === 0) {
      throw new Error(`${label} matches no files`);
    }

    const value = (template ?? '{version}').replaceAll('{version}', version);
    let count = 0;

    for (const file of files) {
      if (!contents.has(file)) {
        const original = await readFile(path.join(cwd, file), 'utf8');
        contents.set(file, { original, content: original });
      }
      const entry = contents.get(file);
      const replaced = replaceVersion(entry.content, pattern, value);
      entry.content = replaced.content;
      count += replaced.count;
    }

    if (count === 0) {
      throw new Error(`${label} matches no version reference in ${files.join(', ')}`);
    }
  }

  const changed = [...contents].filter(([, { original, content }]) => original !== content);
  await Promise.all(changed.map(([file, { content }]) => writeFile(path.join(cwd, file), content)));

  return { previousVersion, version, files: changed.map(([file]) => file).toSorted() };
}
