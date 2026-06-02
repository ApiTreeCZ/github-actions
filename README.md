<div align="center">

<a href="https://github.com/ApiTreeCZ">
<img alt="ApiTree s.r.o." src="https://raw.githubusercontent.com/ApiTreeCZ/toolbox/refs/heads/main/public/apitree-logo.png?v=2025-01-28" width="308" />
</a>

# 🐙 GitHub Actions

### Reusable GitHub Actions and Workflows for ApiTree projects

</div>

## Getting Started

### Prerequisites

- node.js `v24`
- pnpm `v10`

### Installation

```bash
git clone git@github.com:ApiTreeCZ/github-actions.git
cd github-actions
pnpm install
```

### Available Actions

We provide the following reusable GitHub Actions in this repository:

| Action                                                                         | Description                                                              |
| :----------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| [`check-release-pr`](./docs/actions/check-release-pr.md)                       | Checks whether the workflow was triggered by a release PR.               |
| [`check-stable-release`](./docs/actions/check-stable-release.md)               | Checks whether the triggering workflow is a stable release.              |
| [`check-unreleased-changesets`](./docs/actions/check-unreleased-changesets.md) | Detects if there are any unreleased Changesets in the repository.        |
| [`collect-release-info`](./docs/actions/collect-release-info.md)               | Collects release information from the Changesets versioning process.     |
| [`create-release-pr`](./docs/actions/create-release-pr.md)                     | Creates a release PR with collected release info from Changesets.        |
| [`create-release-tags`](./docs/actions/create-release-tags.md)                 | Creates Git tags for the new release based on the Changesets versioning. |
| [`json-to-outputs`](./docs/actions/json-to-outputs.md)                         | Helper to parse a JSON string into individual step outputs.              |
| [`load-secrets`](./docs/actions/load-secrets.md)                               | Injects and loads secrets from 1Password vaults securely.                |
| [`setup-git`](./docs/actions/setup-git.md)                                     | Sets up Git CLI for a bot user with a short-lived token.                 |
| [`setup-node`](./docs/actions/setup-node.md)                                   | Installs Node.js and configures `pnpm` package manager with caching.     |
| [`setup-turbo`](./docs/actions/setup-turbo.md)                                 | Configures Turborepo local & remote cache for build optimization in CI.  |
| [`turbo-run`](./docs/actions/turbo-run.md)                                     | Runs a Turborepo task with controlled concurrency and no telemetry.      |

## Available Workflows

We provide the following reusable GitHub Workflows in this repository:

| Workflow                                     | Description                                                                                         |
| :------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| [`preflight`](./docs/workflows/preflight.md) | Preflight checks that determine if the release process should proceed by validating changes/events. |

## Authors

- Vít Rozsíval ([vit.rozsival@apitree.cz](mailto:vit.rozsival@apitree.cz))

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see
the [tags on this repository](https://github.com/ApiTreeCZ/github-actions/tags).

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull
requests.
