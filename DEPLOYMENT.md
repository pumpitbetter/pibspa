# 🚀 Deployment Strategy Guide

This document outlines the recommended deployment architecture and strategies for PumpItBetter's dual-build system.

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Deployment Strategy](#-deployment-strategy)
- [Build Outputs](#-build-outputs)
- [Deployment Options](#-deployment-options)
- [Recommended Setup](#-recommended-setup)
- [Deployment Commands](#-deployment-commands)
- [Domain Configuration](#-domain-configuration)
- [Environment Variables](#-environment-variables)
- [Monitoring & Analytics](#-monitoring--analytics)

## 🏗️ Architecture Overview

PumpItBetter uses a **dual-build architecture** that creates two separate, optimized deployments:

```
┌─────────────────────────────────────────────────────────────┐
│                    SINGLE CODEBASE                         │
│                  /app, /components, /lib                   │
└─────────────┬─────────────────────────┬─────────────────────┘
              │                         │
              ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │   SPA BUILD     │       │   SSR BUILD     │
    │ Fitness App     │       │ Marketing Site  │
    └─────────────────┘       └─────────────────┘
              │                         │
              ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │ MOBILE/DESKTOP  │       │   WEB MARKETING │
    │ Tauri Apps     │       │ Server-rendered │
    │ + Optional Web  │       │ SEO Optimized   │
    └─────────────────┘       └─────────────────┘
```

## 🎯 Deployment Strategy

### **Recommended: Separate Deployments**

Deploy each build independently for maximum flexibility and performance:

#### **1. 🏃‍♂️ Fitness Application (SPA)**
- **Primary**: Bundled in Tauri for iOS/Android/Desktop apps
- **Secondary**: Web version for browser access
- **Routes**: `/app/*`, workout tracking, progress charts
- **Hosting**: Static hosting (Netlify, Vercel, S3+CloudFront)

#### **2. 🌐 Marketing Website (SSR)**
- **Purpose**: Public landing pages, SEO, lead generation
- **Routes**: `/`, `/features`, `/pricing`, `/blog`
- **Hosting**: Node.js server (Railway, Render, AWS ECS)

## 📦 Build Outputs

Each build creates optimized, deployment-ready artifacts:

```bash
npm run build:all
```

**Output Structure:**
```
build/
├── client/              # SPA Build (Static Files)
│   ├── assets/         # JS, CSS, images (hashed)
│   ├── index.html      # App entry point
│   └── manifest.json   # PWA manifest
└── ssr/                # SSR Build (Node.js Server)
    ├── client/         # Client-side assets
    ├── server/         # Server-side code
    └── index.js        # Server entry point
```

## 🛠️ Deployment Options

### **Option 1: Separate Domains (Recommended)**

```
🌐 pumpitbetter.com        → Marketing Website (SSR)
🏃‍♂️ app.pumpitbetter.com     → Fitness App (SPA) 
📱 Mobile/Desktop Apps     → Tauri (embeds SPA)
```

**Benefits:**
- ✅ Independent scaling and optimization
- ✅ Different hosting requirements (static vs server)
- ✅ Isolated deployments and rollbacks
- ✅ Clear separation of concerns
- ✅ SEO-optimized marketing + fast SPA app

### **Option 2: Single Domain with Routing**

```
🌐 pumpitbetter.com/       → Marketing Website (SSR)
🏃‍♂️ pumpitbetter.com/app/* → Fitness App (SPA)
```

**Benefits:**
- ✅ Single domain management
- ✅ Shared SSL certificate
- ⚠️ Requires complex routing configuration

## 🎯 Recommended Setup

### **Marketing Website Deployment**

**Platform Options:**
- **Railway** (Recommended) - Auto-deploy from GitHub
- **Render** - Simple Node.js hosting  
- **Vercel** - Serverless with SSR support
- **AWS ECS** - Enterprise scalability

**Commands:**
```bash
# Build marketing website
npm run build:ssr

# Deploy to Railway/Render/etc.
# (Platform-specific deployment process)
```

### **Fitness App Deployment**

#### **Mobile/Desktop (Primary)**
```bash
# iOS
npm run ios:build
npm run ios:beta      # TestFlight
npm run ios:release   # App Store

# Android  
npm run android:build
npm run android:beta  # Play Store Beta
npm run android:release # Play Store

# Desktop
npm run desktop:build
```

#### **Web App (Secondary)**
```bash
# Build static SPA
npm run build:spa

# Deploy to static hosting
# Netlify, Vercel, S3+CloudFront
```

## 🌍 Domain Configuration

### **Recommended DNS Setup**

```dns
; Main marketing domain
pumpitbetter.com          A     [SSR-SERVER-IP]
www.pumpitbetter.com      CNAME pumpitbetter.com

; App subdomain (optional web access)
app.pumpitbetter.com      CNAME [CDN-ENDPOINT]

; API subdomain (if needed)
api.pumpitbetter.com      A     [API-SERVER-IP]
```

### **SSL Certificates**

- **Marketing Site**: Server-managed (Let's Encrypt, Railway/Render)
- **App Domain**: CDN-managed (Netlify, Vercel, CloudFront)

## 🔑 Environment Variables

### **Marketing Website (SSR)**
```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database (if needed)
DATABASE_URL=postgresql://...

# Email/Forms
SENDGRID_API_KEY=...
MAILCHIMP_API_KEY=...

# Analytics
GOOGLE_ANALYTICS_ID=...
```

### **Fitness App (SPA)**
```env
# App Configuration  
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.pumpitbetter.com

# Analytics
VITE_ANALYTICS_ID=...

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=true
```

## 📊 Monitoring & Analytics

### **Marketing Website**
- **SEO**: Google Search Console, Ahrefs
- **Analytics**: Google Analytics, Plausible
- **Performance**: Google PageSpeed, Core Web Vitals
- **Uptime**: UptimeRobot, Pingdom

### **Fitness Application**
- **App Analytics**: App Store Connect, Google Play Console
- **Crash Reporting**: Sentry, Bugsnag
- **Performance**: Tauri performance metrics
- **User Analytics**: PostHog, Mixpanel

## 🚀 Complete Deployment Workflow

### **1. Development**
```bash
# SPA development (main app)
npm run dev:spa

# SSR development (marketing)
npm run dev:ssr
```

### **2. Version Management**
```bash
# Bump version for release
npm run bump minor

# Update deployment status
npm run update-version-status
```

### **3. Build & Deploy**
```bash
# Build both targets
npm run build:all

# Deploy marketing website
# (Platform-specific process)

# Deploy static app (optional web version)
# (CDN deployment process)

# Build and deploy mobile apps
npm run ios:beta
npm run android:beta
```

### **4. Post-Deployment**
- ✅ Test both marketing site and app
- ✅ Monitor performance metrics
- ✅ Update VERSION_STATUS.md
- ✅ Notify team of successful deployment

## 🔄 CI/CD Integration

### **GitHub Actions Example**

```yaml
name: Deploy Production
on:
  push:
    tags: ['v*']

jobs:
  deploy-marketing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build:ssr
      - run: # Deploy to Railway/Render

  deploy-app:
    runs-on: ubuntu-latest  
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build:spa
      - run: # Deploy to Netlify/Vercel

  deploy-mobile:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run ios:build
      - run: npm run android:build
```

## 📋 Deployment Checklist

### **Pre-Deployment**
- [ ] Version bumped and committed
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] SSL certificates ready

### **Marketing Website**
- [ ] SSR build successful (`npm run build:ssr`)
- [ ] Server configuration validated
- [ ] Database migrations (if applicable)
- [ ] CDN cache purged

### **Fitness App**
- [ ] SPA build successful (`npm run build:spa`)
- [ ] Mobile builds tested on devices
- [ ] App Store metadata updated
- [ ] Beta testing completed

### **Post-Deployment**
- [ ] Health checks passing
- [ ] Performance monitoring active
- [ ] Analytics tracking confirmed
- [ ] Team notified
- [ ] VERSION_STATUS.md updated

---

## 🎯 Key Benefits of This Strategy

- **🚀 Performance**: Optimized builds for each use case
- **📈 Scalability**: Independent scaling of marketing vs app
- **🔧 Flexibility**: Different hosting solutions for different needs
- **🛡️ Reliability**: Isolated deployments reduce risk
- **💰 Cost Optimization**: Static hosting for SPA, server hosting only where needed
- **🔍 SEO**: Server-side rendering for marketing pages
- **📱 Native Performance**: Tauri apps with embedded SPA

This deployment strategy maximizes the benefits of your dual-build architecture while maintaining simplicity and reliability.