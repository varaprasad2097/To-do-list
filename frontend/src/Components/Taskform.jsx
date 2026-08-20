import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  status: "Todo",
  priority: "Medium",
  dueDate: "",
};

const Taskform = ({
  task,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] =
    useState(initialForm);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Todo",
        priority: task.priority || "Medium",
        dueDate: task.dueDate
          ? task.dueDate.substring(0, 10)
          : "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [task]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">

      <div className="task-form-modal">

        {/* HEADER */}

        <div className="modal-header">

          <div>
            <h2>
              {task
                ? "Edit Task"
                : "Create Task"}
            </h2>

            <p>
              {task
                ? "Update your task details"
                : "Add a new task to your list"}
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onCancel}
            disabled={loading}
          >
            ×
          </button>

        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>

          {/* TITLE */}

          <div className="form-group">

            <label>
              Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              maxLength={100}
              required
            />

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your task..."
              rows={4}
              maxLength={1000}
            />

          </div>

          {/* STATUS + PRIORITY */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
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

            </div>

            <div className="form-group">

              <label>
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>

            </div>

          </div>

          {/* DUE DATE */}

          <div className="form-group">

            <label>
              Due Date *
            </label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />

          </div>

          {/* BUTTONS */}

          <div className="modal-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : task
                ? "Update Task"
                : "Create Task"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Taskform;