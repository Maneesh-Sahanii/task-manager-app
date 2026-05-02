const Project = require("../models/Project");

exports.checkProjectAccess = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is admin or member of project
    const isAdmin = project.admin.toString() === req.userId;
    const isMember = project.members.some(member => member.toString() === req.userId);

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: "Access denied to this project" });
    }

    req.project = project;
    req.isProjectAdmin = isAdmin;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.checkProjectAdmin = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin.toString() !== req.userId) {
      return res.status(403).json({ message: "Only project admin can perform this action" });
    }

    req.project = project;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
