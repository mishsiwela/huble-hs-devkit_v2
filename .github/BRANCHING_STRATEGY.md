# Branching Strategy & Justification

## Overview

This project uses **GitFlow-inspired branching** with two long-lived branches and environment-based deployments. This approach provides comprehensive bug prevention while avoiding over-engineering.

## Branch Structure

```
main (production)
  ↑ PR + Manual approval + Tag
  │
  └── develop (staging auto-deploy)
       ↑ PR + CI validation
       │
       └── feature/* (development)
            ↑ Push triggers CI
            └── Local development
```

## Long-Lived Branches

### 1. `main` - Production Branch
- **Purpose**: Production-ready code only
- **Protection**: Requires PR approval, all CI checks must pass
- **Deployment**: Deploys to **production environment** via tags (`v*.*.*`)
- **Approval**: Requires 1-2 reviewer approvals + 5-minute wait timer
- **Quality Gate**: Must pass all CI, staging validation, and manual QA

### 2. `develop` - Integration Branch
- **Purpose**: Integration of all features, continuous staging deployment
- **Protection**: Requires PR, all CI checks must pass
- **Deployment**: Auto-deploys to **staging environment** on every merge
- **Quality Gate**: Full CI validation (lint, build, test, security audit)

## Short-Lived Branches

### 3. `feature/*` - Feature Branches
- **Naming**: `feature/description-of-feature`
- **Created from**: `develop`
- **Merged to**: `develop` via Pull Request
- **Lifespan**: Duration of feature development (hours to days)
- **CI**: Full validation on every push

### 4. `hotfix/*` - Emergency Production Fixes
- **Naming**: `hotfix/description-of-fix`
- **Created from**: `main`
- **Merged to**: Both `main` AND `develop`
- **Lifespan**: Hours (urgent fixes only)
- **Use case**: Critical production bugs that can't wait for normal cycle

## Why Two Branches (Not Three)?

### ❌ Over-Engineering: develop → staging → main
Some teams use three branches:
```
feature/* → develop → staging → main
```

**Problems with this approach:**
1. **Redundant validation**: Staging branch doesn't add quality gates beyond what develop provides
2. **Deployment confusion**: Staging ENVIRONMENT deploys from staging BRANCH, but which branch represents "ready for staging QA"?
3. **Merge overhead**: Every change requires two PRs (develop → staging, staging → main)
4. **Branch drift**: Staging branch can drift from develop, creating merge conflicts
5. **Unclear semantics**: Is staging a "release candidate" or "integration testing"?

### ✅ Best Practice: develop → main (with staging environment)
Our approach uses two branches with two environments:

```
Branches:     feature/* → develop → main
Environments:            staging   production
```

**Benefits:**
1. **Clear semantics**:
   - `develop` = integration-ready code
   - `main` = production-ready code

2. **Environment-based QA**:
   - Staging environment validates develop branch
   - Production environment deploys from main branch

3. **Proper quality gates**:
   ```
   feature → develop (CI runs)
          → staging deploy (auto)
          → QA testing in staging
          → PR to main (CI + review)
          → main merge (tag created)
          → production deploy (approval required)
   ```

4. **Bug prevention at multiple stages**:
   - **Before develop**: CI validation (lint, build, test, security)
   - **In staging**: Real environment testing, integration testing, manual QA
   - **Before main**: Code review, CI re-validation, staging sign-off
   - **Before production**: Manual approval, deployment gates

## Workflow Examples

### New Feature Development

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/add-button-variant

# 2. Develop and commit
# ... make changes ...
git add .
git commit -m "feat: add outline button variant"
git push origin feature/add-button-variant

# 3. CI runs automatically on push
# - Lint check
# - TypeScript check
# - Build all packages
# - Validate theme structure
# - Run tests
# - Security audit

# 4. Create PR to develop
# - CI must pass (enforced)
# - Code review (recommended)
# - Merge to develop

# 5. Auto-deploy to staging
# - Merge triggers deploy-staging.yml workflow
# - Theme uploaded to HubSpot staging portal
# - QA team tests in staging environment

# 6. After staging validation, create PR to main
git checkout main
git pull origin main
git checkout -b release/v1.2.0
git merge develop
git push origin release/v1.2.0

# 7. Create PR: release/v1.2.0 → main
# - CI validation
# - Code review required
# - Merge to main

# 8. Tag and deploy to production
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release v1.2.0: Add outline button variant"
git push origin v1.2.0

# 9. Production deployment (requires approval)
# - Tag triggers deploy-production.yml
# - Strict validation gates
# - Manual approval required
# - Deployed to production portal
```

### Hotfix for Production

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/fix-button-crash

# 2. Fix the issue
# ... make fix ...
git commit -m "fix: resolve button click crash in Safari"
git push origin hotfix/fix-button-crash

# 3. PR to main (expedited review)
# - CI validation
# - Quick review
# - Merge to main

# 4. Tag and deploy immediately
git tag -a v1.2.1 -m "Hotfix v1.2.1: Fix Safari button crash"
git push origin v1.2.1

# 5. Backport to develop
git checkout develop
git merge hotfix/fix-button-crash
git push origin develop
```

## Quality Gates (Bug Prevention)

Our two-branch strategy has **5 quality gates** before production:

### Gate 1: Local Development
- Developer testing
- Pre-commit hooks (if configured)

### Gate 2: CI Validation on Feature Branch
- ✅ ESLint + TypeScript type checking
- ✅ Build all packages successfully
- ✅ Theme structure validation
- ✅ No `@import` in module.css
- ✅ CSS custom properties defined
- ✅ Unit tests pass
- ✅ Security audit (moderate level)

### Gate 3: Code Review (PR to develop)
- ✅ Peer review required
- ✅ CI must pass (enforced)
- ✅ No merge until approved

