# 📖 Documentation Entry Point

Welcome to the documentation for **ApiTree's GitHub Actions and Workflows**.

Here you will find detailed documentation on how to configure and reuse the customized GitHub Actions and Workflows hosted in this repository.

---

## ⚙️ Available Actions

These custom composite actions can be used as steps within your workflow jobs.

| Action                                                                  | Description                                                              |
| :---------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| [check-release-pr](./actions/check-release-pr.md)                       | Checks whether the workflow was triggered by a release PR.               |
| [check-stable-release](./actions/check-stable-release.md)               | Checks whether the triggering workflow is a stable release.              |
| [check-unreleased-changesets](./actions/check-unreleased-changesets.md) | Detects if there are any unreleased Changesets in the repository.        |
| [collect-release-info](./actions/collect-release-info.md)               | Collects release information from the Changesets versioning process.     |
| [create-release-pr](./actions/create-release-pr.md)                     | Creates a release PR with collected release info from Changesets.        |
| [create-release-tags](./actions/create-release-tags.md)                 | Creates Git tags for the new release based on the Changesets versioning. |
| [json-to-outputs](./actions/json-to-outputs.md)                         | Helper to parse a JSON string into individual step outputs.              |
| [load-secrets](./actions/load-secrets.md)                               | Injects and loads secrets from 1Password vaults securely.                |
| [setup-git](./actions/setup-git.md)                                     | Sets up Git CLI for a bot user with a short-lived token.                 |
| [setup-node](./actions/setup-node.md)                                   | Installs Node.js and configures `pnpm` package manager with caching.     |
| [setup-turbo](./actions/setup-turbo.md)                                 | Configures Turborepo local & remote cache for build optimization in CI.  |
| [turbo-run](./actions/turbo-run.md)                                     | Runs a Turborepo task with controlled concurrency and no telemetry.      |

---

## 🔄 Available Workflows

These reusable workflows can be called directly as jobs.

| Workflow                              | Description                                                                                                                                                  |
| :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [preflight](./workflows/preflight.md) | Preflight checks that determine if the release process should proceed by validating Changesets, release PR status, stable release state, and event triggers. |

---

## 🛠️ Documentation Templates

If you are developing new actions or workflows, please use these templates:

- [Action README Template](./ACTION_README_TEMPLATE.md)
- [Workflow README Template](./WORKFLOW_README_TEMPLATE.md)
