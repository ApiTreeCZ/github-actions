# ⚙️ `setup-node`

Set up [Node.js](https://nodejs.org/en) with [pnpm](https://pnpm.io/) as the package manager (cache enabled).

## 🚀 Usage

### Step Snippet

```yaml
- name: Set up Node.js
  uses: ApiTreeCZ/github-actions/.github/actions/setup-node@v0.6.3
```

### Job Example

Here is how you integrate this action into a job:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Set up Node.js
        uses: ApiTreeCZ/github-actions/.github/actions/setup-node@v0.6.3

      - name: Install dependencies
        run: pnpm install
```

## 📥 Inputs

_This action does not accept any inputs. It automatically resolves the Node.js version from the root `package.json` file via the `node-version-file` configuration._

## 📤 Outputs

_This action does not define any outputs._

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Under the hood**:
  - Sets up `pnpm` using [pnpm/action-setup](https://github.com/pnpm/action-setup).
  - Sets up `Node.js` using [actions/setup-node](https://github.com/actions/setup-node) with `pnpm` cache enabled and `node-version-file` pointing to `package.json`.
