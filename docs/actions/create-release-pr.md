# ⚙️ `create-release-pr`

Creates a release Pull Request (PR) with collected release info from Changesets.

This action automatically configures Git using [setup-git](./setup-git.md) (authenticating via a 1Password service account token) and then uses `peter-evans/create-pull-request` to create or update a release branch and open the release PR.

## 🚀 Usage

### Step Snippet

```yaml
- name: Create Release PR
  uses: ApiTreeCZ/github-actions/.github/actions/create-release-pr@main
  with:
    # Required inputs
    op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
    body: ${{ steps.release-info.outputs.result }}

    # Optional inputs (uncomment if needed)
    # title: 'chore(main): release'
    # branch: 'release/main'
    # base: 'main'
    # commit-message: 'chore(main): release'
    # labels: 'release,automated'
```

### Job Example

Here is how you integrate this action into a release workflow:

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Collect Release Info
        id: release-info
        uses: ApiTreeCZ/github-actions/.github/actions/collect-release-info@main

      - name: Create Release PR
        uses: ApiTreeCZ/github-actions/.github/actions/create-release-pr@main
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
          body: ${{ steps.release-info.outputs.result }}
```

## 📥 Inputs

| Input                      | Description                                                           | Required |         Default          |
| :------------------------- | :-------------------------------------------------------------------- | :------: | :----------------------: |
| `op-service-account-token` | 1Password service account token with access to GitHub Actions secrets | **Yes**  |            -             |
| `body`                     | The body of the release PR                                            | **Yes**  |            -             |
| `title`                    | The title of the release PR                                           |    No    | `'chore(main): release'` |
| `branch`                   | The branch name for the release PR                                    |    No    |     `'release/main'`     |
| `base`                     | The base branch for the release PR                                    |    No    |         `'main'`         |
| `commit-message`           | The commit message for the release PR                                 |    No    | `'chore(main): release'` |
| `labels`                   | Labels to add to the release PR (comma-separated)                     |    No    |            -             |

## 📤 Outputs

| Output      | Description                          |
| :---------- | :----------------------------------- |
| `pr-number` | The number of the created release PR |
| `pr-url`    | The URL of the created release PR    |

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest` (does not currently support Windows runners due to dependencies)
- **Dependencies**:
  - [setup-git](./setup-git.md)
  - [actions/checkout](https://github.com/actions/checkout)
  - [peter-evans/create-pull-request](https://github.com/peter-evans/create-pull-request)
- **Under the hood**:
  - Configures global Git configurations using [setup-git](./setup-git.md).
  - Checks out the repository with the generated token.
  - Generates a release with `changeset version` command.
  - Collects release information using [collect-release-info](./collect-release-info.md).
  - Uses `peter-evans/create-pull-request` to create or update a release branch and open the release PR.
