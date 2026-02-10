# Singscape Deployment Runbook

This runbook covers deployment, monitoring, and troubleshooting procedures for Singscape production environments.

## 🚀 Initial Deployment

### Prerequisites

- Railway account with billing enabled
- Vercel account
- Clerk authentication configured
- Domain names (optional, for custom URLs)

### Backend Deployment (Railway)

1. **Prepare Repository**
   ```bash
   git checkout -b production
   git push origin production
   ```

2. **Create Railway Service**
   - Connect your GitHub repository to Railway
   - Select `backend/python` directory as root
   - Choose Python template
   - Set environment variables (see Environment Variables section)

3. **Configure Environment Variables**
   ```env
   # Production Database
   DATABASE_URL=postgresql://username:password@host:port/database
   
   # AI Configuration
   DEMUCS_MODEL=htdemucs
   DEMUCS_SEGMENT=5
   CUDA_VISIBLE_DEVICES=-1  # CPU-only or GPU index
   
   # Security
   CLERK_JWKS_URL=https://your-domain.clerk.accounts.dev/.well-known/jwks.json
   CLERK_ISSUER=https://your-domain.clerk.accounts.dev
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   
   # File Handling
   MAX_FILE_SIZE_MB=25
   UPLOAD_DIR=/tmp/uploads
   OUTPUT_DIR=/tmp/separated
   DEBUG=false
   ```

4. **Deploy and Test**
   - Railway will automatically deploy on push
   - Test health endpoint: `https://your-app.railway.app/health`
   - Verify model loading and GPU detection

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Add repository to Vercel
   - Select `frontend` directory as root
   - Configure build settings (Next.js defaults)

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-app.railway.app
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
   CLERK_SECRET_KEY=sk_test_your_secret
   NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app
   ```

3. **Deploy**
   - Vercel will automatically deploy on push
   - Test frontend connectivity to backend

## 🔍 Health Checks

### Backend Health Check

**Endpoint**: `GET /health`

**Response Example**:
```json
{
  "status": "healthy",
  "model": "htdemucs",
  "device": "cpu",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Monitor These Metrics**:
- Response time < 200ms
- Status shows model loaded
- No error messages in logs

### Frontend Health Check

**Endpoint**: `GET /api/health`

**Monitor**:
- Backend connectivity
- API response times
- User authentication flow

## 📊 Monitoring & Alerting

### Key Metrics to Monitor

#### System Metrics
- CPU usage (target: < 80%)
- Memory usage (target: < 85%)
- Disk space (target: < 90%)
- GPU memory (if applicable)

#### Application Metrics
- Job success rate (target: > 95%)
- Average processing time
- Queue length and wait times
- User quota utilization
- Error rates by endpoint

#### Business Metrics
- Active users per day
- Files processed per day
- File size distribution
- Peak usage hours

### Setting Up Monitoring

#### Railway Monitoring
1. Go to your service settings
2. Enable "Metrics" tab
3. Set up alerts for:
   - CPU > 80% for 5 minutes
   - Memory > 85% for 5 minutes
   - HTTP 5xx errors > 1%

#### Vercel Analytics
1. Enable in project settings
2. Monitor:
   - Web Vitals (LCP, FID, CLS)
   - Traffic patterns
   - Error rates

#### External Monitoring (Optional)
```bash
# Simple health check script
#!/bin/bash
HEALTH_URL="https://your-app.railway.app/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -ne 200 ]; then
    echo "Health check failed: HTTP $RESPONSE"
    # Send alert (email, Slack, etc.)
fi
```

## 🚨 Common Issues & Solutions

### Issue: "Model Loading Failed"
**Symptoms**: Health check returns error, jobs stuck in "queued"
**Causes**: Incompatible PyTorch version, corrupted model files
**Solutions**:
1. Check logs for specific error
2. Restart Railway service
3. Verify PyTorch CUDA compatibility:
   ```python
   import torch
   print(f"PyTorch: {torch.__version__}")
   print(f"CUDA available: {torch.cuda.is_available()}")
   ```

### Issue: "Database Connection Failed"
**Symptoms**: 500 errors on job creation, status endpoints
**Causes**: Wrong DATABASE_URL, connection limits, network issues
**Solutions**:
1. Verify DATABASE_URL format
2. Check Railway database status
3. Test connection manually:
   ```bash
   psql $DATABASE_URL -c "SELECT 1;"
   ```

### Issue: "CORS Errors"
**Symptoms**: Browser console shows CORS errors, frontend can't call backend
**Causes**: Missing or incorrect ALLOWED_ORIGINS
**Solutions**:
1. Update ALLOWED_ORIGINS with frontend domain
2. Verify no trailing slashes
3. Restart backend service

### Issue: "High Memory Usage"
**Symptoms**: Service restarts, OOM errors
**Causes**: Large files, memory leaks, too many concurrent jobs
**Solutions**:
1. Reduce DEMUCS_SEGMENT size
2. Implement job concurrency limits
3. Add memory monitoring alerts

### Issue: "Slow Processing"
**Symptoms**: Jobs taking > 10 minutes, queue buildup
**Causes**: CPU-only processing, large files, model inefficiency
**Solutions**:
1. Enable GPU processing
2. Optimize DEMUCS_SEGMENT
3. Consider auto-scaling

## 🔄 Maintenance Procedures

### Daily Tasks
- Check error logs for patterns
- Monitor queue health
- Verify backup completion
- Review user feedback

### Weekly Tasks
- Update dependencies
- Clean up old job files
- Review performance metrics
- Update rate limits if needed

### Monthly Tasks
- Database maintenance (vacuum, analyze)
- Security audit
- Performance optimization review
- Capacity planning

## 🚀 Scaling Guidelines

### When to Scale Up
- CPU > 80% consistently
- Memory > 85% consistently
- Queue wait times > 5 minutes
- HTTP 5xx errors > 1%

### Scaling Options

#### Horizontal Scaling (Railway)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Database Scaling
- Upgrade Railway Postgres plan
- Add read replicas for high traffic
- Implement connection pooling

#### CDN Integration
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.your-domain.com' : '',
}
```

## 🛠️ Troubleshooting Commands

### Backend Debugging
```bash
# Check logs
railway logs

