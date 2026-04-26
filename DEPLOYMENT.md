# Deployment Guide

This project is split into:

- `backend`: Express + MongoDB API for Render
- `frontend`: Create React App for Vercel

## 1. Deploy the backend to Render

You can either:

- create a Render Web Service manually, or
- import the root `render.yaml` Blueprint from this repo

Recommended Render settings:

- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables for Render:

- `MONGO_URL`: your MongoDB connection string
- `CLIENT_URLS`: your Vercel frontend URL after the frontend is deployed

Example `CLIENT_URLS` value:

```env
https://your-project.vercel.app
```

The API exposes:

- `GET /` for a quick status message
- `GET /health` for Render health checks

## 2. Deploy the frontend to Vercel

Create a new Vercel project from the same repository and set:

- Root Directory: `frontend`
- Framework Preset: `Create React App`

Environment variable for Vercel:

```env
REACT_APP_API_URL=https://your-render-service.onrender.com/api/v1
```

The included `frontend/vercel.json` keeps client-side routes working by rewriting requests to `index.html`.

## 3. Final hookup

After Vercel gives you the frontend URL:

1. Add that URL to Render as `CLIENT_URLS`
2. Trigger a redeploy on Render
3. Confirm the frontend can load and submit data

## Notes

- Local frontend fallback stays `http://localhost:5000/api/v1`
- Local backend fallback stays `PORT=5000`
- If you use more than one frontend domain, put them in `CLIENT_URLS` as a comma-separated list
