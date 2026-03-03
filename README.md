# Levitica Data Management

Full-stack CRM: React frontend (HR, Finance, Sales, Admin) + Node/Express/MongoDB backend.

## Structure

- **Levitica-data-management/** – React app (dashboard, HR, Sales, Finance, Admin)
- **backend/** – Express API, MongoDB (Mongoose)

## Run locally

**Frontend**
```bash
cd Levitica-data-management
npm install
npm start
```
Runs at http://localhost:3000

**Backend**
```bash
cd backend
npm install
# Add .env with PORT and MONGODB_URI
npm run dev
```
Runs at http://localhost:5001 (or PORT in .env)

## Push to your own GitHub repo (separate from your friend’s)

1. On GitHub: **Create a new repository** (e.g. `Levitica-Data-Management`) under your account. Do **not** initialize with README (you already have code).
2. In this project folder run:

```bash
cd "c:\Users\Lalith\OneDrive\Desktop\levitica"
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Levitica-Data-Management.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username so the repo is **yours**, not your friend’s.
