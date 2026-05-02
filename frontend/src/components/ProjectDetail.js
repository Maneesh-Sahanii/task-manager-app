import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import ProjectMembers from "./ProjectMembers";
import "../styles/ProjectDetail.css";

function ProjectDetail({ project, onProjectDeleted, token, userId, userName }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjectData();
  }, [project._id]);

  const fetchProjectData = async () => {
    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data.stats || {});
      
      const tasksResponse = await fetch(`/api/tasks/project/${project._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tasksData = await tasksResponse.json();
      setTasks(tasksData.tasks || []);
      setError("");
    } catch (err) {
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(t => t._id !== taskId));
  };

  const handleProjectDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        onProjectDeleted(project._id);
      }
    } catch (err) {
      setError("Failed to delete project");
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const isProjectAdmin = project.admin._id === userId;

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  return (
    <div className="project-detail">
      <div className="project-header">
        <div className="project-info">
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <div className="project-meta">
            <span>Admin: {project.admin.name}</span>
            {project.dueDate && <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>}
          </div>
        </div>
        {isProjectAdmin && (
          <button onClick={handleProjectDelete} className="delete-project-btn">
            Delete Project
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.total || 0}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completed || 0}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{stats.inProgress || 0}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card overdue">
          <h3>{stats.overdue || 0}</h3>
          <p>Overdue</p>
        </div>
      </div>

      <div className="project-content">
        {/* Members */}
        <ProjectMembers
          project={project}
          token={token}
          isAdmin={isProjectAdmin}
          onMembersUpdate={fetchProjectData}
        />

        {/* Tasks Section */}
        <div className="tasks-section">
          <div className="tasks-header">
            <h2>Tasks</h2>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="create-task-btn"
            >
              + New Task
            </button>
          </div>

          {showTaskForm && (
            <TaskForm
              projectId={project._id}
              projectMembers={project.members}
              token={token}
              onTaskCreated={handleTaskCreated}
              onCancel={() => setShowTaskForm(false)}
            />
          )}

          {/* Filter */}
          <div className="task-filters">
            {["all", "todo", "in-progress", "completed", "overdue"].map(status => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? "active" : ""}`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            token={token}
            userId={userId}
            projectAdmin={project.admin._id}
            onTaskDeleted={handleTaskDeleted}
            onTasksUpdate={fetchProjectData}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
