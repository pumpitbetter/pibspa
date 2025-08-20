#!/bin/bash
# Generate changelog from git commits since last version
#
# This script analyzes git commits since the last version and generates
# release notes automatically based on conventional commit messages.
#
# Usage: npm run generate-changelog
#
# Commit message conventions:
# - feat: new features
# - fix: bug fixes  
# - docs: documentation changes
# - style: formatting, missing semicolons, etc
# - refactor: code changes that neither fix bugs nor add features
# - perf: performance improvements
# - test: adding missing tests
# - chore: maintenance tasks

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")

# Try to find the last version tag or commit
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "📋 Generating changelog from last tag: $LAST_TAG to current version: v$CURRENT_VERSION"
    SINCE_REF="$LAST_TAG"
else
    # If no tags, look for the last version commit
    LAST_VERSION_COMMIT=$(git log --oneline --grep="version.*0\." --max-count=1 --format="%H" 2>/dev/null)
    if [ -n "$LAST_VERSION_COMMIT" ]; then
        echo "📋 Generating changelog from last version commit to current version: v$CURRENT_VERSION"
        SINCE_REF="$LAST_VERSION_COMMIT"
    else
        # Fallback to last 10 commits
        echo "📋 No version history found. Generating changelog from last 10 commits"
        SINCE_REF="HEAD~10"
    fi
fi

echo "🔍 Analyzing commits since $SINCE_REF..."
echo ""

# Initialize arrays for different types of changes
declare -a FEATURES=()
declare -a FIXES=()
declare -a DOCS=()
declare -a REFACTOR=()
declare -a PERF=()
declare -a CHORE=()
declare -a OTHER=()

# Get commits since last version
while IFS= read -r line; do
    if [[ -z "$line" ]]; then
        continue
    fi
    
    # Extract commit message (remove hash and merge commit indicators)
    commit_msg=$(echo "$line" | sed 's/^[a-f0-9]* //' | sed 's/^Merge .*//' | sed '/^$/d')
    
    if [[ -z "$commit_msg" ]]; then
        continue
    fi
    
    # Categorize commits based on conventional commit format
    if [[ $commit_msg =~ ^feat(\(.+\))?: ]]; then
        FEATURES+=("${commit_msg#feat*: }")
    elif [[ $commit_msg =~ ^fix(\(.+\))?: ]]; then
        FIXES+=("${commit_msg#fix*: }")
    elif [[ $commit_msg =~ ^docs(\(.+\))?: ]]; then
        DOCS+=("${commit_msg#docs*: }")
    elif [[ $commit_msg =~ ^refactor(\(.+\))?: ]]; then
        REFACTOR+=("${commit_msg#refactor*: }")
    elif [[ $commit_msg =~ ^perf(\(.+\))?: ]]; then
        PERF+=("${commit_msg#perf*: }")
    elif [[ $commit_msg =~ ^(chore|build|ci)(\(.+\))?: ]]; then
        CHORE+=("${commit_msg#*: }")
    else
        # For non-conventional commits, try to guess the type
        if [[ $commit_msg =~ [Ff]ix|[Bb]ug|[Ee]rror ]]; then
            FIXES+=("$commit_msg")
        elif [[ $commit_msg =~ [Aa]dd|[Nn]ew|[Ff]eature ]]; then
            FEATURES+=("$commit_msg")
        elif [[ $commit_msg =~ [Dd]oc|[Rr]eadme ]]; then
            DOCS+=("$commit_msg")
        else
            OTHER+=("$commit_msg")
        fi
    fi
done < <(git log --oneline --no-merges "$SINCE_REF..HEAD" 2>/dev/null)

# Generate formatted changelog
echo "📝 Generated Release Notes:"
echo "=========================="

if [ ${#FEATURES[@]} -gt 0 ]; then
    echo "### 🆕 New Features"
    for item in "${FEATURES[@]}"; do
        echo "- $item"
    done
    echo ""
fi

if [ ${#FIXES[@]} -gt 0 ]; then
    echo "### 🐛 Bug Fixes"
    for item in "${FIXES[@]}"; do
        echo "- $item"
    done
    echo ""
fi

if [ ${#PERF[@]} -gt 0 ]; then
    echo "### ⚡ Performance Improvements"
    for item in "${PERF[@]}"; do
        echo "- $item"
    done
    echo ""
fi

if [ ${#REFACTOR[@]} -gt 0 ]; then
    echo "### 🔧 Code Improvements"
    for item in "${REFACTOR[@]}"; do
        echo "- $item"
    done
    echo ""
fi

if [ ${#DOCS[@]} -gt 0 ]; then
    echo "### 📚 Documentation"
    for item in "${DOCS[@]}"; do
        echo "- $item"
    done
    echo ""
fi

if [ ${#CHORE[@]} -gt 0 ]; then
    echo "### 🛠️ Maintenance"
    for item in "${CHORE[@]}"; do
        echo "- $item"
    done
    echo ""
fi

if [ ${#OTHER[@]} -gt 0 ]; then
    echo "### 📋 Other Changes"
    for item in "${OTHER[@]}"; do
        echo "- $item"
    done
    echo ""
fi

# If no categorized changes found
if [ ${#FEATURES[@]} -eq 0 ] && [ ${#FIXES[@]} -eq 0 ] && [ ${#PERF[@]} -eq 0 ] && [ ${#REFACTOR[@]} -eq 0 ] && [ ${#DOCS[@]} -eq 0 ] && [ ${#CHORE[@]} -eq 0 ] && [ ${#OTHER[@]} -eq 0 ]; then
    echo "### 📋 Changes"
    echo "- Minor updates and improvements"
    echo ""
fi

echo "### 🔗 Platforms"
echo "- iOS: TestFlight ready"
echo "- Android: Play Store Beta ready"
echo "- Web: Production ready"
echo ""

echo "💡 Tip: Copy the above release notes for use in update-version-status"
echo "💡 Or run: npm run update-version-status-auto"