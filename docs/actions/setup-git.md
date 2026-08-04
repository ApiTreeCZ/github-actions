# ⚙️ `setup-git`

Set up Git CLI for a bot user with a short-lived token via ApiTree GitHub Actions app and 1Password.

## 🚀 Usage

### Step Snippet

```yaml
- name: Set up Git
  uses: ApiTreeCZ/github-actions/.github/actions/setup-git@v0.6.2
  with:
    # Required inputs
    op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}

    # Optional inputs (uncomment if needed)
    # op-client-id-secret: 'apitree-infra/github-actions/CLIENT_ID'
    # op-private-key-secret: 'apitree-infra/github-actions/private-key.pem'
    # permission-contents: 'write'
    # permission-pull-requests: 'write'
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
        uses: ApiTreeCZ/github-actions/.github/actions/setup-git@v0.6.2
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

| Input                      | Description                                                                                            | Required |                     Default                      |
| :------------------------- | :----------------------------------------------------------------------------------------------------- | :------: | :----------------------------------------------: |
| `op-service-account-token` | 1Password service account token with access to the vault containing ApiTree GitHub Actions app secrets | **Yes**  |                        -                         |
| `op-client-id-secret`      | 1Password secret path for the ApiTree GitHub Actions app client ID                                     |    No    |    `'apitree-infra/github-actions/CLIENT_ID'`    |
| `op-private-key-secret`    | 1Password secret path for the ApiTree GitHub Actions app private key                                   |    No    | `'apitree-infra/github-actions/private-key.pem'` |
| `permission-contents`      | The permission level for contents (repository) scope of the token (`read` or `write`)                  |    No    |                    `'write'`                     |
| `permission-pull-requests` | The permission level for pull requests (repository) scope of the token (`read` or `write`)             |    No    |                    `'write'`                     |

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
  - [load-secrets](./load-secrets.md)
  - [json-to-outputs](./json-to-outputs.md)
  - [actions/create-github-app-token](https://github.com/actions/create-github-app-token)
- **Under the hood**:
  - Loads GitHub App credentials from a 1Password vault using [load-secrets](./load-secrets.md).
  - Parses credentials using [json-to-outputs](./json-to-outputs.md).
  - Generates a short-lived installation token using [actions/create-github-app-token](https://github.com/actions/create-github-app-token).
  - Configures global Git configurations (username and email) and credentials helper using the token.
