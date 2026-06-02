# ⚙️ `setup-git`

Set up Git CLI for a bot user with a short-lived token via ApiTree GitHub Actions app and 1Password.

## 🚀 Usage

### Step Snippet

```yaml
- name: Set up Git
  uses: ApiTreeCZ/github-actions/actions/setup-git@main
  with:
    # Required inputs
    op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}

    # Optional inputs (uncomment if needed)
    # permission-contents: 'write'
```

### Job Example

Here is how you integrate this action into a job:

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Set up Git
        id: setup-git
        uses: ApiTreeCZ/github-actions/actions/setup-git@main
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
          permission-contents: 'write' # Optional, defaults to 'write'

      - name: Checkout code
        uses: actions/checkout@v6
        with:
          token: ${{ steps.setup-git.outputs.token }}

      - name: Commit and push changes
        run: |
          git add .
          git commit -m "chore: automated update"
          git push
```

## 📥 Inputs

| Input                      | Description                                                                                            | Required |  Default  |
| :------------------------- | :----------------------------------------------------------------------------------------------------- | :------: | :-------: |
| `op-service-account-token` | 1Password service account token with access to the vault containing ApiTree GitHub Actions app secrets | **Yes**  |     -     |
| `permission-contents`      | The permission level for contents (repository) scope of the token (`read` or `write`)                  |    No    | `'write'` |

## 📤 Outputs

| Output       | Description                                                                          |
| :----------- | :----------------------------------------------------------------------------------- |
| `token`      | The generated GitHub App token for authentication with GitHub API and Git operations |
| `user-name`  | Git username (bot) configured for Git operations                                     |
| `user-email` | Git email (bot) configured for Git operations                                        |

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest` (does not currently support Windows runners due to dependencies)
- **Dependencies**:
  - [load-secrets](../load-secrets)
  - [json-to-outputs](../json-to-outputs)
  - [actions/create-github-app-token](https://github.com/actions/create-github-app-token)
- **Under the hood**:
  - Loads GitHub App credentials from a 1Password vault using [load-secrets](../load-secrets).
  - Parses credentials using [json-to-outputs](../json-to-outputs).
  - Generates a short-lived installation token using [actions/create-github-app-token](https://github.com/actions/create-github-app-token).
  - Configures global Git configurations (username and email) and credentials helper using the token.
