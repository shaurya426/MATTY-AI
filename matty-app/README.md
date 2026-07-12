# Matty — Online Graphic Design Tool

A MERN-stack web app for creating posters, banners, and social media graphics: drag-and-drop canvas editor, image upload, text styling, save/load designs, PNG export, and a "My Designs" dashboard. Ships with a polished light theme and dark theme.

This implements the Phase 1 MVP from the project brief: **User Auth, Canvas Editor, Save/Load Designs, Export PNG, My Designs Dashboard.**

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router, TailwindCSS, fabric.js (canvas engine), lucide-react (icons), axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB (MongoDB Atlas) |
| Auth | JWT (bcrypt-hashed passwords) |
| Image storage | Cloudinary (optional — local base64 upload works out of the box too) |

## Project structure

```
matty-app/
├── backend/
│   ├── config/          # db.js, cloudinary.js
│   ├── models/          # User.js, Design.js
│   ├── middleware/       # auth.js, errorHandler.js
│   ├── routes/           # auth.js, designs.js, uploads.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/       # AuthContext, ThemeContext
    │   ├── components/    # Navbar, CanvasEditor, ProtectedRoute
    │   ├── pages/         # Login, Register, Dashboard, Editor
    │   ├── App.jsx, main.jsx, index.css
    ├── tailwind.config.js
    ├── package.json
    └── .env.example
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB connection string (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works well)
- (Optional) A free [Cloudinary](https://cloudinary.com) account, if you want uploaded images hosted in the cloud instead of embedded as base64

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/matty?retryWrites=true&w=majority

JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run it:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API will be live at `http://localhost:5000/api`. Check `GET /api/health` to confirm it's running.

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Open `http://localhost:5173`. Register an account, and you'll land on the dashboard.

## 4. API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Register (`username`, `email`, `password`) |
| POST | `/api/auth/login` | – | Log in (`email`, `password`) → JWT |
| GET  | `/api/auth/me` | ✅ | Current user profile |
| GET  | `/api/designs` | ✅ | List the user's designs |
| GET  | `/api/designs/:id` | ✅ | Fetch one design |
| POST | `/api/designs` | ✅ | Create a design (`title`, `jsonData`, `thumbnailUrl`) |
| PUT  | `/api/designs/:id` | ✅ | Update a design |
| DELETE | `/api/designs/:id` | ✅ | Delete a design |
| POST | `/api/uploads/image` | ✅ | Upload an image (multipart `image` field) to Cloudinary |

Authenticated requests need `Authorization: Bearer <token>`.

## 5. Editor features included

- Add rectangles, circles, editable text, and uploaded images to a canvas (fabric.js)
- Drag, resize, rotate, and delete objects
- Undo / redo (up to 50 steps)
- Export the canvas as a PNG
- Save the canvas as JSON to MongoDB, with an auto-generated thumbnail
- Reopen and continue editing any saved design

## 6. Light & dark theme

Theme is a Tailwind `class`-based dark mode toggle (moon/sun icon in the navbar and on the auth screens), persisted to `localStorage` and defaulting to the visitor's OS preference on first visit. Colors are defined as design tokens in `tailwind.config.js` (`canvas`, `surface`, `border`, `ink`, `muted`, `primary`, `accent`) so the whole UI restyles consistently.

## 7. Deployment

- **Frontend** → Vercel or Netlify (`npm run build`, publish `frontend/dist`, set `VITE_API_URL` to your deployed backend URL)
- **Backend** → Render / Railway (set the same env vars as `.env.example`, plus `CLIENT_URL` pointing at your deployed frontend)
- **Database** → MongoDB Atlas
- **Images** → Cloudinary

## 8. What's not included (per the brief's Phase 1 scope)

Real-time multi-user collaboration, a template gallery/marketplace, and payments are listed as Phase 2 / future enhancements in the project brief and are intentionally left out of this MVP. The code is structured (Socket.io-ready backend, modular routes) so they can be added later without a rewrite.
