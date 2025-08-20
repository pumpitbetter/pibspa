#!/bin/bash
# Update VERSION_STATUS.md with current version and auto-generated release notes
#
# This script combines automatic changelog generation with the version status update.
# It analyzes git commits since the last version and generates release notes automatically.
#
# Usage: npm run update-version-status-auto
#
# Workflow:
# 1. Generates changelog from git commits automatically
# 2. Shows preview and allows editing
# 3. Updates VERSION_STATUS.md with the notes
# 4. Creates backup and provides git commands

# Get current version and date
CURRENT_VERSION=$(node -p "require('./package.json').version")
CURRENT_DATE=$(date +%Y-%m-%d)

echo "🔄 Auto-updating VERSION_STATUS.md"
echo "Version: v$CURRENT_VERSION"
echo "Date: $CURRENT_DATE"
echo ""

# Generate changelog automatically
echo "🤖 Generating release notes from git history..."
AUTO_NOTES=$(./scripts/generate-changelog.sh 2>/dev/null | sed -n '/Generated Release Notes:/,/Tip:/p' | sed '1d;$d' | sed 's/^### /## /')

if [ -z "$AUTO_NOTES" ]; then
    echo "⚠️  Could not auto-generate release notes. Using manual input..."
    echo "Enter release notes for v$CURRENT_VERSION (press Enter twice when done):"
    NOTES=""
    while IFS= read -r line; do
        [[ -z "$line" ]] && break
        NOTES="$NOTES- $line\n"
    done
else
    echo "📝 Auto-generated release notes:"
    echo "$AUTO_NOTES"
    echo ""
    echo "Would you like to:"
    echo "1) Use these auto-generated notes"
    echo "2) Edit the notes" 
    echo "3) Enter notes manually"
    read -p "Choose option (1-3): " choice
    
    case $choice in
        1)
            # Convert markdown format for VERSION_STATUS.md
            NOTES=$(echo "$AUTO_NOTES" | sed 's/^## /### /' | sed 's/^- /- /')
            ;;
        2)
            # Save auto-generated notes to temp file for editing
            echo "$AUTO_NOTES" > /tmp/release_notes.md
            echo ""
            echo "Opening notes in editor (nano). Edit and save, then exit..."
            sleep 2
            nano /tmp/release_notes.md
            NOTES=$(cat /tmp/release_notes.md | sed 's/^## /### /' | sed 's/^- /- /')
            rm /tmp/release_notes.md
            ;;
        3)
            echo "Enter release notes for v$CURRENT_VERSION (press Enter twice when done):"
            NOTES=""
            while IFS= read -r line; do
                [[ -z "$line" ]] && break
                NOTES="$NOTES- $line\n"
            done
            ;;
        *)
            echo "Invalid choice. Using auto-generated notes."
            NOTES=$(echo "$AUTO_NOTES" | sed 's/^## /### /' | sed 's/^- /- /')
            ;;
    esac
fi

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
$(echo -e "$NOTES")
- **Platforms:** iOS Beta, Android Beta, Web Production

EOF

# Append existing history (skip first version entry)
if [ -f VERSION_STATUS.md.backup ]; then
    tail -n +20 VERSION_STATUS.md.backup >> VERSION_STATUS.md
fi

echo ""
echo "✅ VERSION_STATUS.md updated to v$CURRENT_VERSION"
echo "📄 Backup saved as VERSION_STATUS.md.backup"
echo ""
echo "Review the changes and commit:"
echo "  git add VERSION_STATUS.md"
echo "  git commit -m 'docs: update version status to v$CURRENT_VERSION'"