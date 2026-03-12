# Deploy AI Grievance Portal

This guide deploys the **backend** to [Render](https://render.com) (free tier) and the **frontend** to [Vercel](https://vercel.com) (free tier), with [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) as the database.

---

## 1. MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **free cluster** (e.g. M0).
3. Under **Database Access** → Add Database User (username + password). Note the password.
4. Under **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) for Render/Vercel to connect.
5. In the cluster, click **Connect** → **Drivers** → copy the connection string (e.g. `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/`).
6. Replace `<password>` with your DB user password. Add database name:  
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/ai-grievance-portal?retryWrites=true&w=majority`  
   This is your **MONGODB_URI**.

---

## 2. Backend on Render

1. Push your code to **GitHub** (if not already).
2. Go to [Render](https://render.com) → Sign up / Log in → **New** → **Web Service**.
3. Connect your **GitHub repo** and select the repository.
4. Configure:
   - **Name:** `ai-grievance-portal-api` (or any name).
   - **Region:** Choose one (e.g. Oregon).
   - **Root Directory:** `backend`.
   - **Runtime:** Node.
   - **Build Command:** `npm install`.
   - **Start Command:** `npm start`.
   - **Plan:** Free.
5. **Environment** (add these):
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your Atlas URI from step 1
   - `JWT_SECRET` = a long random string (e.g. generate with `openssl rand -hex 32`)
   - `CORS_ORIGIN` = leave empty for now (you’ll set it after frontend is deployed)
   - `GROQ_API_KEY` = your [Groq](https://console.groq.com) API key (for chatbot)
   - Optional: `JWT_EXPIRE`, `RATE_LIMIT_*`, `EMAIL_*`, etc. (see `backend/.env.example`).
6. Click **Create Web Service**. Wait for the first deploy.
7. Copy your backend URL, e.g. `https://ai-grievance-portal-api.onrender.com`.  
   You’ll use this as the API base (e.g. `https://ai-grievance-portal-api.onrender.com/api`).

**Seed the database once:** Run the seed script locally with Atlas as `MONGODB_URI` in your local `backend/.env`, then:

```bash
cd backend
npm run seed
```

Or use MongoDB Compass connected to Atlas and run the seed script logic / add the 6 departments manually (see `backend/MONGODB_SETUP.md`).

---

## 3. Frontend on Vercel

1. Go to [Vercel](https://vercel.com) → Sign up / Log in (e.g. with GitHub).
2. **Add New** → **Project** → Import your GitHub repo.
3. Configure:
   - **Root Directory:** set to `frontend` (click Edit, then set root to `frontend`).
   - **Framework Preset:** Create React App (or leave Vercel to detect).
   - **Build Command:** `npm run build`.
   - **Output Directory:** `build`.
4. **Environment Variables:**
   - `REACT_APP_API_URL` = `https://YOUR-RENDER-URL.onrender.com/api`  
     (use the backend URL from step 2, with `/api` at the end).
5. Click **Deploy**. Wait for the build. Note your frontend URL, e.g. `https://ai-grievance-portal.vercel.app`.

---

## 4. Connect Backend to Frontend (CORS)

1. In **Render** → your backend service → **Environment**.
2. Set **CORS_ORIGIN** to your Vercel (and any custom) frontend URL, no trailing slash:
   - `https://ai-grievance-portal.vercel.app`
   - If you add a custom domain later: `https://your-domain.com` (or comma-separated list).
3. Save. Render will redeploy automatically.

---

## 5. Verify

- Open the Vercel frontend URL. You should see the app.
- Register / Login and submit a test complaint.
- Open `https://YOUR-RENDER-URL.onrender.com/api/health` — should return `{"status":"OK",...}`.

---

## Optional: Deploy via CLI

**Backend (Render)**  
Render can use the repo’s `backend/render.yaml` when you create the service from the dashboard (choose “Apply blueprint” if you add the blueprint to the repo). Or create the Web Service manually as above.

**Frontend (Vercel)**

```bash
cd frontend
npm i -g vercel
vercel
# Set root to ./frontend if asked; add REACT_APP_API_URL when prompted or in dashboard.
vercel --prod
```

---

## Notes

- **Uploads:** On Render’s free tier, files in `backend/uploads` are ephemeral (lost on restart). For production, consider cloud storage (e.g. AWS S3, Cloudinary) and update the complaints upload logic.
- **Free tier limits:** Render free services spin down after inactivity; first request after idle may be slow. Vercel and Atlas free tiers have their own limits.
- **Custom domain:** Add it in Vercel (frontend) and in Render (backend), then set `CORS_ORIGIN` to that domain and update `REACT_APP_API_URL` to your backend domain.
