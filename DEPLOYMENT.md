# Deployment Guide - Simple Step-by-Step

## Overview

Your app has 2 parts that need to be deployed separately:
- **Backend** (Python/FastAPI) → Deploy on **Render** (free)
- **Frontend** (Next.js) → Deploy on **Vercel** (free)

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

7. Click **"Create Web Service"**
8. Wait 5-10 minutes for it to deploy
9. **Copy your backend URL** (looks like: `https://todo-backend.onrender.com`)

---

## STEP 3: Deploy Frontend on Vercel

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

7. Click **"Deploy"**
8. Wait 2-3 minutes
9. Your app is live! 🎉

---

## Quick Summary Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] Frontend deployed on Vercel with `NEXT_PUBLIC_API_URL` set

---

## Important Notes

1. **Backend must be deployed first** - you need its URL for the frontend
2. **Free tier limits**: Render free services sleep after 15min of inactivity (takes 30s to wake up)
3. **DATABASE_URL**: Get your free PostgreSQL from [neon.tech](https://neon.tech)

---

## Troubleshooting

**Problem**: Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` in Vercel settings
- Make sure backend URL includes `https://` (not `http://`)

**Problem**: Backend crashes on startup
- Check Render logs for the error
- Make sure all environment variables are set correctly

**Problem**: Database connection error
- Verify your `DATABASE_URL` is correct
- Make sure your Neon database is not paused
