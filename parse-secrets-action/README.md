# ⚙️ `parse-secrets-action`

Parses a JSON secrets string and dynamically exposes each key-value pair as individual output variables on the step.

## 🚀 Usage

### Step Snippet

```yaml
- name: Parse Secrets
  id: parse-secrets
  uses: ApiTreeCZ/github-actions/parse-secrets-action@main
  with:
    # Required inputs
    json: ${{ steps.load-secrets.outputs.secrets }}
```

### Job Example

Here is how you integrate this action into a job:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6

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
          echo "API Key is ${{ steps.parse-secrets.outputs.API_KEY }}"
          echo "DB URI is ${{ steps.parse-secrets.outputs.DATABASE_URI }}"
```

## 📥 Inputs

| Input  | Description            | Required | Default |
| :----- | :--------------------- | :------: | :-----: |
| `json` | JSON string of secrets | **Yes**  |    -    |

## 📤 Outputs

Exposes outputs dynamically. Each key parsed from the input JSON will be registered as an individual output (e.g. `${{ steps.parse-secrets.outputs.KEY }}`).

## 🛠️ Details

- **Type**: `node24`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
