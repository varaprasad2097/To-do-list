const mongoose = require("mongoose");
const Task = require("../models/Task");

// ==========================================
// CREATE TASK
// ==========================================

const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
    } = req.body;

    if (!title || !dueDate) {
      res.status(400);

      throw new Error(
        "Title and due date are required."
      );
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL USER TASKS
// ==========================================

const getTasks = async (req, res, next) => {
  try {
    // ==========================================
    // Query Parameters
    // ==========================================

    const {
      status,
      priority,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // ==========================================
    // Build MongoDB Filter
    // ==========================================

    const filter = {
      userId: req.user._id,
    };

    // Filter by status
    if (status) {
      const allowedStatuses = [
        "Todo",
        "In Progress",
        "Done",
      ];

      if (!allowedStatuses.includes(status)) {
        res.status(400);

        throw new Error(
          "Invalid status. Use Todo, In Progress, or Done."
        );
      }

      filter.status = status;
    }

    // Filter by priority
    if (priority) {
      const allowedPriorities = [
        "Low",
        "Medium",
        "High",
      ];

      if (!allowedPriorities.includes(priority)) {
        res.status(400);

        throw new Error(
          "Invalid priority. Use Low, Medium, or High."
        );
      }

      filter.priority = priority;
    }

    // Search by title
    if (search && search.trim() !== "") {
      filter.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // ==========================================
    // Pagination Validation
    // ==========================================

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1
    ) {
      res.status(400);

      throw new Error(
        "Page must be a positive integer."
      );
    }

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      res.status(400);

      throw new Error(
        "Limit must be between 1 and 100."
      );
    }

    // ==========================================
    // Sorting
    // ==========================================

    const allowedSortFields = [
      "createdAt",
      "dueDate",
      "priority",
      "title",
      "status",
    ];

    if (!allowedSortFields.includes(sortBy)) {
      res.status(400);

      throw new Error(
        "Invalid sort field."
      );
    }

    if (!["asc", "desc"].includes(sortOrder)) {
      res.status(400);

      throw new Error(
        "sortOrder must be either asc or desc."
      );
    }

    const sortDirection =
      sortOrder === "asc" ? 1 : -1;

    const sort = {
      [sortBy]: sortDirection,
    };

    // ==========================================
    // Calculate Pagination
    // ==========================================

    const skip =
      (parsedPage - 1) * parsedLimit;

    // ==========================================
    // Execute Queries
    // ==========================================

    const [tasks, totalTasks] = await Promise.all([
      Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit),

      Task.countDocuments(filter),
    ]);

    // ==========================================
    // Pagination Metadata
    // ==========================================

    const totalPages = Math.ceil(
      totalTasks / parsedLimit
    );

    res.status(200).json({
      success: true,

      data: {
        tasks,
      },

      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        totalTasks,
        totalPages,
        hasNextPage:
          parsedPage < totalPages,
        hasPreviousPage:
          parsedPage > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET SINGLE TASK
// ==========================================

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);

      throw new Error("Invalid task ID.");
    }

    const task = await Task.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!task) {
      res.status(404);

      throw new Error("Task not found.");
    }

    res.status(200).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE TASK
// ==========================================

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);

      throw new Error("Invalid task ID.");
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
    } = req.body;

    const task = await Task.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!task) {
      res.status(404);

      throw new Error("Task not found.");
    }

    // Update only fields that were provided
    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate;
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE TASK
// ==========================================

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);

      throw new Error("Invalid task ID.");
    }

    const task = await Task.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!task) {
      res.status(404);

      throw new Error("Task not found.");
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE TASK STATUS
// ==========================================

const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);

      throw new Error("Invalid task ID.");
    }

    if (!status) {
      res.status(400);

      throw new Error("Status is required.");
    }

    const allowedStatuses = [
      "Todo",
      "In Progress",
      "Done",
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400);

      throw new Error(
        "Status must be Todo, In Progress, or Done."
      );
    }

    const task = await Task.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!task) {
      res.status(404);

      throw new Error("Task not found.");
    }

    task.status = status;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated successfully.",
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
};