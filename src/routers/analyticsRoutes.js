const express = require("express");

const {
  getTaskAnalytics,
} = require("../controller/analyticsController");

const protect = require("../middleware/authmiddleware");

const router = express.Router();

// All analytics routes require authentication
router.use(protect);

// GET /api/analytics
router.get("/", getTaskAnalytics);

module.exports = router;
