# Contributing to Huble HubSpot CMS Developer Kit

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professionalism

## Getting Started

### 1. Fork and Clone

```bash
git clone <your-fork-url>
cd huble-hs-devkit_v2
pnpm install
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks

### 3. Make Changes

Follow these guidelines:

#### Design Tokens
- Add tokens to appropriate JSON files in `packages/design-tokens/src/`
- Run `pnpm run build:tokens` to generate CSS and TypeScript
- Test in both Storybook and local preview

#### UI Components
- Create components in `packages/ui/src/` following Atomic Design
- Use TypeScript strict mode
- Use Tailwind CSS for styling
- Create separate files: `Component.tsx`, `Component.types.ts`, `Component.styles.ts`
- Export from `index.ts` barrel files

#### HubSpot Modules
- Create thin adapters in `apps/hubspot-theme/theme/modules/`
- Map fields.json → module.html → React props
- No UI logic in HubSpot modules
- Add noscript fallbacks for progressive enhancement

## Development Workflow

### 1. Local Development

```bash
# Start local preview
pnpm run preview

# Start Storybook
pnpm run storybook

# Build everything
pnpm run build
```

### 2. Testing

```bash
# Type checking
pnpm run type-check

# Build verification
pnpm run build
```

### 3. Code Style

- Use Prettier for formatting
- Follow existing patterns
- Write clear, descriptive variable names
- Add comments only when logic isn't self-evident

### 4. Commits

Write clear commit messages:

```
Add new Card variant for product displays

- Create elevated-large variant in Card.styles.ts
- Add corresponding story in Storybook
- Update Card.types.ts with new variant option
```

Format:
- First line: Imperative mood summary (50 chars max)
- Blank line
- Detailed description (bullet points)

## Pull Request Process

### 1. Before Submitting

- [ ] Code builds without errors
- [ ] Design tokens compile correctly
- [ ] UI components render in Storybook
- [ ] HubSpot modules build successfully
- [ ] No console errors or warnings
- [ ] TypeScript types are correct
- [ ] No HubSpot imports in UI components

### 2. Create Pull Request

Use the PR template and fill in all sections:
- Description of changes
- Type of change
- Checklist completion
- Screenshots (if applicable)
- Testing instructions

### 3. Code Review

- Address reviewer feedback promptly
- Make requested changes
- Keep PR scope focused and manageable
- Avoid unrelated changes

### 4. Merge

- PRs require at least 1 approval
- All CI checks must pass
- Merge to `main` for production
- Merge to `staging` for testing

## Architecture Rules

### ✅ DO

- Keep UI components pure (no CMS dependencies)
- Use design tokens for all visual properties
- Create thin adapters in HubSpot modules
- Write TypeScript with strict mode
- Use server-rendering by default
- Hydrate islands only where needed
- Export components from barrel files
- Follow Atomic Design pattern

### ❌ DON'T

- Import HubSpot modules into React components
- Duplicate UI logic in HubL templates
- Hardcode colors, spacing, or typography
- Hydrate static content unnecessarily
- Create circular dependencies
- Use `any` type in TypeScript
- Mix CMS logic with UI components

## Component Development Guide

### Creating a New Component

1. **Choose Atomic Level**
   - Atoms: Basic elements (Button, Input, Text)
   - Molecules: Composite components (Card, FormField)
   - Organisms: Complex sections (Header, Hero, Footer)

2. **Create Files**
```bash
packages/ui/src/atoms/NewComponent/
├── NewComponent.tsx        # Component implementation
├── NewComponent.types.ts   # TypeScript interfaces
├── NewComponent.styles.ts  # CVA variants
└── index.ts               # Barrel exports
```

3. **Implement Component**
```typescript
// NewComponent.types.ts
export interface NewComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

// NewComponent.styles.ts
import { cva } from 'class-variance-authority';

export const componentVariants = cva(['base-class'], {
  variants: {
    variant: {
      primary: ['primary-classes'],
      secondary: ['secondary-classes'],
    },
    size: {
      sm: ['text-sm', 'p-2'],
      md: ['text-base', 'p-4'],
      lg: ['text-lg', 'p-6'],
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// NewComponent.tsx
import { forwardRef } from 'react';
import { componentVariants } from './NewComponent.styles';
import type { NewComponentProps } from './NewComponent.types';

export const NewComponent = forwardRef<HTMLDivElement, NewComponentProps>(
  ({ variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={componentVariants({ variant, size })}
        {...props}
      />
    );
  }
);

NewComponent.displayName = 'NewComponent';

// index.ts
export { NewComponent } from './NewComponent';
export type { NewComponentProps } from './NewComponent.types';
```

4. **Export from UI Package**
```typescript
// packages/ui/src/index.ts
export * from './atoms/NewComponent';
```

5. **Create Storybook Story**
```typescript
// apps/storybook/stories/NewComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { NewComponent } from '@huble/ui';

const meta = {
  title: 'Atoms/NewComponent',
  component: NewComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof NewComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
};
```

6. **Create HubSpot Module**
```bash
apps/hubspot-theme/theme/modules/new-component.module/
├── fields.json    # HubSpot field definitions
├── module.html    # Thin adapter
├── module.js      # Island hydration (if interactive)
└── meta.json      # Module metadata
```

## Performance Considerations

- Minimize bundle size (tree-shake unused code)
- Use server-rendering for static content
- Hydrate islands only for interactivity
- Lazy load images with `loading="lazy"`
- Optimize images (WebP, correct dimensions)
- Use design tokens (prevents CLS)
- Monitor Core Web Vitals

## Questions?

- Check existing issues for similar questions
- Review documentation in `.own-docs/`
- Ask in pull request comments
- Create a new issue with `question` label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
