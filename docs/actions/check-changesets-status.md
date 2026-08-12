# ⚙️ `check-changesets-status`

Checks the presence of Changesets on a PR branch and reports the status by adding a comment (or updating an existing one) on the pull request.

This action runs `changeset status --since=<origin-ref>` to determine if the changes on the branch require a package bump. If no changesets are found but changes are present, it leaves a warning comment on the PR; otherwise, it lists the package bumps that will happen.

## 🚀 Usage

### Step Snippet

```yaml
- name: Check Changesets Status
  uses: ApiTreeCZ/github-actions/.github/actions/check-changesets-status@v0.6.5
  with:
    # Optional inputs (uncomment if needed)
    # before-script: ''
    # changeset-bin: 'pnpx @changesets/cli'
    # origin-ref: 'origin/main'
```

### Job Example

Here is how you integrate this action into a PR check workflow:

```yaml
jobs:
  check-changesets:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write # Required to comment on pull requests
    steps:
      - name: Checkout code
        uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - name: Check Changesets status
        uses: ApiTreeCZ/github-actions/.github/actions/check-changesets-status@v0.6.5
```

## 📥 Inputs

| Input           | Description                                              | Required |         Default          |
| :-------------- | :------------------------------------------------------- | :------: | :----------------------: |
| `before-script` | The command to run before checking the Changesets status |    No    |           `''`           |
| `changeset-bin` | The command to run the Changesets CLI                    |    No    | `'pnpx @changesets/cli'` |
| `origin-ref`    | The Git ref to compare the Changesets status against     |    No    |     `'origin/main'`      |

## 📤 Outputs

| Output             | Description                                               |
| :----------------- | :-------------------------------------------------------- |
| `result`           | Indicates whether there are Changesets present in the PR  |
| `changeset-status` | The output of the Changesets status command               |
| `since-ref`        | The Git ref used to compare the Changesets status against |

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**:
  - [setup-node](./setup-node.md)
  - [thollander/actions-comment-pull-request](https://github.com/thollander/actions-comment-pull-request)
- **Under the hood**:
  - Checks out the branch (relies on `actions/checkout` having been run).
  - Sets up the Node.js project environment using [setup-node](./setup-node.md).
  - Runs the script specified in `before-script` if provided.
  - Checks for the presence of changesets comparing against `origin-ref` using the Changesets status command.
  - Adds or updates a pull request comment indicating whether changesets are present or missing.
