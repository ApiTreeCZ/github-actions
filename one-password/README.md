# ⚙️ Action `one-password`

Exports and injects secrets from 1Password vault(s) securely using a 1Password Service Account. This action maps and resolves 1Password secret references to dynamic step outputs and exports them directly to the runner's environment variables.

## 🚀 Usage

### Step Snippet

```yaml
- name: Load Secrets from 1Password
  uses: ApiTreeCZ/github-actions/one-password@main
  with:
    # Required inputs
    op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
    secrets: |
      MY_SECRET_1=op://vault-name/item-name/field-name
      MY_SECRET_2=op://vault-name/item-name/field-name

    # Optional inputs (uncomment if needed)
    # op-env-file: '.env.example'
    # op-export-env: 'false'
```

### Job Example

Here is how you integrate this action into a job to load secrets as environment variables:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Load Secrets
        uses: ApiTreeCZ/github-actions/one-password@main
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
          secrets: |
            DATABASE_URI=op://apitree-project/production/DATABASE_URI
            API_KEY=op://apitree-project/production/API_KEY

      - name: Use Secrets
        run: |
          echo "Connecting to database at $DATABASE_URI"
```

If you prefer to access them only as step outputs:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Load Secrets
        id: one-password
        uses: ApiTreeCZ/github-actions/one-password@main
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
          op-export-env: 'false'
          secrets: |
            DATABASE_URI=op://apitree-project/production/DATABASE_URI
            API_KEY=op://apitree-project/production/API_KEY

      - name: Use Secrets
        run: |
          echo "API Key is ${{ fromJSON(steps.one-password.outputs.secrets).API_KEY }}"
```

## 📥 Inputs

| Input                      | Description                                                               | Required | Default  |
| :------------------------- | :------------------------------------------------------------------------ | :------: | :------: |
| `secrets`                  | Secrets references in `KEY=VALUE` format, one per line                    | **Yes**  |    -     |
| `op-service-account-token` | 1Password service account token with access to the vault(s)               | **Yes**  |    -     |
| `op-env-file`              | Path to template `.env` file for secrets injection                        |    No    |    -     |
| `op-export-env`            | Whether to export secrets as environment variables (`'true'` / `'false'`) |    No    | `'true'` |

## 📤 Outputs

| Output    | Description                                                         |
| :-------- | :------------------------------------------------------------------ |
| `secrets` | Exported secrets mapped to their values serialized as a JSON string |

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest` (does not currently support Windows runners)
- **Dependencies**: [1password/load-secrets-action](https://github.com/1Password/load-secrets-action)
