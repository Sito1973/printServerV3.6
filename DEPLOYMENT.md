# Deployment Guide - PrinterHub

## EasyPanel Deployment

### Quick Start

1. **Clone/Upload your project** to your server or build system
2. **Configure environment variables** in EasyPanel:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NODE_ENV=production`
   - `PORT=3000` (default)

3. **Use the included configuration**:
   ```bash
   # Build and deploy using the production Dockerfile
   docker build -f Dockerfile.production -t printerhub .
   
   # Or use docker-compose
   docker-compose -f docker-compose.easypanel.yml up -d
   ```

### Environment Variables Required

```env
# Database (Required)
DATABASE_URL=postgres://user:password@host:port/database

# Application (Optional - has defaults)
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

### EasyPanel Configuration

The application includes these deployment files:

- `Dockerfile.production` - Optimized multi-stage Docker build
- `easypanel.yml` - EasyPanel service configuration
- `docker-compose.easypanel.yml` - Complete stack with PostgreSQL

### Key Features

✅ **Multi-stage Docker build** for smaller production images
✅ **Health checks** at `/api/health`
✅ **Automatic database migrations** on startup
✅ **Security optimized** - runs as non-root user
✅ **Memory efficient** - includes memory limits
✅ **PostgreSQL ready** - includes database in compose

### Database Setup

The application will automatically run migrations on startup. Ensure your `DATABASE_URL` points to a PostgreSQL 12+ database.

#### Using included PostgreSQL (docker-compose)
```bash
docker-compose -f docker-compose.easypanel.yml up -d
```

#### Using external database
Set `DATABASE_URL` to your external PostgreSQL instance.

### Monitoring

- **Health Check**: `GET /api/health`
- **Application Logs**: Check Docker logs
- **Database**: Standard PostgreSQL monitoring

### Port Configuration

- Application runs on port **3000** by default
- Health checks expect port **3000**
- Configure load balancer/reverse proxy accordingly

### Security Notes

- Application runs as non-root user (`nextjs:nodejs`)
- No sensitive data in Docker image
- All secrets via environment variables
- Database connections use SSL when available

### Troubleshooting

1. **Build fails**: Check that all source files are present
2. **Database connection**: Verify `DATABASE_URL` format and accessibility
3. **Health check fails**: Ensure port 3000 is accessible
4. **Migration errors**: Check database permissions and PostgreSQL version

### Performance

- Includes memory limits (512MB max, 256MB reserved)
- Uses Alpine Linux for smaller image size
- Production-optimized Node.js settings
- Multi-stage build reduces final image size

## Development vs Production

| Feature | Development (Replit) | Production (EasyPanel) |
|---------|---------------------|------------------------|
| Port | 5000 | 3000 |
| Database | Replit built-in | External PostgreSQL |
| File watching | Yes (tsx) | No |
| Hot reload | Yes (Vite) | No |
| SSL | Automatic | Configure via proxy |
| Environment | Replit Secrets | Docker ENV |