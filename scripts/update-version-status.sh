#!/bin/bash
# Update VERSION_STATUS.md with current version and deployment information
#
# This script automates the documentation process after version deployments.
# It reads the current version from package.json, prompts for release notes,
# and updates the VERSION_STATUS.md file with:
# - Current version across all platforms  
# - Today's date as release date
# - User-provided release notes
# - Preserved version history
#
# Usage: npm run update-version-status
#
# Interactive workflow:
# 1. Enter release notes (one per line)
# 2. Press Enter twice when finished
# 3. Review generated VERSION_STATUS.md
# 4. Commit changes with provided git commands
#
# The script creates a backup file and preserves existing version history.

# Get current version and date
CURRENT_VERSION=$(node -p "require('./package.json').version")
CURRENT_DATE=$(date +%Y-%m-%d)

echo "🔄 Updating VERSION_STATUS.md"
echo "Version: v$CURRENT_VERSION"
echo "Date: $CURRENT_DATE"
echo ""

# Prompt for release notes
echo "Enter release notes for v$CURRENT_VERSION (press Enter twice when done):"
NOTES=""
while IFS= read -r line; do
    [[ -z "$line" ]] && break
    NOTES="$NOTES- $line\n"
done

# Create backup
cp VERSION_STATUS.md VERSION_STATUS.md.backup

# Create updated content
cat > VERSION_STATUS.md << EOF
# Version Deployment Status

## Current Versions

| Platform   | Version | Status             | Released    | Notes                 |
|------------|---------|--------------------|-------------|-----------------------|
| SPA Web    | $CURRENT_VERSION   | 🟢 Production      | $CURRENT_DATE  | Current live version  |
| iOS        | $CURRENT_VERSION   | 🟡 TestFlight      | $CURRENT_DATE  | In beta testing       |
| Android    | $CURRENT_VERSION   | 🟡 Play Store Beta | $CURRENT_DATE  | In beta testing       |

## Version History

### v$CURRENT_VERSION ($CURRENT_DATE)
$(echo -e "$NOTES")- **Platforms:** iOS Beta, Android Beta, Web Production

EOF

# Append existing history (skip first version entry)
tail -n +20 VERSION_STATUS.md.backup >> VERSION_STATUS.md

echo "✅ VERSION_STATUS.md updated to v$CURRENT_VERSION"
echo "📄 Backup saved as VERSION_STATUS.md.backup"
echo ""
echo "Review the changes and commit:"
echo "  git add VERSION_STATUS.md"
echo "  git commit -m 'docs: update version status to v$CURRENT_VERSION'"