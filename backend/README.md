# Site Log - Backend API

Starter backend service for Site Log platform.

## Setup & Running

1. **Install dependencies (if adding Express / DB drivers):**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Run in development mode (with hot-reload):**
   ```bash
   npm run dev
   ```

4. **Run in production mode:**
   ```bash
   npm start
   ```

The server runs on `http://localhost:5000` by default.
- Health check: `http://localhost:5000/api/health`
