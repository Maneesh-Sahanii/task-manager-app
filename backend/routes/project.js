const router = require("express").Router();
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const { verifyToken, getCurrentUser } = require("../middleware/auth");
const { checkProjectAccess, checkProjectAdmin } = require("../middleware/project");

// Create project
router.post("/", verifyToken, getCurrentUser, async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      dueDate,
      admin: req.userId,
      members: [req.userId]
    });

    await project.populate("admin members", "name email avatar role");

    res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all user's projects
router.get("/", verifyToken, getCurrentUser, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.userId }, { members: req.userId }]
    })
      .populate("admin members", "name email avatar role")
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single project
router.get("/:projectId", verifyToken, checkProjectAccess, async (req, res) => {
  try {
    const projectWithStats = await Project.findById(req.params.projectId)
      .populate("admin members", "name email avatar role");

    // Get task stats
    const tasks = await Task.find({ project: req.params.projectId });
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === "completed").length,
      inProgress: tasks.filter(t => t.status === "in-progress").length,
      overdue: tasks.filter(t => t.status === "overdue").length,
      todo: tasks.filter(t => t.status === "todo").length
    };

    res.json({
      project: projectWithStats,
      stats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update project
router.put("/:projectId", verifyToken, checkProjectAdmin, async (req, res) => {
  try {
    const { name, description, status, dueDate } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { name, description, status, dueDate, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate("admin members", "name email avatar role");

    res.json({
      message: "Project updated successfully",
      project
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add member to project
router.post("/:projectId/members", verifyToken, checkProjectAdmin, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.findById(req.params.projectId);

    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push(user._id);
    await project.save();
    await project.populate("admin members", "name email avatar role");

    res.json({
      message: "Member added successfully",
      project
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove member from project
router.delete("/:projectId/members/:userId", verifyToken, checkProjectAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (project.admin.toString() === req.params.userId) {
      return res.status(400).json({ message: "Cannot remove project admin" });
    }

    project.members = project.members.filter(id => id.toString() !== req.params.userId);
    await project.save();
    await project.populate("admin members", "name email avatar role");

    res.json({
      message: "Member removed successfully",
      project
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete project
router.delete("/:projectId", verifyToken, checkProjectAdmin, async (req, res) => {
  try {
    await Task.deleteMany({ project: req.params.projectId });
    await Project.findByIdAndDelete(req.params.projectId);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
