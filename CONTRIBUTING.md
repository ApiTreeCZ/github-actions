# Contribution Guidelines

Please follow the contribution process outlined below.

## Contribution Process

We use [GitHub](https://github.com/ApiTreeCZ/toolbox) for version control and issue tracking. Here's a
step-by-step guide on how to contribute:

### 1. Create a Feature Branch

To work on a new feature or fix, create a new branch from the `main` branch. Name your branch descriptively.

```bash
git checkout -b feature/my-feature
```

### 2. Committing Your Changes

Please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard when making commits.
This will help with automated versioning and changelogs.

Additionally, we use [Changesets](https://github.com/changesets/changesets) to manage the release process. Be sure to
document your changes accordingly.

### 3. Open a Pull Request

When your work is ready for review, push your branch to the main repository and open a Pull Request (PR).

- Assign the PR to the appropriate reviewers.
- Provide a clear and concise description of your changes.
- Reference any issues that the PR addresses.

### 4. Review and Approval

Reviewers will assess your PR for code quality, adherence to coding standards, and functional correctness. They may
request changes or provide feedback. Make necessary adjustments to address these comments.

### 5. Merge to `main`

Once your PR is approved, a maintainer will merge it into the `main` branch.

## Conventional Commits and Changesets

We use Conventional Commits and Changesets to keep our changelogs accurate and to facilitate version management. Commit
messages should follow the format:

```
<type>(<scope>): <message>
```

- `<type>`: Describes the purpose of the commit (e.g., `feat`, `fix`, `chore`).
- `<scope>`: Specifies the component or area of the code affected by the change.
- `<message>`: Provides a concise description of the change.

Please, briefly describe changes, enhancements, and fixes with this commit format.

Changesets are used to group changes into releases. When creating a Changeset, include a summary of the changes, a list
of PRs, and any breaking changes. This is critical for generating accurate changelogs.

## Code Style

Please adhere to our coding style guidelines, which are controlled by `eslint` and `prettier`. Ensure
that your code follows the established patterns and conventions described and used in each package.

## Reporting Issues

If you encounter any issues or have suggestions for improvement, please use
the [GitHub issue tracker](https://github.com/ApiTreeCZ/toolbox/issues) to report them. Be
as descriptive as possible and follow the issue template to provide the necessary details.
