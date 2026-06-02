# 🔄 `[workflow-name]`

[A brief but descriptive explanation of what this reusable workflow does, what problems it solves, and when to use it.]

## 🚀 Usage

### Job Snippet

```yaml
[job-id]:
  uses: ApiTreeCZ/github-actions/.github/workflows/[workflow-name].yml@main
  with:
    # Required inputs
    some-required-input: 'value'

    # Optional inputs (uncomment if needed)
    # some-optional-input: 'default-value'
  secrets:
    # Required secrets (uncomment/edit if needed)
    # SOME_SECRET: ${{ secrets.SOME_SECRET }}
```

### Workflow Example

Here is how you call this reusable workflow from another workflow:

```yaml
jobs:
  [job-id]:
    uses: ApiTreeCZ/github-actions/.github/workflows/[workflow-name].yml@main
    with:
      some-required-input: 'value'
```

## 📥 Inputs

| Input                 | Description                       | Required |      Default      |
| :-------------------- | :-------------------------------- | :------: | :---------------: |
| `some-required-input` | Description of the required input | **Yes**  |         -         |
| `some-optional-input` | Description of the optional input |    No    | `'default-value'` |

## 🔑 Secrets

| Secret        | Description                            | Required |
| :------------ | :------------------------------------- | :------: |
| `SOME_SECRET` | Description of what this secret is for | **Yes**  |

## 📤 Outputs

| Output             | Description                                |
| :----------------- | :----------------------------------------- |
| `some-output-name` | Description of what this output represents |

## 🛠️ Details

- **Runs on**: `ubuntu-latest`
- **Dependencies**: [e.g. list any actions or workflows called inside this workflow]
