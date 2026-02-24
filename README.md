# EduTech Bridge: WordPress-to-Mobile API

This project transforms a standard WordPress installation into a high-performance, headless data source for EduTech applications. It bridges the gap between WordPress's authoring capabilities and the performance requirements of modern mobile applications.

## 🚀 The Core Architecture

The system follows a **Decoupled Hybrid Architecture**:

1.  **WordPress (Admin & Authoring)**: Teachers and staff record scores using a familiar UI. WordPress acts as the "Source of Authoring."
2.  **Node.js API (Middleware)**: A high-performance Express server that ingests data from WordPress via signed webhooks.
3.  **PostgreSQL (Source of Record)**: A relational database managed via **Prisma 7** that stores normalized student and score data for fast retrieval by mobile apps.
4.  **Redis + BullMQ (Automation)**: A resilient queuing system that processes background jobs (like weekly parent email summaries) without slowing down the main API.

### Data Flow
`WP Update` → `Signed Webhook` → `Node.js Ingestion` → `PostgreSQL Storage` → `Mobile API Access`
`Node.js Routine` → `Redis Queue` → `BullMQ Worker` → `SendGrid Email`

---

## 🛠️ Technical Implementation & "The Hard Parts"

During development, we solved several critical modern Node.js challenges:

### 1. ESM & TypeScript Compatibility
To ensure the backend is future-proof, we used **ES Modules (ESM)**. 
*   **The Problem**: Node.js ESM requires explicit `.js` extensions in all relative imports (e.g., `import './app.js'`), even when writing TypeScript.
*   **The Fix**: We configured the project to use `type: "module"` and meticulously ensured all imports are compliant. We also switched the execution runner to **`tsx`**, which provides world-class support for TypeScript ESM during development.

### 2. Prisma 7 Modern Configuration
We adopted **Prisma 7**, which introduces a stricter separation between schema and environment.
*   **The Problem**: Traditional `url = env("DATABASE_URL")` in `schema.prisma` is deprecated in favor of driver adapters for direct connections.
*   **The Fix**: We implemented the `@prisma/adapter-pg` driver adapter. The database connection is now managed via `prisma.config.ts` and initialized programmatically in our prisma service, making the system significantly more robust and production-ready.

### 3. Infrastructure Versioning
*   **The Problem**: The email queuing library (**BullMQ**) requires modern Redis features (Streams/XADD) introduced in Redis 5.0. 
*   **The Fix**: We documented and ensured the local development environment uses **Redis 5.0+** to avoid background job failures.

---

## 📦 Project Structure

```text
edutech_demo/
├── backend/                # Node.js + Prisma API
│   ├── prisma/             # DB Schema and Migrations
│   ├── src/                # TypeScript Source Code
│   │   ├── controllers/    # API Logic
│   │   ├── middleware/     # Auth & Webhook Verification
│   │   ├── services/       # DB & Email Infrastructure
│   │   └── workers/        # BullMQ Background Worker
│   └── .env                # Secret management
├── wordpress-bridge/       # WordPress Integration
│   └── edutech-score-bridge/ # Custom WP Plugin for Webhooks
└── README.md               # This file
```

---

## 🚦 Getting Started (Manual Setup)

### 1. Prerequisite: Databases
*   **PostgreSQL**: Install and create a database named `edutech`.
*   **Redis**: Install and start **Redis 5.0 or later**.

### 2. Configure Backend
1.  Navigate to `/backend`.
2.  Install dependencies: `npm install`.
3.  Update your `DATABASE_URL` in `.env`:
    `postgresql://USER:PASSWORD@localhost:5432/edutech?schema=public`
4.  Run migrations: `npx prisma migrate dev --name init`.

### 3. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`. Your API and Email Worker will both be live in this same process.

---

## 🧪 Verification
*   **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)
*   **Inbound Scores**: Use the WordPress plugin to send a test score.
*   **Email Queue**: Hit the admin trigger endpoint to watch the BullMQ worker process jobs.

---
**Author**: Antigravity
**Project Type**: Headless LMS Infrastructure Demo