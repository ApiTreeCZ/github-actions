# AGENTS.md

This repository contains reusable GitHub Actions and Workflows for ApiTree projects. It is structured as a monorepo containing multiple composite GitHub Actions and reusable workflows.

## Repository Tech Stack

- **Node.js**: `v24` (strict engine)
- **Package Manager**: `pnpm` `v10`
- **Linting & Formatting**: ESlint (`eslint.config.js`) and Prettier (`prettier.config.js`)

## Project Structure

Each action is placed in its own folder under `.github/actions/` (e.g., `.github/actions/[name]/`).

- `.github/actions/[name]/`: Folders containing composite GitHub Actions (each with an `action.yml`).
- `.github/workflows/`: Reusable workflows and repository CI workflows (like `preflight.yml` and `ci.yml`).
- `docs/actions/[name].md`: Individual documentation files for each action.
- `docs/workflows/[name].md`: Individual documentation files for each reusable workflow.
- `docs/README.md`: Entry point documenting and linking all actions and workflows.
- `docs/ACTION_README_TEMPLATE.md`: Template for generating individual action documentation.
- `docs/WORKFLOW_README_TEMPLATE.md`: Template for generating individual reusable workflow documentation.

## Custom Agent Skills

This repository includes custom agent instructions/skills in `.agents/`:

- **[create-action](./.agents/skills/create-action/SKILL.md)**: Use this skill when asked to create/scaffold a new reusable GitHub Action. It walks you through metadata collection, folder creation, and template validation.
- **[release](./.agents/skills/release/SKILL.md)**: Use this skill when asked to release a new version of the repository. It bumps the version in `package.json` and READMEs, commits, tags, and pushes to remote.

## Development Workflows

When editing or creating code/config in this repository, always run these commands to ensure style, lint compliance, and functionality:

- **Lint checks**: `pnpm run lint`
- **Formatting checks**: `pnpm run format`
- **Auto-fix code/lint issues**: `pnpm run fix`
- **Run tests**: `pnpm run test`

## Constraints & Rules

1. **GitHub Actions Format**: All actions should be composite actions unless explicitly instructed otherwise.
2. **Workflow Snippets**: In action/workflow `README.md` files, do NOT include `name:` or `on:` top-level triggers in example code snippets. Focus purely on job/step context.
3. **Commit Messages**: Follow Conventional Commits format (`type(scope): message`) and document changes using Changesets.
4. **No Absolute Paths**: Never use absolute file paths (e.g., `file:///Users/...`) in documentation. Always use relative repository paths (e.g., `./[action-name]`, `../[action-name]`).
