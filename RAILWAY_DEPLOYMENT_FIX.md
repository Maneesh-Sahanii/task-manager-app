# Railway Deployment - Complete Fix Guide

## 🔴 The Problem

Your deployed app shows these errors:
- "An error occurred" on signup
- "Unexpected token '<', '<!doctype'..." on dashboard
- "Failed to load projects"

**Root Cause:** The frontend doesn't know your backend API URL.

---

## ✅ Step-by-Step Fix

### Step 1: Get Your Backend URL from Railway

1. Go to **https://railway.app**
2. Login to your account
3. Click on your **Task Manager project**
4. Find **Backend service**
5. Click it → Look for **"Deployments"** or **"Services"**
6. You'll see a URL like: `https://task-manager-backend-xxx.railway.app`
7. **Copy this URL** (you'll need it in Step 2)

---

### Step 2: Set Environment Variables in Railway

**For Frontend Service:**

1. In Railway Dashboard → Click **Frontend** service
2. Go to **"Variables"** tab
3. Click **"Add Variable"**
4. Set:
   ```
   REACT_APP_API_URL=https://task-manager-backend-xxx.railway.app
   ```
   (Replace `xxx` with your actual backend URL from Step 1)

5. Click **Save**
6. **Redeploy:** Go to Deployments → Click "Redeploy" or wait for auto-redeploy

---

### Step 3: Update Backend CORS Settings

The backend needs to allow requests from your frontend URL.

**For Backend Service:**

1. In Railway → Click **Backend** service
2. Go to **"Variables"** tab
3. Find `CLIENT_URL` variable
4. Update it to your frontend URL:
   ```
   CLIENT_URL=https://task-manager-frontend-yyy.railway.app
   ```
   (Replace `yyy` with your actual frontend URL)

5. Click **Save**
6. **Redeploy**

---

## 📋 Required Environment Variables Checklist

### Backend Variables (in Railway):
```
PORT=8000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your-secret-key
CLIENT_URL=https://task-manager-frontend-yyy.railway.app
```

### Frontend Variables (in Railway):
```
REACT_APP_API_URL=https://task-manager-backend-xxx.railway.app
```

---

## 🔧 Quick Fix: Get Your Railway URLs

Run this in PowerShell to find your deployed URLs:

```powershell
cd c:\Users\manee\task-manager

# If using Railway CLI:
railway status
```

This will show you both service URLs.

---

## 🚀 Manual Redeploy Steps

If changes don't reflect, force a redeploy:

```powershell
cd c:\Users\manee\task-manager

# Push latest code to GitHub
git add .
git commit -m "Fix frontend API URL configuration"
git push origin main

# In Railway, trigger redeploy:
# Option 1: Dashboard → Service → Deployments → Redeploy
# Option 2: CLI command:
railway trigger
```

---

## ❌ Common Mistakes

### ❌ Mistake 1: Wrong API URL Format
```
WRONG:  REACT_APP_API_URL=task-manager-backend-xxx.railway.app
RIGHT:  REACT_APP_API_URL=https://task-manager-backend-xxx.railway.app
                          ↑ Don't forget https://
```

### ❌ Mistake 2: Forgot to Redeploy
- Changing variables in Railway requires a **redeploy**
- The new variables won't take effect automatically
- Go to **Deployments** → **Redeploy**

### ❌ Mistake 3: MongoDB Connection Wrong
- Use MongoDB Atlas, not local MongoDB
- Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- Get it from: https://www.mongodb.com/cloud/atlas

### ❌ Mistake 4: Port Conflicts
- Backend port should be `8000` or let Railway assign it
- Don't use `5000` in production
- Let Railway set PORT with `$PORT` variable

---

## 📝 Complete MongoDB Atlas Setup (if needed)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster
4. Go to **Database Access** → Create user (username/password)
5. Go to **Network Access** → Allow access from anywhere (0.0.0.0/0)
6. Click **Connect** → Copy connection string
7. Replace `<username>`, `<password>`, `<dbname>` in the string
8. Use this as `MONGODB_URI` in Railway

Example:
```
mongodb+srv://maneesh:MyPassword123@cluster0.abc.mongodb.net/taskmanager
```

---

## ✅ Test After Fix

1. Go to your **Frontend URL** (from Railway)
2. Try **Signup** with new email
3. You should **NOT** see "An error occurred"
4. After signup, dashboard should load
5. Try creating a project
6. Try creating a task

---

## 🆘 If Still Failing

### Debug Step 1: Check Console Errors
1. Open frontend URL in browser
2. Press **F12** (Open Developer Tools)
3. Go to **Console** tab
4. Look for errors with network requests
5. Note the API URL it's trying to use

### Debug Step 2: Test Backend Directly
Open this in browser (replace with your backend URL):
```
https://task-manager-backend-xxx.railway.app/api/auth/me
```

**Expected:** JSON error about missing token (that's OK)
**Bad:** HTML error page or "Cannot GET /api/auth/me"

### Debug Step 3: Check Railway Logs
1. Go to Railway Dashboard
2. Click Backend service
3. Go to **Logs** tab
4. Look for any error messages
5. Check if MongoDB is connecting properly

### Debug Step 4: Verify Environment Variables
1. Railway → Backend service → Variables
2. Verify all 5 variables are set correctly
3. Railway → Frontend service → Variables
4. Verify REACT_APP_API_URL is set

---

## 📞 Need Help?

If still not working, provide:
1. Your Backend URL (from Railway)
2. Your Frontend URL (from Railway)
3. Screenshot of the error
4. Open DevTools (F12) → Console → Screenshot of errors shown

---

## ✨ Success Indicators

When it's working:
✅ Signup form works without "An error occurred"
✅ Dashboard loads without JSON parsing errors
✅ Can create projects and tasks
✅ Can see list of projects
✅ Can manage team members

---

**Start with Step 1 and let me know when you have the URLs!** 🚀
