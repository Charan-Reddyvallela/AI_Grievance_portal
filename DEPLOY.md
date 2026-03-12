# Push to GitHub & Deploy – AI Grievance Portal

## 1. Push to GitHub

### One-time setup

1. **Create a GitHub account** (if you don’t have one): [github.com](https://github.com)

2. **Create a new repository** on GitHub:
   - Click **New repository**
   - Name it (e.g. `AI_Grievance_portal`)
   - Choose **Public**
   - Do **not** add README, .gitignore, or license (you already have a project)
   - Click **Create repository**

3. **In your project folder**, open PowerShell and run:

```powershell
cd "c:\Users\Mroads\Desktop\AI_Grievance_portal"

# Initialize Git (if not already)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: AI Grievance Portal"

# Add your GitHub repo as remote (replace YOUR_USERNAME and YOUR_REPO with your actual GitHub username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

When prompted, sign in with your GitHub account (or use a **Personal Access Token** instead of password).

---

## 2. Deploy / Publish

Your app has:
- **Frontend**: React (in `frontend/`)
- **Backend**: Node.js + Express (in `backend/`)
- **Database**: MongoDB

### Option A: Frontend + Backend on free tiers

| Part      | Service   | Notes                                      |
|----------|-----------|--------------------------------------------|
| Frontend | **Vercel** or **Netlify** | Connect GitHub repo, set build to `frontend` folder |
| Backend  | **Render** or **Railway** | Connect GitHub, set root to `backend`, add env vars |
| Database | **MongoDB Atlas** (free) | Create cluster, get connection string for backend |

**Frontend (e.g. Vercel):**
- Repo: your GitHub repo
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Environment variables**: e.g. `REACT_APP_API_URL=https://your-backend-url.onrender.com`

**Backend (e.g. Render):**
- Repo: same GitHub repo
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment variables**: `MONGODB_URI`, `JWT_SECRET`, etc. (from your `.env`)

### Option B: All-in-one (backend + serve frontend)

- **Render**, **Railway**, or **Cyclic**: one project that runs the Node backend and can serve the built frontend (e.g. static files from `frontend/build`). You’d add a small change in the backend to serve the React build in production.

---

## 3. Before you deploy

- [ ] **MongoDB Atlas**: Create a free cluster and use its connection string as `MONGODB_URI` in production.
- [ ] **Secrets**: Set `JWT_SECRET`, API keys, etc. only in the hosting dashboard (env vars), never in the repo.
- [ ] **CORS**: In the backend, allow your frontend URL (e.g. `https://your-app.vercel.app`) in CORS settings.

---

## 4. Push updates later

```powershell
git add .
git commit -m "Describe your changes"
git push
```

After you push, Vercel/Render/etc. will auto-redeploy if you connected the GitHub repo.
