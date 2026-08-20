import { useCallback, useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../Components/Navbar";
import StatsCard from "../Components/StatsCard";
import TaskCard from "../Components/TaskCard";
import Taskform from "../Components/Taskform";
import Pagination from "../Components/Pagination";

const Dashboard = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [tasks, setTasks] = useState([]);

  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionPercentage: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [analyticsLoading, setAnalyticsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [formLoading, setFormLoading] =
    useState(false);

  // ==========================================
  // FILTERS
  // ==========================================

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [priority, setPriority] =
    useState("");

  const [sortBy, setSortBy] =
    useState("createdAt");

  const [sortOrder, setSortOrder] =
    useState("desc");

  // ==========================================
  // PAGINATION
  // ==========================================

  const [page, setPage] = useState(1);

  const [limit] = useState(5);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 5,
      totalTasks: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  // ==========================================
  // FETCH TASKS
  // ==========================================

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      if (priority) {
        params.priority = priority;
      }

      const response = await api.get(
        "/tasks",
        {
          params,
        }
      );

      setTasks(
        response.data.data.tasks
      );

      setPagination(
        response.data.pagination
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    search,
    status,
    priority,
    sortBy,
    sortOrder,
  ]);

  // ==========================================
  // FETCH ANALYTICS
  // ==========================================

  const fetchAnalytics =
    useCallback(async () => {
      try {
        setAnalyticsLoading(true);

        const response = await api.get(
          "/analytics"
        );

        setAnalytics(
          response.data.data
        );
      } catch (error) {
        console.error(
          "Analytics error:",
          error
        );
      } finally {
        setAnalyticsLoading(false);
      }
    }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // ==========================================
  // CREATE / UPDATE TASK
  // ==========================================

  const handleTaskSubmit = async (
    formData
  ) => {
    try {
      setFormLoading(true);
      setError("");

      if (editingTask) {
        await api.put(
          `/tasks/${editingTask._id}`,
          formData
        );
      } else {
        await api.post(
          "/tasks",
          formData
        );
      }

      setShowTaskForm(false);
      setEditingTask(null);

      await fetchTasks();
      await fetchAnalytics();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save task."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/tasks/${taskId}`
      );

      await fetchTasks();
      await fetchAnalytics();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete task."
      );
    }
  };

  // ==========================================
  // CHANGE STATUS
  // ==========================================

  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {
    try {
      setError("");

      await api.patch(
        `/tasks/${taskId}/status`,
        {
          status: newStatus,
        }
      );

      await fetchTasks();
      await fetchAnalytics();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update task status."
      );
    }
  };

  // ==========================================
  // OPEN CREATE FORM
  // ==========================================

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCloseForm = () => {
    if (formLoading) {
      return;
    }

    setShowTaskForm(false);
    setEditingTask(null);
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  // ==========================================
  // STATUS FILTER
  // ==========================================

  const handleStatusFilterChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  // ==========================================
  // PRIORITY FILTER
  // ==========================================

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
    setPage(1);
  };

  // ==========================================
  // SORT
  // ==========================================

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setPage(1);
  };

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const hasFilters =
    search ||
    status ||
    priority ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">

        {/* ====================================
            HEADER
        ==================================== */}

        <section className="dashboard-header">

          <div>
            <h2>Dashboard</h2>

            <p>
              Track your work and stay productive.
            </p>
          </div>

          <button
            className="create-task-button"
            onClick={handleCreateTask}
          >
            + Create Task
          </button>

        </section>

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div className="dashboard-error">
            {error}

            <button
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {/* ====================================
            ANALYTICS
        ==================================== */}

        <section className="stats-grid">

          <StatsCard
            title="Total Tasks"
            value={
              analyticsLoading
                ? "..."
                : analytics.totalTasks
            }
            description="All your tasks"
            icon="📋"
          />

          <StatsCard
            title="Completed"
            value={
              analyticsLoading
                ? "..."
                : analytics.completedTasks
            }
            description="Tasks completed"
            icon="✓"
          />

          <StatsCard
            title="Pending"
            value={
              analyticsLoading
                ? "..."
                : analytics.pendingTasks
            }
            description="Tasks remaining"
            icon="⏳"
          />

          <StatsCard
            title="Completion"
            value={
              analyticsLoading
                ? "..."
                : `${analytics.completionPercentage}%`
            }
            description="Overall progress"
            icon="📈"
          />

        </section>

        {/* ====================================
            TASK SECTION
        ==================================== */}

        <section className="tasks-section">

          <div className="tasks-section-header">

            <div>
              <h2>Your Tasks</h2>

              <p>
                {pagination.totalTasks}{" "}
                {pagination.totalTasks === 1
                  ? "task"
                  : "tasks"}{" "}
                total
              </p>
            </div>

          </div>

          {/* ==================================
              FILTERS
          ================================== */}

          <div className="filters">

            <div className="search-wrapper">

              <span>🔍</span>

              <input
                type="text"
                value={search}
                onChange={
                  handleSearchChange
                }
                placeholder="Search by title..."
              />

            </div>

            <select
              value={status}
              onChange={
                handleStatusFilterChange
              }
            >
              <option value="">
                All Status
              </option>

              <option value="Todo">
                Todo
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Done">
                Done
              </option>
            </select>

            <select
              value={priority}
              onChange={
                handlePriorityChange
              }
            >
              <option value="">
                All Priorities
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>

            <select
              value={sortBy}
              onChange={
                handleSortChange
              }
            >
              <option value="createdAt">
                Created Date
              </option>

              <option value="dueDate">
                Due Date
              </option>

              <option value="priority">
                Priority
              </option>

              <option value="title">
                Title
              </option>

              <option value="status">
                Status
              </option>
            </select>

            <select
              value={sortOrder}
              onChange={
                handleSortOrderChange
              }
            >
              <option value="desc">
                Descending
              </option>

              <option value="asc">
                Ascending
              </option>
            </select>

            {hasFilters && (
              <button
                className="clear-filter-button"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}

          </div>

          {/* ==================================
              TASK LIST
          ================================== */}

          <div className="task-list">

            {loading ? (
              <div className="state-message">
                <div className="spinner"></div>
                <p>Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">

                <div className="empty-icon">
                  📋
                </div>

                <h3>
                  {hasFilters
                    ? "No matching tasks"
                    : "No tasks yet"}
                </h3>

                <p>
                  {hasFilters
                    ? "Try changing your filters or search."
                    : "Create your first task to get started."}
                </p>

                {!hasFilters && (
                  <button
                    className="create-task-button"
                    onClick={
                      handleCreateTask
                    }
                  >
                    + Create Your First Task
                  </button>
                )}

              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={
                    handleEditTask
                  }
                  onDelete={
                    handleDelete
                  }
                  onStatusChange={
                    handleStatusChange
                  }
                />
              ))
            )}

          </div>

          {/* ==================================
              PAGINATION
          ================================== */}

          {!loading &&
            tasks.length > 0 && (
              <Pagination
                page={
                  pagination.page
                }
                totalPages={
                  pagination.totalPages
                }
                hasNextPage={
                  pagination.hasNextPage
                }
                hasPreviousPage={
                  pagination.hasPreviousPage
                }
                onPageChange={
                  handlePageChange
                }
              />
            )}

        </section>

      </main>

      {/* ======================================
          TASK FORM MODAL
      ====================================== */}

      {showTaskForm && (
        <Taskform
          task={editingTask}
          onSubmit={
            handleTaskSubmit
          }
          onCancel={
            handleCloseForm
          }
          loading={formLoading}
        />
      )}

    </div>
  );
};

export default Dashboard;