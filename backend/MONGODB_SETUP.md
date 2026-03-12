# MongoDB Setup (Compass – localhost:27017)

The app uses **database**: `ai-grievance-portal`  
**Collections**: `users`, `complaints`, `departments`

## Option A: Automatic setup (recommended)

From the **backend** folder:

```bash
npm run seed
```

This will:

- Use `mongodb://localhost:27017/ai-grievance-portal` (or `MONGODB_URI` from `.env`)
- Create the database and collections if they don’t exist
- Create indexes for users, complaints, and departments
- Seed the 6 departments required by the app

## Option B: Manual setup in Compass

1. **Connect** in MongoDB Compass to: `mongodb://localhost:27017`
2. **Create database**
   - Click “Create Database”
   - Database name: `ai-grievance-portal`
   - Collection name: `users` (create one collection; others can be added the same way)
3. **Create the three collections**
   - In the new database, create collections:
     - `users`
     - `complaints`
     - `departments`
4. **Seed departments**  
   Run once from backend: `npm run seed` so the 6 department documents exist.

## Collections and structure (reference)

| Collection    | Purpose |
|---------------|--------|
| **users**    | Citizens and admins (name, email, password, role, reward_points, etc.) |
| **complaints** | Complaints (complaint_id, user_id, complaint_text, location, pincode, department, status, priority_level, etc.) |
| **departments** | Department master (department_name, department_email, department_head, contact_phone) |

Indexes are created automatically when you run `npm run seed` or when the backend starts and uses Mongoose models.

## Backend connection

Ensure `backend/.env` has:

```
MONGODB_URI=mongodb://localhost:27017/ai-grievance-portal
```

Then start the backend; it will use this database and the same collections.
