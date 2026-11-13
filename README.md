# SentinelOps

Educational Mini-SIEM & Security Operations and Threat Detection Platform.
Repository: shrey799/SentinelOps. Active development branch: `dev`.

## Progress

- Milestone 0: environment inspected; Python is available through `py`.
- Milestone 1, Part 1: React + TypeScript + Vite frontend foundation with Tailwind CSS and a dark welcome screen.
- Milestone 1 remains in progress. Backend, API integration, and security events are not implemented yet.

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
