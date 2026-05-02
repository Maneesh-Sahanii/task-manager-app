# Quick Start Guide 🚀

Get the Task Manager app running in minutes!

## Prerequisites
- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas account

## 1. Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

## 2. Setup Frontend

```bash
# In a new terminal, navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend will open at `http://localhost:3000`

## 3. Test the App

1. **Sign Up**
   - Click "Sign Up" on the login page
   - Enter name, email, and password
   - Click "Sign Up" button

2. **Create a Project**
   - Click "+ New Project" in the sidebar
   - Enter project name and description
   - Click "Create Project"

3. **Create a Task**
   - Select your project
   - Click "+ New Task"
   - Fill in task details
   - Click "Create Task"

4. **Add Team Members**
   - Go to project details
   - Scroll to "Team Members"
   - Enter member email and click "Add Member"

5. **Manage Tasks**
   - Change task status from the dropdown
   - Assign tasks to team members
   - Filter tasks by status and priority

## Using Docker (Optional)

```bash
# Make sure Docker is installed and running

# Run the entire stack
docker-compose up

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
# MongoDB: localhost:27017
```

## Environment Variables

Copy `.env.example` to `.env` and update values:

**Backend (.env)**
```
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

## Useful Commands

### Backend
```bash
npm run dev     # Start development server with auto-reload
npm start       # Start production server
```

### Frontend
```bash
npm start       # Start development server
npm run build   # Create production build
npm test        # Run tests
```

## Common Issues

**Port already in use?**
```bash
# Find and kill process on port
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -ti:5000 | xargs kill -9

# Or change PORT in .env file
```

**MongoDB not connecting?**
- Ensure MongoDB service is running
- Check MONGO_URI in .env file
- For Atlas: ensure IP is whitelisted

**CORS errors?**
- Check CLIENT_URL in backend .env
- Ensure frontend URL matches exactly

## Next Steps

1. Configure MongoDB Atlas for production
2. Deploy on Railway (see README.md)
3. Set up GitHub repository
4. Configure CI/CD pipeline

Need help? Check the main README.md for detailed documentation!
