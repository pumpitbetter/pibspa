# Git Conventions & Smart Automation

This guide explains how to write effective commit messages that enable automatic changelog generation and better project documentation.

## 🎯 Why Conventional Commits?

Our project uses **Conventional Commits** to:
- ✅ **Auto-generate release notes** for App Store and Play Store
- ✅ **Categorize changes** automatically (features, fixes, docs, etc.)
- ✅ **Track breaking changes** and highlight them prominently  
- ✅ **Improve team communication** with consistent commit history
- ✅ **Enable smart automation** for version management and deployments

## 📝 Conventional Commit Format

### Basic Structure
```
<type>: <description>

[optional body]

[optional footer]
```

### Core Commit Types

| Type | When to Use | Changelog Section | Example |
|------|-------------|------------------|---------|
| `feat:` | New features, functionality | **🆕 New Features** | `feat: add workout progress charts` |
| `fix:` | Bug fixes, error corrections | **🐛 Bug Fixes** | `fix: resolve timer not stopping on pause` |
| `docs:` | Documentation only changes | **📚 Documentation** | `docs: update API installation guide` |
| `style:` | Code formatting, whitespace | **🎨 Style Changes** | `style: fix eslint warnings in auth module` |
| `refactor:` | Code restructuring (no behavior change) | **♻️ Code Refactoring** | `refactor: simplify workout calculation logic` |
| `perf:` | Performance improvements | **⚡ Performance Improvements** | `perf: optimize chart rendering by 60%` |
| `test:` | Adding or updating tests | **🧪 Testing** | `test: add unit tests for exercise service` |
| `build:` | Build system, dependencies | **🔧 Build & CI** | `build: update React Router to v7.3` |
| `ci:` | CI/CD pipeline changes | **🔧 Build & CI** | `ci: add automated Android deployment` |
| `chore:` | Maintenance, version bumps | **🧹 Maintenance** | `chore: update dependencies` |

## 🚀 Real-World Examples

### ✅ Good Conventional Commits

**New Features:**
```bash
git commit -m "feat: add exercise search and filtering
  
Allow users to search exercises by name and filter by:
- Muscle group (chest, back, legs, etc.)
- Equipment type (barbell, dumbbell, bodyweight)
- Difficulty level (beginner, intermediate, advanced)

Closes #42"

git commit -m "feat: implement offline workout sync

- Store workouts locally when offline
- Sync automatically when connection restored  
- Show sync status indicator in UI
- Handle conflicts with timestamp resolution"
```

**Bug Fixes:**
```bash
git commit -m "fix: prevent duplicate exercise entries

Users were able to add the same exercise multiple times
to a workout, causing data inconsistencies. Added validation
to check for existing exercises before adding new ones.

Fixes #38"

git commit -m "fix: resolve crash on iOS when deleting workout

App crashed when user tried to delete workout while
timer was running. Added proper cleanup of timer
resources before deletion.

Tested on iOS 16 and 17 simulators."
```

**Performance Improvements:**
```bash
git commit -m "perf: optimize chart rendering for large datasets

- Implement data virtualization for >1000 data points
- Use memoization for expensive calculations  
- Reduce re-renders by 75%
- Improve initial load time from 3s to 800ms

Benchmarked with 2-year workout history dataset."
```

**Breaking Changes:**
```bash
git commit -m "feat!: migrate to new workout data structure

BREAKING CHANGE: Workout data format has changed to support
advanced analytics. Previous workout data needs migration.

Migration steps:
1. Run 'npm run migrate-workouts' after updating
2. Export data before updating as backup
3. Import will be available if migration fails

This enables:
- Better performance analytics
- Advanced progress tracking
- Integration with fitness devices"
```

### ❌ Avoid These Patterns

**Too vague:**
```bash
git commit -m "updates"
git commit -m "fix stuff"  
git commit -m "changes"
git commit -m "wip"
```

**Missing type:**
```bash
git commit -m "add new feature"
git commit -m "fixed the problem"
git commit -m "updated documentation"
```

**Not descriptive enough:**
```bash
git commit -m "fix: bug"
git commit -m "feat: update"
git commit -m "docs: change"
```

## 🔧 Advanced Patterns

### Scoped Commits (Optional)
Add scope to provide more context:

