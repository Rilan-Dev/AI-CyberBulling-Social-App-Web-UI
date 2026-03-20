# Deployment Configuration & Environment Details

This document outlines the deployment strategy and environment-specific configurations for the AI Cyberbullying Social App.

## 🌍 Environment-Specific Details

| Environment | Backend URL (Django) | Frontend URL (Next.js) | Database | Auth Provider |
|-------------|-----------------------|-------------------------|----------|---------------|
| **Development** | `http://localhost:8000/api` | `http://localhost:3000` | SQLite | Local (JWT) |
| **Production** | `https://ai-cyberbulling-social-app-backend-django-production.up.railway.app/api` | `https://cybernulling.social.ostechnologies.info/cyberbulling` | PostgreSQL | Managed JWT |

## 🛠️ Deployment Stack

- **Backend**: Railway (Platform as a Service)
- **Frontend**: Vercel (recommended) or custom hosting
- **Database**: PostgreSQL (Railway managed or external)
- **CI/CD**: GitHub Actions for automated testing and deployment

## 📂 Repositories

- **Frontend**: [AI-CyberBulling-Social-App-Web-UI](https://github.com/Rilan-Dev/AI-CyberBulling-Social-App-Web-UI.git)
- **Backend**: [AI-CyberBulling-Social-App-Backend-Django](https://github.com/Rilan-Dev/AI-CyberBulling-Social-App-Backend-Django.git)

## ⚙️ Configuration (Environment Variables)

### Backend (`.env`)
```env
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgres://user:password@host:port/dbname
ALLOWED_HOSTS=ai-cyberbulling-social-app-backend-django-production.up.railway.app
CORS_ALLOWED_ORIGINS=https://cybernulling.social.ostechnologies.info
```

### Frontend (`.env.production`)
```env
NEXT_PUBLIC_API_URL=https://ai-cyberbulling-social-app-backend-django-production.up.railway.app/api
```

## 🚀 Deployment Instructions

### Backend (Railway)
1. **Connect Repository**: Import the backend repo into Railway.
2. **Set Variables**: Add `DATABASE_URL`, `SECRET_KEY`, and other env variables in the Railway dashboard.
3. **Deploy**: Railway automatically detects the Django app and deploys it.

### Frontend (Vercel)
1. **Connect Repository**: Import the frontend repo into Vercel.
2. **Set Variables**: Add `NEXT_PUBLIC_API_URL` to Vercel's environment variables.
3. **Deploy**: Automatically deploys on push to `main` branch.

---
*For more detailed deployment scripts, refer to the `scripts/` directory.*
