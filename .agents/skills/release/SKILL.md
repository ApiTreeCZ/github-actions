---
name: release
description: >
  Bump version on a release branch, open a PR to main, and tag the merged commit. Use when user says
  "release" or "bump version".
---

You are the release engineer for GitHub Actions. Follow this workflow precisely.

## Prerequisites

1. **Check branch** — run `git rev-parse --abbrev-ref HEAD`. Must be `main`.

- If not on `main`, abort and tell the user to switch to `main` first.

2. **Check for uncommitted changes** — run `git status --porcelain`. Must be empty.

- If dirty, abort and ask the user to commit or stash changes first.

3. **Pull latest** — run `git pull --rebase` to ensure you're up to date.

## Version Bump

Ask the user what type of release this is (major, minor, patch). Prefer tool to ask question if available, otherwise ask in the chat.

Wait for their answer. Then bump the version using semver:

| Type  | Current `X.Y.Z` | New `X.Y.Z` |
| ----- | --------------- | ----------- |
| major | `X.Y.Z`         | `X+1.0.0`   |
| minor | `X.Y.Z`         | `X.Y+1.0`   |
| patch | `X.Y.Z`         | `X.Y.Z+1`   |

## Release Branch

Agents never push to `main`: it only accepts rebase-merged PRs with a code-owner review. The release
commit goes through a `release/vX.Y.Z` branch instead.

1. **Check the version is free** — neither the tag nor the branch may exist on the remote:
   ```bash
   git ls-remote origin refs/tags/vX.Y.Z refs/heads/release/vX.Y.Z
   ```
   It must print nothing. Otherwise abort and report what exists.
2. **Create the branch** from the freshly pulled `main`:
   ```bash
   git switch -c release/vX.Y.Z
   ```

## Update the Version

Read root `package.json` to find the current `version: "X.Y.Z"` field. Update it in-place.
Read all markdown files under `docs/actions/*.md` and `docs/workflows/*.md`. Update any version and/or branch references in `uses` fields (e.g., `uses: ApiTreeCZ/github-actions/.github/actions/some-action@vX.Y.Z` or `uses: ApiTreeCZ/github-actions/.github/workflows/some-workflow.yml@main`) to the new version.
Read all `.github/actions/*/action.yml` files and all `.github/workflows/*.yml` files. Update any version and/or branch references to `ApiTreeCZ/github-actions` in `uses` fields to the new version.

## Commit & Pull Request

1. **Gather all changed files**:
   ```bash
   git add $(git diff --name-only HEAD)
   ```
2. **Commit**:
   ```bash
   git commit -m "chore(release): vX.Y.Z"
   ```
3. **Push the branch** — confirm with the user first:
   ```bash
   git push -u origin release/vX.Y.Z
   ```
4. **Open the PR**:
   ```bash
   gh pr create --base main --head release/vX.Y.Z --title "chore(release): vX.Y.Z" \
     --body "Release vX.Y.Z. Rebase-merge, then the tag is pushed from the merged commit."
   ```
5. **Wait for the required checks** (`qa`):
   ```bash
   gh pr checks release/vX.Y.Z --watch --required
   ```
   If a check fails, stop and report it. Do not push fixes onto the release branch unasked.
6. **Hand the merge to the user** — print the PR URL and ask them to review and merge it with **Rebase and
   merge** (the only method `main` allows). Never merge it yourself, never use `--admin` or any ruleset
   bypass. Wait for the user to confirm, then verify:
   ```bash
   gh pr view release/vX.Y.Z --json state --jq .state
   ```
   It must print `MERGED`. Anything else: stop, nothing gets tagged.

## Tag

The tag goes on `main`'s copy of the release commit, never the branch's: a rebase merge rewrites every
commit, so the SHA on `release/vX.Y.Z` never reaches `main`. Tag right after the merge: until `vX.Y.Z`
exists, every `uses: ApiTreeCZ/github-actions/...@vX.Y.Z` on `main` points at a missing ref.

1. **Update `main`**:
   ```bash
   git switch main
   git pull --rebase
   ```
2. **Find the merged release commit**:
   ```bash
   git log main --format=%H -n 1 --grep='^chore(release): vX.Y.Z$'
   ```
   It must print exactly one SHA. If it prints nothing, stop and report — do not tag `HEAD` instead.
3. **Create an annotated tag** on that SHA, then confirm it exists. Annotated, not signed: agent sessions
   hold no signing key (`tag.gpgsign = false`), so `git tag -s` fails there:
   ```bash
   git tag -a vX.Y.Z <SHA> -m "Release vX.Y.Z"
   git tag --list vX.Y.Z
   ```
   If the second command prints nothing, the tag was **not** created. Stop and report the error.
4. **Push the tag** — confirm with the user first:
   ```bash
   git push origin vX.Y.Z
   ```
5. **Clean up** the local branch (`-D`: the rebase merge leaves its original commits unmerged by SHA):
   ```bash
   git branch -D release/vX.Y.Z
   git fetch --prune
   ```

## Confirmation

Report back to the user:

```
✅ Release vX.Y.Z created successfully.
   - Version bumped in: {list all files that were modified during the release}
   - Committed: chore(release): vX.Y.Z on release/vX.Y.Z
   - PR: {PR URL}, rebase-merged into main
   - Tagged: vX.Y.Z on {merged SHA}, pushed to remote
```

## Error Handling

- If the version format is unexpected, abort and ask the user to verify it follows `X.Y.Z` semver or is approved to be in a different format (e.g., `X.Y.Z-beta`).
- If `git push` fails (e.g., remote rejects the branch or tag, network issue), inform the user and stop. Do not retry automatically.
- Never push to `main`, never merge the release PR, never bypass branch rules — `main` changes only through the user's merge.
- Never auto-approve — always confirm each step with the user before proceeding when the action is irreversible (push to remote).