```bash
git commit -m "feat(auth): add two-factor authentication"
git commit -m "fix(ios): resolve push notification crash"
git commit -m "perf(charts): optimize rendering performance"
git commit -m "docs(api): add workout endpoints guide"
git commit -m "test(auth): add integration tests for login flow"
```

### Multi-line Commit Messages
For complex changes, use the body to explain what and why:

```bash
git commit -m "feat: implement workout analytics dashboard

Add comprehensive analytics for tracking workout progress:

Features:
- Weekly/monthly/yearly progress charts
- Exercise performance trends
- Strength progression tracking  
- Volume and intensity metrics
- Comparison with previous periods

Technical details:
- Uses Chart.js for visualizations
- Implements data aggregation in background
- Caches calculations for performance
- Responsive design for mobile and desktop

This addresses user requests for better progress tracking
and provides insights to improve workout effectiveness.

Closes #45, #52, #61"
```

### Breaking Changes
Always use `!` after the type and include `BREAKING CHANGE:` in footer:

```bash
git commit -m "feat!: redesign authentication system

Complete overhaul of user authentication to improve security
and support social login providers.

BREAKING CHANGE: Previous authentication tokens are no longer
valid. Users will need to log in again after this update.

New features:
- OAuth support for Google, Apple, Facebook
- Improved security with JWT tokens
- Biometric authentication on mobile
- Session management across devices

Migration required: None - users just need to re-authenticate."
```

## 🤖 How Smart Automation Works

### Automatic Changelog Generation

Our `generate-changelog.sh` script analyzes your commits and creates professional release notes:

```bash
npm run generate-changelog
```

**Input (your commits):**
```
feat: add workout progress tracking
fix: resolve timer synchronization issue  
perf: optimize chart rendering performance
docs: update deployment guide
```

**Output (auto-generated):**
```markdown
## 🆕 New Features
- Add workout progress tracking with visual charts

## 🐛 Bug Fixes
- Resolve timer synchronization issue during workouts

## ⚡ Performance Improvements  
- Optimize chart rendering performance by 60%

## 📚 Documentation
- Update deployment troubleshooting guide
```

### Smart Categorization Rules

The automation script:
- **Groups by type:** All `feat:` commits → New Features section
- **Filters noise:** Ignores merge commits, version bumps, and `chore:` commits
- **Prioritizes importance:** Breaking changes appear first, then features, then fixes
- **Handles scopes:** `feat(auth): login` becomes "Login (Auth module)"
- **Detects patterns:** Recognizes common patterns like "add", "implement", "improve"
- **Formats consistently:** Creates markdown ready for App Store, Play Store, or docs

### Integration with Deployments

**Complete automated workflow:**
```bash
# 1. Develop with conventional commits
git commit -m "feat: add exercise video previews"
git commit -m "fix: resolve offline sync conflicts"

# 2. Bump version 
npm run bump minor  # 0.1.1 → 0.2.0 (syncs all configs automatically)

# 3. Deploy with auto-generated release notes
npm run update-version-status-auto  # Uses smart changelog
npm run ios:beta && npm run android:beta

# 4. Commit updated documentation
git add VERSION_STATUS.md
git commit -m "docs: update version status to v0.2.0"
```

## 📋 Commit Message Templates

### Setup Git Template
Create a template to make conventional commits easier:

```bash
# Create global commit template
cat > ~/.gitmessage << 'EOF'
# <type>: <subject line> (50 characters max)
#
# <body> - Explain what and why, not how (72 chars per line)
#
# <footer> - Reference issues, breaking changes
#
# Types:
#   feat:     New feature or functionality
#   fix:      Bug fix or error correction
#   docs:     Documentation only changes
#   style:    Code formatting, whitespace (no logic changes)
#   refactor: Code restructuring (no behavior change)
#   perf:     Performance improvements
#   test:     Adding or updating tests
#   build:    Build system or dependency changes
#   ci:       CI/CD pipeline changes
#   chore:    Maintenance tasks, version bumps
#
# Breaking changes: Add ! after type (feat!:) and BREAKING CHANGE: in footer
# Example: feat!: redesign user authentication
#
# Reference issues: Closes #123, Fixes #456, Refs #789
EOF

# Configure git to use the template
git config --global commit.template ~/.gitmessage
```

**Usage:**
```bash
git commit  # Opens editor with template and guidelines
```

