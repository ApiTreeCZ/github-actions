# ⚙️ `turbo-run`

Run Turbo task with controlled concurrency and no telemetry.

## 🚀 Usage

### Step Snippet

```yaml
- name: Build with Turbo
  uses: ApiTreeCZ/github-actions/.github/actions/turbo-run@v0.6.2
  with:
    # Required inputs
    task: 'build'

    # Optional inputs (uncomment if needed)
    # turbo-bin: 'pnpx turbo'
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
        uses: ApiTreeCZ/github-actions/.github/actions/turbo-run@v0.6.2
        with:
          task: 'build'
          concurrency: '5'
          turbo-bin: 'npx turbo'
```

## 📥 Inputs

| Input         | Description                                        | Required |    Default     |
| :------------ | :------------------------------------------------- | :------: | :------------: |
| `task`        | The Turbo task to run                              | **Yes**  |       -        |
| `concurrency` | Controls number of Turbo tasks running in parallel |    No    |     `'10'`     |
| `turbo-bin`   | The command to run the Turbo CLI                   |    No    | `'pnpx turbo'` |

## 📤 Outputs

_This action does not define any outputs._

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: None
