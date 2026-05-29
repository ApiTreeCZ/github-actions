# ⚙️ `load-secrets-action`

Exports and injects secrets from 1Password vault(s) securely using a 1Password Service Account.

## 🚀 Usage

### Step Snippet

```yaml
- name: Load Secrets from 1Password
  uses: ApiTreeCZ/github-actions/load-secrets-action@main
  with:
    # Required inputs
    op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
    secrets: |
      MY_SECRET_1=op://vault-name/item-name/field-name
      MY_SECRET_2=op://vault-name/item-name/field-name

    # Optional inputs (uncomment if needed)
    # op-env-file: '.env.example'
    # export-env: 'true'
```

### Job Example

Here is how you integrate this action into a job using the recommended secure pattern:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Load Secrets
        id: load-secrets
        uses: ApiTreeCZ/github-actions/load-secrets-action@main
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
          secrets: |
            DATABASE_URI=op://apitree-project/production/DATABASE_URI
            API_KEY=op://apitree-project/production/API_KEY

      - name: Parse Secrets to Outputs
        id: parse-secrets
        uses: ApiTreeCZ/github-actions/parse-secrets-action@main
        with:
          json: ${{ steps.load-secrets.outputs.secrets }}

      - name: Use Secrets
        run: |
          echo "Connecting to database at ${{ steps.parse-secrets.outputs.DATABASE_URI }}"
```

### Environment Variable Exporting (`export-env`)

By default, `export-env` is `'false'`. If you need to export secrets directly to the runner's environment variables, you can configure it in three ways:

- **Export all secrets:** Set `export-env: 'true'` to export all loaded secrets directly to the job environment.
- **Export specific secrets:** Provide a multi-line list of specific secret keys to export only those select secrets:
  ```yaml
  with:
    export-env: |
      DATABASE_URI
      API_KEY
  ```
- **Disable all exports (Default):** Leave it unset or set it to `'false'`. Secrets will be accessible only via step outputs.

> [!WARNING]
> Keep in mind exporting secrets to environment variables makes them available to **all** subsequent steps of the CI job. **Use with caution.**

## 📥 Inputs

| Input                      | Description                                                                                                                      | Required |  Default  |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :------: | :-------: |
| `secrets`                  | Secrets references in `KEY=VALUE` format, one per line                                                                           | **Yes**  |     -     |
| `export-env`               | Whether to export secrets as environment variables. Can be `'true'`, `'false'`, or a multi-line list of specific keys to export. |    No    | `'false'` |
| `op-service-account-token` | 1Password service account token with access to the vault(s)                                                                      | **Yes**  |     -     |
| `op-env-file`              | Path to template `.env` file for secrets injection                                                                               |    No    |     -     |

## 📤 Outputs

| Output    | Description                                                         |
| :-------- | :------------------------------------------------------------------ |
| `secrets` | Exported secrets mapped to their values serialized as a JSON string |

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest` (does not currently support Windows runners)
- **Dependencies**: [1password/load-secrets-action](https://github.com/1Password/load-secrets-action)
