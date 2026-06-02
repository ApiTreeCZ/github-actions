# ⚙️ `create-snapshot-release`

Creates a snapshot release with Changesets.

This composite action checks out the repository, sets up the Node.js project using [setup-project](./setup-project.md), versionizes packages as a snapshot with the given distribution tag, runs the build script, and publishes packages to the npm registry with the distribution tag.

> [!NOTE]
> This action checks out the repository automatically, so you do not need to run `actions/checkout` before using this action in your job.

> [!IMPORTANT]
> Any job that uses this action and wants to publish packages to the registry MUST be configured following npm's [Trusted publishing guidelines](https://docs.npmjs.com/trusted-publishers) (which requires configuring OpenID Connect with `permissions: id-token: write`).

## 🚀 Usage

### Step Snippet

```yaml
- name: Create Snapshot Release
  uses: ApiTreeCZ/github-actions/.github/actions/create-snapshot-release@v0.4.0
  with:
    # Required inputs
    op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}

    # Optional inputs (uncomment if needed)
    # before-script: ''
    # build-script: 'pnpm run build'
    # changeset-bin: 'pnpx @changesets/cli'
    # dist-tag: 'next'
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
      - name: Create Snapshot Release
        uses: ApiTreeCZ/github-actions/.github/actions/create-snapshot-release@v0.4.0
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
```

## 📥 Inputs

| Input                      | Description                                                           | Required |         Default          |
| :------------------------- | :-------------------------------------------------------------------- | :------: | :----------------------: |
| `op-service-account-token` | 1Password service account token with access to GitHub Actions secrets | **Yes**  |            -             |
| `before-script`            | The command to run before creating the snapshot release               |    No    |           `''`           |
| `build-script`             | The command to run the build script                                   |    No    |    `'pnpm run build'`    |
| `changeset-bin`            | The command to run the Changesets CLI                                 |    No    | `'pnpx @changesets/cli'` |
| `dist-tag`                 | The dist tag to publish the snapshot release under                    |    No    |         `'next'`         |
| `publish-packages`         | Whether to publish packages to the registry                           |    No    |         `'true'`         |

## 📤 Outputs

_This action does not define any outputs._

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest` (does not currently support Windows runners due to dependencies)
- **Dependencies**:
  - [setup-project](./setup-project.md)
  - [actions/checkout](https://github.com/actions/checkout)
- **Under the hood**:
  - Checks out the repository without credentials.
  - Sets up the Node.js project using [setup-project](./setup-project.md).
  - Runs the script specified in `before-script` if provided.
  - Versionizes the codebase using Changeset snapshot command (`${{ inputs.changeset-bin }} version --snapshot ${{ inputs.dist-tag }}`).
  - Runs the build script (`${{ inputs.build-script }}`).
  - Publishes to the package registry (`${{ inputs.changeset-bin }} publish --tag ${{ inputs.dist-tag }} --no-git-tag`) if `publish-packages` is set to `"true"`.
