const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "priority-high";

      case "Medium":
        return "priority-medium";

      case "Low":
        return "priority-low";

      default:
        return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Done":
        return "status-done";

      case "In Progress":
        return "status-progress";

      case "Todo":
        return "status-todo";

      default:
        return "";
    }
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "No due date";

  return (
    <div className="task-card">
      <div className="task-card-main">
        <div className="task-card-title-row">
          <h3>{task.title}</h3>

          <span
            className={`priority-badge ${getPriorityClass(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="task-description">
            {task.description}
          </p>
        )}

        <div className="task-meta">
          <span
            className={`status-badge ${getStatusClass(
              task.status
            )}`}
          >
            {task.status}
          </span>

          <span className="due-date">
            Due: {formattedDate}
          </span>
        </div>
      </div>

      <div className="task-actions">
        {task.status !== "Done" && (
          <button
            className="complete-button"
            onClick={() =>
              onStatusChange(task._id, "Done")
            }
            title="Mark as completed"
          >
            ✓
          </button>
        )}

        <button
          className="edit-button"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;