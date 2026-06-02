# Deploying MERN Movie App to Vercel

## Prerequisites

- GitHub account with your repository pushed
- MongoDB Atlas cluster (cloud database)
- Vercel account (free tier works)
- TMDB API key

## Step-by-Step Deployment

### 1. Prepare MongoDB Atlas

- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/movieapp?retryWrites=true&w=majority`
- Go to Network Access and whitelist `0.0.0.0/0` (allow all IPs - or just your Vercel IP if you want to restrict)

### 2. Verify Local Build Works

Run this locally to ensure everything builds correctly:

```bash
npm run build:all
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Select your repository from GitHub
4. Click "Import"
5. Vercel will auto-detect the monorepo structure
6. **DO NOT click Deploy yet** - configure environment variables first

### 4. Set Environment Variables in Vercel

In the Vercel project settings, add these environment variables under **Settings → Environment Variables**:

**Production Environment:**

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movieapp?retryWrites=true&w=majority
JWT_SECRET=generate-a-random-strong-secret-key-here
JWT_EXPIRES_IN=7d
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here
TMDB_BASE_URL=https://api.themoviedb.org/3
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
USE_LOCAL_DB=false
```

> **Note:** Replace `your-app` with your actual Vercel project name. You'll see it after the first deployment.

### 5. Deploy

Click the "Deploy" button. Vercel will:

- Build both backend and frontend
- Deploy the frontend as static files
- Convert your Express backend to serverless functions at `/api/*`

### 6. Get Your Vercel URL

After deployment, Vercel will give you a URL like: `https://mern-movie-app.vercel.app`

### 7. Update Environment Variables (if needed)

If your Vercel domain is different from what you set in `FRONTEND_URL`:

1. Go to **Settings → Environment Variables** in Vercel
2. Update `FRONTEND_URL` to match your actual Vercel domain
3. Redeploy

### 8. Test the Deployment

1. Open your Vercel URL in a browser
2. Try logging in
3. Check browser console for any errors
4. Test API calls in the Network tab

## Troubleshooting

### Backend API returns 404

- Check that your FRONTEND_URL in Vercel matches your actual deployment URL
- Verify the API route rewrites in `vercel.json` are correct

### Token verification keeps failing

- Ensure `MONGODB_URI` is correct and MongoDB Atlas network access allows Vercel IPs
- Check that `JWT_SECRET` is set in Vercel environment variables
- Look at Vercel logs for MongoDB connection errors

### CORS errors

- Verify `FRONTEND_URL` in Vercel matches your deployment URL
- Check that backend CORS is configured to accept your frontend domain

### Cold start delays

- Vercel serverless functions have a cold start delay (5-30 seconds on first request after deployment)
- This is normal and gets faster with subsequent requests

## Monitoring & Logs

View logs in Vercel dashboard:

1. Go to your project → **Functions**
2. Click on `backend/api/index` to see serverless function logs
3. Check **Deployments** tab for build logs

## Redeployment

- Any push to your main branch automatically redeploys
- You can also manually redeploy from the Vercel dashboard

## Local Development

To run locally for testing:

```bash
npm run dev:backend    # Terminal 1 - Runs backend on port 5000
npm run dev:frontend   # Terminal 2 - Runs frontend on port 3000
```

Update your `.env` file locally:

```
REACT_APP_API_URL=http://localhost:5000
```

## Environment Variables Needed

### Backend (set in Vercel dashboard)

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Random secret for JWT signing
- `JWT_EXPIRES_IN` - Token expiration (e.g., "7d")
- `TMDB_API_KEY` - Your The Movie Database API key
- `TMDB_BEARER_TOKEN` - Your TMDB bearer token
- `FRONTEND_URL` - Your Vercel frontend URL
- `NODE_ENV` - Set to "production"

### Frontend (built from .env.production)

- `REACT_APP_API_URL` - Your Vercel backend API URL (e.g., https://your-app.vercel.app/api)
- `REACT_APP_TMDB_API_KEY` - TMDB API key (same as backend)

## Success Indicators

✓ Frontend loads without errors
✓ Login page displays
✓ Can submit login form
✓ Token is saved to localStorage
✓ Redirects to home page
✓ Can refresh home page and stay logged in
✓ API calls appear in Network tab (not blocked by CORS)
