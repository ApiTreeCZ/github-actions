# ⚙️ `setup-turbo-action`

Set up Turbo cache for CI. This action configures local cache retrieval and storage using GitHub Actions caching, and sets up environment variables (`TURBO_API`, `TURBO_TEAM`, `TURBO_TOKEN`, and `TURBO_REMOTE_CACHE_SIGNATURE_KEY`) required for Turbo remote cache server authentication and verification.

## 🚀 Usage

### Step Snippet

```yaml
- name: Set up Turbo
  uses: ApiTreeCZ/github-actions/setup-turbo-action@main
  with:
    # Required inputs
    token: ${{ secrets.TURBO_TOKEN }}
    signature-key: ${{ secrets.TURBO_SIGNATURE_KEY }}

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
        uses: ApiTreeCZ/github-actions/setup-turbo-action@main
        with:
          token: ${{ secrets.TURBO_TOKEN }}
          signature-key: ${{ secrets.TURBO_SIGNATURE_KEY }}
```

## 📥 Inputs

| Input           | Description                                                                   | Required |                                Default                                |
| :-------------- | :---------------------------------------------------------------------------- | :------: | :-------------------------------------------------------------------: |
| `token`         | The token to use for the Turbo remote cache server authentication             | **Yes**  |                                   -                                   |
| `signature-key` | The signature key to verify the integrity of the Turbo remote cache artifacts | **Yes**  |                                   -                                   |
| `dir`           | The directory to use for the Turbo cache                                      |    No    |                              `'.turbo'`                               |
| `cache-key`     | The key to use for the Turbo local cache                                      |    No    | `'turbo-cache-${{ runner.os }}-${{ runner.arch }}-${{ github.sha }}'` |
| `restore-keys`  | The restore keys to use for the Turbo local cache                             |    No    |         `'turbo-cache-${{ runner.os }}-${{ runner.arch }}-'`          |

## 📤 Outputs

_This action does not define any outputs._

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: [actions/cache](https://github.com/actions/cache)
