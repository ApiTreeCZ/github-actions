# ⚙️ `collect-release-info`

Collects release information from the Changesets versioning process. It parses modified `CHANGELOG.md` files, extracts the latest changes, categorizes them by bump type (major, minor, patch), and outputs a formatted summary suitable for a GitHub release or Pull Request body.

## 🚀 Usage

### Step Snippet

```yaml
- name: Collect Release Info
  id: release-info
  uses: ApiTreeCZ/github-actions/actions/collect-release-info@v0.2.0
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
        with:
          fetch-depth: 0

      - name: Collect Release Info
        id: release-info
        uses: ApiTreeCZ/github-actions/actions/collect-release-info@v0.2.0

      - name: Create Release PR
        uses: peter-evans/create-pull-request@v6
        with:
          title: 'Version Packages'
          body: ${{ steps.release-info.outputs.result }}
```

## 📥 Inputs

_This action does not accept any inputs._

## 📤 Outputs

| Output   | Description                                                                                           |
| :------- | :---------------------------------------------------------------------------------------------------- |
| `result` | The formatted markdown containing the release summary categorized by major, minor, and patch changes. |

## 🛠️ Details

- **Type**: `node24`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: None
