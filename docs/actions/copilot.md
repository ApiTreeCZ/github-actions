# ⚙️ `copilot`

Runs the `@github/copilot` CLI programmatically in a workflow step. Installs the CLI, authenticates with a token, executes the prompt, and then runs a custom command to process the output (e.g. writing to `$GITHUB_STEP_SUMMARY` or an output file).

## 🚀 Usage

### Step Snippet

```yaml
- name: Run Copilot CLI
  uses: ApiTreeCZ/github-actions/.github/actions/copilot@main
  with:
    prompt: 'Summarize the changes in this PR'
    output-cmd: 'cat summary.md >> "$GITHUB_STEP_SUMMARY"'

    # Optional inputs (uncomment if needed)
    # args: '--allow-tool=shell(git:*) --allow-tool=write'
    # token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

### Job Example

Here is how you integrate this action into a job:

```yaml
jobs:
  daily-summary:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Run Copilot CLI
        uses: ApiTreeCZ/github-actions/.github/actions/copilot@main
        with:
          prompt: 'Review the git log and write a bullet-point summary of today changes to summary.md'
          output-cmd: 'cat summary.md >> "$GITHUB_STEP_SUMMARY"'
          args: '--allow-tool=shell(git:*) --allow-tool=write'
```

## 📥 Inputs

| Input    | Description                                      | Required |             Default              |
| :------- | :----------------------------------------------- | :------: | :------------------------------: |
| `prompt` | The prompt to pass to the Copilot CLI            | **Yes**  |                -                 |
| `args`   | Additional CLI flags (e.g. `--allow-tool=write`) |    No    |               `''`               |
| `token`  | GitHub token for Copilot authentication          |    No    | `${{ github.token }}` (implicit) |

## 📤 Outputs

This action does not define explicit outputs. Use `output-cmd` to write results to files, step summaries, or GitHub outputs as needed.

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: `ApiTreeCZ/github-actions/.github/actions/setup-node@main` (for Node.js + pnpm; `pnpx` invokes `@github/copilot`)
