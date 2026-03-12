# AI Grievance Portal

A full-stack **AI-powered civic complaint management platform** where citizens submit complaints about public issues and government departments manage and resolve them efficiently.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Database](#database)
- [Deployment](#deployment)
- [Deploy to production](#deploy-to-production)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### For Citizens
- **Complaint submission** — Photos, location, pincode, and detailed descriptions
- **AI categorization** — Automatic department assignment from complaint content
- **Priority detection** — Red / Yellow / Green based on urgency
- **Status tracking** — From submission to resolution
- **Duplicate detection** — Similar complaints flagged to avoid duplicates
- **Multi-language support** — Detection and translation for multiple languages
- **Rewards & upvotes** — Points for submissions and upvoting others’ complaints

### For Administrators
- **Dashboard** — All complaints with filters and search
- **Analytics** — Metrics and trends
- **Department-wise management** — Filter and assign by department
- **Status updates** — Update status and add admin notes
- **User management** — Citizen accounts and permissions
- **Bulk operations** — Handle multiple complaints at once

### AI & Security
- **Smart categorization** — Routes to the right department
- **Priority scoring** — Urgency from text
- **Duplicate detection** — Similarity-based checks
- **JWT auth** — Secure login and role-based access
- **Rate limiting & validation** — Abuse prevention and input validation

---

## Technology Stack

| Layer        | Technologies |
|-------------|--------------|
| **Frontend** | React 18, React Router 6, MUI, Tailwind CSS, Chart.js, Recharts, Axios |
| **Backend**  | Node.js, Express, Mongoose |
| **Database** | MongoDB |
| **Auth**     | JWT, bcryptjs |
| **AI/NLP**   | Natural, Franc, Compromise, Groq (chatbot) |
| **Security** | Helmet, express-rate-limit, express-validator |

---

## Project Structure

```
AI_Grievance_portal/
├── backend/
│   ├── middleware/       # Auth, validation
│   ├── models/           # Mongoose schemas (User, Complaint, Department)
│   ├── routes/           # auth, complaints, users, chatbot
│   ├── scripts/          # seedDb.js
│   ├── uploads/          # Complaint images (gitignored)
│   ├── server.js
│   ├── .env.example
│   └── MONGODB_SETUP.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # UI, ChatbotWidget, etc.
│   │   ├── pages/        # Dashboard, Admin, etc.
│   │   ├── config/
│   │   └── ...
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** — v16 or higher (LTS recommended)
- **MongoDB** — Local (`mongod`) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn**

---

## Installation & Setup

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd AI_Grievance_portal

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment files

Copy the example env files and fill in values (see [Environment Variables](#environment-variables)):

```bash
# From project root
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. MongoDB

- **Local:** Start MongoDB (e.g. `mongod`).
- **Atlas:** Create a cluster and set `MONGODB_URI` in `backend/.env`.

See **[backend/MONGODB_SETUP.md](backend/MONGODB_SETUP.md)** for database name, collections, and seeding.

### 4. Seed database (recommended)

From the **backend** folder:

```bash
cd backend
npm run seed
```

This creates the `ai-grievance-portal` database, collections, indexes, and seeds the 6 departments.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `PORT` | API server port | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ai-grievance-portal` |
| `JWT_SECRET` | Secret for JWT signing | **Required** — use a strong secret in production |
| `JWT_EXPIRE` | JWT expiry | `7d` |
| `EMAIL_HOST` | SMTP host (notifications) | e.g. `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP user | Your email |
| `EMAIL_PASS` | SMTP password / app password | Your app password |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5MB) |
| `UPLOAD_PATH` | Dir for uploaded images | `./uploads` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `ENABLE_AI_PROCESSING` | Enable AI categorization/priority | `true` |
| `SIMILARITY_THRESHOLD` | Duplicate similarity (0–1) | `0.8` |
| `GROQ_API_KEY` | Groq API key for chatbot | Required for chatbot |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Running the Application

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm start
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Health check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register user |
| POST | `/api/login` | Login |
| GET | `/api/user/profile` | Get profile (JWT) |
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/change-password` | Change password |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints/submit` | Submit complaint |
| GET | `/api/complaints` | List all (Admin) |
| GET | `/api/complaints/user/:userId` | User’s complaints |
| GET | `/api/complaints/status/:complaintId` | Track complaint |
| PUT | `/api/complaints/update-status` | Update status (Admin) |
| POST | `/api/complaints/upvote` | Upvote complaint |
| GET | `/api/complaints/analytics` | Analytics (Admin) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (Admin) |
| GET | `/api/users/leaderboard/top` | Top users |

### Chatbot
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chatbot` | Chat with AI assistant |
| GET | `/api/chatbot/info` | Chatbot info |

---

## Database

- **Database:** `ai-grievance-portal`
- **Collections:** `users`, `complaints`, `departments`

Schema details and seeding are in **[backend/MONGODB_SETUP.md](backend/MONGODB_SETUP.md)**.

---

## Deployment

### Backend
1. Set production env vars (especially `NODE_ENV`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`).
2. `npm install --production`
3. `npm start`

### Frontend
1. Set `REACT_APP_API_URL` to your production API URL.
2. `npm run build`
3. Deploy the `build` folder (e.g. static hosting, Vercel, Netlify).

### Deploy to production

For a full step-by-step (MongoDB Atlas + Render + Vercel), see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

- **Backend:** Render (free tier), use repo root `render.yaml` or create Web Service with root dir `backend`.
- **Frontend:** Vercel — set root to `frontend`, set `REACT_APP_API_URL` to your Render API URL.
- **Database:** MongoDB Atlas free cluster; run `npm run seed` once (from backend with `MONGODB_URI` pointing to Atlas).

---

## Contributing

1. Fork the repo.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit: `git commit -m 'Add your feature'`.
4. Push: `git push origin feature/your-feature`.
5. Open a Pull Request.

---

## License

MIT License — see the [LICENSE](LICENSE) file for details.
