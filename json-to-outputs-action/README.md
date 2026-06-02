# ⚙️ `json-to-outputs-action`

Parses a JSON string and dynamically exposes each key-value pair as individual output variables on the step.

## 🚀 Usage

### Step Snippet

```yaml
- name: Parse JSON to Outputs
  id: parse-json
  uses: ApiTreeCZ/github-actions/json-to-outputs-action@v0.1.0
  with:
    # Required inputs
    json: ${{ steps.some-step.outputs.some-json }}
```

### Job Example

Here is how you integrate this action into a job to parse 1Password secrets JSON:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Load secrets
        id: load-secrets
        uses: ApiTreeCZ/github-actions/load-secrets-action@v0.1.0
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
          secrets: |
            DATABASE_URI=op://apitree-project/production/DATABASE_URI
            API_KEY=op://apitree-project/production/API_KEY

      - name: Parse secrets JSON to outputs
        id: parse-secrets
        uses: ApiTreeCZ/github-actions/json-to-outputs-action@v0.1.0
        with:
          json: ${{ steps.load-secrets.outputs.secrets }}

      - name: Use secrets
        run: |
          echo "API Key is ${{ steps.parse-secrets.outputs.API_KEY }}"
          echo "DB URI is ${{ steps.parse-secrets.outputs.DATABASE_URI }}"
```

## 📥 Inputs

| Input  | Description          | Required | Default |
| :----- | :------------------- | :------: | :-----: |
| `json` | JSON string to parse | **Yes**  |    -    |

## 📤 Outputs

Exposes outputs dynamically. Each key parsed from the input JSON will be registered as an individual output (e.g. `${{ steps.parse-json.outputs.KEY }}`).

## 🛠️ Details

- **Type**: `node24`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: None
