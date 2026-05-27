# NPM Skill

## Purpose
Practical command patterns for working with npm in this project.

## When to use
- Installing runtime or dev dependencies
- Running project scripts
- Auditing or updating packages
- Publishing-related checks for package metadata

## Common commands

### Install dependencies
```bash
npm install
```

### Add a runtime dependency
```bash
npm install <package>
```

### Add a dev dependency
```bash
npm install -D <package>
```

### Remove a dependency
```bash
npm uninstall <package>
```

### Run scripts
```bash
npm run dev
npm run build
npm run preview
```

### Check outdated packages
```bash
npm outdated
```

### Audit dependencies
```bash
npm audit
npm audit fix
```

### Update dependency versions within allowed range
```bash
npm update
```

### Clean install from lockfile
```bash
npm ci
```

## Project-specific notes
- This repository uses `npm` and has scripts: `dev`, `build`, `preview`.
- Main config lives in `package.json`.
- Prefer `npm install -D` for tooling like TypeScript, Vite, linters, and test frameworks.
- After changing dependencies, run `npm run build` to verify the project still builds.

## Safe workflow
1. Inspect `package.json` before changing dependencies.
2. Install or remove the package.
3. Run the relevant script, usually `npm run build`.
4. Review lockfile changes before commit.
