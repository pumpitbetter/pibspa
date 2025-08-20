#!/bin/bash
# Update VERSION_STATUS.md with current version and date

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