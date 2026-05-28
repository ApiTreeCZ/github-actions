# ⚙️ Action `[action-name]`

[A brief but descriptive explanation of what this GitHub Action does, what problems it solves, and when to use it.]

## 🚀 Usage

### Step Snippet

```yaml
- name: Setup [Action Name]
  uses: ApiTreeCZ/github-actions/[action-folder-name]@main
  with:
    # Required inputs
    some-required-input: 'value'

    # Optional inputs (uncomment if needed)
    # some-optional-input: 'default-value'
```

### Job Example

Here is how you integrate this action into a job:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run [Action Name]
        uses: ApiTreeCZ/github-actions/[action-folder-name]@main
        with:
          some-required-input: 'value'
```

## 📥 Inputs

| Input                 | Description                       | Required |      Default      |
| :-------------------- | :-------------------------------- | :------: | :---------------: |
| `some-required-input` | Description of the required input | **Yes**  |         -         |
| `some-optional-input` | Description of the optional input |    No    | `'default-value'` |

## 📤 Outputs

| Output             | Description                                |
| :----------------- | :----------------------------------------- |
| `some-output-name` | Description of what this output represents |

## 🛠️ Details

- **Type**: `composite` / `node20` / `docker`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: [e.g. list any third-party actions used, like `actions/setup-node`]
