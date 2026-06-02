# ⚙️ `setup-git-action`

Set up Git CLI for a bot user with a short-lived token via ApiTree GitHub Actions app and 1Password.

## 🚀 Usage

### Step Snippet

```yaml
- name: Set up Git
  uses: ApiTreeCZ/github-actions/setup-git-action@v0.1.0
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
      - name: Checkout code
        uses: actions/checkout@v6

      - name: Set up Git
        uses: ApiTreeCZ/github-actions/setup-git-action@v0.1.0
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}

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

_This action does not define any outputs._

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest` (does not currently support Windows runners due to dependencies)
- **Dependencies**:
  - [load-secrets-action](../load-secrets-action)
  - [json-to-outputs-action](../json-to-outputs-action)
  - [actions/create-github-app-token](https://github.com/actions/create-github-app-token)
- **Under the hood**:
  - Loads GitHub App credentials from a 1Password vault using [load-secrets-action](../load-secrets-action).
  - Parses credentials using [json-to-outputs-action](../json-to-outputs-action).
  - Generates a short-lived installation token using [actions/create-github-app-token](https://github.com/actions/create-github-app-token).
  - Configures global Git configurations (username and email) and credentials helper using the token.
