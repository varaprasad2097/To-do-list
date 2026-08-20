const express = require("express");
const cors = require("cors");

const authRoutes = require("./routers/authRoutes");
const taskRoutes = require("./routers/taskRoutes");
const analyticsRoutes = require("./routers/analyticsRoutes");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management API",
    version: "1.0.0",
  });
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management API is running",
  });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// TASK ROUTES
// ==========================================

app.use("/api/tasks", taskRoutes);

// ==========================================
// ANALYTICS ROUTES
// ==========================================

app.use("/api/analytics", analyticsRoutes);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(notFound);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorHandler);

module.exports = app;