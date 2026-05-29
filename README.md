# Task Tracker App

A full-stack task and time tracking application built with React, Node.js, and MongoDB. Users can manage tasks, track time with a real-time timer, and view daily productivity summaries.

## Live Demo

🔗 **https://task-tracker-client-brown.vercel.app**

## Test Credentials

| Field    | Value           |
|----------|-----------------|
| Email    | test@gmail.com  |
| Password | 123456          |

> Or sign up with any new email and password directly on the site.

---

## Features

- JWT based signup / login / logout
- Create, edit, delete tasks
- Task status — Pending, In Progress, Completed
- Real-time start / stop timer per task
- Timer restores on page refresh
- Daily summary — total time tracked, tasks worked on, time per task
- Every user sees only their own data

---

## Tech Stack

| Layer    | Technology                |
|----------|---------------------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend  | Node.js, Express          |
| Database | MongoDB Atlas, Mongoose   |
| Auth     | JWT, bcryptjs             |
| Hosting  | Vercel (frontend + backend) |

---

## API Endpoints

| Method | Endpoint                    | Protected | Description         |
|--------|-----------------------------|-----------|---------------------|
| POST   | /api/auth/signup            | No        | Register user       |
| POST   | /api/auth/login             | No        | Login user          |
| GET    | /api/tasks                  | Yes       | Get all tasks       |
| POST   | /api/tasks                  | Yes       | Create task         |
| PUT    | /api/tasks/:id              | Yes       | Update task         |
| DELETE | /api/tasks/:id              | Yes       | Delete task         |
| POST   | /api/timelogs/start/:taskId | Yes       | Start timer         |
| PUT    | /api/timelogs/stop/:taskId  | Yes       | Stop timer          |
| GET    | /api/timelogs/active        | Yes       | Get active timer    |
| GET    | /api/timelogs/:taskId       | Yes       | Get logs for task   |
| GET    | /api/summary/daily          | Yes       | Get daily summary   |

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/Kanhaiyadav01/Task-tracker
cd Task-tracker
```

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=yoursecretkey
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

### 4. Open
