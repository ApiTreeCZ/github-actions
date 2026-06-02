# ⚙️ `check-unreleased-changesets`

Detects if there are any unreleased Changesets in the repository.

## 🚀 Usage

### Step Snippet

```yaml
- name: Check unreleased Changesets
  id: check-unreleased-changesets
  uses: ApiTreeCZ/github-actions/.github/actions/check-unreleased-changesets@v0.5.0
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

      - name: Check unreleased Changesets
        id: check-unreleased-changesets
        uses: ApiTreeCZ/github-actions/.github/actions/check-unreleased-changesets@v0.5.0
```

## 📥 Inputs

_This action does not require any inputs._

## 📤 Outputs

| Output   | Description                                           |
| :------- | :---------------------------------------------------- |
| `result` | Indicates whether there are any unreleased Changesets |

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: None
