# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-30

### Added

#### Foundation
- Monorepo structure with pnpm workspaces and Turborepo
- TypeScript configuration with strict mode
- Git repository initialization
- Comprehensive .gitignore and .hsignore

#### Design Token System
- JSON-based design token source files (colors, spacing, typography, breakpoints)
- Automated token generation script
- CSS custom properties output for HubSpot
- TypeScript constants output for React
- Multi-brand support architecture

#### UI Component Library
- Atomic Design structure (atoms, molecules, organisms, templates)
- Button atom with 5 variants and 4 sizes
- Card molecule with 3 variants and composable sections
- Hero organism with flexible image positioning
- Tailwind CSS integration with design tokens
- CVA (Class Variance Authority) for type-safe variants
- Full TypeScript support with strict types

#### HubSpot Theme
- Thin adapter architecture for zero duplication
- Button module with fields.json, module.html, module.js
- Hero module with image support
- Build scripts for token copying and module bundling
- esbuild configuration with JSX support
- HubL templates with noscript fallbacks
- Theme configuration and metadata

#### Local Preview App
- Vite development server at localhost:3000
- Mock CMS content system
- HomePage component demonstration
- Zero HubSpot dependency for local development
- Hot module replacement (HMR)
- Tailwind CSS styling

#### Storybook
- Storybook 8 with React and Vite
- Accessibility addon for a11y testing
- Button, Card, and Hero stories
- Multiple background options for testing
- Autodocs generation
- Design token integration

#### CI/CD
- GitHub Actions workflow for staging deployment
- GitHub Actions workflow for production deployment
- Test workflow for PR validation
- Pull request template with comprehensive checklist
- Automated deployment tagging
- Build verification steps

#### Documentation
- Comprehensive README with quick start guide
- CONTRIBUTING guide with development workflow
- CHANGELOG for tracking changes
- Architecture documentation
- Troubleshooting guide
- Performance optimization checklist

### Architecture Principles

- React owns UI, HubSpot owns content
- Design tokens own visual design
- Zero UI duplication between React and HubSpot
- Islands architecture (server-rendered by default)
- Strict separation of concerns
- Dependency inversion (HubSpot depends on UI, not vice versa)

### Performance Targets

- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

### Developer Experience

- Local preview with mock content
- Component documentation in Storybook
- Type-safe components with TypeScript
- Fast builds with Turborepo caching
- Automated deployment pipelines

---

## [Unreleased]

### Planned

- Additional UI components (Input, Text, Link, Icon, Image, Badge)
- FormField molecule component
- Header and Footer organism components
- Template layouts
- Unit tests with Vitest
- E2E tests with Playwright
- Build tools package for automated module generation
- Multi-brand theme switching
- Performance monitoring integration
- Lighthouse CI integration

---

[1.0.0]: https://github.com/your-org/huble-hs-devkit/releases/tag/v1.0.0
