# Deployment Guide - Simple Step-by-Step

## Overview

Your app has 2 parts that need to be deployed separately:
- **Backend** (Python/FastAPI) → Deploy on **Render** (free)
- **Frontend** (Next.js) → Deploy on **Vercel** (free)

---

## STEP 0: Get Your API Keys First!

Before deploying, you need these things:

### A. Google OAuth (for Google Sign-In) ⭐ IMPORTANT!

1. Go to **[console.cloud.google.com](https://console.cloud.google.com)**
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**
5. Select **"Web application"**
6. Add these **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (for local)
   - `https://YOUR-VERCEL-APP.vercel.app/api/auth/callback/google` (for production - add later)
7. Copy your **Client ID** and **Client Secret**

### B. Neon PostgreSQL (Database)

1. Go to **[neon.tech](https://neon.tech)**
2. Sign up and create a free project
3. Copy the **Connection string**

### C. Gemini API Key (for AI Chatbot)

1. Go to **[makersuite.google.com](https://makersuite.google.com/app/apikey)**
2. Create an API key
3. Copy it

---

## STEP 1: Push Your Code to GitHub

1. Go to **github.com** and create a new repository
2. Push your code:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

---

## STEP 2: Deploy Backend on Render (Free)

1. Go to **[render.com](https://render.com)**
2. Sign up/login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Fill in the form:

   | Setting | Value |
   |---------|-------|
   | Name | `todo-backend` (any name you want) |
   | Root Directory | `backend` |
   | Runtime | `Python 3` |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |

6. **Add Environment Variables** (scroll down to "Advanced"):

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon PostgreSQL connection string |
   | `BETTER_AUTH_SECRET` | A random 32+ character string |
   | `GEMINI_API_KEY` | Your Gemini API key |
   | `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
   | `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret |

7. Click **"Create Web Service"**
8. Wait 5-10 minutes for it to deploy
9. **Copy your backend URL** (looks like: `https://todo-backend.onrender.com`)

---

## STEP 3: Update Google OAuth Redirect URI

Now that you have your Vercel URL coming, go back to Google Console:

1. Go to **console.cloud.google.com** → **APIs & Services** → **Credentials**
2. Edit your OAuth 2.0 Client ID
3. Add your Vercel URL to redirect URIs:
   - `https://YOUR-VERCEL-APP.vercel.app/api/auth/callback/google`
4. Save

---

## STEP 4: Deploy Frontend on Vercel

1. Go to **[vercel.com](https://vercel.com)**
2. Sign up/login with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repository
5. Configure:

   | Setting | Value |
   |---------|-------|
   | Framework Preset | `Next.js` |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` (auto-filled) |

6. **Add Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | Your **Backend URL** from STEP 2 |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
   | `BETTER_AUTH_SECRET` | Same as backend (32+ random chars) |

7. Click **"Deploy"**
8. Wait 2-3 minutes
9. Your app is live! 🎉
10. **Copy your Vercel URL** and go back to STEP 3 to add it to Google Console

---

## Quick Summary Checklist

- [ ] Got Google OAuth Client ID & Secret
- [ ] Got Neon PostgreSQL connection string
- [ ] Got Gemini API key
- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render with all env vars
- [ ] Backend URL copied
- [ ] Frontend deployed on Vercel with all env vars
- [ ] Vercel URL added to Google Console redirect URIs

---

## Environment Variables Reference

### Backend (Render):
| Variable | Required? | Description |
|----------|-----------|-------------|
| `DATABASE_URL` | ✅ Yes | Neon PostgreSQL connection |
| `BETTER_AUTH_SECRET` | ✅ Yes | JWT secret (32+ chars) |
| `GOOGLE_CLIENT_ID` | ✅ Yes | For Google Sign-In |
| `GOOGLE_CLIENT_SECRET` | ✅ Yes | For Google Sign-In |
| `GEMINI_API_KEY` | ✅ Yes | For AI chatbot |
| `OPENAI_API_KEY` | Optional | Backup AI provider |

### Frontend (Vercel):
| Variable | Required? | Description |
|----------|-----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Backend URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ✅ Yes | Google OAuth Client ID |
| `BETTER_AUTH_SECRET` | ✅ Yes | Same as backend |

---

## Important Notes

1. **Backend must be deployed first** - you need its URL for the frontend
2. **Free tier limits**: Render free services sleep after 15min of inactivity (takes 30s to wake up)
3. **Google OAuth**: Make sure redirect URIs match exactly (including `https://`)

---

## Troubleshooting

**Problem**: Google Sign-In not working
- Check redirect URIs in Google Console match your Vercel URL exactly
- Make sure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in Vercel

**Problem**: Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` in Vercel settings
- Make sure backend URL includes `https://` (not `http://`)

**Problem**: Backend crashes on startup
- Check Render logs for the error
- Make sure all environment variables are set correctly

**Problem**: Database connection error
- Verify your `DATABASE_URL` is correct
- Make sure your Neon database is not paused
