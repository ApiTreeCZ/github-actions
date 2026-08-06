# ⚙️ `copilot`

Runs the `@github/copilot` CLI programmatically in a workflow step. Installs the CLI, authenticates with a token, executes the prompt, and then runs a custom command to process the output (e.g. writing to `$GITHUB_STEP_SUMMARY` or an output file).

## 🚀 Usage

### Step Snippet

```yaml
- name: Run Copilot CLI
  uses: ApiTreeCZ/github-actions/.github/actions/copilot@v0.6.4
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
        uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - name: Run Copilot CLI
        uses: ApiTreeCZ/github-actions/.github/actions/copilot@v0.6.4
        with:
          prompt: 'Review the git log and write a bullet-point summary of today changes to summary.md'
          output-cmd: 'cat summary.md >> "$GITHUB_STEP_SUMMARY"'
          args: '--allow-tool=shell(git:*) --allow-tool=write'
```

## 📥 Inputs

| Input        | Description                                                 | Required |             Default              |
| :----------- | :---------------------------------------------------------- | :------: | :------------------------------: |
| `prompt`     | The prompt to pass to the Copilot CLI                       | **Yes**  |                -                 |
| `args`       | Additional CLI flags (e.g. `--allow-tool=write`)            |    No    |               `''`               |
| `output-cmd` | Command to run after Copilot finishes to process its result |    No    |               `''`               |
| `token`      | GitHub token for Copilot authentication                     |    No    | `${{ github.token }}` (implicit) |

## 📤 Outputs

This action does not define explicit outputs. Use `output-cmd` to write results to files, step summaries, or GitHub outputs as needed.

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest`, `windows-latest`
- **Dependencies**: [setup-node](./setup-node.md)
- **Under the hood**:
  - Sets up Node.js and pnpm using [setup-node](./setup-node.md).
  - Invokes `@github/copilot` via `pnpm dlx` with the given prompt and arguments.
  - Runs the `output-cmd` after Copilot finishes to process results.

## ⚠️ Notes

- `prompt` is passed to the CLI through an environment variable, so backticks, `$(...)` and quotes inside it are sent verbatim instead of being expanded by the shell.
- `args` is expanded straight into the command line, so quote any flag containing shell metacharacters: `args: "--allow-tool='shell(gh:*)'"`.
- Copilot runs with `--no-ask-user`, so every tool it may use has to be allow-listed via `args`. A `shell(<cmd>:*)` rule is matched against the command name, so commands prefixed with an environment variable assignment (`PAGER=cat gh ...`) match no rule and fail with `Permission denied and could not request permission from user`. The action already exports `PAGER`, `GH_PAGER` and `GIT_PAGER` as `cat` to remove the most common reason for such a prefix.
- The `token` input only authenticates Copilot itself and must carry the **Copilot Requests** permission. Tools that Copilot invokes (e.g. `gh`) use whatever credentials the runner already has.
