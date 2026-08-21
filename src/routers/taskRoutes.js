const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controller/taskController");

const protect = require("../middleware/authmiddleware");

const router = express.Router();

// All task routes require authentication
router.use(protect);

// Create task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Get single task
router.get("/:id", getTaskById);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

// Update task status
router.patch("/:id/status", updateTaskStatus);

module.exports = router;
