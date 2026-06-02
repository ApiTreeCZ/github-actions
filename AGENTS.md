# AGENTS.md

This repository contains reusable GitHub Actions for ApiTree projects. It is structured as a monorepo containing multiple composite GitHub Actions.

## Repository Tech Stack

- **Node.js**: `v24` (strict engine)
- **Package Manager**: `pnpm` `v10`
- **Linting & Formatting**: ESlint (`eslint.config.js`) and Prettier (`prettier.config.js`)

## Project Structure

Each action is placed in its own folder under `actions/` (e.g., `actions/[name]/`).

- `actions/check-release-pr/`: Checks whether the workflow was triggered by a release PR.
- `actions/check-stable-release/`: Checks whether the triggering workflow is a stable release.
- `actions/check-unreleased-changesets/`: Detects if there are any unreleased Changesets in the repository.
- `actions/collect-release-info/`: Collects release information from the Changesets versioning process.
- `actions/create-release-pr/`: Creates a release PR with collected release info from Changesets.
- `actions/create-release-tags/`: Creates Git tags for the new release based on the Changesets versioning.
- `actions/json-to-outputs/`: Helper to parse a JSON string into individual step outputs.
- `actions/load-secrets/`: Injects and loads secrets from 1Password vaults securely.
- `actions/setup-git/`: Sets up Git CLI for a bot user with a short-lived token.
- `actions/setup-node/`: Installs Node.js and configures `pnpm` package manager with caching.
- `actions/setup-turbo/`: Configures Turborepo local & remote cache for build optimization in CI.
- `actions/turbo-run/`: Runs a Turborepo task with controlled concurrency and no telemetry.
- `docs/ACTION_README_TEMPLATE.md`: Template for generating individual action documentation.

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
2. **Workflow Snippets**: In action `README.md` files, do NOT include `name:` or `on:` top-level triggers in example code snippets. Focus purely on job/step context.
3. **Commit Messages**: Follow Conventional Commits format (`type(scope): message`) and document changes using Changesets.
4. **No Absolute Paths**: Never use absolute file paths (e.g., `file:///Users/...`) in documentation. Always use relative repository paths (e.g., `./[action-name]`, `../[action-name]`).
