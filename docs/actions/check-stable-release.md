# ⚙️ `check-stable-release`

Checks whether the triggering workflow is a stable release.

## 🚀 Usage

### Step Snippet

```yaml
- name: Check stable release
  uses: ApiTreeCZ/github-actions/.github/actions/check-stable-release@v0.6.2
  with:
    # Optional inputs (uncomment if needed)
    # commit-message: 'chore(main): release'
    # commit-author: 'apitree-github-actions[bot]'
```

### Job Example

Here is how you integrate this action into a job:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v7

      - name: Check stable release
        uses: ApiTreeCZ/github-actions/.github/actions/check-stable-release@v0.6.2
```

## 📥 Inputs

| Input            | Description                                            | Required |             Default             |
| :--------------- | :----------------------------------------------------- | :------: | :-----------------------------: |
| `commit-message` | Exact release commit message used for detection        |    No    |    `'chore(main): release'`     |
| `commit-author`  | Exact username of the commit author used for detection |    No    | `'apitree-github-actions[bot]'` |

## 📤 Outputs

| Output   | Description                                               |
| :------- | :-------------------------------------------------------- |
| `result` | Indicates whether the workflow is a stable release or not |

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: None
