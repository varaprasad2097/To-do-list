# TaskFlow - Task Management System

A full-stack Task Management System built with React, Node.js, Express, and MongoDB.

The application provides JWT-based authentication, task CRUD operations, filtering, searching, sorting, pagination, analytics, responsive UI, and dark mode.

---

## 🚀 Live Demo

Frontend: `YOUR_FRONTEND_URL`

Backend API: `YOUR_BACKEND_URL`

> Replace the URLs above after deployment.

---

## 📌 Project Overview

TaskFlow is a task management web application designed to help users create, organize, track, and analyze their tasks.

Each authenticated user can manage their own tasks and view productivity insights through an analytics dashboard.

The project was built as a full-stack recruitment assignment with a focus on clean architecture, REST APIs, authentication, database optimization, and responsive UI.

---

# ✨ Features

## 🔐 Authentication

- User signup
- User login
- JWT-based authentication
- Protected routes
- Password validation
- Authentication persistence
- Logout functionality
- User-specific task access

---

## 📝 Task Management

Authenticated users can:

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Mark tasks as completed
- Change task status

Each task contains:

- Title
- Description
- Status
- Priority
- Due Date

### Supported Statuses

- Todo
- In Progress
- Done

### Supported Priorities

- Low
- Medium
- High

---

# 🔎 Search, Filtering & Sorting

The application provides:

- Search tasks by title
- Filter by status
- Filter by priority
- Sort by:
  - Created date
  - Due date
  - Priority
  - Title
  - Status
- Ascending and descending sorting

---

# 📊 Analytics Dashboard

The dashboard provides basic task insights:

- Total number of tasks
- Completed tasks
- Pending tasks
- Completion percentage

Example:

```text
Total Tasks       10
Completed          6
Pending            4
Completion       60%
