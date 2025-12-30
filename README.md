# Huble HubSpot CMS Developer Kit

> Modern React + HubSpot CMS development framework with design tokens, islands architecture, and zero duplication.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🎯 Overview

The Huble HubSpot CMS Developer Kit is a production-ready framework that bridges the gap between modern React development and HubSpot CMS. It implements a clean separation of concerns where **React owns UI, HubSpot owns content, and design tokens own visual design**.

### Key Features

- **🎨 Design Token System** - Single source of truth for colors, spacing, typography
- **🏝️ Islands Architecture** - Server-rendered by default, hydrate only where needed
- **♻️ Zero Duplication** - React components mapped to HubSpot modules via thin adapters
- **⚛️ Atomic Design** - Organized component library (atoms → molecules → organisms)
- **🎯 Multi-Brand Support** - Scale across brands by swapping token files
- **⚡ Developer Experience** - localhost:3000 preview with zero HubSpot dependency
- **📊 Performance Optimized** - Core Web Vitals targets (LCP < 2.5s, FID < 100ms, CLS < 0.1)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0
- HubSpot account (for deployment)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd huble-hs-devkit_v2

# Install dependencies
pnpm install

# Build design tokens and UI library
pnpm run build
```

### Development

```bash
# Start local preview (localhost:3000)
pnpm run preview

# Start Storybook (localhost:6006)
pnpm run storybook

# Build for HubSpot
pnpm run build:theme
```

## 📁 Project Structure

```
huble-hs-devkit/
├── packages/
│   ├── design-tokens/          # Visual design system
│   │   ├── src/                # Token JSON files
│   │   ├── build/              # Compiled CSS + TypeScript
│   │   └── scripts/            # Generation scripts
│   │
│   ├── ui/                     # React component library
│   │   ├── src/
│   │   │   ├── atoms/          # Button, Input, Text, etc.
│   │   │   ├── molecules/      # Card, FormField, etc.
│   │   │   ├── organisms/      # Header, Footer, Hero, etc.
│   │   │   └── templates/      # Layout templates
│   │   └── dist/               # Compiled components
│   │
│   └── build-tools/            # HubSpot automation (future)
│
├── apps/
│   ├── local-preview/          # localhost:3000 dev server
│   │   ├── src/
│   │   │   ├── pages/          # Page compositions
│   │   │   └── mock-content/   # CMS mock data
│   │   └── index.html
│   │
│   ├── storybook/              # Component documentation
│   │   ├── .storybook/         # Storybook config
│   │   └── stories/            # Component stories
│   │
│   └── hubspot-theme/          # HubSpot CMS delivery
│       ├── theme/
│       │   ├── modules/        # HubSpot modules (thin adapters)
│       │   ├── templates/      # HubL page templates
│       │   ├── css/            # Compiled tokens + styles
│       │   └── theme.json      # Theme configuration
│       ├── scripts/            # Build scripts
│       └── hubspot.config.yml  # HubSpot CLI config
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│
└── .own-docs/                  # Internal documentation
```

## 🎨 Design Token System

Design tokens are the single source of truth for visual design. They compile to both CSS custom properties (for HubSpot) and TypeScript constants (for React).

### Token Files

- `colors.json` - Color palette with semantic naming
- `spacing.json` - Spacing scale (4, 8, 12, 16px, etc.)
- `typography.json` - Font families, sizes, weights
- `breakpoints.json` - Responsive breakpoints

### Usage

```typescript
// In React components
import { tokens } from '@huble/design-tokens';

// In CSS (HubSpot)
.button {
  background: var(--color-primary-500);
  padding: var(--spacing-4);
}
```

### Building Tokens

```bash
pnpm run build:tokens
```

Generates:
- `build/tokens.css` - CSS custom properties
- `build/tokens.ts` - TypeScript constants

## ⚛️ UI Component Library

Pure React components with zero HubSpot dependencies. Built with:
- TypeScript (strict mode)
- Tailwind CSS
- CVA (Class Variance Authority) for variants
- Atomic Design pattern

### Example Component

```typescript
// packages/ui/src/atoms/Button/Button.tsx
import { forwardRef } from 'react';
import { buttonVariants } from './Button.styles';
import type { ButtonProps } from './Button.types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size })}
        {...props}
      >
        {children}
      </button>
    );
  }
);
```

### Building UI Package

```bash
pnpm --filter ui build
```

## 🏝️ HubSpot Theme - Thin Adapters

HubSpot modules are **thin adapters** that map CMS fields to React component props. No UI logic lives here.

### Module Structure

```
button.module/
├── fields.json       # HubSpot field definitions
├── module.html       # Thin adapter (maps fields → props)
├── module.js         # Island hydration script
└── meta.json         # Module metadata
```

### Example Adapter

```html
<!-- module.html -->
<div data-component="Button"
     data-props='{{ {
       "variant": module.variant,
       "size": module.size,
       "children": module.label
     } | tojson }}'>
