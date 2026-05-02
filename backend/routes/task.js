const router = require("express").Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const { verifyToken, getCurrentUser } = require("../middleware/auth");
const { checkProjectAccess } = require("../middleware/project");

// Create task
router.post("/", verifyToken, getCurrentUser, async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !projectId || !dueDate) {
      return res.status(400).json({
        message: "Title, project ID, and due date are required"
      });
    }

    // Verify user has access to project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAdmin = project.admin.toString() === req.userId;
    const isMember = project.members.some(m => m.toString() === req.userId);

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: "Access denied to this project" });
    }

    // Verify assigned user is project member if specified
    if (assignedTo) {
      const isMemberOfProject = project.members.some(m => m.toString() === assignedTo);
      if (!isMemberOfProject) {
        return res.status(400).json({ message: "Assigned user is not a project member" });
      }
    }

    let task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      priority,
      dueDate,
      createdBy: req.userId,
      status: "todo"
    });

    // Populate the created task
    task = await Task.findById(task._id)
      .populate("createdBy assignedTo", "name email avatar");

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all tasks for a project
router.get("/project/:projectId", verifyToken, checkProjectAccess, async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    let query = { project: req.params.projectId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate("createdBy assignedTo", "name email avatar")
      .sort({ dueDate: 1, priority: -1 });

    // Check for overdue tasks
    const updatedTasks = tasks.map(task => {
      if (task.status !== "completed" && new Date(task.dueDate) < new Date()) {
        task.status = "overdue";
      }
      return task;
    });

    res.json({ tasks: updatedTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single task
router.get("/:taskId", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("createdBy assignedTo project", "name email avatar");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check access
    const project = await Project.findById(task.project);
    const isAdmin = project.admin.toString() === req.userId;
    const isMember = project.members.some(m => m.toString() === req.userId);

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task
router.put("/:taskId", verifyToken, getCurrentUser, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check access
    const project = await Project.findById(task.project);
    const isAdmin = project.admin.toString() === req.userId;
    const isMember = project.members.some(m => m.toString() === req.userId);

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Verify assigned user is project member if being changed
    if (assignedTo && assignedTo !== task.assignedTo?.toString()) {
      const isMemberOfProject = project.members.some(m => m.toString() === assignedTo);
      if (!isMemberOfProject) {
        return res.status(400).json({ message: "Assigned user is not a project member" });
      }
    }

    // Update task
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) {
      task.status = status;
      if (status === "completed") {
        task.completedAt = new Date();
      }
    }
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    task.updatedAt = new Date();

    await task.save();

    // Re-fetch and populate the updated task
    const updatedTask = await Task.findById(task._id)
      .populate("createdBy assignedTo", "name email avatar");

    res.json({
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete task
router.delete("/:taskId", verifyToken, getCurrentUser, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check access
    const project = await Project.findById(task.project);
    const isAdmin = project.admin.toString() === req.userId;

    if (!isAdmin && task.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Only creator or project admin can delete" });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's assigned tasks
router.get("/user/assigned-tasks", verifyToken, getCurrentUser, async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.userId,
      status: { $ne: "completed" }
    })
      .populate("createdBy project", "name email avatar")
      .sort({ dueDate: 1 });

    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;