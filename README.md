# Task Tracker

## Features

- **CRUD** — Create, view, update, delete tasks
- **Status** — Cycle between dropped → in-progress → done (click badge)
- **Priority** — Low / medium / high with colored bar on cards (click to cycle)
- **Color** — 11 card background colors (click card → color palette in modal)
- **Pin** — Pin important tasks to the top
- **Search** — Real-time search across titles and descriptions
- **Grid layout** — Responsive grid, pinned section separate from others
- **Detail modal** — Click any card to open and edit inline
- **Validation** — Both client and server side

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Chakra UI, react-icons, axios |
| Backend | Node.js, Express.js, Mongoose, express-validator |
| Database | MongoDB Atlas |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (`?status=`, `?priority=`, `?search=`, `?sort=`) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

