# Automated Releases

This repository uses GitHub Actions to automatically publish new versions to npm when changes are pushed to the `main` branch.

## How It Works

1. **Trigger**: The workflow runs on every push to the `main` branch
2. **Version Bump**: Automatically increments the patch version (e.g., 1.0.22 → 1.0.23)
3. **Build**: Runs `npm run build` to compile TypeScript
4. **Publish**: Publishes the package to npm with provenance
5. **Release**: Creates a GitHub release with the version tag

## Setup Requirements

### NPM Token

To enable publishing to npm, you need to configure an `NPM_TOKEN` secret in the repository settings:

1. Go to [npmjs.com](https://www.npmjs.com/) and log in
2. Navigate to your account settings → Access Tokens
3. Create a new **Automation** token
4. Copy the token
5. In GitHub, go to Settings → Secrets and variables → Actions
6. Create a new repository secret named `NPM_TOKEN`
7. Paste the token value

### Repository Permissions

The workflow requires the following permissions (already configured in the workflow file):
- `contents: write` - To push version commits and tags
- `id-token: write` - For npm provenance

## Version Management

The workflow automatically bumps the **patch** version on each release. If you need to:

- **Minor version bump**: Manually run `npm version minor` before merging to main
- **Major version bump**: Manually run `npm version major` before merging to main

## Preventing Double Releases

The workflow uses `[skip ci]` in commit messages to prevent the version bump commit from triggering another workflow run, avoiding an infinite loop.

## Testing the Workflow

Before merging to `main`, you can test the workflow by:

1. Creating a feature branch
2. Making your changes
3. Opening a pull request
4. The test workflow will run on the PR
5. Once merged to `main`, the publish workflow will automatically run
