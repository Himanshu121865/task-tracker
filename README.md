# Task Tracker

MERN stack task tracker with a Google Keep-inspired UI. Built for COLL-EDGE CONNECT internship assignment.

## Features

- **CRUD** — Create, view, update, delete tasks
- **Status** — Cycle between dropped → in-progress → done (click badge)
- **Priority** — Low / medium / high with colored bar on cards (click to cycle)
- **Color** — 11 card background colors (click card → color palette in modal)
- **Pin** — Pin important tasks to the top
- **Search** — Real-time search across titles and descriptions
- **Grid layout** — Responsive grid, pinned section separate from others
- **Dark mode** — Always-on dark theme
- **Expandable form** — "Take a note..." bar expands with color picker & priority
- **Detail modal** — Click any card to open and edit inline
- **Toast notifications** — Feedback on all actions
- **Validation** — Both client and server side

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Chakra UI, react-icons, axios |
| Backend | Node.js, Express.js, Mongoose, express-validator |
| Database | MongoDB Atlas |

## Project Structure

```
task-tracker/
├── backend/
│   ├── models/Task.js
│   ├── routes/tasks.js
│   ├── middleware/validation.js
│   ├── server.js
│   └── render.yaml
├── frontend/
│   ├── src/
│   │   ├── api/tasks.js
│   │   ├── hooks/useTasks.js
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskDetailModal.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── vite.config.js
├── AGENTS.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and install
```sh
git clone <your-repo-url>
cd task-tracker

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/task-tracker?retryWrites=true&w=majority
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run
```sh
# Terminal 1 — Backend
cd backend && npm start

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (`?status=`, `?priority=`, `?search=`, `?sort=`) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Deployment

- **Backend** → [Render](https://render.com) — Node web service, set `MONGO_URI` env var
- **Frontend** → [Vercel](https://vercel.com) — Import repo, set `VITE_API_URL` env var
- **Database** → [MongoDB Atlas](https://cloud.mongodb.com) — Free M0 cluster

## Submission

- Deployed app link
- GitHub repo link
- Google Form: https://forms.gle/DArr7s78iy7Pmj1v5
