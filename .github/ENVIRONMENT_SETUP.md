# GitHub Environment Configuration Guide

## Overview

This project uses GitHub Environments for deployment to HubSpot:
- **Staging**: Automatic deployment from `develop` branch
- **Production**: Manual deployment via tags or workflow dispatch

## Setup Instructions

### 1. Create GitHub Environments

Navigate to your repository: `Settings → Environments → New environment`

#### Staging Environment

1. **Name**: `staging`
2. **Deployment branches**: `develop`
3. **Environment secrets**:
   - `HUBSPOT_STAGING_PORTAL_ID`: Your HubSpot staging portal ID
   - `HUBSPOT_STAGING_ACCESS_KEY`: Personal access key for staging

4. **Protection rules** (optional):
   - ☐ Required reviewers: None (auto-deploy)
   - ☑ Wait timer: 0 minutes
   - ☑ Deployment branches: Selected branches (develop)

#### Production Environment

1. **Name**: `production`
2. **Deployment branches**: Tags only (`v*.*.*`)
3. **Environment secrets**:
   - `HUBSPOT_PROD_PORTAL_ID`: Your HubSpot production portal ID
   - `HUBSPOT_PROD_ACCESS_KEY`: Personal access key for production

4. **Protection rules** (REQUIRED):
   - ☑ Required reviewers: 1-2 team members
   - ☑ Wait timer: 5 minutes (safety buffer)
   - ☑ Deployment branches: Tags only

### 2. Configure HubSpot Personal Access Keys

#### Create Access Keys in HubSpot

1. Log into HubSpot (staging/production account)
2. Navigate to: `Settings → Integrations → Private Apps`
3. Create a new private app:
   - **Name**: `GitHub Actions CI/CD`
   - **Scopes**:
     - `cms.content.read`
     - `cms.content.write`
     - `cms.themes.read`
     - `cms.themes.write`
4. Copy the access token

#### Add Secrets to GitHub

1. Repository → `Settings → Secrets and variables → Actions`
2. Add new repository secrets:
   - **Staging**:
     - Name: `HUBSPOT_STAGING_PORTAL_ID`
     - Value: Your staging portal ID (e.g., `12345678`)
     - Name: `HUBSPOT_STAGING_ACCESS_KEY`
     - Value: The private app access token
   - **Production**:
     - Name: `HUBSPOT_PROD_PORTAL_ID`
     - Value: Your production portal ID
     - Name: `HUBSPOT_PROD_ACCESS_KEY`
     - Value: The private app access token

### 3. Branch Strategy

```
main (production-ready code)
  ↑
  └── develop (staging environment)
       ↑
       └── feature/* (feature branches)
```

**Workflow:**
1. Create feature branch from `develop`
2. Push to feature branch → CI runs (build, test, validate)
3. Open PR to `develop` → CI runs + review
4. Merge to `develop` → Auto-deploy to staging
5. Test in staging environment
6. Create PR from `develop` to `main` → Review
7. Merge to `main` and create tag → Deploy to production

### 4. Deployment Process

#### Staging Deployment (Automatic)

```bash
# Merge to develop branch
git checkout develop
git merge feature/your-feature
git push origin develop

# Triggers: .github/workflows/deploy-staging.yml
# Result: Auto-deploys to HubSpot staging portal
```

#### Production Deployment (Manual)

```bash
# Create a release tag
git checkout main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Triggers: .github/workflows/deploy-production.yml
# Result: Creates release + requires approval → deploys to production
```

### 5. Rollback Procedure

If production deployment fails:

```bash
# Revert to previous tag
git checkout v1.0.0-previous
git tag -a v1.0.1-rollback -m "Rollback to v1.0.0"
git push origin v1.0.1-rollback
```

---

**Last Updated:** 2025-12-31
