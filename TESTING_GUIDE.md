# Manual Testing Guide - Step by Step

Complete testing of your Task Manager application. Follow each step carefully.

---

## Prerequisites Check

Before you start, verify you have:
- MongoDB running locally OR MongoDB Atlas connection string
- Node.js installed (v16+)
- npm installed

### Quick Check
```powershell
node --version    # Should show v16.0.0 or higher
npm --version     # Should show v8.0.0 or higher
```

---

## Step 1: Setup Environment Variables (2 minutes)

### 1.1 Backend Configuration
Navigate to backend folder and verify `.env` file:

```powershell
cd c:\Users\manee\task-manager\backend
```

**Check if `.env` exists:**
```powershell
ls -Name .env
```

**If `.env` doesn't exist, create it:**
```powershell
New-Item -Path ".env" -ItemType File
```

**Add these contents to `.env` file:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-secret-key-change-this-in-production
CLIENT_URL=http://localhost:3000
```

**Save and verify:**
```powershell
Get-Content .env
```

Expected output:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-secret-key-change-this-in-production
CLIENT_URL=http://localhost:3000
```

### 1.2 Frontend Configuration
```powershell
cd c:\Users\manee\task-manager\frontend
```

Verify `.env` file exists:
```powershell
ls -Name .env
```

If it doesn't exist, create it:
```powershell
New-Item -Path ".env" -ItemType File
```

Add this content:
```
REACT_APP_API_URL=http://localhost:5000
```

Save and verify:
```powershell
Get-Content .env
```

---

## Step 2: Install Dependencies (3 minutes)

### 2.1 Backend Dependencies
```powershell
cd c:\Users\manee\task-manager\backend
npm install
```

**Expected output:** Should show "added X packages" with no errors

### 2.2 Frontend Dependencies
```powershell
cd c:\Users\manee\task-manager\frontend
npm install
```

**Expected output:** Should show "added X packages" with no errors

---

## Step 3: Start MongoDB (1 minute)

**Option A: Local MongoDB**
```powershell
mongod
```

**Expected output:**
```
...
[initandlisten] Listening on 127.0.0.1:27017
...
```

**Keep this terminal open while testing.**

---

## Step 4: Start Backend Server (2 minutes)

### Open NEW PowerShell window
```powershell
cd c:\Users\manee\task-manager\backend
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
📡 Environment: development
✅ MongoDB Connected
```

**Keep this terminal open.**

---

## Step 5: Run API Tests (5 minutes)

### Open ANOTHER NEW PowerShell window
```powershell
cd c:\Users\manee\task-manager\backend
node test-api-v2.js
```

**Expected output:**
```
============================================================
   TEAM TASK MANAGER - TEST SUITE (v2.0)
============================================================

1. AUTHENTICATION TESTS

✓ Signup user 1
✓ Signup user 2
✓ Login with valid credentials
✓ Login fails with wrong password
✓ Get current user

2. PROJECT MANAGEMENT TESTS

✓ Create project
✓ Get all projects
✓ Get single project
✓ Update project
✓ Add member to project

3. TASK MANAGEMENT TESTS

✓ Create task
✓ Get tasks by project
✓ Update task status
✓ Assign task to member

4. ACCESS CONTROL TESTS

✓ Non-member cannot access project

5. VALIDATION TESTS

✓ Weak password rejected
✓ Required fields validation
✓ Delete task
✓ Delete project

============================================================
   TEST SUMMARY
============================================================

Passed: 19
Failed: 0
Total:  19

Pass Rate: 100.00%

✓ ALL TESTS PASSED!
```

**This confirms ALL API endpoints are working! ✅**

---

## Step 6: Start Frontend (2 minutes)

### Open ANOTHER NEW PowerShell window
```powershell
cd c:\Users\manee\task-manager\frontend
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view task-manager-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

**This will automatically open your browser at `http://localhost:3000`**

---

## Step 7: Manual Frontend Testing (5 minutes)

### 7.1 Test Authentication
**Page:** Login/Signup screen

**Step 1: Signup**
1. Click "Don't have an account? Sign up"
2. Enter:
   - Name: `Test User`
   - Email: `testuser@example.com`
   - Password: `Password123`
   - Confirm Password: `Password123`
3. Click "Sign Up"

**Expected:** ✅ Redirected to Dashboard
**Status Indicator:** Green success message

---

### 7.2 Test Project Creation
**Page:** Dashboard

**Step 1: Create New Project**
1. You'll see a form to create project
2. Enter:
   - Project Name: `My First Project`
   - Description: `Testing the application`
   - Due Date: Select any future date
3. Click "Create Project"

**Expected:** ✅ Project appears in left sidebar
**Status Indicator:** Project listed under your name

---

### 7.3 Test Task Creation
**Page:** Dashboard (with project selected)

**Step 1: Create New Task**
1. Click on the project you just created
2. In the task form, enter:
   - Task Title: `Complete Project`
   - Description: `Finish testing all features`
   - Priority: `High`
   - Due Date: Select a date