</div>
```

### Building Theme

```bash
pnpm run build:theme
```

This:
1. Copies design tokens to `theme/css/`
2. Bundles module JavaScript with React imports
3. Prepares theme for HubSpot upload

## 🧪 Development Workflow

### 1. Build Components

```bash
# Work in packages/ui/src/
pnpm --filter ui dev
```

### 2. Preview Locally

```bash
# Test at localhost:3000 with mock content
pnpm run preview
```

### 3. Document in Storybook

```bash
# View at localhost:6006
pnpm run storybook
```

### 4. Create HubSpot Modules

```bash
# Map components in apps/hubspot-theme/theme/modules/
pnpm run build:theme
```

### 5. Deploy to HubSpot

```bash
# Staging
git push origin staging

# Production (requires approval)
git push origin main
```

## 🚢 Deployment

### Prerequisites

1. Configure HubSpot CLI credentials:
```bash
hs auth
```

2. Update `apps/hubspot-theme/hubspot.config.yml` with your portal IDs

3. Add GitHub Secrets:
   - `HUBSPOT_STAGING_API_KEY`
   - `HUBSPOT_STAGING_PORTAL_ID`
   - `HUBSPOT_PROD_API_KEY`
   - `HUBSPOT_PROD_PORTAL_ID`

### Deployment Branches

- **`staging`** - Auto-deploys to staging portal
- **`main`** - Auto-deploys to production (manual approval required)

### Manual Upload

```bash
cd apps/hubspot-theme
hs upload theme --portal=YOUR_PORTAL_ID
```

## ✅ Success Criteria

### Architecture
- ✅ React components have ZERO HubSpot imports
- ✅ HubSpot modules are thin adapters only
- ✅ Design tokens compile to CSS + TypeScript
- ✅ Islands architecture (server-rendered by default)

### Development Workflow
- ✅ localhost:3000 preview with mock content
- ✅ Storybook at localhost:6006
- ✅ HMR < 500ms
- ✅ No HubSpot dependency during local development

### Performance
- ✅ LCP < 2.5s (server-rendered React)
- ✅ FID < 100ms (minimal JS, islands only)
- ✅ CLS < 0.1 (tokenized layouts)

## 🎓 Core Principles

### 1. React owns UI. HubSpot owns content.

```typescript
// ✅ CORRECT - Pure React component
export function Button({ label, variant }) {
  return <button className={styles[variant]}>{label}</button>;
}

// ❌ WRONG - HubSpot import in React
import { HubSpotModule } from 'hubspot';
```

### 2. Thin Adapters, Zero Duplication

```html
<!-- ✅ CORRECT - Thin adapter -->
<div data-component="Button" data-props='{"label": "{{ module.label }}"}'>
</div>

<!-- ❌ WRONG - Duplicated UI in HubL -->
<button class="btn btn--primary">{{ module.label }}</button>
```

### 3. Islands Architecture

```javascript
// ✅ CORRECT - Static content (server-rendered)
<Hero /> // No JavaScript needed

// ✅ CORRECT - Interactive content (hydrated)
<Tabs /> // Needs client-side JavaScript

// ❌ WRONG - Hydrate everything
<Hero /> // Unnecessary JavaScript
```

## 🐛 Troubleshooting

### localhost:3000 won't start

```bash
# Kill port 3000
lsof -ti:3000 | xargs kill -9

# Restart
pnpm run preview
```

### HubSpot module not showing

1. Check `meta.json` exists
2. Verify `is_available_for_new_content: true`
3. Run `hs upload` again
4. Refresh Design Manager

### Design tokens not updating

```bash
# Rebuild tokens
pnpm run build:tokens

# Rebuild theme
pnpm run build:theme

# Upload to HubSpot
cd apps/hubspot-theme && hs upload theme
```

## 📚 Additional Resources

- [FRESH_START_EXECUTION_PROMPT.md](.own-docs/FRESH_START_EXECUTION_PROMPT.md) - Full implementation guide
- [SDLC Workflow](.own-docs/Editable-SDLC-workflow.md) - Development lifecycle
- [HubSpot CMS Docs](https://developers.hubspot.com/docs/cms)
- [Tailwind CSS](https://tailwindcss.com)
- [Storybook](https://storybook.js.org)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Build and test locally
4. Create a pull request
5. Ensure CI/CD tests pass
6. Request review

## 📄 License

MIT License - see LICENSE file for details

---

**Built with:** React 18 + TypeScript 5 + Vite 6 + HubSpot CMS + Tailwind CSS + Turborepo

**Philosophy:** Zero duplication. Islands architecture. Token-driven. DRY. SOLID.
