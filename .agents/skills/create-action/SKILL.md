---
name: create-action
description: >-
  Prompts the user to define a new GitHub Action (name, description, inputs, and outputs),
  and bootstraps the action's folder with a validated `action.yml` and a standard `README.md`.
---

# Create GitHub Action

This skill automates the creation of a new reusable GitHub Action in the repository. It prompts the user for action metadata, validates their choices, and generates both the `action.yml` configuration and a beautifully formatted `README.md` conforming to the organization's standard template.

## Workflow

### 1. Collect Action Metadata

Ask the user for the following details. You can ask directly or suggest a standard prompt/form. If the user provides a partial response, clarify the missing parts.

1. **Action Name**: The human-readable name of the action (e.g. `Deploy to Staging`, `Setup Node.js`).
2. **Action Description**: A short description of what the action does.
3. **Inputs (Optional)**: For each input, collect:
   - Name (e.g. `node-version`)
   - Description
   - Required status (`true` / `false`)
   - Default value (optional)
4. **Outputs (Optional)**: For each output, collect:
   - Name (e.g. `cache-hit`)
   - Description

### 2. Scaffold Action Directory

- **Folder Name**: Construct a kebab-case directory name from the Action Name (e.g., `Setup Node.js` -> `setup-node`).
- **Path**: Create this directory under `.github/actions/`: `.github/actions/[folder-name]/`.

### 3. Generate action.yml

Generate the `action.yml` file under `.github/actions/[folder-name]/action.yml` with the following structure:

```yaml
name: [Action Name]
description: [Action Description]

inputs:
  # (List inputs if any are defined)
  some-input:
    description: 'Description here'
    required: true
    default: 'default-value'

outputs:
  # (List outputs if any are defined)
  some-output:
    description: 'Description here'

runs:
  using: composite
  steps:
    - name: [Action Name]
      # Placeholder step - user will replace this with their actual steps
```

### 4. Generate README.md

Generate the action's documentation file under `docs/actions/[folder-name].md` based on the organization's template.

- **Important**: Read the organization template from `docs/ACTION_README_TEMPLATE.md` to ensure any recent layout changes are respected.
- **Note**: Do NOT include `name:` or `on:` triggers in any workflow code examples. Keep examples focused on the job or step context.
- Populate the Inputs and Outputs sections using Markdown tables:
  - For inputs: `| Input | Description | Required | Default |`
  - For outputs: `| Output | Description |`
  - If there are no inputs/outputs, replace the tables with a friendly paragraph explaining that there are none.
- **Entrypoint**: Update `docs/README.md` to register the new action in the list of Available Actions.

## Validation Checklist

Before finishing, verify:

- [ ] Folder name is kebab-cased.
- [ ] `action.yml` is valid YAML.
- [ ] `README.md` uses the correct template and contains tables for inputs/outputs.
- [ ] No `name:` or `on:` triggers are present in the `README.md` YAML code snippets.
