<div align="center">

<a href="https://github.com/ApiTreeCZ">
<img alt="ApiTree s.r.o." src="https://raw.githubusercontent.com/ApiTreeCZ/toolbox/refs/heads/main/public/apitree-logo.png?v=2025-01-28" width="308" />
</a>

# 🐙 GitHub Actions

### Reusable GitHub Actions for ApiTree projects

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

| Action                                                                 | Description                                                              |
| :--------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| [`check-release-pr`](./actions/check-release-pr)                       | Checks whether the workflow was triggered by a release PR.               |
| [`check-stable-release`](./actions/check-stable-release)               | Checks whether the triggering workflow is a stable release.              |
| [`check-unreleased-changesets`](./actions/check-unreleased-changesets) | Detects if there are any unreleased Changesets in the repository.        |
| [`collect-release-info`](./actions/collect-release-info)               | Collects release information from the Changesets versioning process.     |
| [`create-release-pr`](./actions/create-release-pr)                     | Creates a release PR with collected release info from Changesets.        |
| [`create-release-tags`](./actions/create-release-tags)                 | Creates Git tags for the new release based on the Changesets versioning. |
| [`json-to-outputs`](./actions/json-to-outputs)                         | Helper to parse a JSON string into individual step outputs.              |
| [`load-secrets`](./actions/load-secrets)                               | Injects and loads secrets from 1Password vaults securely.                |
| [`setup-git`](./actions/setup-git)                                     | Sets up Git CLI for a bot user with a short-lived token.                 |
| [`setup-node`](./actions/setup-node)                                   | Installs Node.js and configures `pnpm` package manager with caching.     |
| [`setup-turbo`](./actions/setup-turbo)                                 | Configures Turborepo local & remote cache for build optimization in CI.  |
| [`turbo-run`](./actions/turbo-run)                                     | Runs a Turborepo task with controlled concurrency and no telemetry.      |

## Authors

- Vít Rozsíval ([vit.rozsival@apitree.cz](mailto:vit.rozsival@apitree.cz))

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see
the [tags on this repository](https://github.com/ApiTreeCZ/github-actions/tags).

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull
requests.
