# 🚀 Vercel Deployment Guide

## Issue Fixed: API URL Configuration

### Problem
The frontend was calling APIs to its own domain (`myfirstportfolio-coral.vercel.app`) instead of the backend URL.

### Solution
Created a centralized axios configuration that reads from environment variables.

---

## 📁 Files Changed

1. **`client/src/api/axiosConfig.js`** (NEW)
   - Configures axios with base URL from environment
   - Adds auth token interceptor
   - Handles both development and production

2. **`client/src/context/AuthContext.jsx`**
   - Now uses configured axios instance
   - Auth token handled by interceptor

3. **`client/src/api/portfolioService.js`**
   - Now uses configured axios instance

4. **`client/.env.example`**
   - Added production URL example

---

## 🔧 How It Works

### Development (Local)
```env
VITE_API_URL=http://localhost:5000
```
- Axios calls: `http://localhost:5000/api/auth/register`
- Vite proxy still works as backup

### Production (Vercel)
```env
VITE_API_URL=https://first-portfolio-seven-kappa.vercel.app
```
- Axios calls: `https://first-portfolio-seven-kappa.vercel.app/api/auth/register`
- Direct backend URL

---

## 📝 Deployment Steps

### 1. Deploy Backend to Vercel

**Option A: Vercel CLI**
```bash
cd server
vercel
```

**Option B: Vercel Dashboard**
1. Import `First-Portfolio` repository
2. Set Root Directory: `server`
3. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CLOUDINARY_*`: If using Cloudinary
4. Deploy

**Get your backend URL:** `https://first-portfolio-seven-kappa.vercel.app`

---

### 2. Deploy Frontend to Vercel

**Step 1: Set Environment Variable**

In Vercel Dashboard for frontend project:
1. Go to Settings → Environment Variables
2. Add variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://first-portfolio-seven-kappa.vercel.app`
   - **All Environments** (Production, Preview, Development)

**Step 2: Deploy**

**Option A: Vercel CLI**
```bash
cd client
vercel
```

**Option B: Vercel Dashboard**
1. Import repository (if not already)
2. Set Root Directory: `client`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variable (from Step 1)
6. Deploy

---

## ✅ Verification

### 1. Check Backend
Visit: `https://first-portfolio-seven-kappa.vercel.app/api/auth/login`
- Should return: `{"message":"..."}`  or API response

### 2. Check Frontend
1. Visit your frontend URL
2. Open Browser DevTools → Network tab
3. Try to register/login
4. Check API calls go to correct backend URL

### 3. Test API Calls
All these should work:
- Registration
- Login
- Get Portfolio
- Update Portfolio
- Public Portfolio view

---

## 🔍 Common Issues

### Issue: Still calling wrong URL

**Solution:** Clear Vercel build cache
```bash
# In Vercel Dashboard
Deployments → ⋯ Menu → Redeploy → Clear cache and redeploy
```

### Issue: CORS errors

**Solution:** Add frontend URL to CORS in `server/index.js`
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://myfirstportfolio-coral.vercel.app'  // Add your frontend URL
  ]
}));
```

### Issue: Environment variable not working

**Solution:** 
1. Verify variable name is **exactly** `VITE_API_URL` (case-sensitive)
2. Redeploy after adding environment variable
3. Check Vercel logs for errors

---

## 📋 Environment Variables Checklist

### Backend (.env)
- [ ] `MONGO_URI`
- [ ] `JWT_SECRET`
- [ ] `PORT` (optional, Vercel sets automatically)
- [ ] `CLOUDINARY_CLOUD_NAME` (if using)
- [ ] `CLOUDINARY_API_KEY` (if using)
- [ ] `CLOUDINARY_API_SECRET` (if using)

### Frontend (.env)
- [ ] `VITE_API_URL` ← **IMPORTANT!**

---

## 🎯 Quick Deploy Commands

### Deploy Both (Separate Projects)

**Terminal 1 - Backend:**
```bash
cd server
vercel --prod
```

**Terminal 2 - Frontend:**
```bash
cd client  
vercel --prod
```

### Environment Setup

**Backend .env:**
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key_here
```

**Frontend .env (Production):**
```env
VITE_API_URL=https://first-portfolio-seven-kappa.vercel.app
```

**Frontend .env (Development):**
```env
VITE_API_URL=http://localhost:5000
```

---

## 💡 Pro Tips

1. **Keep two .env files locally:**
   - `.env` - for development
   - `.env.production` - for production testing

2. **Test locally with production URL:**
   ```bash
   # In client directory
   VITE_API_URL=https://first-portfolio-seven-kappa.vercel.app npm run dev
   ```

3. **Use Vercel environment groups:**
   - Production: Real backend
   - Preview: Test/staging backend
   - Development: localhost

4. **Monitor API calls:**
   - Use Vercel Analytics
   - Check backend logs for requests
   - Use browser DevTools Network tab

---

## ✅ Success Checklist

After deployment:
- [ ] Backend is accessible at your Vercel URL
- [ ] Frontend loads correctly
- [ ] Registration works
- [ ] Login works
- [ ] Can create/edit portfolio
- [ ] Public portfolio displays
- [ ] No CORS errors
- [ ] API calls go to correct backend
- [ ] Templates switch correctly
- [ ] Dark/light themes work

---

## 🆘 Need Help?

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set
4. Test API endpoints directly with Postman/curl
5. Check CORS configuration

---

**Your app is now configured for production deployment!** 🎉

The frontend will correctly use your backend URL from environment variables.
