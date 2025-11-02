# FastAPI & React URL Shortener

A simple URL shortener prototype, this project features a FastAPI backend API and a React (Vite) frontend, users can create update and use short links from a simple interface.

This implementation uses an **in-memory database** (a Python dictionary), this means all links will be lost when the backend server is restarted.

## 🏛️ Technology Stack

- **Backend:** FastAPI, Uvicorn
- **Frontend:** React 18, Vite
- **Database:** In-memory Python dictionary (for development)

## ✨ Features

- **Create short links:** Generate a random 6-character code.
- **Create custom links:** Propose a custom alias (e.g., `/my-event`).
- **Update links:** Change the destination URL of an existing short link.
- **View all links:** A simple list view of all active short codes.
- **Redirect:** The main `GET /{short_code}` route handles the redirection.

## 🚀 Getting Started

You need two separate terminals to run the project, one for the backend and one for the frontend.

### 1. Backend (FastAPI)

1.  **Clone the repository**

    ```bash
    git clone https://github.com/JuanLoaiza007/fastapit-react-url-shortener.git

    ```

2.  **Create and activate a virtual environment**

    ```bash
    cd fastapit-react-url-shortener/
    # Create
    python -m venv venv

    # Activate on Windows (Powershell)
    .\venv\Scripts\Activate.ps1
    ```

3.  **Install dependencies**

    ```bash
    pip install fastapi uvicorn
    ```

4.  **Run the server**
    ```bash
    # --reload enables auto-restart on code changes
    uvicorn main:app --reload
    ```
    > ✅ The API is now running on `http://127.0.0.1:8000`

---

### 2. Frontend (React)

1.  **Navigate to the frontend directory**

    ```bash
    # Assuming you are in the root directory
    cd frontend-folder
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```
    > ✅ The React app is now running on `http://localhost:5173`

## 📦 API Endpoints

A brief overview of the available API routes:

- `POST /links`

  - Creates a new short link.
  - Body: `{ "long_url": "...", "custom_short_code": "..." }`

- `GET /links`

  - Retrieves a list of all current links.

- `PUT /links/{short_code}`

  - Updates the destination URL for a specific code.
  - Body: `{ "long_url": "..." }`

- `GET /{short_code}`
  - Performs the `HTTP 307` redirect to the long URL.
