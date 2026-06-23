# ⚙️ `setup-project`

Set up project for CI/CD workflows.

This composite action automatically runs [setup-node](./setup-node.md) to initialize Node.js and `pnpm`, configures Turborepo local & remote cache using [setup-turbo](./setup-turbo.md) (optional), and installs project dependencies with `pnpm install` (optional).

## 🚀 Usage

### Step Snippet

```yaml
- name: Set up project
  uses: ApiTreeCZ/github-actions/.github/actions/setup-project@v0.5.2
  with:
    # Required inputs
    op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}

    # Optional inputs (uncomment if needed)
    # install-deps: 'true'
    # use-turbo: 'true'
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

      - name: Set up project
        uses: ApiTreeCZ/github-actions/.github/actions/setup-project@v0.5.2
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
```

## 📥 Inputs

| Input                      | Description                     | Required | Default  |
| :------------------------- | :------------------------------ | :------: | :------: |
| `op-service-account-token` | 1Password service account token | **Yes**  |    -     |
| `install-deps`             | Whether to install dependencies |    No    | `'true'` |
| `use-turbo`                | Whether to set up Turbo cache   |    No    | `'true'` |

## 📤 Outputs

_This action does not define any outputs._

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**:
  - [setup-node](./setup-node.md)
  - [setup-turbo](./setup-turbo.md)
- **Under the hood**:
  - Initializes Node.js and `pnpm` using [setup-node](./setup-node.md).
  - Sets up Turborepo remote caching using [setup-turbo](./setup-turbo.md) if `use-turbo` is `'true'`.
  - Runs `pnpm install --frozen-lockfile --prefer-offline` if `install-deps` is `'true'`.
