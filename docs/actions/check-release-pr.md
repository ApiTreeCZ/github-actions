# ⚙️ `check-release-pr`

Checks whether the workflow was triggered by a release PR.

## 🚀 Usage

### Step Snippet

```yaml
- name: Check release PR
  id: check-release-pr
  uses: ApiTreeCZ/github-actions/.github/actions/check-release-pr@v0.4.0
  with:
    # Optional inputs (uncomment if needed)
    # branch-name: 'release/main'
```

### Job Example

Here is how you integrate this action into a job:

```yaml
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6

      - name: Check release PR
        id: check-release-pr
        uses: ApiTreeCZ/github-actions/.github/actions/check-release-pr@v0.4.0
```

## 📥 Inputs

| Input         | Description                                    | Required |     Default      |
| :------------ | :--------------------------------------------- | :------: | :--------------: |
| `branch-name` | Name or pattern matching the release PR branch |    No    | `'release/main'` |

## 📤 Outputs

| Output   | Description                                                  |
| :------- | :----------------------------------------------------------- |
| `result` | Indicates whether the workflow was triggered by a release PR |

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: None
