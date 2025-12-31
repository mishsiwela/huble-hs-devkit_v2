# HubSpot Upload Guide

## Prerequisites

1. **HubSpot CLI installed:**
```bash
npm install -g @hubspot/cli
```

2. **Authenticated with HubSpot:**
```bash
hs auth
```

## Upload Process

### Step 1: Build the Theme

```bash
# From project root
cd /Users/sm-home-folder/Documents/dev/huble-hs-devkit_v2

# Build everything (generates macros + bundles modules)
pnpm run build
```

### Step 2: Navigate to Theme Directory

```bash
# Go to the theme app directory
cd apps/hubspot-theme
```

### Step 3: Upload Theme Folder

**IMPORTANT:** Upload the `theme` directory, NOT the current directory

```bash
# Upload theme folder to HubSpot
hs upload theme huble-devkit-theme
```

Or if you want to watch for changes:

```bash
# Watch mode (auto-uploads on file changes)
hs watch theme huble-devkit-theme
```

## Common Issues & Solutions

### Issue 1: "missing field name" Error

**Cause:** Trying to upload from wrong directory (uploading `.` instead of `theme`)

**Solution:**
```bash
# Make sure you're in apps/hubspot-theme directory
pwd  # Should show: .../apps/hubspot-theme

# Upload the theme folder specifically
hs upload theme huble-devkit-theme
```

### Issue 2: "unknown is not a valid field type"

**Cause:** Malformed fields.json in a module

**Solution:** Validate all fields.json files:
```bash
# Run validation
node scripts/validate.js

# Check each module's fields.json
cat theme/modules/*/fields.json | jq '.'
```

### Issue 3: Macros File Upload Issues

**Cause:** HubSpot trying to parse macros as a module/template

**Solution:** Macros are imported by modules, they upload fine as regular templates in the `templates/macros/` directory.

## Correct Upload Command

From `apps/hubspot-theme` directory:

```bash
# Single upload
hs upload theme huble-devkit-theme

# Watch mode
hs watch theme huble-devkit-theme --remove
```

## What Gets Uploaded

```
theme/
├── css/                   # Styles (tokens + components)
├── js/                    # JavaScript (islands system)
├── modules/               # HubSpot modules
│   ├── button.module/
│   ├── card.module/
│   └── hero.module/
├── templates/             # Page templates
│   ├── home.html
│   ├── example-page.html
│   └── macros/
│       └── react-components.html
└── theme.json             # Theme configuration
```

## Verification After Upload

1. Go to HubSpot Design Manager
2. Navigate to "huble-devkit-theme"
3. Check modules are visible in sidebar:
   - ⚡ Button
   - 📇 Card
   - 🎯 Hero
4. Create test page using home.html template
5. Drag modules onto page
6. Configure and publish

## Troubleshooting

### Clear HubSpot Cache

```bash
# Sometimes HubSpot caches bad uploads
# Delete the theme in Design Manager and re-upload
hs remove theme/huble-devkit-theme
hs upload theme huble-devkit-theme
```

### Validate Before Upload

```bash
# Always validate first
pnpm run build

# Check validation output
node scripts/validate.js
```

### Check File Permissions

```bash
# Ensure all files are readable
find theme -type f -exec chmod 644 {} \;
find theme -type d -exec chmod 755 {} \;
```

## Success Checklist

- [ ] Built project (`pnpm run build`)
- [ ] In correct directory (`apps/hubspot-theme`)
- [ ] Uploading `theme` folder (not `.`)
- [ ] HubSpot CLI authenticated
- [ ] Validation passes
- [ ] Theme appears in Design Manager
- [ ] Modules visible in sidebar
- [ ] Modules work when dragged to page
