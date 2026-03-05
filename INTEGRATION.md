# Backend–Frontend Integration Guide

Follow these steps to run the backend and frontend together and verify that data flows correctly.

---

## Step 1: Backend setup

1. **Open a terminal** and go to the backend folder:
   ```bash
   cd backend
   ```

2. **Create `.env`** (copy from `.env.example` and fill in real values):
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and set at least:
   - `MONGODB_URI` — your MongoDB connection string
   - `JWT_SECRET` — keep existing value if you already have users; otherwise set a long random string

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

4. **Start the backend**:
   ```bash
   npm start
   ```
   You should see: `Server running on http://localhost:5001`

---

## Step 2: Frontend setup

1. **Open a second terminal** and go to the frontend folder:
   ```bash
   cd Levitica-data-management
   ```

2. **Create `.env`** so the app talks to your backend:
   - Create a file named `.env` in `Levitica-data-management/`
   - Add:
     ```
     REACT_APP_API_URL=http://localhost:5001
     ```
   (If you skip this, the app defaults to `http://localhost:5001`.)

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

4. **Start the frontend**:
   ```bash
   npm start
   ```
   The app should open at `http://localhost:3000`.

---

## Step 3: Verify backend health

1. In a browser or with curl, open:
   ```
   http://localhost:5001/api/health
   ```
2. **Expected:** JSON like `{ "status": "ok", "message": "Backend is running" }`.

| Check            | How to verify                    | Expected result                          |
|------------------|-----------------------------------|------------------------------------------|
| Backend health   | GET `http://localhost:5001/api/health` | `{ "status": "ok" }`                     |

---

## Step 4: Verify login

1. Go to **http://localhost:3000** (or your frontend URL).
2. Select a **role** (e.g. Admin).
3. Enter **email** and **password** of a user that exists in your backend (e.g. from your User collection).
4. Click **Sign In**.

| Check       | How to verify              | Expected result                                      |
|------------|----------------------------|------------------------------------------------------|
| Login OK   | Sign in with valid user    | Redirect to `/admin`, `/sales`, or `/sales-rep` etc. |
| Login fail | Wrong email/password      | Toast: "Invalid email or password"                  |
| No backend | Backend stopped           | Toast: "Login failed" or network error               |

---

## Step 5: Verify Leads (Admin)

1. Log in as **Admin**.
2. Go to **Admin → Leads** (sidebar).
3. **Expected:** Table loads with leads from the backend (or “No leads” if the list is empty).
4. **Add lead:** Click “Add Lead”, fill required fields (First name, Last name, Phone, Lead source), choose an owner, Save.  
   **Expected:** Toast “Lead added successfully” and the new row appears.
5. **Edit lead:** Click the pencil on a row, change a field, Save.  
   **Expected:** Toast “Lead updated successfully” and the row updates.
6. **Delete lead:** Click the trash on a row (Admin only).  
   **Expected:** Toast “Lead deleted” and the row disappears.

| Check        | How to verify        | Expected result                          |
|-------------|----------------------|------------------------------------------|
| List leads  | Open Admin → Leads   | Table shows backend data or “No leads”   |
| Create lead | Add Lead → Save      | Success toast + new row                  |
| Update lead | Edit → Save          | Success toast + row updated              |
| Delete lead | Trash icon           | Success toast + row removed              |

---

## Step 6: Optional – API checks with curl

Use these only if you want to test the API directly. You need a valid JWT (e.g. copy from browser DevTools → Application → Local Storage → `levitica_token`).

```bash
# Replace YOUR_TOKEN with the actual token
export TOKEN="YOUR_TOKEN"

# Health
curl -s http://localhost:5001/api/health

# List leads (requires auth)
curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:5001/api/v1/leads?page=1&limit=10"
```

**Expected list response shape:**
```json
{
  "leads": [...],
  "total": 0,
  "page": 1,
  "pages": 1
}
```

---

## Troubleshooting

| Problem              | What to check                                                                 |
|----------------------|-------------------------------------------------------------------------------|
| “Login failed”       | Backend running? Correct MONGODB_URI and JWT_SECRET? User exists in DB?       |
| “Not found” / 404    | Backend base URL correct? Frontend `.env`: `REACT_APP_API_URL=http://localhost:5001` |
| CORS errors          | Backend has `cors()` enabled (already in `server.js`)                          |
| Empty leads table    | Logged in as Admin? Backend returns `{ leads, total, page, pages }`          |
| 401 on leads         | Token in localStorage; logout and login again to refresh token                |

---

## Summary checklist

- [ ] Backend: `.env` with MONGODB_URI and JWT_SECRET
- [ ] Backend: `npm start` → “Server running on http://localhost:5001”
- [ ] Frontend: `.env` with REACT_APP_API_URL (or default)
- [ ] Frontend: `npm start` → app at http://localhost:3000
- [ ] GET `/api/health` returns `{ "status": "ok" }`
- [ ] Login with real user → redirect to dashboard
- [ ] Admin → Leads: list loads from backend
- [ ] Add / Edit / Delete lead works and data persists
