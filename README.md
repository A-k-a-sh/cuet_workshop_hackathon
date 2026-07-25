# CUET Workshop 1h Hackathon ft Mysoftheaven (BD) Ltd

Welcome to the **CUET Workshop Hackathon 1h Hackathon ft Mysoftheaven (BD) Ltd** repository. This workspace contains three rapidly prototyped applications demonstrating frontend and backend engineering, machine learning inference, and AI service integrations.

The problems/tasks of this hackathon are in the file `problems.md`.

---

## 📁 Repository Structure

*   **`Proj1/`**: AI Self-Introduction Analyzer (FastAPI Backend + Vite React Frontend).
*   **`Proj2/`**: Heart Disease Risk Predictor (Vite React Frontend using browser-computed Logistic Regression).
*   **`Proj3/`**: Multi-Role Marketplace Prototype (Vite React Frontend using Context API and `localStorage` persistence).
*   **`plan/`**: Design documents and specifications for each project.

---

## 🛠️ Project Details & Run Guidelines

### 🎙️ Project 1: AI Self-Introduction Analyzer
An interactive portal that records your 30-second self-introduction, transcribes your speech, counts filler phrases (like *um*, *uh*, *like*), evaluates pacing, and generates structured coaching recommendations.
*   **Tech Stack**: FastAPI, Groq Whisper Large v3 (Audio transcription), Groq Llama 3.3 (Analysis), Vite React, Canvas Audio Visualizer, SVG Countdown Timer.
*   **How to Run**:
    1.  **Start Backend**:
        ```bash
        cd Proj1/backend
        pip install -r requirements.txt
        python3 -m uvicorn main:app --port 8000
        ```
    2.  **Start Frontend**:
        ```bash
        cd Proj1/frontend
        npm install
        npm run dev
        ```

### ❤️ Project 2: Heart Disease Risk Predictor
A browser-calculated health risk assessment tool that inputs medical factors (age, cholesterol, blood pressure) and runs immediate Logistic Regression matrix multiplication to render an animated indicator needle and weighted risk charts.
*   **Tech Stack**: Vite React, HSL tailormade colors, SVG needles, browser execution.
*   **How to Run**:
    ```bash
    cd Proj2/frontend
    npm install
    npm run dev
    ```

### 🏬 Project 3: Multi-Role Marketplace Prototype
A sandbox application illustrating marketplace dynamics. Log in as a Shopper (catalog, detail views, cart checkouts), Vendor (publish product items, edit specs, track sales), or Admin (suspend accounts, monitor financial transactions, and view live system logs).
*   **Tech Stack**: Vite React, Context API State Reducers, Toast Managers, `localStorage` persistence.
*   **How to Run**:
    ```bash
    cd Proj3/frontend
    npm install
    npm run dev
    ```

---

## 📦 Global Dependencies
Ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [Python 3.9+](https://www.python.org/)
*   A valid **Groq API Key** placed inside `Proj1/backend/.env` (see `Proj1/backend/.env.example` or `api.md` for guidance).
