# ⚙️ `turbo-run-action`

Run Turbo task with controlled concurrency and no telemetry.

## 🚀 Usage

### Step Snippet

```yaml
- name: Build with Turbo
  uses: ApiTreeCZ/github-actions/turbo-run-action@main
  with:
    # Required inputs
    task: 'build'

    # Optional inputs (uncomment if needed)
    # runner: 'pnpm turbo run'
    # concurrency: '10'
```

### Job Example

Here is how you integrate this action into a job with custom runner and concurrency settings:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6

      - name: Build with Turbo
        uses: ApiTreeCZ/github-actions/turbo-run-action@main
        with:
          task: 'build'
          concurrency: '5'
          runner: 'npx turbo run'
```

## 📥 Inputs

| Input         | Description                                        | Required |      Default       |
| :------------ | :------------------------------------------------- | :------: | :----------------: |
| `task`        | The Turbo task to run                              | **Yes**  |         -          |
| `concurrency` | Controls number of Turbo tasks running in parallel |    No    |       `'10'`       |
| `runner`      | Script to use for invoking `turbo run` tasks       |    No    | `'pnpm turbo run'` |

## 📤 Outputs

_This action does not define any outputs._

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: None
