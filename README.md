# SentinelOps

Educational Mini-SIEM & Security Operations and Threat Detection Platform.
Repository: shrey799/SentinelOps. Active development branch: `dev`.

## Progress

- Milestone 0: environment inspected; Python is available through `py`.
- Milestone 1, Part 1: React + TypeScript + Vite frontend foundation with Tailwind CSS and a dark welcome screen.
- Milestone 1, Part 2: modular FastAPI backend with health and synthetic authentication-event APIs; 17 automated tests passed.
- Milestone 1 remains in progress. Frontend/API integration is reserved for Part 3.

The current frontend does not collect logs or perform security monitoring.

## Run the frontend (PowerShell)

Use Node.js 24 LTS and npm. From the repository root:

```powershell
cd frontend
npm ci
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open http://127.0.0.1:5173/ while the server is running. Press Ctrl+C in the terminal to stop it.

## Validation

```powershell
cd frontend
npm run build
```

The build checks TypeScript and generates production files in the ignored `frontend/dist/` directory.
Part 1 validation: production build passed, development server started, and the page and welcome component returned HTTP 200. Visual browser review remains manual.

## Frontend files

- `src/main.tsx`: mounts React into the HTML root element.
- `src/App.tsx`: application root component.
- `src/components/WelcomeScreen.tsx`: introductory screen and future dashboard placeholder.
- `src/index.css`: Tailwind import and global styles.
- `vite.config.ts`: React and Tailwind Vite plugins.
- `index.html`: page title, metadata, and React mount point.
- `package.json`: dependencies and development/build scripts.
- `package-lock.json`: exact dependency versions for repeatable installs with `npm ci`.
- `tsconfig*.json`: TypeScript compiler settings.
- `.oxlintrc.json`: generated static analysis configuration, if present.

Keep development on `dev`. Commits, pushes, and merges require user approval.

## Backend setup and execution (PowerShell)

From the repository root, use Python 3.12 to create an isolated environment and install the pinned dependencies:

```powershell
cd C:\GitRepo\SentinelOps\backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Keep the terminal open; Ctrl+C stops the server. Calling the environment's Python directly avoids PowerShell activation-policy changes. `.venv/`, Python caches, and server logs are ignored by Git.

Open these URLs while Uvicorn is running:

- http://127.0.0.1:8000/api/health — application name, status, and version.
- http://127.0.0.1:8000/api/events — a JSON array of 12 synthetic authentication events.
- http://127.0.0.1:8000/docs — interactive API documentation.

### Backend structure and file purposes

```text
backend/
├── .venv/                  # Local Python environment (ignored)
├── app/
│   ├── __init__.py
│   ├── main.py             # App, CORS, router registration, safe 500 handler
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── health.py       # GET /api/health
│   │   └── events.py       # GET /api/events
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── health.py       # Health response schema
│   │   └── events.py       # Validated authentication event schema
│   └── data/
│       ├── __init__.py
│       └── sample_events.py # Fixed fictional authentication timeline
├── tests/
│   └── test_api.py         # Endpoint, schema, CORS, and error tests
├── pytest.ini             # Test discovery settings
└── requirements.txt       # Pinned installed runtime and test dependencies
```

`__init__.py` files identify Python packages. The sample timeline uses UUID event IDs, timezone-aware ISO 8601 timestamps, fictional usernames/systems, and documentation-only IP ranges (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`). Every event includes `synthetic: true`. Repeated authentication failures are examples, not generated alerts or confirmed attacks. Sample timestamps and IDs stay fixed between requests.

### Backend tests and verified results

From `backend/`:

```powershell
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe -m pip check
```

Part 2 verification: **17 tests passed**; `pip check` reported no broken requirements. Live requests to `/api/health`, `/api/events`, and `/docs` each returned HTTP 200; the events endpoint returned 12 records. Tests cover required fields, unique IDs, timezones, documentation IPs, success/failure examples, repeated failures, invalid data, CORS allow/reject behavior, 404/405 responses, and a safe 500 response.

The installed Starlette version emits a deprecation warning for its HTTPX test-client integration. The sandbox also blocked pytest's optional cache write; tests still passed. To run without the optional cache, use `python -m pytest -q -p no:cacheprovider` with the virtual-environment Python.

### Concepts introduced

- **FastAPI:** the Python framework that maps API URLs to functions and defines response contracts.
- **REST API:** an HTTP interface to resources; these read-only routes use GET requests.
- **JSON:** structured text containing objects and arrays, readable by Python and JavaScript.
- **HTTP status codes:** 200 means success, 404 means route not found, 405 means unsupported method, and 500 means an unexpected server error. Internal error details are not returned to clients.
- **Uvicorn:** the server that listens on port 8000 and runs the FastAPI application.
- **Virtual environment:** a project-local Python package installation, separate from other projects.
- **Pydantic:** checks UUIDs, IP addresses, timezone-aware timestamps, required fields, and allowed authentication results. FastAPI validates route responses against these models.
- **CORS:** browser permission to read responses across origins. Only `http://localhost:5173` and `http://127.0.0.1:5173` are allowed, with GET as the permitted method. CORS is not authentication and does not restrict non-browser clients.

No frontend connection, real ingestion, detection rules, database, or authentication is implemented in Part 2.
