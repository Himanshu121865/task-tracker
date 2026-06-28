# Task Tracker — Agent Memory File

## Project Overview
MERN stack task tracker with a Google Keep-inspired UI. Dark mode only. Built for COLL-EDGE CONNECT internship assignment.

## Tech Stack
- **Frontend**: React 18 + Vite + Chakra UI + react-icons + axios
- **Backend**: Node.js + Express.js + Mongoose + express-validator
- **Database**: MongoDB Atlas

## Project Structure
```
task-tracker/
├── backend/
│   ├── models/Task.js           # Mongoose schema (title, desc, status, priority, color, pinned)
│   ├── routes/tasks.js          # CRUD + search/filter/sort query params
│   ├── middleware/validation.js # express-validator rules
│   ├── server.js                # Express entry point
│   ├── render.yaml              # Render deployment config
│   └── .env                     # MONGO_URI, PORT
├── frontend/
│   ├── src/
│   │   ├── api/tasks.js         # Axios API layer
│   │   ├── hooks/useTasks.js    # State management + all CRUD/action functions
│   │   ├── components/
│   │   │   ├── TaskForm.jsx     # Expandable "Take a note..." form with color & priority
│   │   │   ├── TaskCard.jsx     # Keep-style card: priority bar, pin, hover actions, click to open
│   │   │   ├── TaskList.jsx     # Responsive grid with Pinned / Other sections
│   │   │   └── TaskDetailModal.jsx  # Modal for editing title, desc, color, status, priority
│   │   ├── App.jsx              # Sticky header with search bar + layout
│   │   └── main.jsx             # ChakraProvider, forced dark theme
│   ├── vercel.json              # SPA fallback routing
│   └── vite.config.js
├── README.md
└── AGENTS.md
```

## Feature Inventory

### Core CRUD
- Create via expandable "Take a note..." form (title req, desc opt, color picker, priority)
- Read with responsive grid, pinned first
- Update via edit button (prefills top form) or click card → detail modal
- Delete via trash icon on card hover or in modal

### Status Management
- Click status badge to cycle: dropped → in-progress → done → dropped
- Badge color-coded (gray/blue/green)
- Change in modal as well

### Priority
- Colored top bar on cards (green/orange/red)
- Click priority badge on hover to cycle: low → medium → high → low
- 3 toggle buttons in form, clickable badge in modal

### Card Colors
- 11 colors (default, red, orange, yellow, green, teal, blue, purple, pink, brown, gray)
- Color swatches in form and modal
- Dark Google Keep-style palette
- Instant update on click

### Pin
- Pin icon on hover, yellow when pinned
- Pinned tasks appear in separate section at top
- Toggle in modal too

### Search
- Real-time regex search on title + description
- Sticky header search bar

### UI Features
- Always-on dark mode
- Google Keep-style cards with hover-reveal action bar
- Click card to open detail modal (auto-saves title/desc on close)
- Responsive grid (1-4 columns)
- Empty state with icon + helpful text
- Loading spinner (indigo spinner)
- Toast notifications on create/update/delete/pin/status/priority
- Action bar uses absolute positioning (no layout shift on hover)
- Drag-and-drop grid reorder with @dnd-kit (three independent sections: pinned, active, archive)

### UI Polish (v2)
- Inter font via @fontsource/inter (Google Keep-style typography)
- Scrollbar styling (thin, rounded)
- Header: "Taskflow" branding with purple gradient icon, blurred backdrop, pill-shaped search with indigo focus glow
- Card: scale(1.02) on hover, elevated shadow, taller (5px) priority bar, always-visible drag handle at low opacity, pill-shaped badges and action buttons, filled pin icon when pinned
- Form: plus icon placeholder, focus glow on expanded state, larger color swatches with checkmark on selected, pill-shaped priority/add buttons with gradient submit button
- Modal: matching top colored bar, colored outline with checkmark on selected swatch, pill badges, auto-focus title on open, backdrop blur overlay
- Section headers: icons (pin/archive) + count badges, uppercase letter-spacing
- Dark background: #1a1a2e (deep navy) instead of gray.800

### Backend
- Mongoose schema with validation (title 3-100 chars, desc max 500)
- express-validator middleware (status, priority, color, pinned)
- CORS enabled
- Regex search on title + description
- Default sort: pinned first, then newest
- Query params: `?status=`, `?priority=`, `?search=`, `?sort=`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks with optional filters |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Deployment
- Backend: Render (Node web service, env vars: MONGO_URI, PORT)
- Frontend: Vercel (env var: VITE_API_URL)
- Database: MongoDB Atlas (free M0 cluster)

## Known Limitations
- No undo/redo
- No due dates or reminders
- No user authentication (single-user)
- No pagination (all tasks loaded at once)
- No image/file attachments

## How to Run
```sh
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run dev
```

## Session History
- Initial scaffold: Express + Mongoose CRUD, Vite + React + Chakra UI
- Added filtering, sorting, search, validation
- Redesigned UI to Google Keep style (grid cards, pin, color picker, expandable form)
- Added dark color palette for card backgrounds
- Forced dark mode only, removed light mode toggle
- Added clickable status badge (cycle dropped/in-progress/done)
- Removed hover Collapse (absolute overlay instead, no layout shift)
- Added TaskDetailModal (click card to edit title, desc, color, status, priority)
- Added priority support (colored bar, cycle on hover badge, form selector, modal control)
- Status enum renamed: pending → dropped
- Created README.md with full setup/deployment docs
- Updated AGENTS.md to track all features accurately
- UI Polish v2: Inter font, Taskflow branding, indigo accent color, card scale/shadow on hover, pill-shaped badges/buttons/blur backdrop, color swatches with checkmark, gradient submit button, archive section naming, deep navy background, custom scrollbar
