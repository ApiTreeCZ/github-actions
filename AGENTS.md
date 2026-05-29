# AGENTS.md

Welcome! This repository contains reusable GitHub Actions for ApiTree projects. It is structured as a monorepo containing multiple composite GitHub Actions.

## Repository Tech Stack

- **Node.js**: `v24` (strict engine)
- **Package Manager**: `pnpm` `v10`
- **Linting & Formatting**: ESlint (`eslint.config.js`) and Prettier (`prettier.config.js`)

## Project Structure

Each action is placed in its own folder under the repository root (e.g., `[name]-action/`).

- `load-secrets-action/`: Injects/loads secrets from 1Password.
- `parse-secrets-action/`: Helper to parse JSON secrets into outputs.
- `setup-node-action/`: Installs Node.js & configures `pnpm` with caching.
- `setup-turbo-action/`: Configures Turborepo local caching.
- `docs/ACTION_README_TEMPLATE.md`: Template for generating individual action documentation.

## Custom Agent Skills

This repository includes custom agent instructions/skills in `.agents/`:

- **[create-action](file:///Users/vitrozsival/projects/apitree/github-actions/.agents/skills/create-action/SKILL.md)**: Use this skill when asked to create/scaffold a new reusable GitHub Action. It walks you through metadata collection, folder creation, and template validation.

## Development Workflows

When editing or creating code/config in this repository, always run these commands to ensure style and lint compliance:

- **Lint checks**: `pnpm run lint`
- **Formatting checks**: `pnpm run format`
- **Auto-fix code/lint issues**: `pnpm run fix`

## Constraints & Rules

1. **GitHub Actions Format**: All actions should be composite actions unless explicitly instructed otherwise.
2. **Workflow Snippets**: In action `README.md` files, do NOT include `name:` or `on:` top-level triggers in example code snippets. Focus purely on job/step context.
3. **Commit Messages**: Follow Conventional Commits format (`type(scope): message`) and document changes using Changesets.
