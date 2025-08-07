# Development Environment Setup

This guide walks you through setting up your development environment for PumpItBetter on macOS.

## 📋 Prerequisites

- **macOS**: This guide is specifically for macOS users
- **Apple Developer Account**: Required for iOS development and deployment
- **Homebrew**: macOS package manager (we'll install this first)

## 🛠️ Core Development Tools

### 1. Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js and npm

```bash
brew install node
```

Verify installation:
```bash
node --version  # Should be 18+ or higher
npm --version
```

### 3. Install Git (if not already installed)

```bash
brew install git
```

### 4. Install Xcode and Command Line Tools

1. **Install Xcode from App Store**
   - Search for "Xcode" in App Store
   - Download and install (this is large, ~10GB)

2. **Install Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```

3. **Accept Xcode License**
   ```bash
   sudo xcodebuild -license accept
   ```

## 🦀 Rust Development Environment

### Install Rust Toolchain

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.zshrc
```

Verify installation:
```bash
rustc --version
cargo --version
```

### Add iOS Targets

```bash
rustup target add aarch64-apple-ios
rustup target add x86_64-apple-ios
rustup target add aarch64-apple-ios-sim
```

## 📱 iOS Development Setup

### 1. Install Ruby with rbenv (Required for Fastlane)

**Why rbenv?** Fastlane recommends using a Ruby version manager instead of system Ruby.

```bash
# Install rbenv and ruby-build
brew install rbenv ruby-build

# Add rbenv to your shell
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
source ~/.zshrc

# Check available Ruby versions (install the latest)
rbenv install --list | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | tail -5

# Install latest stable Ruby (currently 3.4.5)
rbenv install 3.4.5

# Set as global default
rbenv global 3.4.5 && rbenv rehash

# Verify installation
ruby --version && gem --version
```

### 2. Install Fastlane and Dependencies

```bash
# Install Fastlane
gem install fastlane

# Install dotenv gem for automatic .env loading
gem install dotenv
```

Verify installation:
```bash
fastlane --version
gem list dotenv
```

### 3. Apple Developer Account Setup

#### Required Apple Developer Resources

For iOS development and deployment, you need:

1. **Apple Developer Account** ($99/year)
   - Individual or Organization account
   - Enrolled and active

2. **App Identifier (Bundle ID)**
   - Registered in Apple Developer Portal
   - Format: `com.pumpitbetter.app`

3. **Apple Distribution Certificate**
   - For App Store distribution
   - Generated in Apple Developer Portal

4. **App Store Provisioning Profile**
   - Links your app ID and distribution certificate
   - Enables App Store distribution

#### Setting Up Certificates and Provisioning Profiles

**Option 1: Automatic Management (Recommended)**

FastLane can automatically create and manage certificates for you:

```bash
# Initialize FastLane for your project
cd fastlane
fastlane cert  # Creates distribution certificate if needed
fastlane sigh  # Creates provisioning profile if needed
```

This will:
- Create an Apple Distribution certificate in your Keychain
- Generate an App Store provisioning profile
- Download and install both automatically

**Option 2: Manual Setup via Apple Developer Portal**

1. **Create App Identifier:**
   - Go to [developer.apple.com](https://developer.apple.com) → **Certificates, Identifiers & Profiles**
   - Click **Identifiers** → **+** (Add)
   - Select **App IDs** → **App**
   - Bundle ID: `com.pumpitbetter.app`
   - Description: "Pump It Better"
   - Capabilities: Enable as needed

2. **Create Apple Distribution Certificate:**
   - Go to **Certificates** → **+** (Add)
   - Select **Apple Distribution** (for App Store)
   - Follow prompts to generate Certificate Signing Request (CSR)
   - Download and install certificate in Keychain

3. **Create App Store Provisioning Profile:**
   - Go to **Profiles** → **+** (Add)
   - Select **App Store** distribution
   - Choose your App ID (`com.pumpitbetter.app`)
   - Select your Apple Distribution certificate
   - Name: "com.pumpitbetter.app AppStore"
   - Download and install profile

#### Certificate and Profile Verification

**Check installed certificates:**
```bash
# List all code signing certificates
security find-identity -v -p codesigning

# Should show something like:
# 1) ABC123DEF456GHI789JKL012MNO345PQR678STU9 "Apple Distribution: Your Name (TEAM_ID)"
```

**Check provisioning profiles:**
```bash
# List installed provisioning profiles
ls ~/Library/MobileDevice/Provisioning\ Profiles/

# Check profile details
fastlane sigh --readonly
```

**Verify FastLane can access your setup:**
```bash
cd fastlane
fastlane cert --readonly  # Shows your certificates
fastlane sigh --readonly  # Shows your provisioning profiles
```

#### Troubleshooting Certificate Issues

**"No valid code signing identity found"**
```bash
# Check if certificate is in keychain
security find-identity -v -p codesigning

# If missing, regenerate certificate
fastlane cert --force
```

**"Provisioning profile not found"**
```bash
# Regenerate provisioning profile
fastlane sigh --force

# Or create new one with specific name
fastlane sigh --force --app_identifier com.pumpitbetter.app --provisioning_name "com.pumpitbetter.app AppStore"
```

**"Certificate is not valid"**
- Check certificate expiration in Keychain Access
- Regenerate if expired: `fastlane cert --force`
- Ensure certificate is for correct Team ID

## 🔐 Certificate Management & Team Sharing

### Backing Up Certificates

**Export certificates for team sharing:**
```bash
# Export certificate and private key from Keychain
# 1. Open Keychain Access
# 2. Find "Apple Distribution: Your Name (TEAM_ID)"
# 3. Right-click → Export → Save as .p12 file
# 4. Set a password for the .p12 file

# Or use command line:
security find-certificate -c "Apple Distribution" -p > apple_distribution.cer
```

**Create certificate backup script:**
```bash
#!/bin/bash
# backup-certificates.sh

# Create backup directory
mkdir -p ~/ios-certificates-backup

# Export distribution certificate
security find-certificate -c "Apple Distribution" -p > ~/ios-certificates-backup/apple_distribution.cer

# Copy provisioning profiles
cp ~/Library/MobileDevice/Provisioning\ Profiles/* ~/ios-certificates-backup/

echo "Certificates backed up to ~/ios-certificates-backup/"
```

### Restoring Certificates on New Machine

**For new team members or new development machine:**

1. **Get certificate files from team:**
   - Apple Distribution certificate (.cer or .p12)
   - App Store provisioning profile (.mobileprovision)

2. **Install certificate:**
   ```bash
   # Double-click .cer file to install in Keychain
   # OR import .p12 file with password
   
   # Verify installation
   security find-identity -v -p codesigning
   ```

3. **Install provisioning profile:**
   ```bash
   # Double-click .mobileprovision file
   # OR copy to profiles directory
   cp profile.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/
   ```

4. **Test setup:**
   ```bash
   cd fastlane
   fastlane cert --readonly
   fastlane sigh --readonly
   ```

### Certificate Management Options

**Current Setup (Recommended)**: This project uses automatic certificate management via FastLane `cert` and `sigh` actions:

```bash
cd fastlane

# Check certificate status  
fastlane cert --readonly

# Check provisioning profile status
fastlane sigh --readonly --app_identifier com.pumpitbetter.app
```

**Benefits of Current Approach:**
- Simple setup and maintenance
- Automatic certificate/profile creation when needed
- Works seamlessly with single developer or small teams
- No additional repository setup required
- Certificates stored locally and managed automatically

**Alternative: FastLane Match (For Large Teams)**

If you have a large team and need centralized certificate management, FastLane Match can be considered:

```bash
# Would require additional setup (not currently implemented)
fastlane match init
fastlane match appstore
```

**Note**: This project currently uses the simpler `cert`/`sigh` approach which works perfectly for the current team size.

### 4. iOS Simulator (Optional for Development)

Open Xcode and go to:
- **Xcode** → **Settings** → **Platforms**
- Download iOS simulators you want to test on

## ⚡ Tauri Setup

### Install Tauri CLI

```bash
npm install -g @tauri-apps/cli
```

Verify installation:
```bash
npx tauri --version
```

## 🔧 Project Setup

### 1. Clone and Setup Project

```bash
# Clone the repository
git clone [repository-url]
cd pibspa

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your Apple Developer credentials
nano .env
```

Fill in these values in your `.env` file:

```properties
# Apple Developer credentials (DO NOT COMMIT THIS FILE)
APPLE_ID="your-apple-id@email.com"           # Your Apple Developer account email
APP_SPECIFIC_PASSWORD="your-app-password"    # Generated from appleid.apple.com
TEAM_ID="YOUR_APPLE_TEAM_ID"                 # 10-character string from developer.apple.com
BUNDLE_ID="com.pumpitbetter.app"             # App identifier (already set)
APP_NAME="Pump It Better"                    # App display name (already set)
```

**Variable Mapping:**
- `APPLE_ID` → Your Apple Developer account email address
- `APP_SPECIFIC_PASSWORD` → App-specific password for two-factor authentication  
- `TEAM_ID` → Your Apple Developer Team ID (found in Membership Details)
- `BUNDLE_ID` → App bundle identifier (pre-configured for this project)
- `APP_NAME` → App display name (pre-configured for this project)

### 3. Apple Developer Credentials Setup

#### Get your Team ID:
1. Go to [developer.apple.com](https://developer.apple.com)
2. Sign in → **Account** → **Membership Details**
3. Copy your Team ID (10-character string like `ABCD123456`)
4. **Add to `.env` file**: `TEAM_ID="YOUR_ACTUAL_TEAM_ID"`

#### Generate App Specific Password:
1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in → **Security** → **App-Specific Passwords**
3. Click **Generate Password**
4. Label it "Fastlane PumpItBetter"
5. Copy the generated password (format: `abcd-efgh-ijkl-mnop`)
6. **Add to `.env` file**: `APP_SPECIFIC_PASSWORD="your-actual-password"`

> **Important:** App-specific passwords are required for two-factor authentication accounts. Regular Apple ID passwords will not work with FastLane.

#### Verify Apple Developer Account Access

**Test your credentials:**
```bash
# Test Apple ID login (will prompt for credentials)
fastlane spaceauth -u your-apple-id@email.com

# Should show: "Login successful"
```

#### Certificate and Profile Management

Your certificates and provisioning profiles will be automatically managed by FastLane during the first build. The automation will:

1. **Check for existing Apple Distribution certificate**
2. **Create certificate if missing** (requires admin approval)
3. **Check for App Store provisioning profile**
4. **Create profile if missing**
5. **Update Xcode project with correct signing settings**

**Manual verification (optional):**
```bash
cd fastlane

# Check certificate status
fastlane cert --readonly

# Check provisioning profile status  
fastlane sigh --readonly --app_identifier com.pumpitbetter.app
```

## ✅ Verify Installation

Test that everything is working:

### 1. Frontend Development
```bash
npm run dev
```
Should start the development server at `http://localhost:5173`

### 2. Desktop App
```bash
npm run tauri:dev
```
Should open the desktop app

### 3. iOS Simulator
```bash
npm run ios:dev
```
Should build and open in iOS Simulator (will prompt you to select a simulator)

**Note:** On first run, you'll need to:
1. Select a simulator from the list (e.g., iPhone 16 = option 12)
2. Wait for the initial build (can take 3-5 minutes)
3. The iOS Simulator should open with your app

### 4. Fastlane Automated Setup

**Test the complete automated workflow:**
```bash
npm run ios:beta
```

This will:
- ✅ Build React Router frontend
- ✅ Compile Tauri iOS app  
- ✅ Automatically handle code signing
- ✅ Create .ipa file
- ✅ Upload to TestFlight
- ✅ **Zero manual intervention required**

**Expected output:**
```
[17:02:06]: Using app-specific password authentication from .env file
[17:02:07]: Login successful
[17:02:38]: Upload to TestFlight complete! 🎉
```

**On first run, FastLane may:**
- Create Apple Distribution certificate (if missing)
- Generate App Store provisioning profile (if missing)
- Prompt for admin approval for certificate creation

cd fastlane && fastlane --version
```
Should show Fastlane version without errors

## 🔍 Troubleshooting

### Common Issues

**"command not found: brew"**
- Restart terminal after installing Homebrew
- Make sure Homebrew is in your PATH

**"command not found: tauri"**
```bash
npm install -g @tauri-apps/cli
```

**Ruby/rbenv issues**
```bash
# Check rbenv is in PATH
which rbenv

# If not found, add to shell:
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
source ~/.zshrc
```

**iOS build failures**
- Ensure Xcode is installed and license accepted
- Check Apple Developer credentials in `.env`
- Make sure iOS targets are installed: `rustup target list --installed`
- Run `npx tauri ios init` to initialize iOS project
- Verify Team ID is set in `src-tauri/tauri.conf.json`

**Certificate/provisioning issues**
```bash
# Check certificate is installed
security find-identity -v -p codesigning

# Check provisioning profiles
ls ~/Library/MobileDevice/Provisioning\ Profiles/

# Regenerate if needed
cd fastlane
fastlane cert --force
fastlane sigh --force
```

**FastLane authentication errors**
- Verify App Specific Password is correct in `.env`
- Check Team ID matches your Apple Developer account  
- Test login: `fastlane spaceauth -u your-apple-id@email.com`
- Ensure bundle ID is registered in Apple Developer Portal

**"No valid signing identity found"**
- Install Xcode and accept license: `sudo xcodebuild -license accept`
- Check Apple Developer account has valid certificates
- Run certificate setup: `cd fastlane && fastlane cert`

**Tauri export errors (expected)**
- This is a known limitation with Tauri iOS export
- The workflow automatically falls back to manual .ipa creation
- Final .ipa file quality is not affected

## 🎯 Next Steps

After completing setup:

1. **Read BUILD.md** - Learn about build processes and deployment
2. **Run tests** - `npm test` to verify everything works
3. **Make a test build** - Try `npm run ios:build` to test iOS pipeline
4. **Join development** - You're ready to contribute!

## 📚 Additional Resources

- [Tauri Documentation](https://tauri.app/v2/guides/)
- [React Router Documentation](https://reactrouter.com/)
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Rust Documentation](https://doc.rust-lang.org/)

## 🆘 Getting Help

If you encounter issues:

1. Check this setup guide again
2. Look at error messages carefully
3. Search existing GitHub issues
4. Ask the team in Slack/Discord
5. Create a new issue with full error details

---

**Last Updated:** August 2025  
**Target Platform:** macOS only  
**Estimated Setup Time:** 30-60 minutes (depending on download speeds)  
**Ruby Version:** 3.4.5+ (via rbenv)  
**FastLane:** 2.x with automatic .env loading  
**iOS Automation:** Fully automated TestFlight deployment
