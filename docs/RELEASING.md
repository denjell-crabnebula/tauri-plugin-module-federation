---
title: Releasing
read_when:
  - preparing a release
  - updating release automation
---

# Releasing

This repo publishes:

- npm package: `@module-federation/tauri`
- cargo crate: `tauri-plugin-module-federation`

## Release flow

1. Add a changeset for `@module-federation/tauri`.
2. Run the `Release Pull Request` workflow.
3. Merge the generated release PR.
4. Cut a GitHub Release from the merged version commit.

The `Release` workflow publishes both npm and crates.io from the same version.

## Required secrets

- `NPM_TOKEN`
- `CARGO_REGISTRY_TOKEN`

`REPO_SCOPED_TOKEN` is optional. If absent, workflows fall back to `GITHUB_TOKEN`.

## Tag format

Use plain semver tags.

- valid: `1.2.3`
- invalid: `v1.2.3`

## Notes

- `release.yml` syncs the Cargo crate version from `module-federation-plugin/package.json` before publish.
- `workflow_dispatch` with `version=next` creates a snapshot-style prerelease version for npm and crates.io.
