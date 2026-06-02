# ⚙️ `setup-turbo`

Set up Turbo cache for CI. This action configures local cache retrieval and storage using GitHub Actions caching, and sets up environment variables (`TURBO_API`, `TURBO_TEAM`, `TURBO_TOKEN`, and `TURBO_REMOTE_CACHE_SIGNATURE_KEY`) required for Turbo remote cache server authentication and verification.

## 🚀 Usage

### Step Snippet

```yaml
- name: Set up Turbo
  uses: ApiTreeCZ/github-actions/.github/actions/setup-turbo@v0.5.1
  with:
    # Required inputs
    op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}

    # Optional inputs (uncomment if needed)
    # dir: '.turbo'
    # cache-key: 'turbo-cache-${{ runner.os }}-${{ runner.arch }}-${{ github.sha }}'
    # restore-keys: 'turbo-cache-${{ runner.os }}-${{ runner.arch }}-'
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

      - name: Set up Turbo
        uses: ApiTreeCZ/github-actions/.github/actions/setup-turbo@v0.5.1
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
```

## 📥 Inputs

| Input                      | Description                                                                       | Required |                                Default                                |
| :------------------------- | :-------------------------------------------------------------------------------- | :------: | :-------------------------------------------------------------------: |
| `op-service-account-token` | 1Password service account token with access to the vault containing Turbo secrets | **Yes**  |                                   -                                   |
| `dir`                      | The directory to use for the Turbo cache                                          |    No    |                              `'.turbo'`                               |
| `cache-key`                | The key to use for the Turbo local cache                                          |    No    | `'turbo-cache-${{ runner.os }}-${{ runner.arch }}-${{ github.sha }}'` |
| `restore-keys`             | The restore keys to use for the Turbo local cache                                 |    No    |         `'turbo-cache-${{ runner.os }}-${{ runner.arch }}-'`          |

## 📤 Outputs

_This action does not define any outputs._

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: [actions/cache](https://github.com/actions/cache)
