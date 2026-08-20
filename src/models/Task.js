const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        1000,
        "Description cannot exceed 1000 characters",
      ],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["Todo", "In Progress", "Done"],
        message:
          "Status must be Todo, In Progress, or Done",
      },
      default: "Todo",
    },

    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message:
          "Priority must be Low, Medium, or High",
      },
      default: "Medium",
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// MONGODB INDEXES
// =====================================================

// 1. User's tasks sorted by newest first
// Supports:
// GET /api/tasks
// Pagination + createdAt sorting
taskSchema.index({
  userId: 1,
  createdAt: -1,
});

// 2. User's tasks filtered by status
// Supports:
// ?status=Todo
// ?status=In Progress
// ?status=Done
taskSchema.index({
  userId: 1,
  status: 1,
});

// 3. User's tasks filtered by priority
// Supports:
// ?priority=High
// ?priority=Medium
// ?priority=Low
taskSchema.index({
  userId: 1,
  priority: 1,
});

// 4. User's tasks sorted/filtered by due date
// Supports:
// ?sortBy=dueDate
taskSchema.index({
  userId: 1,
  dueDate: 1,
});

module.exports = mongoose.model(
  "Task",
  taskSchema
);