# SSH into container
railway open

# Test model manually
python -c "
from demucs import pretrained
model = pretrained('htdemucs')
print('Model loaded successfully')
"

# Check GPU availability
python -c "
import torch
print(f'CUDA available: {torch.cuda.is_available()}')
print(f'GPU count: {torch.cuda.device_count()}')
if torch.cuda.is_available():
    print(f'Current device: {torch.cuda.current_device()}')
"
```

### Frontend Debugging
```bash
# Check build
npm run build

# Test locally
npm run start

# Check environment variables
vercel env ls
```

### Database Operations
```sql
-- Check job counts
SELECT status, COUNT(*) FROM jobs GROUP BY status;

-- Check long-running jobs
SELECT id, created_at, processing_duration_seconds 
FROM jobs 
WHERE status = 'processing' 
AND created_at < NOW() - INTERVAL '1 hour';

-- Clean old jobs
DELETE FROM jobs WHERE created_at < NOW() - INTERVAL '7 days';
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migration tested
- [ ] Health checks working
- [ ] SSL certificates valid
- [ ] DNS configured correctly

### Post-Deployment
- [ ] Services responding correctly
- [ ] Monitoring alerts configured
- [ ] Load testing performed
- [ ] Documentation updated
- [ ] Team notified

## 🆘 Emergency Procedures

### Service Outage
1. Check Railway status page
2. Review recent deployments
3. Check application logs
4. Restore previous version if needed:
   ```bash
   railway rollback
   ```

### Database Issues
1. Switch to read-only mode
2. Check connection limits
3. Restart database service
4. Restore from backup if necessary

### Security Incident
1. Identify affected systems
2. Rotate API keys and secrets
3. Review audit logs
4. Communicate with users
5. Post-mortem analysis

---

## 📞 Support Contacts

- **Infrastructure**: Railway Dashboard, Vercel Dashboard
- **Authentication**: Clerk Dashboard
- **Code Repository**: GitHub Issues
- **Emergency**: Team Slack/Discord

Remember: This runbook should be updated regularly as the system evolves and new issues are discovered.