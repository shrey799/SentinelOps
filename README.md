# SentinelOps

Educational Mini-SIEM & Security Operations and Threat Detection Platform.
Repository: shrey799/SentinelOps. Active development branch: `dev`.

## Progress

- Milestone 0: environment inspected; Python is available through `py`.
- Milestone 1, Part 1: React + TypeScript + Vite frontend foundation with Tailwind CSS and a dark welcome screen.
- Milestone 1, Part 2: modular FastAPI backend with health and synthetic authentication-event APIs; 17 automated tests passed.
- Milestone 1, Part 3: React dashboard connected to FastAPI, with derived summaries, search, result filtering, refresh, and loading/error/empty states.
- Milestone 1 implementation and automated checks are complete; manual browser review and user approval are pending before further work.

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
- `src/components/Dashboard.tsx`: API loading lifecycle, connection state, search, filtering, and refresh.
- `src/components/SummaryCards.tsx`: counts calculated from all fetched events.
- `src/components/EventsTable.tsx`: accessible event table with UTC timestamps and result badges.
- `src/components/WelcomeScreen.tsx`: retained original introductory screen, no longer mounted.
- `src/services/api.ts`: relative API requests, HTTP error handling, and response-shape checks.
- `src/types/api.ts`: TypeScript interfaces matching the backend JSON models.
- `src/utils/events.ts`: summary and filtering functions.
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

## Run the integrated dashboard

Use two separate PowerShell terminals. Dependencies need installing only on initial setup or when dependency files change (`npm ci` in `frontend/`, and the backend pip command above).

Terminal 1 — FastAPI:

```powershell
cd C:\GitRepo\SentinelOps\backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Terminal 2 — Vite:

```powershell
cd C:\GitRepo\SentinelOps\frontend
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open http://127.0.0.1:5173/. Keep both terminals open. If a port is already in use by the existing server, reuse it rather than launching a duplicate. Restart Vite after changing proxy configuration.

### Request and response flow

React calls `fetch('/api/health')` and `fetch('/api/events')`. In development, the browser sends those requests to Vite on port 5173. Vite forwards `/api` to FastAPI on `127.0.0.1:8000`, then returns the JSON response. The API service checks HTTP success and the expected response shape before React displays it. The frontend never substitutes mock events when a request fails.

The proxy is development-only. Production hosting must route `/api` to its backend under the same origin; production endpoints are not hardcoded in frontend code. Direct cross-origin requests would instead rely on the backend CORS configuration.

- `fetch()` makes an HTTP request. `async/await` lets code wait for its response without blocking the page.
- `useEffect` loads data when the dashboard mounts and cancels requests when it unmounts.
- `useState` stores events, connection state, filters, and loading/errors; changes cause React to render the updated UI.
- TypeScript interfaces describe JSON at compile time. Pydantic validates backend data at runtime. UUIDs, datetimes, and IPs serialize to strings in JSON. Frontend response-shape checks supplement TypeScript, which cannot validate network data by itself.
- Loading means requests are pending; errors mean data could not be retrieved. An empty successful response is distinct from an error. Failed refreshes clear previous records instead of showing stale counts as current. Requests time out after ten seconds.
- The connection indicator uses the health response independently of the event request. Summary cards cover all fetched events; search and result filters affect only the table.

### Part 3 automated checks

From `frontend/`:

```powershell
npm test
npm run build
# Requires both servers running on ports 5173 and 8000:
npm run test:integration
```

From `backend/`:

```powershell
.\.venv\Scripts\python.exe -m pytest -q -p no:cacheprovider
```

Verified results: **17 frontend tests passed**, **1 live integration test passed**, production TypeScript/Vite build passed, and **all 17 existing backend tests passed** with the previously documented Starlette deprecation warning. The frontend unit/component tests use fixtures only inside tests. The separate live test renders the actual dashboard in jsdom and fetches real data through Vite's proxy to FastAPI; it verifies the health indicator, row count, and summary values. Both proxied endpoints returned HTTP 200. The current sample has 12 total events, 5 successful logins, 7 failures, and 6 unique IPs; these are observed results, never constants in application code.

Full browser visual/mobile review was not automated. jsdom validates DOM rendering and behavior, not CSS layout.

### Manual dashboard checks

1. Open the dashboard; check that the backend says connected, summaries match the API, and the table has 12 records, newest first in UTC.
2. Choose Failure: the current sample should show 7 rows. Search `jordan.lee`: 5 rows. Summary cards should remain unchanged.
3. Search an unknown username: verify the no-matches message. Clear search and choose All results to restore the table.
4. Select Refresh: confirm that API requests run again. The fixed sample timeline stays the same.
5. Press F12, open Network, select Fetch/XHR, then refresh. Inspect `/api/health` and `/api/events`: HTTP 200 and JSON in the Response tab. The browser-facing request URL should use port 5173.
6. Stop FastAPI with Ctrl+C in its terminal, then Refresh. Confirm the unavailable/error messages appear and stale summary cards disappear. Restart FastAPI and Refresh to recover.
7. Test a narrow browser window: cards and controls stack; the table scrolls horizontally. Use Tab to reach controls and the table region.

No detection engine, real log ingestion, database, Docker, or authentication is included.

### Prepared milestone Pull Request

Source: `dev`. Target: `main`. Title: `feat: complete full-stack SentinelOps foundation`.

Description: Adds the React/TypeScript/Tailwind foundation and modular FastAPI synthetic-event API, then integrates them in a dashboard with derived summaries, search, filtering, refresh, and explicit request states. Validation: 17 frontend tests, 1 live integration test, 17 backend tests, and a successful production frontend build. Manual browser review remains pending. No PR has been published, and no commit, push, or merge is authorized by this preparation.
