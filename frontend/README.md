# SentinelOps frontend

React + TypeScript + Vite, styled with Tailwind CSS through its Vite plugin.

See [the project README](../README.md) for setup, file explanations, and milestone progress.

```powershell
npm ci
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
npm run build
```

The dashboard requests synthetic authentication events from FastAPI through Vite's `/api` development proxy. Start the backend on port 8000 alongside this frontend. Counts are calculated from the API response; the application does not perform real monitoring or threat detection.

```powershell
npm test
# With both development servers running:
npm run test:integration
```

See the project README for request flow, manual checks, and test results.
