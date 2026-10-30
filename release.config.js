// Release config for the `bump-version` action (see docs/actions/bump-version.md): version references updated on
// release besides the root `package.json` version. Add a target to bump another file or pattern: `pattern` must
// capture the old version in a named group `version`, which is replaced by `template` with `{version}` substituted
// by the new `X.Y.Z`.

/** @type {import('./.github/actions/bump-version/bump-version.js').ReleaseConfig} */
export default {
  targets: [
    {
      // `uses: ApiTreeCZ/github-actions/...@vX.Y.Z` (or `@main`) in actions, workflows and their docs.
      files: ['.github/actions/*/action.yml', '.github/workflows/*.yml', 'docs/actions/*.md', 'docs/workflows/*.md'],
      pattern:
        /uses:\s*ApiTreeCZ\/github-actions\/[^@\s]+@(?<version>v\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+(?:\.\d+)?)?|main)/g,
      template: 'v{version}',
    },
  ],
};
