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

The workflow automatically bumps the **patch** version on each release (e.g., 1.0.22 → 1.0.23).

If you need a **minor** or **major** version bump:

1. **Before pushing to main**, manually run the version command locally:
   - Minor version: `npm version minor`
   - Major version: `npm version major`
2. Push the version commit and tag: `git push --follow-tags`
3. The workflow will detect the new version and publish it to npm

Alternatively, you can manually edit the version in `package.json` and push to main. The workflow will publish whatever version is in the file.

## Preventing Double Releases

The workflow uses `[skip ci]` in commit messages to prevent the version bump commit from triggering another workflow run, avoiding an infinite loop.

## Testing the Workflow

Before merging to `main`, you can test the workflow by:

1. Creating a feature branch
2. Making your changes
3. Opening a pull request
4. The test workflow will run on the PR
5. Once merged to `main`, the publish workflow will automatically run
