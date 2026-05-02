# Team Task Manager 📋

A full-stack web application for managing team projects and tasks with role-based access control. Create projects, assign tasks, track progress, and manage team members efficiently.

## 🚀 Key Features

- **Authentication**: Secure signup/login with JWT tokens
- **Project Management**: Create and manage multiple projects
- **Task Tracking**: Create, assign, and track task progress
- **Team Collaboration**: Add team members to projects and assign tasks
- **Dashboard**: View all tasks with filtering by status and priority
- **Role-Based Access**: Admin and Member roles with different permissions
- **Status Tracking**: Track tasks with Todo, In Progress, Completed, and Overdue status
- **Priority Levels**: Assign low, medium, or high priority to tasks

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password**: bcryptjs

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user details

### Projects
- `GET /api/projects` - Get all user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:projectId` - Get project details
- `PUT /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project
- `POST /api/projects/:projectId/members` - Add member to project
- `DELETE /api/projects/:projectId/members/:userId` - Remove member from project

### Tasks
- `GET /api/tasks/project/:projectId` - Get all tasks in a project
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:taskId` - Get task details
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task
- `GET /api/tasks/user/assigned-tasks` - Get user's assigned tasks

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User signs up or logs in
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is sent in Authorization header for protected routes
5. Server validates token and returns user data

## 👥 Role-Based Access

- **Admin**: Can create projects, manage members, create/delete tasks
- **Member**: Can view projects, create/update tasks assigned to them

## 🚀 Deployment (Railway)

### Steps to Deploy on Railway

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/task-manager.git
   git push -u origin main
   ```

2. **Connect Railway Account**:
   - Go to [railway.app](https://railway.app)
   - Sign up/Login
   - Create new project

3. **Deploy Backend**:
   - Connect your GitHub repository
   - Select backend folder as root directory
   - Set environment variables:
     - `MONGO_URI`: MongoDB Atlas connection string
     - `JWT_SECRET`: Strong secret key
     - `NODE_ENV`: production
     - `CLIENT_URL`: Your frontend URL on Railway

4. **Deploy Frontend**:
   - Create another service for frontend
   - Set build command: `npm run build`
   - Set start command: `npm start`
   - Set environment variable: `REACT_APP_API_URL`: Your backend URL

5. **Connect Services**:
   - Link backend and frontend services in Railway
   - Update API URLs in frontend

## 📦 Project Structure

```
task-manager/
├── backend/
│   ├── middleware/
│   │   ├── auth.js
│   │   └── project.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── project.js
│   │   └── task.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── styles/
│   │   ├── App.js
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## 📝 Usage Example

### Creating a Project
1. Login to the application
2. Click "New Project" button
3. Enter project name and description
4. Project is created and you are set as admin

### Creating a Task
1. Select a project from sidebar
2. Click "New Task" button
3. Fill in task details (title, description, priority, due date)
4. Optionally assign to a team member
5. Task is created

### Managing Team Members
1. Go to project
2. Scroll to "Team Members" section
3. Add members by their email address
4. Remove members as needed

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify `MONGO_URI` in `.env` file

### JWT Token Issues
- Clear browser cache and localStorage
- Log out and log back in
- Check that `JWT_SECRET` is the same on backend

### CORS Errors
- Ensure backend `CLIENT_URL` matches frontend URL
- Check CORS configuration in server.js

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

For questions or support, please create an issue in the GitHub repository.

---

**Happy task managing! 🎉**
