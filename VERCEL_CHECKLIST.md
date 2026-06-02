# Quick Deployment Checklist

## Before You Deploy

### Local Verification

- [ ] Run `npm run build:all` successfully
- [ ] No build errors in backend or frontend
- [ ] Backend compiles to `backend/dist/`
- [ ] Frontend builds to `frontend/build/`

### Prepare Credentials

- [ ] MongoDB Atlas account with a cluster created
- [ ] MongoDB connection string ready
- [ ] TMDB API key and bearer token ready
- [ ] Generate a strong JWT secret (random string ~32 characters)

### Git Preparation

- [ ] Commit all changes
- [ ] Push to GitHub main branch
- [ ] Verify no `.env` files are committed

## Deployment Steps

### 1. Create Vercel Account & Link GitHub

- [ ] Go to https://vercel.com
- [ ] Sign in with GitHub
- [ ] Grant GitHub access

### 2. Import Project

- [ ] Click "Add New" → "Project"
- [ ] Select your MERN Movie App repository
- [ ] Click "Import"

### 3. Configure Environment Variables

Vercel will show an environment variables screen. Add these for **Production**:

```
MONGODB_URI = [your MongoDB Atlas connection string]
JWT_SECRET = [generate random strong string]
JWT_EXPIRES_IN = 7d
TMDB_API_KEY = [your TMDB key]
TMDB_BEARER_TOKEN = [your TMDB token]
TMDB_BASE_URL = https://api.themoviedb.org/3
NODE_ENV = production
FRONTEND_URL = https://[project-name].vercel.app
USE_LOCAL_DB = false
```

**Replace `[project-name]` with your actual Vercel project name** (you can see it in the URL)

- [ ] All 8 environment variables set
- [ ] FRONTEND_URL matches your Vercel domain

### 4. Deploy

- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check for any build errors in the logs

### 5. Update Frontend API URL

After deployment, update the frontend API URL:

1. [ ] Note your Vercel project URL (e.g., `https://mern-movie-app.vercel.app`)
2. [ ] Update `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://[your-vercel-url]/api
   ```
3. [ ] Commit and push the change
4. [ ] Vercel will automatically redeploy

### 6. Test the Live App

- [ ] Visit your Vercel URL
- [ ] Login page loads without errors
- [ ] Try logging in
- [ ] Check browser console for CORS errors
- [ ] Verify token verification works
- [ ] Refresh page - should stay authenticated

## Troubleshooting

| Issue                    | Solution                                                                  |
| ------------------------ | ------------------------------------------------------------------------- |
| 404 on API calls         | Check FRONTEND_URL in env vars and `/api/` routes in vercel.json          |
| Token verification fails | Verify MONGODB_URI is correct and MongoDB whitelist allows Vercel         |
| CORS errors              | Check FRONTEND_URL matches your actual Vercel domain                      |
| Blank page               | Check browser console for JavaScript errors, look at Vercel Function logs |
| 5xx errors               | Check Vercel function logs, verify env variables are set                  |

## After Deployment

- Check Vercel Analytics and Logs regularly
- Monitor function performance
- Keep environment variables secure (never share JWT_SECRET or MONGODB_URI)
- Update `FRONTEND_URL` if your domain changes

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Functions](https://vercel.com/docs/functions/serverless-functions)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- See `DEPLOYMENT.md` for detailed instructions
