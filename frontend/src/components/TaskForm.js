import { useState } from "react";
import "../styles/TaskForm.css";

function TaskForm({ projectId, projectMembers, token, onTaskCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          projectId
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create task");
      }

      const data = await response.json();
      onTaskCreated(data.task);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Create New Task</h3>

      {error && <div className="error-message">{error}</div>}

      <input
        type="text"
        name="title"
        placeholder="Task Title *"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Task Description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
      />

      <div className="form-row">
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>

      <select
        name="assignedTo"
        value={formData.assignedTo}
        onChange={handleChange}
      >
        <option value="">Assign to...</option>
        {projectMembers.map(member => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </select>

      <div className="form-buttons">
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
