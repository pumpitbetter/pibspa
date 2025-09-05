# Fly.io Deployment Guide

This guide walks you through deploying PumpItBetter's dual SSR+SPA architecture to Fly.io with managed PostgreSQL.

## 🏗️ Architecture Overview

**Single Fly.io Instance** serves both applications:
- `https://www.pumpitbetter.com` → **SSR Marketing Site** (React Router SSR)
- `https://app.pumpitbetter.com` → **SPA Fitness App** (React Router SPA)

**Benefits:**
- ✅ **Cost Effective**: Single server instance for both apps
- ✅ **Shared Resources**: Database, authentication, and API endpoints
- ✅ **Simplified Deployment**: One deployment pipeline for both apps
- ✅ **Subdomain Routing**: Automatic traffic routing based on hostname

## 📋 Prerequisites

1. ✅ **Fly.io Account**: Sign up at [fly.io](https://fly.io)
2. ✅ **Fly.io CLI**: Already installed via setup scripts
3. ✅ **Domain Ready**: `pumpitbetter.com` configured with DNS provider
4. ✅ **Build Working**: `npm run build:all` completes successfully

## 🚀 Step-by-Step Deployment

### Step 1: Authenticate with Fly.io

```bash
# Login to Fly.io (opens browser)
npm run fly:login

# Verify authentication
flyctl auth whoami
```

### Step 2: Create Fly.io Applications

```bash
# Create test/staging app
flyctl apps create pumpitbetter-test --org personal

# Create production app  
flyctl apps create pumpitbetter-prod --org personal
```

### Step 3: Set Up Managed PostgreSQL

**Option A: Single Database Cluster (Recommended)**
```bash
# Create shared PostgreSQL cluster
flyctl postgres create --name pumpitbetter-db --region iad --vm-size shared-cpu-1x --volume-size 3

# This creates a cluster we'll use for both environments
```

**Option B: Separate Database Clusters (Higher Cost)**
```bash
# Create production database
flyctl postgres create --name pumpitbetter-prod-db --region iad --vm-size shared-cpu-1x --volume-size 3

# Create test database
flyctl postgres create --name pumpitbetter-test-db --region iad --vm-size shared-cpu-1x --volume-size 1
```

### Step 4: Configure Database Connections

**For Single Cluster (Option A):**
```bash
# Attach database to production app (creates default database)
flyctl postgres attach --app pumpitbetter-prod pumpitbetter-db

# Create separate database for test environment
flyctl postgres db create --app pumpitbetter-db pumpitbetter_test

# Get connection strings
flyctl postgres connect --app pumpitbetter-db

# Note the connection strings:
# Production: postgres://user:pass@pumpitbetter-db.internal:5432/pumpitbetter_prod
# Test: postgres://user:pass@pumpitbetter-db.internal:5432/pumpitbetter_test
```

**For Separate Clusters (Option B):**
```bash
# Attach production database
flyctl postgres attach --app pumpitbetter-prod pumpitbetter-prod-db

# Attach test database
flyctl postgres attach --app pumpitbetter-test pumpitbetter-test-db
```

### Step 5: Configure Environment Variables

```bash
# Production environment secrets
flyctl secrets set \\
  NODE_ENV=production \\
  DATABASE_URL="your-production-database-url" \\
  --app pumpitbetter-prod

# Test environment secrets
flyctl secrets set \\
  NODE_ENV=staging \\
  DATABASE_URL="your-test-database-url" \\
  --app pumpitbetter-test
```

### Step 6: Deploy to Test Environment

```bash
# Deploy test environment first
npm run deploy:test

# Monitor deployment
flyctl logs --app pumpitbetter-test

# Test the deployment
curl https://pumpitbetter-test.fly.dev/health
```

**Expected Output:**
```
✅ Build completed successfully
✅ Health checks passing
✅ Both SSR and SPA routes working
```

### Step 7: Configure Custom Domains

```bash
# Add SSL certificates for production domains
flyctl certs create www.pumpitbetter.com --app pumpitbetter-prod
flyctl certs create app.pumpitbetter.com --app pumpitbetter-prod

# Fly.io will provide DNS instructions. Configure these DNS records:
# www.pumpitbetter.com    CNAME   pumpitbetter-prod.fly.dev
# app.pumpitbetter.com    CNAME   pumpitbetter-prod.fly.dev
```

### Step 8: Deploy to Production

```bash
# Deploy to production (includes confirmation prompt)
npm run deploy:prod

# Monitor production deployment
flyctl logs --app pumpitbetter-prod

# Test production deployment
curl https://www.pumpitbetter.com/health
curl https://app.pumpitbetter.com/health
```

## 🔧 Configuration Details

### Fly.io App Configuration

**Production (`fly.toml`)**:
- **App Name**: `pumpitbetter-prod`
- **Region**: `iad` (US East)
- **Resources**: 1 CPU, 512MB RAM
- **Domains**: `www.pumpitbetter.com`, `app.pumpitbetter.com`

**Test (`fly.test.toml`)**:
- **App Name**: `pumpitbetter-test`
- **Region**: `iad` (US East)
- **Resources**: 1 CPU, 256MB RAM
- **Domains**: `pumpitbetter-test.fly.dev`

### Subdomain Routing Logic

The combined server (`scripts/combined-server.js`) routes traffic:

```javascript
// Route based on hostname
if (hostname.startsWith('app.')) {
  // Serve SPA fitness app
  serveStatic(spa/index.html)
} else {
  // Serve SSR marketing site
  handleSSRRequest()
}
```

### Database Schema (When Implemented)

**Shared Tables** (both environments):
- `users` - User accounts
- `exercises` - Exercise database  
- `programs` - Workout programs

**Environment-Specific Data**:
- Test: Sample/demo data
- Production: Real user data

## 📊 Monitoring and Maintenance

### Health Checks

```bash
# Application health
curl https://www.pumpitbetter.com/health
curl https://app.pumpitbetter.com/health

# Database health
flyctl postgres connect --app pumpitbetter-db
```

### Log Monitoring

```bash
# Real-time logs
flyctl logs --app pumpitbetter-prod

# Application status
flyctl status --app pumpitbetter-prod

# Database status
flyctl status --app pumpitbetter-db
```

### Scaling

```bash
# Scale application resources
flyctl scale count 2 --app pumpitbetter-prod  # Add second instance
flyctl scale vm shared-cpu-2x --app pumpitbetter-prod  # Upgrade VM

# Scale database
flyctl scale vm shared-cpu-2x --app pumpitbetter-db
```

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Test build locally
npm run build:all

# Check for missing dependencies
npm install

# Verify scripts are executable
chmod +x scripts/*.sh
```

**Database Connection Issues:**
```bash
# Test database connectivity
flyctl postgres connect --app pumpitbetter-db

# Check connection string
flyctl secrets list --app pumpitbetter-prod

# Reset database URL
flyctl secrets set DATABASE_URL="new-url" --app pumpitbetter-prod
```

**SSL/Domain Issues:**
```bash
# Check certificate status
flyctl certs list --app pumpitbetter-prod

# Verify DNS configuration
dig www.pumpitbetter.com
dig app.pumpitbetter.com

# Force certificate renewal
flyctl certs create www.pumpitbetter.com --app pumpitbetter-prod
```

**Performance Issues:**
```bash
# Monitor resource usage
flyctl metrics --app pumpitbetter-prod

# Check database performance
flyctl postgres stats --app pumpitbetter-db

# Scale if needed
flyctl scale vm shared-cpu-2x --app pumpitbetter-prod
```

### Recovery Procedures

**Rollback Deployment:**
```bash
# List recent releases
flyctl releases --app pumpitbetter-prod

# Rollback to previous version
flyctl releases rollback <version> --app pumpitbetter-prod
```

**Database Backup:**
```bash
# Manual backup
flyctl postgres backup create --app pumpitbetter-db

# Restore from backup
flyctl postgres backup restore <backup-id> --app pumpitbetter-db
```

## 💰 Cost Optimization

### Current Configuration Costs

**Production Environment:**
- **App Instance**: ~$5-10/month (shared-cpu-1x, 512MB)
- **Database**: ~$15-25/month (shared-cpu-1x, 3GB storage)
- **Bandwidth**: ~$2-5/month (typical usage)
- **Total**: ~$22-40/month

**Test Environment:**
- **App Instance**: ~$3-5/month (shared-cpu-1x, 256MB)
- **Database**: Shared with production (if using single cluster)
- **Total Additional**: ~$3-5/month

### Cost Reduction Strategies

1. **Shared Database**: Use single PostgreSQL cluster with separate databases
2. **Resource Optimization**: Monitor and right-size VM instances
3. **Regional Optimization**: Deploy in region closest to users
4. **Auto-Sleep**: Test environment can auto-sleep during inactive periods

## 🔄 CI/CD Integration (Future)

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Fly.io
on:
  push:
    branches: [main]  # Deploy test on main
  release:
    types: [published]  # Deploy prod on releases

jobs:
  deploy-test:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --config fly.test.toml --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
          
  deploy-prod:
    if: github.event_name == 'release'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --config fly.toml --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

## 📚 Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [PostgreSQL on Fly.io](https://fly.io/docs/postgres/)
- [Custom Domains on Fly.io](https://fly.io/docs/app-guides/custom-domains-with-fly/)
- [Fly.io Pricing](https://fly.io/docs/about/pricing/)

---

**Next Steps:**
1. ✅ Complete initial deployment to test environment
2. ✅ Verify both SSR and SPA routes work correctly  
3. ✅ Configure production domains and SSL
4. ✅ Deploy to production environment
5. ⏭️ Add database integration when ready
6. ⏭️ Set up monitoring and alerting
7. ⏭️ Configure automated CI/CD pipeline