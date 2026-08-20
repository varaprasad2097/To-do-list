const Task = require("../models/Task");

// ==========================================
// GET TASK ANALYTICS
// ==========================================

const getTaskAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const analytics = await Task.aggregate([
      // --------------------------------------
      // 1. Only current user's tasks
      // --------------------------------------

      {
        $match: {
          userId: userId,
        },
      },

      // --------------------------------------
      // 2. Calculate task statistics
      // --------------------------------------

      {
        $group: {
          _id: null,

          totalTasks: {
            $sum: 1,
          },

          completedTasks: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Done"] },
                1,
                0,
              ],
            },
          },

          pendingTasks: {
            $sum: {
              $cond: [
                { $ne: ["$status", "Done"] },
                1,
                0,
              ],
            },
          },
        },
      },

      // --------------------------------------
      // 3. Calculate completion percentage
      // --------------------------------------

      {
        $project: {
          _id: 0,

          totalTasks: 1,

          completedTasks: 1,

          pendingTasks: 1,

          completionPercentage: {
            $cond: [
              { $eq: ["$totalTasks", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          "$completedTasks",
                          "$totalTasks",
                        ],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },
    ]);

    // --------------------------------------
    // No tasks
    // --------------------------------------

    if (analytics.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
          completionPercentage: 0,
        },
      });
    }

    // --------------------------------------
    // Return analytics
    // --------------------------------------

    res.status(200).json({
      success: true,
      data: analytics[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTaskAnalytics,
};