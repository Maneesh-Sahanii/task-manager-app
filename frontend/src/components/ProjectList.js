import "../styles/ProjectList.css";

function ProjectList({ projects, selectedProject, onSelectProject }) {
  return (
    <div className="project-list">
      {projects.length === 0 ? (
        <p className="empty-projects">No projects yet</p>
      ) : (
        projects.map(project => (
          <div
            key={project._id}
            className={`project-item ${selectedProject?._id === project._id ? "active" : ""}`}
            onClick={() => onSelectProject(project)}
          >
            <div className="project-name">{project.name}</div>
            <div className="project-status">{project.status}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectList;
