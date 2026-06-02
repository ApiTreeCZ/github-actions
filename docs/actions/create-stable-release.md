# ⚙️ `create-stable-release`

Creates and tags a stable release with Changesets.

This composite action automatically configures Git using [setup-git](./setup-git.md) (authenticating via a 1Password service account token), checks out the codebase with the authenticated Git credentials, sets up the project using [setup-project](./setup-project.md), runs the build script, publishes packages to the registry (if enabled), and pushes the changes and newly created release tags back to the remote repository.

> [!NOTE]
> This action checks out the repository automatically using the authenticated Git credentials, so you do not need to run `actions/checkout` before using this action in your job.

> [!IMPORTANT]
> Any job that uses this action and wants to publish packages to the registry MUST be configured following npm's [Trusted publishing guidelines](https://docs.npmjs.com/trusted-publishers) (which requires configuring OpenID Connect with `permissions: id-token: write`).

## 🚀 Usage

### Step Snippet

```yaml
- name: Create Stable Release
  uses: ApiTreeCZ/github-actions/.github/actions/create-stable-release@v0.4.0
  with:
    # Required inputs
    op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}

    # Optional inputs (uncomment if needed)
    # before-script: ''
    # build-script: 'pnpm run build'
    # changeset-bin: 'pnpx @changesets/cli'
    # publish-packages: 'true'
```

### Job Example

Here is how you integrate this action into a job:

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Required for OIDC trusted publishing
    steps:
      - name: Create Stable Release
        uses: ApiTreeCZ/github-actions/.github/actions/create-stable-release@v0.4.0
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
```

## 📥 Inputs

| Input                      | Description                                                           | Required |         Default          |
| :------------------------- | :-------------------------------------------------------------------- | :------: | :----------------------: |
| `op-service-account-token` | 1Password service account token with access to GitHub Actions secrets | **Yes**  |            -             |
| `before-script`            | The command to run before creating the stable release                 |    No    |           `''`           |
| `build-script`             | The command to run the build script                                   |    No    |    `'pnpm run build'`    |
| `changeset-bin`            | The command to run the Changesets CLI                                 |    No    | `'pnpx @changesets/cli'` |
| `publish-packages`         | Whether to publish packages to the registry                           |    No    |         `'true'`         |

## 📤 Outputs

_This action does not define any outputs._

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest` (does not currently support Windows runners due to dependencies)
- **Dependencies**:
  - [setup-git](./setup-git.md)
  - [setup-project](./setup-project.md)
  - [actions/checkout](https://github.com/actions/checkout)
- **Under the hood**:
  - Configures global Git configurations using [setup-git](./setup-git.md).
  - Checks out the repository with the generated token.
  - Sets up the Node.js project using [setup-project](./setup-project.md).
  - Runs the script specified in `before-script` if provided.
  - Runs the build script (`${{ inputs.build-script }}`).
  - Publishes to the package registry (`${{ inputs.changeset-bin }} publish`) if `publish-packages` is set to `"true"`.
  - Pushes commits and release tags to the remote repository (`git push --follow-tags`).
