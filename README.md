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

| [`collect-release-info-action`](./collect-release-info-action) | Collects release information from the Changesets versioning process. |
| [`json-to-outputs-action`](./json-to-outputs-action) | Helper to parse a JSON string into individual step outputs. |
| [`load-secrets-action`](./load-secrets-action) | Injects and loads secrets from 1Password vaults securely. |
| [`setup-node-action`](./setup-node-action) | Installs Node.js and configures `pnpm` package manager with caching. |
| [`setup-turbo-action`](./setup-turbo-action) | Configures Turborepo local & remote cache for build optimization in CI. |

## Authors

- Vít Rozsíval ([vit.rozsival@apitree.cz](mailto:vit.rozsival@apitree.cz))

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see
the [tags on this repository](https://github.com/ApiTreeCZ/github-actions/tags).

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull
requests.
