# Feedback Admin Panel (MERN)

This repository contains a complete MERN stack feedback admin panel project.

## Repository Structure

```text
project-root/
├── frontend/
└── backend/
```

## Features

- Navbar with **Dashboard** and **Add Feedback** tabs (React Router based routing)
- Feedback dashboard with:
  - Course ID
  - Course Name
  - Course Duration
  - Overall Feedback Rating
  - Update/Delete actions per row
- Add Feedback form with:
  - Course Name
  - Feedback Comments
  - Feedback Rating
- Update existing feedback
- Delete existing feedback
- Responsive UI for mobile and desktop
- Node.js + Express backend connected to MongoDB Atlas

## Setup after clone

### 1) Backend

```bash
cd backend
npm install
```

Update `backend/.env` with a valid MongoDB Atlas connection string.

Run backend:

```bash
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend reads API URL from `frontend/.env`.

## Notes

- `.env` files are included with placeholders/default local values for evaluator convenience.
- `package.json` files in both frontend and backend contain all required dependencies.
