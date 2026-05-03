import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProjectList from "./components/ProjectList";
import ProjectDetail from "./components/ProjectDetail";
import CreateProject from "./components/CreateProject";
import "./styles/Dashboard.css";

function Dashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchProjects();
    }
  }, [token, navigate]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setProjects(data.projects || []);
      setError("");
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    setShowCreateProject(false);
  };

  const handleProjectDeleted = (projectId) => {
    setProjects(projects.filter(p => p._id !== projectId));
    setSelectedProject(null);
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📋 Task Manager</h1>
        <div className="user-section">
          <span>Welcome, {user?.name || "User"}! ({user?.role})</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Projects</h2>
            <button
              onClick={() => setShowCreateProject(true)}
              className="create-project-btn"
            >
              + New Project
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <ProjectList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
          />
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {showCreateProject ? (
            <CreateProject
              onProjectCreated={handleProjectCreated}
              onCancel={() => setShowCreateProject(false)}
            />
          ) : selectedProject ? (
            <ProjectDetail
              project={selectedProject}
              onProjectDeleted={handleProjectDeleted}
              token={token}
              userId={user?._id}
              userName={user?.name}
            />
          ) : (
            <div className="empty-state">
              <p>👈 Select a project or create a new one to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
