# ⚙️ `create-release-tags-action`

Creates Git tags for the new release based on the Changesets versioning.

This composite action automatically configures Git using [setup-git-action](../setup-git-action) (authenticating via a 1Password service account token), checks out the codebase with the authenticated Git credentials, runs the Changeset tag command (`pnpx @changesets/cli tag` by default), pulls to avoid conflicts, and pushes the newly created release tags back to the remote repository.

> [!NOTE]
> This action checks out the repository automatically using the authenticated Git credentials, so you do not need to run `actions/checkout` before using this action in your job.

## 🚀 Usage

### Step Snippet

```yaml
- name: Create Release Tags
  uses: ApiTreeCZ/github-actions/create-release-tags-action@main
  with:
    # Required inputs
    op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}

    # Optional inputs (uncomment if needed)
    # changeset-bin: 'pnpx @changesets/cli'
```

### Job Example

Here is how you integrate this action into a job:

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Create Release Tags
        uses: ApiTreeCZ/github-actions/create-release-tags-action@main
        with:
          op-service-account-token: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
```

## 📥 Inputs

| Input                      | Description                                                           | Required |         Default          |
| :------------------------- | :-------------------------------------------------------------------- | :------: | :----------------------: |
| `op-service-account-token` | 1Password service account token with access to GitHub Actions secrets | **Yes**  |            -             |
| `changeset-bin`            | The command to run the Changesets CLI                                 |    No    | `'pnpx @changesets/cli'` |

## 📤 Outputs

_This action does not define any outputs._

## 🛠️ Details

- **Type**: `composite`
- **Runs on**: `ubuntu-latest`, `macos-latest` (does not currently support Windows runners due to dependencies)
- **Dependencies**:
  - [setup-git-action](../setup-git-action)
  - [actions/checkout](https://github.com/actions/checkout)
- **Under the hood**:
  - Configures global Git configurations using [setup-git-action](../setup-git-action).
  - Checks out the repository with the generated token.
  - Runs the Changesets tag command (`${{ inputs.changeset-bin }} tag`) to create the release tags.
  - Pulls any upstream changes with rebase (`git pull --rebase`).
  - Pushes the tags to the remote repository (`git push --follow-tags`).
