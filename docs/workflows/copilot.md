# 🔄 `copilot`

Automatically approves Renovate bot dependency update pull requests using GitHub Copilot after CI checks pass.

## 🚀 Usage

### Workflow Snippet

```yaml
copilot:
  uses: ApiTreeCZ/github-actions/.github/workflows/copilot.yml@v0.6.5
  secrets:
    OP_APITREE_INFRA_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_APITREE_INFRA_SERVICE_ACCOUNT_TOKEN }}
```

### Workflow Example

Include this reusable workflow in your CI to auto-approve safe dependency updates:

```yaml
jobs:
  copilot:
    uses: ApiTreeCZ/github-actions/.github/workflows/copilot.yml@v0.6.5
    secrets:
      OP_APITREE_INFRA_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_APITREE_INFRA_SERVICE_ACCOUNT_TOKEN }}
    env:
      # Optional override of the default pattern for CI checks to wait for before Copilot approval.
      WAIT_FOR_CHECKS_MATCH_PATTERN: '^(build|lint|test)$'
```

## 📥 Inputs

This workflow does not accept any inputs.

## 🔑 Secrets

| Secret                                   | Description                                                           |
| :--------------------------------------- | :-------------------------------------------------------------------- |
| `OP_APITREE_INFRA_SERVICE_ACCOUNT_TOKEN` | 1Password service account token with access to GitHub Actions secrets |

## 📤 Outputs

This workflow does not expose any outputs.

## 🛠️ Details

- **Triggers**: Pull requests targeting `main`, or via `workflow_call`.
- **Runs on**: `ubuntu-latest`
- **Concurrency**: Groups by workflow and ref; cancels in-progress runs.
- **How it works**:
  1. Waits for CI checks (`commitlint`, `manypkg`, `eslint`, `tsc`, `prettier`, `qa`, `test`) to pass.
  2. If the PR author is `renovate[bot]` and all checks succeeded, authenticates `gh` CLI with a Copilot token.
  3. Prompts Copilot to analyze the PR and approve it if it contains only non-major dependency updates.
- **Dependencies**:
  - `poseidon/wait-for-status-checks@v0.7.0`
  - `actions/checkout@v7`
  - [`setup-project`](../actions/setup-project.md)
  - [`load-secrets`](../actions/load-secrets.md)
  - [`json-to-outputs`](../actions/json-to-outputs.md)
  - [`copilot`](../actions/copilot.md)