3. Click "Add Task"

**Expected:** ✅ Task appears in the task list
**Status Indicator:** Task card shows in the list

---

### 7.4 Test Task Status Update
**Page:** Dashboard (task card visible)

**Step 1: Change Task Status**
1. Find the task you created
2. In the task card, find the status dropdown (shows "todo")
3. Change to "in-progress"

**Expected:** ✅ Status updates immediately
**Status Indicator:** Status badge changes

---

### 7.5 Test Member Addition
**Page:** Dashboard (project detail)

**Step 1: Create Another User (New Signup)**
1. Click "Logout" (top right)
2. Click "Sign Up"
3. Signup with:
   - Name: `Team Member`
   - Email: `member@example.com`
   - Password: `Password456`
4. Create a project

**Step 2: Add Member to Your First Project**
1. Logout as `member@example.com`
2. Login as `testuser@example.com`
3. Click on "My First Project"
4. Look for "Add Member" button
5. Enter email: `member@example.com`
6. Click "Add"

**Expected:** ✅ Member added to project
**Status Indicator:** Member appears in members list

---

### 7.6 Test Access Control
**Step 1: Login as Different User**
1. Logout
2. Login as `member@example.com`
3. You should be able to see the project they were added to

**Expected:** ✅ Can view project and tasks
**Status Indicator:** Project visible in sidebar

**Step 2: Try to Access Unauthorized Project**
1. Note the project URL (e.g., `...projectId=xyz`)
2. Manually try to modify the URL to a different project ID
3. Application should reject access

**Expected:** ✅ Access denied message
**Status Indicator:** Error notification shown

---

## Step 8: Verification Checklist

After completing all tests, verify:

### Backend API (from Step 5)
- [ ] All 19 tests passed
- [ ] 100% pass rate shown
- [ ] No error messages in test output

### Frontend Authentication (from Step 7.1)
- [ ] Signup works
- [ ] Login works
- [ ] User data persists

### Project Management (from Step 7.2-7.3)
- [ ] Can create projects
- [ ] Projects appear in sidebar
- [ ] Can create tasks within projects
- [ ] Tasks display correctly

### Task Operations (from Step 7.4)
- [ ] Can update task status
- [ ] Status changes immediately
- [ ] Can delete tasks

### Team Features (from Step 7.5-7.6)
- [ ] Can add team members
- [ ] Members can access shared projects
- [ ] Non-members cannot access projects
- [ ] Role-based access working

---

## Step 9: Stop Services (Cleanup)

When done testing:

### Terminal 1 (MongoDB)
```powershell
# Press Ctrl+C to stop MongoDB
```

### Terminal 2 (Backend)
```powershell
# Press Ctrl+C to stop backend server
```

### Terminal 3 (Tests)
- Already finished, you can close this

### Terminal 4 (Frontend)
```powershell
# Press Ctrl+C to stop frontend dev server
# Close browser tab
```

---

## Troubleshooting Guide

### Issue: MongoDB Connection Failed

**Error:** 
```
✘ MongoDB Connection Failed
```

**Solution:**
1. Check if MongoDB is running: `mongod` in a terminal
2. Or use MongoDB Atlas (cloud):
   - Change `MONGODB_URI` in `.env` to your connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/taskmanager`

### Issue: Port 5000 Already in Use

**Error:**
```
listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Issue: Port 3000 Already in Use

**Error:**
```
Something is already running on port 3000
```

**Solution:**
```powershell
# Kill process on 3000
lsof -i :3000
taskkill /PID <PID> /F

# Or use different port
set PORT=3001
npm start
```

### Issue: Tests Fail with "Cannot Find Module"

**Error:**
```
Error: Cannot find module 'axios'
```

**Solution:**
```powershell
cd backend
npm install axios
npm install
```

### Issue: CORS Error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Verify `CLIENT_URL` in backend `.env`
2. Verify `REACT_APP_API_URL` in frontend `.env`
3. Both should be correct URLs
4. Restart backend after changing `.env`

---

## Summary of Commands

**Quick Reference - Copy and Run These:**

```powershell
# Terminal 1 - MongoDB
mongod

# Terminal 2 - Backend
cd c:\Users\manee\task-manager\backend
npm install
npm run dev

# Terminal 3 - Tests
cd c:\Users\manee\task-manager\backend
node test-api-v2.js

# Terminal 4 - Frontend
cd c:\Users\manee\task-manager\frontend
npm install
npm start
```

---

## Expected Results

✅ **All APIs respond correctly (19/19 tests)**  
✅ **Frontend loads without errors**  
✅ **Can signup and login**  
✅ **Can create projects and tasks**  
✅ **Can manage team members**  
✅ **Access control working**  

**Total Testing Time:** ~20-30 minutes

**When All Tests Pass:** Your application is ready for deployment! 🎉

---

## Next Steps After Testing

1. ✅ Push to GitHub
2. ✅ Deploy to Railway
3. ✅ Test in production
4. ✅ Share with team/instructor

Good luck! Let me know if you hit any issues! 🚀