### Quick Reference Template
For team members, create a quick reference:

```bash
# Common patterns:
git commit -m "feat: add [new functionality]"
git commit -m "fix: resolve [specific problem]"  
git commit -m "perf: optimize [what was improved]"
git commit -m "docs: update [what documentation]"
git commit -m "refactor: simplify [what code]"
git commit -m "test: add [what tests]"

# With scope (optional):
git commit -m "feat(auth): add social login"
git commit -m "fix(ios): resolve crash on startup"

# Breaking changes:
git commit -m "feat!: redesign data structure

BREAKING CHANGE: Previous data format no longer supported.
Run migration script after updating."
```

## 🏆 Best Practices

### ✅ Do This

**Write clear, actionable descriptions:**
```bash
✅ git commit -m "feat: add push notifications for workout reminders"
✅ git commit -m "fix: resolve memory leak in chart component"
✅ git commit -m "perf: reduce app startup time by 40%"
```

**Include context in body for complex changes:**
```bash
git commit -m "feat: implement offline workout sync

Store workouts locally when device is offline and sync
automatically when connection is restored. Handles
conflicts by preferring most recent data.

Closes #34"
```

**Use consistent terminology:**
- "add" for new features
- "implement" for new systems
- "resolve" or "fix" for bug fixes
- "optimize" or "improve" for performance
- "update" for changes to existing features

### ❌ Avoid This

**Vague or generic messages:**
```bash
❌ git commit -m "fix: bug"
❌ git commit -m "feat: update"
❌ git commit -m "changes"
```

**Implementation details instead of user impact:**
```bash
❌ git commit -m "feat: add useEffect hook to component"
✅ git commit -m "feat: auto-save workout progress"
```

**Multiple unrelated changes in one commit:**
```bash
❌ git commit -m "feat: add charts and fix auth bug and update docs"
✅ Split into separate commits with different types
```

## 📊 Team Guidelines

### Code Review Integration
When reviewing PRs, check for:
- ✅ Conventional commit format used
- ✅ Commit messages are descriptive  
- ✅ Breaking changes are properly marked
- ✅ Related commits are grouped logically
- ✅ No "fix typo" or "wip" commit messages

### Release Process Integration
1. **Feature Development:** Use `feat:` commits
2. **Bug Fixes:** Use `fix:` commits  
3. **Pre-release:** Run `npm run generate-changelog` to preview
4. **Version Bump:** `npm run bump [patch|minor|major]` (syncs all configs)
5. **Deploy:** `npm run update-version-status-auto` for AI-assisted release notes
6. **Documentation:** Commit the updated VERSION_STATUS.md

### Onboarding New Team Members
1. Share this guide and the commit template
2. Show examples of good vs. bad commit messages
3. Demonstrate the changelog generation tools
4. Practice with conventional commits on feature branches
5. Include commit message review in code review process

## 🔗 Related Documentation

- **[VERSION_MANAGEMENT.md](../VERSION_MANAGEMENT.md)** - Complete version strategy and automation
- **[BUILD.md](../BUILD.md)** - Build processes and deployment workflows  
- **[scripts/generate-changelog.sh](../scripts/generate-changelog.sh)** - Automated changelog generation
- **[scripts/update-version-status-auto.sh](../scripts/update-version-status-auto.sh)** - AI-assisted documentation updates

## 💡 Tips for Success

### Start Simple
Begin with basic conventional commits:
```bash
feat: add [feature name]
fix: resolve [problem description]
docs: update [documentation type]
```

### Gradually Add Detail
As you get comfortable, add more context:
```bash
feat: add exercise video previews

Allow users to preview exercise demonstrations
before adding to workout. Supports mp4 format
with automatic thumbnail generation.

Closes #67
```

### Use Tools
- **Git aliases:** `git config alias.cf "commit --template=~/.gitmessage"`
- **IDE extensions:** Many editors have conventional commit plugins
- **Pre-commit hooks:** Validate commit message format automatically
- **Team standards:** Establish team-specific conventions for scopes

### Measure Success
- Check changelog quality after each release
- Monitor how well auto-generated notes work for app stores
- Gather team feedback on commit message clarity
- Track time saved in release note preparation

---

**Remember:** Good commit messages are a gift to your future self and your team. They make understanding changes easier, enable powerful automation, and create better documentation for your users.