# Diafat Khulud - Backend API 🚀

Professional Node.js/Express/Prisma backend for the Diafat platform.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment**:
    Ensure `.env` exists with:
    ```env
    PORT=3001
    ```

3.  **Database Init**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Seed Data**:
    ```bash
    npx ts-node prisma/seed.ts
    ```

5.  **Run Server**:
    ```bash
    npm run dev
    ```

## API Endpoints

- `GET /` - Health Check
- `GET /api/hotels` - List all hotels with rooms
