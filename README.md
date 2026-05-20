# TaskFlow - Full Stack Project Management System

TaskFlow is a robust, full-stack project and task management system. It provides seamless role-based access control (RBAC), allowing teams to manage projects and tasks efficiently. 

## Technologies Used

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS v4** (for styling)
- **Axios** (for API requests)
- **React Router DOM** (for routing)
- **Lucide React** (for icons)

### Backend
- **.NET 8 Web API**
- **Entity Framework Core** (ORM)
- **PostgreSQL** (via Supabase)
- **JWT** (JSON Web Tokens for Authentication & Authorization)

---

## Getting Started Locally

### 1. Database Setup
The application uses PostgreSQL. The backend is configured to use a remote Supabase database out of the box. If you wish to use a local PostgreSQL instance, update the `ConnectionStrings__DefaultConnection` in `backend/appsettings.Development.json`.

### 2. Backend Setup
Navigate into the backend directory and run the application:
```bash
cd backend
dotnet restore
dotnet build
dotnet run
```
*Note: Entity Framework Migrations run automatically on startup via `db.Database.Migrate()`.*

### 3. Frontend Setup
Navigate into the frontend directory, install dependencies, and run the development server:
```bash
cd frontend
npm install
npm run dev
```

---

##  Deployment

### Deploying the Backend to Railway
The backend is fully configured for deployment on Railway:
1. Connect your GitHub repository to Railway.
2. Under the service **Settings**, set the **Root Directory** to `/backend`.
3. Railway will automatically detect the provided `Dockerfile` and handle the build and deployment.
4. **Environment Variables**: The `PORT` will be automatically assigned by Railway. Ensure you add `Jwt__Key` in Railway's Variables tab for secure JWT signing.

### Deploying the Frontend
The frontend can be deployed on Vercel, Netlify, or Railway.
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment Variables**: Set `VITE_API_URL` to the URL of your deployed Railway backend.

---

## Key Features
- **JWT Authentication & Authorization**: Secure login system with Role-Based Access Control (Admin vs Member).
- **Project Management**: Create, view, and manage projects.
- **Task Management**: Assign tasks to users, track progress, and update statuses.
- **Responsive UI**: Built with Tailwind CSS to ensure the app looks great on any device.
