import { useState, useEffect } from "react";
import "../styles/ProjectMembers.css";

function ProjectMembers({ project, token, isAdmin, onMembersUpdate }) {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/projects/${project._id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: newMemberEmail })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add member");
      }

      setNewMemberEmail("");
      onMembersUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from project?")) return;

    try {
      const response = await fetch(`/api/projects/${project._id}/members/${memberId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        onMembersUpdate();
      }
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  return (
    <div className="project-members">
      <h2>Team Members</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="members-list">
        {project.members.map(member => (
          <div key={member._id} className="member-item">
            <div>
              <strong>{member.name}</strong>
              <p>{member.email}</p>
            </div>
            {member._id === project.admin._id && <span className="admin-badge">Admin</span>}
            {isAdmin && member._id !== project.admin._id && (
              <button
                onClick={() => handleRemoveMember(member._id)}
                className="remove-member-btn"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <form onSubmit={handleAddMember} className="add-member-form">
          <input
            type="email"
            placeholder="Add member by email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Member"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ProjectMembers;
