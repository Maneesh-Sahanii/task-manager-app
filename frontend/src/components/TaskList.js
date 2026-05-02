import { useState } from "react";
import "../styles/TaskList.css";

function TaskList({ tasks, token, userId, projectAdmin, onTaskDeleted, onTasksUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        onTasksUpdate();
      }
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        onTaskDeleted(taskId);
      }
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "todo": "#gray",
      "in-progress": "#blue",
      "completed": "#green",
      "overdue": "#red"
    };
    return colors[status] || "#gray";
  };

  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p className="empty-tasks">No tasks in this filter</p>
      ) : (
        tasks.map(task => (
          <div key={task._id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority}
              </span>
            </div>

            {task.description && <p>{task.description}</p>}

            <div className="task-meta">
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              {task.assignedTo && (
                <span>Assigned: {task.assignedTo.name}</span>
              )}
            </div>

            <div className="task-actions">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className={`status-select status-${task.status}`}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {(userId === projectAdmin || userId === task.createdBy._id) && (
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="delete-task-btn"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;
