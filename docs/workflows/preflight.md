# 🔄 `preflight`

Preflight checks that determine if the release process should proceed by validating Changesets, release PR status, stable release state, and event triggers.

## 🚀 Usage

### Job Snippet

```yaml
preflight:
  uses: ApiTreeCZ/github-actions/.github/workflows/preflight.yml@v0.4.0
```

### Workflow Example

Here is how you call this reusable workflow and use its outputs to conditionally run subsequent jobs:

```yaml
jobs:
  preflight:
    uses: ApiTreeCZ/github-actions/.github/workflows/preflight.yml@v0.4.0

  release:
    needs: preflight
    if: ${{ needs.preflight.outputs.should-release == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      # Add your release steps here
```

## 📥 Inputs

This workflow does not accept any inputs.

## 🔑 Secrets

This workflow does not require any secrets.

## 📤 Outputs

| Output              | Description                                                  |
| :------------------ | :----------------------------------------------------------- |
| `has-changesets`    | Indicates whether there are any unreleased Changesets        |
| `is-stable-release` | Indicates whether the workflow is a stable release or not    |
| `is-release-pr`     | Indicates whether the workflow was triggered by a release PR |
| `should-release`    | Indicates whether the release process should proceed         |

## 🛠️ Details

- **Runs on**: `ubuntu-latest`
- **Dependencies**:
  - `actions/checkout@v6`
  - [`check-unreleased-changesets`](../actions/check-unreleased-changesets.md)
  - [`check-stable-release`](../actions/check-stable-release.md)
  - [`check-release-pr`](../actions/check-release-pr.md)
