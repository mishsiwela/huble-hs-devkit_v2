# Monorepo Structure Guide

## Why Multiple package.json Files Are Required

This project uses **pnpm workspaces** for monorepo management. Each workspace (package or app) **must** have its own `package.json` file. This is not duplication—it's required architecture.

### Workspace Structure

```
root/
├── package.json                    # Workspace coordinator + shared devDependencies
├── packages/
│   ├── ui/package.json            # React component library (publishable)
│   ├── design-tokens/package.json # Token generation system
│   └── build-tools/package.json   # CLI tools for macro generation
└── apps/
    ├── storybook/package.json     # Component documentation
    ├── hubspot-theme/package.json # HubSpot CMS theme
    └── local-preview/package.json # Local development environment
```

## Why Each Workspace Needs Its Own package.json

### 1. Different Purposes
- **Libraries** (`packages/ui`) - Shared React components, built for consumption
- **Build Tools** (`packages/design-tokens`) - Generate CSS/TS from JSON tokens
- **Applications** (`apps/storybook`) - Standalone apps that consume packages

### 2. Different Build Processes
| Workspace | Build Tool | Output | Purpose |
|-----------|------------|--------|---------|
| `packages/ui` | tsup | `dist/` | ES/CJS modules + types |
| `packages/design-tokens` | tsx | `build/` | Generated CSS/TS files |
| `apps/storybook` | Storybook | `storybook-static/` | Static documentation |
| `apps/local-preview` | Vite | `dist/` | SPA bundle |
| `apps/hubspot-theme` | esbuild + scripts | `theme/` | HubSpot modules |

### 3. Different Entry Points
```json
// packages/ui/package.json - Library exports
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": { ... }
}

// packages/build-tools/package.json - CLI executable
{
  "bin": {
    "huble-generate": "./src/cli.js"
  }
}

// apps/storybook/package.json - No exports (app only)
{
  "private": true,
  "scripts": { "dev": "storybook dev" }
}
```

### 4. Different Dependency Types
- **dependencies** - Runtime dependencies (shipped with package/app)
- **devDependencies** - Build-time only (not shipped)
- **peerDependencies** - Required by consuming projects

Example: `react` is a **dependency** in apps (bundled), but a **peerDependency** in `packages/ui` (provided by consumer).

## What We DID Optimize: Shared Dependencies

Before optimization, we had duplicated devDependencies:
- `typescript: ^5.7.2` in 5 packages
- `@types/react` in 3 packages
- `autoprefixer`, `postcss`, `tailwindcss` in 3 packages each

### After Optimization

**Root package.json** now contains shared devDependencies:
```json
{
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2"
  }
}
```

**Individual packages** only declare package-specific devDependencies:
```json
// packages/ui/package.json
{
  "devDependencies": {
    "tsup": "^8.3.5"  // Only UI needs tsup
  }
}

// apps/storybook/package.json
{
  "devDependencies": {
    "@storybook/react": "^8.6.14",  // Only Storybook needs these
    "storybook": "^8.6.14",
    "vite": "^6.0.7"
  }
}
```

## Benefits of This Structure

### ✅ Dependency Hoisting
pnpm automatically hoists shared dependencies to `node_modules/.pnpm`, reducing disk usage and installation time.

### ✅ Isolated Builds
Each workspace can be built independently:
```bash
pnpm --filter ui build        # Build only UI package
pnpm --filter storybook build # Build only Storybook
```

### ✅ Dependency Graph
Turbo understands workspace dependencies and builds in the correct order:
```
design-tokens → ui → storybook
design-tokens → ui → local-preview
design-tokens → ui → hubspot-theme
```

### ✅ Selective Installation
Install dependencies only where needed:
```bash
pnpm --filter storybook add some-package
```

## Common Misconceptions

### ❌ "One package.json reduces duplication"
**Reality:** Each workspace serves a different purpose and requires its own configuration. The `package.json` file is not just for dependencies—it defines the workspace itself.

### ❌ "Same dependency = duplication"
**Reality:** pnpm hoists shared dependencies automatically. Multiple declarations don't mean multiple installations.

### ❌ "Should centralize all scripts"
**Reality:** Build scripts are package-specific. The UI library uses `tsup`, but Storybook uses `storybook build`. These can't be centralized.

## Best Practices

### ✅ DO: Put shared tooling in root
- TypeScript, Prettier, ESLint
- Build tools used by ALL packages
- Type definitions (@types/*)

### ✅ DO: Keep package-specific deps in workspaces
- Build tools unique to that workspace (tsup, esbuild)
- Framework-specific packages (Storybook, Vite plugins)
- Package-specific utilities

### ❌ DON'T: Try to consolidate into one package.json
- Breaks workspace detection
- Loses dependency isolation
- Makes builds slower (everything rebuilds together)

## How to Add a New Package

```bash
# 1. Create directory structure
mkdir -p packages/new-package/src

# 2. Create package.json
cat > packages/new-package/package.json <<EOF
{
  "name": "@huble/new-package",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {},
  "devDependencies": {}
}
EOF

# 3. pnpm will auto-detect the new workspace
pnpm install
```

## Summary

**Multiple package.json files are not duplication—they're the foundation of a properly architected monorepo.**

Each workspace is a self-contained unit with:
- Its own build configuration
- Its own dependency requirements
- Its own purpose and output

We optimized by consolidating **shared tooling** to the root while preserving the modular structure that makes this monorepo maintainable and scalable.
