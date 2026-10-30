# ⚙️ `bump-version`

Bumps the project version and every version reference listed in a release config file, with no LLM and no
dependencies. Use it to prepare a release commit: it reads the current version (by default the root `package.json`
`version`), computes the next one from the release type, and rewrites only the version inside each configured
pattern, keeping the rest of every file intact. A config target that matches no file or no version fails the step
before anything is written, so a stale config never silently skips a reference.

## 🚀 Usage

### Step Snippet

```yaml
- name: Bump version
  id: bump-version
  uses: ApiTreeCZ/github-actions/.github/actions/bump-version@v0.8.1
  with:
    # Required inputs
    release: 'patch'

    # Optional inputs (uncomment if needed)
    # config: 'release.config.js'
```

### Job Example

Here is how you open a release PR with the bumped version. The push uses a GitHub App token from
[setup-git](./setup-git.md): the default `GITHUB_TOKEN` cannot push changes to workflow files, and PRs it opens do not
trigger other workflows.

```yaml
jobs:
  release-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v7
        with:
          persist-credentials: false

      - name: Set up Git
        id: setup-git
        uses: ApiTreeCZ/github-actions/.github/actions/setup-git@v0.8.1
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
          permission-workflows: 'write' # Only when the config targets workflow files

      - name: Bump version
        id: bump-version
        uses: ApiTreeCZ/github-actions/.github/actions/bump-version@v0.8.1
        with:
          release: ${{ inputs.release }}

      - name: Open release PR
        env:
          GH_TOKEN: ${{ steps.setup-git.outputs.token }}
          TAG: v${{ steps.bump-version.outputs.version }}
        run: |
          git switch -c "release/${TAG}"
          git commit -am "chore(release): ${TAG}"
          git push -u origin "release/${TAG}"
          gh pr create --base main --title "chore(release): ${TAG}" --body "Release ${TAG}."
```

### Release Config

The config is an ES module (`release.config.js`, or `release.config.mjs` in packages without `"type": "module"`)
default-exporting the source of the current version and the references to bump. Paths are relative to the config
file. Every `pattern` must capture the old version in a named group `version`; only that group is replaced, with
`template` (`{version}` is the new `X.Y.Z`). Without the `g` flag only the first match per file is replaced.

```js
export default {
  // Optional, defaults to the root package.json "version".
  source: { file: 'pyproject.toml', pattern: /^version = "(?<version>[^"]+)"/m },

  // Optional, references to bump besides the source.
  targets: [
    {
      files: ['.github/workflows/*.yml', 'docs/**/*.md'],
      pattern: /uses:\s*my-org\/my-actions\/[^@\s]+@(?<version>v\d+\.\d+\.\d+|main)/g,
      template: 'v{version}',
    },
    {
      files: ['README.md'],
      pattern: /Current version: (?<version>\S+)/,
    },
  ],
};
```

The same bump runs locally without GitHub Actions: `node <path-to-action>/index.js <release> [--config <file>]`.

## 📥 Inputs

| Input     | Description                                                                                   | Required |        Default        |
| :-------- | :-------------------------------------------------------------------------------------------- | :------: | :-------------------: |
| `release` | Release type (`major`, `minor`, `patch`) or an explicit version (`X.Y.Z` or `X.Y.Z-pre`)      | **Yes**  |           -           |
| `config`  | Path to the release config file (ES module); its directory is the base for the paths it lists |    No    | `'release.config.js'` |

`major`, `minor` and `patch` follow semver (`1.2.3` → `2.0.0` / `1.3.0` / `1.2.4`). On a prerelease current version
(e.g. `2.0.0-rc.1`) they fail: pass the next version explicitly.

## 📤 Outputs

| Output             | Description                                                               |
| :----------------- | :------------------------------------------------------------------------ |
| `version`          | The new version (`X.Y.Z`)                                                 |
| `previous-version` | The version before the bump (`X.Y.Z`)                                     |
| `files`            | Newline-separated list of changed files, relative to the config directory |

## 🛠️ Details

- **Type**: `node24`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: None