### Gate 4: Staging Environment (Auto-deploy from develop)
- ✅ Real HubSpot environment testing
- ✅ Integration testing with CMS
- ✅ Manual QA by team
- ✅ Browser compatibility testing
- ✅ Performance validation
- ✅ No ORB errors
- ✅ Module previews work

### Gate 5: Production Deployment (Tag from main)
- ✅ Strict validation (no warnings)
- ✅ High-severity security audit only
- ✅ Critical `@import` check
- ✅ Manual approval required (1-2 reviewers)
- ✅ 5-minute wait timer
- ✅ Post-deployment monitoring

## Branch Protection Rules

### `main` Branch
```yaml
Protection Rules:
  - Require pull request before merging: ✅
  - Require approvals: 1-2
  - Dismiss stale reviews: ✅
  - Require review from Code Owners: ✅ (if CODEOWNERS exists)
  - Require status checks to pass: ✅
    - lint
    - build
    - validate-theme
    - test
    - security-audit
  - Require branches to be up to date: ✅
  - Require conversation resolution: ✅
  - Include administrators: ✅
  - Allow force pushes: ❌
  - Allow deletions: ❌
```

### `develop` Branch
```yaml
Protection Rules:
  - Require pull request before merging: ✅
  - Require approvals: 1 (recommended, not enforced)
  - Require status checks to pass: ✅
    - lint
    - build
    - validate-theme
    - test
    - security-audit
  - Require branches to be up to date: ✅
  - Allow force pushes: ❌
  - Allow deletions: ❌
```

## Environment Configuration

### Staging Environment
```yaml
Environment: staging
Deployment branches: develop
Protection rules:
  - Required reviewers: None (auto-deploy)
  - Wait timer: 0 minutes
  - Deployment branches: Selected branches (develop only)
Secrets:
  - HUBSPOT_STAGING_PORTAL_ID
  - HUBSPOT_STAGING_ACCESS_KEY
```

### Production Environment
```yaml
Environment: production
Deployment branches: Tags only (v*.*.*)
Protection rules:
  - Required reviewers: 1-2 team members
  - Wait timer: 5 minutes (safety buffer)
  - Deployment branches: Tags only
Secrets:
  - HUBSPOT_PROD_PORTAL_ID
  - HUBSPOT_PROD_ACCESS_KEY
```

## Comparison: Alternative Strategies

### Strategy A: Trunk-Based Development
```
feature/* → main (with feature flags)
```
- **Pros**: Simplest, fastest integration
- **Cons**: Requires mature CI/CD, feature flags, high test coverage
- **Verdict**: Not suitable for HubSpot themes (can't use feature flags in CMS)

### Strategy B: GitFlow (Full)
```
feature/* → develop → release/* → main
         ↘         ↗
          hotfix/*
```
- **Pros**: Very structured, clear release management
- **Cons**: Complex, overhead for small teams, release branch redundant with CI/CD
- **Verdict**: Over-engineering for our use case

### Strategy C: GitHub Flow (Simplified)
```
feature/* → main
```
- **Pros**: Very simple
- **Cons**: No staging validation, risky for CMS deployments
- **Verdict**: Too risky for HubSpot production

### Strategy D: Our Approach (GitFlow-Lite)
```
feature/* → develop → main
           (staging)  (production)
```
- **Pros**: Balance of simplicity and safety, environment-based QA, proper gates
- **Cons**: None significant
- **Verdict**: ✅ Best practice for our needs

## Why This Prevents Bugs in Production

### 1. Multiple Validation Layers
Every change goes through:
- Local development → CI (automated) → Staging (real environment) → Code review → Production approval

### 2. Real Environment Testing
- Staging environment is a **real HubSpot portal**
- Tests actual CMS behavior, not just local builds
- Catches ORB errors, module issues, CDN problems

### 3. Automated Quality Checks
- Can't merge to develop without CI passing
- Can't deploy to production without staging validation
- Can't deploy without manual approval

### 4. Human Review Gates
- Code review before merging to develop (recommended)
- Code review before merging to main (required)
- Manual approval before production deployment (required)

### 5. Rollback Safety
- Production tags are immutable
- Easy rollback: create new tag from previous version
- Staging can test rollback process

## Adherence to SDLC

### Planning Phase
- Create feature branch from develop
- Document requirements in PR description

### Development Phase
- Develop in feature branch
- CI validates on every push

### Testing Phase
- Automated tests run in CI
- Manual testing in staging environment

### Review Phase
- Code review via Pull Request
- Staging environment QA sign-off

### Deployment Phase
- Develop → staging (automated)
- Main → production (manual approval)

### Maintenance Phase
- Hotfix branches for urgent fixes
- Regular feature development continues

## Conclusion

**The two-branch strategy (develop + main) with environment-based deployments is the optimal approach for this project because:**

1. ✅ **Not over-engineering**: No redundant branches or unnecessary complexity
2. ✅ **Comprehensive bug prevention**: 5 quality gates before production
3. ✅ **Real environment validation**: Staging catches HubSpot-specific issues
4. ✅ **Clear workflow**: Developers know exactly where code should go
5. ✅ **SDLC compliant**: Covers all phases with proper gates
6. ✅ **Rollback capable**: Easy to revert production issues
7. ✅ **Industry standard**: Widely adopted GitFlow-lite approach

**Adding a third `staging` branch would:**
- ❌ Add merge overhead without additional quality benefits
- ❌ Create confusion between staging branch and staging environment
- ❌ Increase maintenance burden
- ❌ Slow down development velocity
- ❌ Not prevent any bugs that current approach doesn't catch

---

**Last Updated**: 2025-12-31
**Version**: 1.0
