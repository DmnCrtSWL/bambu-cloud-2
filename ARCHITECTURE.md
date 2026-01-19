# Café Management System Architecture

## Project Structure
The project consists of three main components arranged in a monorepo-like structure for local development, which can be deployed independently.

```
/bambu-cloud-2-1
├── /menu       # Public Vue 3 Application (Vite)
├── /admin      # Admin Vue Application (Template)
├── /server     # Node.js + Express API
└── README.md
```

## Git Workflow
- **`main`**: Production-ready code. Only merge here when stable.
- **`develop`**: Active development branch. All feature branches merge here first.
- **Feature Branches**: Create branches like `feature/menu-layout` or `fix/login-bug` from `develop`.

## Backend Architecture (Server)
Located in `/server`.
- **Port**: 3000 (default)
- **Tech**: Express, PostgreSQL, JWT
- **Structure**:
  - `src/server.js`: Entry point
  - `src/app.js`: Express configuration
  - `src/routes/`: Route definitions
    - `public.js`: For Menu (no auth)
    - `private.js`: For Admin (JWT auth)
  - `src/middleware/`: Auth middleware
  - `src/config/`: Database connection

## Frontend Architecture
### Menu (/menu)
- **Tech**: Vue 3 + Vite
- **Focus**: Public facing, high performance, mobile friendly.
- **Components**: Will be built based on specific instructions.

### Admin (/admin)
- **Tech**: Vue (Template)
- **Focus**: Internal management, protected routes.
- **Auth**: Uses JWT token stored in localStorage/cookies.

## Deployment Strategy (Plesk)
- **Frontend**: Build `menu` and `admin` separately (`npm run build`). Deploy the `dist` folders to separate subdomains or subdirectories (e.g., `cafe.com` and `cafe.com/admin` or `admin.cafe.com`).
- **Backend**: Deploy `server` as a Node.js application on Plesk.
- **Environment Variables**: Manage sensitive keys (DB URL, JWT Secret) in Plesk environment settings.

## Getting Started Locally
1. **Server**:
   ```bash
   cd server
   npm install
   npm start
   ```
2. **Menu**:
   ```bash
   cd menu
   npm install
   npm run dev
   ```
3. **Database**: Ensure PostgreSQL is running and update `.env` in `server/`.

## Next Steps
1. User to provide design instructions for Menu components.
2. User to load/setup Admin template in `/admin`.
