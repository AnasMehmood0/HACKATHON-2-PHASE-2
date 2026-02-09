# Vercel Deployment Guide

Deploy both Backend (FastAPI) and Frontend (Next.js) on Vercel.

---

## Overview

| Part | Directory | Vercel Project Name |
|------|-----------|---------------------|
| Backend | `backend/` | `todo-backend` |
| Frontend | `frontend/` | `todo-frontend` |

---

## STEP 0: Get Your API Keys First

### A. Google OAuth (for Google Sign-In)

1. Go to **[console.cloud.google.com](https://console.cloud.google.com)**
2. **APIs & Services** → **Credentials**
3. **Create Credentials** → **"OAuth client ID"**
4. Select **"Web application"**
5. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://todo-frontend.vercel.app/api/auth/callback/google` (production - update after deploy)
6. Copy **Client ID** and **Client Secret**

### B. Neon PostgreSQL (Database)

1. Go to **[neon.tech](https://neon.tech)**
2. Create free project
3. Copy **Connection string**

### C. Gemini API Key

1. Go to **[makersuite.google.com](https://makersuite.google.com/app/apikey)**
2. Create API key
3. Copy it

---

## STEP 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

---

## STEP 2: Deploy Backend on Vercel

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:

   | Setting | Value |
   |---------|-------|
   | **Project Name** | `todo-backend` |
   | **Root Directory** | `backend` |
   | **Framework Preset** | `Other` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Output Directory** | `.` |

5. **Add Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon PostgreSQL connection string |
   | `BETTER_AUTH_SECRET` | A random 32+ character string |
   | `GEMINI_API_KEY` | Your Gemini API key |
   | `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
   | `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret |

6. Click **"Deploy"**
7. Wait for deployment to complete
8. **Copy your backend URL** (e.g., `https://todo-backend.vercel.app`)

---

## STEP 3: Deploy Frontend on Vercel

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Add New..."** → **"Project"**
3. Import the **same** GitHub repository
4. Configure:

   | Setting | Value |
   |---------|-------|
   | **Project Name** | `todo-frontend` |
   | **Root Directory** | `frontend` |
   | **Framework Preset** | `Next.js` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `.next` |

5. **Add Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | Your **Backend URL** from STEP 2 |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
   | `BETTER_AUTH_SECRET` | Same as backend (32+ random chars) |

6. Click **"Deploy"**
7. Wait for deployment to complete
8. Your app is live! 🎉

---

## STEP 4: Update Google OAuth Redirect

1. Go to **[console.cloud.google.com](https://console.cloud.google.com)**
2. Edit your OAuth Client ID
3. Add this redirect URI:
   - `https://todo-frontend.vercel.app/api/auth/callback/google`
4. Save

---

## Environment Variables Summary

### Backend (todo-backend):
| Variable | Required? | Description |
|----------|-----------|-------------|
| `DATABASE_URL` | ✅ Yes | Neon PostgreSQL |
| `BETTER_AUTH_SECRET` | ✅ Yes | JWT secret |
| `GOOGLE_CLIENT_ID` | ✅ Yes | Google Sign-In |
| `GOOGLE_CLIENT_SECRET` | ✅ Yes | Google Sign-In |
| `GEMINI_API_KEY` | ✅ Yes | AI chatbot |

### Frontend (todo-frontend):
| Variable | Required? | Description |
|----------|-----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Backend URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ✅ Yes | Google OAuth |
| `BETTER_AUTH_SECRET` | ✅ Yes | Same as backend |

---

## Troubleshooting

**Problem**: Backend returns 500 error
- Check Vercel logs for the backend
- Make sure all environment variables are set
- Verify DATABASE_URL is correct

**Problem**: Google Sign-In not working
- Check redirect URIs in Google Console match exactly
- Make sure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in frontend

**Problem**: Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Make sure backend is deployed successfully
