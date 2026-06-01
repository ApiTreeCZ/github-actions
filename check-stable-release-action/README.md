# ⚙️ `check-stable-release-action`

Checks whether the triggering workflow is a stable release.

## 🚀 Usage

### Step Snippet

```yaml
- name: Check stable release
  uses: ApiTreeCZ/github-actions/check-stable-release-action@main
  with:
    # Optional inputs (uncomment if needed)
    # commit-message: 'chore(main): release'
    # commit-author: 'github-actions[bot]'
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

      - name: Check stable release
        uses: ApiTreeCZ/github-actions/check-stable-release-action@main
```

## 📥 Inputs

| Input            | Description                                            | Required |         Default          |
| :--------------- | :----------------------------------------------------- | :------: | :----------------------: |
| `commit-message` | Exact release commit message used for detection        |    No    | `'chore(main): release'` |
| `commit-author`  | Exact username of the commit author used for detection |    No    | `'github-actions[bot]'`  |

## 📤 Outputs

| Output   | Description                                               |
| :------- | :-------------------------------------------------------- |
| `result` | Indicates whether the workflow is a stable release or not |

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: None
