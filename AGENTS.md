
# SentinelOps — Codex Project Instructions

## Project Information

Project Name: SentinelOps
Repository Name: sentinelops
Local Directory: C:\GitRepo\SentinelOps

Project Description:
Full-Stack Mini-SIEM & Security Operations and Threat Detection Platform.

## 1. Project Overview

SentinelOps is a beginner-friendly but professional
Security Information and Event Management (SIEM)
and Threat Detection Platform.

The goal is to build a cybersecurity portfolio project
that demonstrates practical skills required for
Security Engineering, Cybersecurity, SOC Analyst,
Application Security, and Software Engineering internships.

SentinelOps will collect, normalize, store, analyze,
and visualize security events.

The platform will detect suspicious authentication
activity, generate security alerts, and provide
an interactive dashboard for investigating incidents.

This is an educational Mini-SIEM, not a production
replacement for Splunk or Microsoft Sentinel.

## 2. Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts

### Backend
- Python
- FastAPI
- Pydantic
- SQLAlchemy

### Database
- PostgreSQL

### Security
- Log analysis
- Rule-based threat detection
- SIEM fundamentals
- Authentication and authorization
- REST API security
- OWASP security principles
- MITRE ATT&CK mapping

### DevOps and Testing
- Git
- GitHub
- Docker
- Docker Compose
- GitHub Actions
- Pytest
- Vitest
- Dependency security scanning

## 3. Project Architecture

React + TypeScript Frontend
          |
          | REST API
          v
Python FastAPI Backend
          |
          | Event ingestion and normalization
          v
Security Detection Engine
          |
          | Database operations
          v
PostgreSQL Database

The frontend handles visualization, filtering,
user interaction, and incident investigation.

The backend handles API requests, validation,
security event processing, detection rules,
and database operations.

## 4. Core Features

### Security Event Management

1. Import JSON and CSV security logs.
2. Normalize different security log formats.
3. Store events in PostgreSQL.
4. Search and filter historical events.
5. Display authentication activity.

### Threat Detection

6. Detect repeated failed login attempts.
7. Detect potential brute-force attacks.
8. Detect password-spraying patterns.
9. Identify unusual login activity.
10. Generate alerts with severity levels.
11. Associate supported rules with MITRE ATT&CK.

### Security Dashboard

12. Display total security events.
13. Display failed and successful login counts.
14. Visualize security events over time.
15. Show recent security alerts.
16. Display suspicious source IP addresses.
17. Filter events by timestamp, IP, and severity.

### Incident Investigation

18. View detailed alert information.
19. Examine supporting security events.
20. Track alert investigation status.
21. Export investigation reports.

### Security Engineering

22. Validate API requests.
23. Implement secure authentication.
24. Add role-based access control where appropriate.
25. Protect application secrets.
26. Add automated security tests.
27. Implement CI/CD security checks.

## 5. Development Milestones

### Milestone 0 — Environment Setup

Objectives:
- Verify Node.js installation.
- Verify npm installation.
- Verify Python installation.
- Verify Git installation.
- Verify VS Code configuration.
- Explain required development tools.

Do not generate application code yet.

Stop and wait for user confirmation.

### Milestone 1 — Full-Stack Foundation

Objectives:
- Initialize React + TypeScript using Vite.
- Configure Tailwind CSS.
- Initialize Python FastAPI.
- Create a health-check endpoint.
- Connect React to FastAPI.
- Display sample synthetic security events.
- Explain the project folder structure.

Expected structure:

sentinelops/
├── AGENTS.md
├── frontend/
├── backend/
├── README.md
└── .gitignore

Do not proceed until the application runs successfully.

### Milestone 2 — Security Log Processing

Objectives:
- Generate synthetic authentication logs.
- Parse JSON and CSV files.
- Extract timestamps, usernames, and IP addresses.
- Normalize events into a consistent schema.
- Validate malformed and incomplete input.
- Explain security logging fundamentals.

### Milestone 3 — Threat Detection Engine

Objectives:
- Implement brute-force detection.
- Implement password-spraying detection.
- Implement unusual login activity rules.
- Configure detection thresholds.
- Generate security alerts.
- Assign alert severity levels.
- Add automated detection tests.
- Explain false positives and false negatives.

### Milestone 4 — Database and Investigation

Objectives:
- Configure PostgreSQL.
- Integrate SQLAlchemy.
- Store security events.
- Store generated alerts.
- Create search and filtering endpoints.
- Implement incident investigation workflows.
- Add interactive Recharts visualizations.

### Milestone 5 — Security and DevOps

Objectives:
- Implement secure authentication.
- Add authorization checks.
- Configure CORS securely.
- Add API input validation.
- Add Docker and Docker Compose.
- Add GitHub Actions.
- Implement backend and frontend tests.
- Add dependency security scanning.
- Keep credentials out of source control.

### Milestone 6 — GitHub Portfolio Preparation

Objectives:
- Create a professional README.
- Add architecture documentation.
- Add application screenshots.
- Document security detection rules.
- Include example investigation scenarios.
- Document project limitations.
- Add installation and setup instructions.
- Prepare technical interview explanations.
- Prepare accurate resume bullet points.

## 6. User Interface Requirements

Create a modern, professional cybersecurity dashboard.

Design guidelines:
- Dark theme by default.
- Clean sidebar navigation.
- Professional typography.
- Responsive layout.
- Consistent spacing and colors.
- Accessible components.
- Clear alert severity indicators.
- Interactive charts.
- Searchable security event tables.

Suggested navigation:

- Overview
- Security Events
- Threat Detection
- Alerts
- Investigations
- Settings

Prioritize usability and functionality over
unnecessary animations or visual complexity.

## 7. Security and Privacy Requirements

- Use synthetic security data initially.
- Never store plaintext passwords.
- Never hardcode API keys or secrets.
- Use environment variables.
- Validate untrusted input.
- Use parameterized database queries.
- Apply least-privilege principles.
- Avoid exposing sensitive information in logs.
- Do not scan or attack external systems
  without explicit authorization.
- Clearly distinguish simulated detections
  from real security incidents.

## 8. Coding Standards

- Use TypeScript for frontend application code.
- Use Python type hints.
- Follow modular software architecture.
- Write readable, maintainable code.
- Use descriptive function and variable names.
- Separate frontend and backend responsibilities.
- Add meaningful error handling.
- Include tests for important functionality.
- Avoid unnecessary dependencies.
- Follow established framework conventions.
- Do not introduce premature complexity.

## 9. Instructions for Codex

IMPORTANT: The user is learning cybersecurity,
React, TypeScript, Python, and full-stack development.

Follow these rules throughout the project:

1. Work one milestone at a time.
2. Do not generate the entire project immediately.
3. Explain important concepts in beginner-friendly terms.
4. Explain commands before executing them.
5. Explain the purpose of each new file.
6. Use Windows PowerShell commands.
7. Ask permission before major changes.
8. Do not proceed without user confirmation.
9. Keep the application professional and portfolio-ready.
10. Explain errors and their solutions.
11. Do not silently install dependencies.
12. Verify functionality before claiming completion.
13. Use synthetic security data initially.
14. Keep all project files inside the SentinelOps folder.
15. Preserve existing working functionality.
16. Explain cybersecurity concepts as they are introduced.
17. Prefer simple, correct solutions over complex ones.
18. Provide a short summary after each completed milestone.

## 10. GitHub Requirements

Repository Name: sentinelops

Repository Description:
Full-Stack Mini-SIEM & Security Operations
and Threat Detection Platform.

Use meaningful commit messages.

Maintain a clean repository structure.

Do not commit:
- .env files
- Credentials
- API keys
- Virtual environments
- node_modules
- Database credentials
- Generated temporary files

Include:
- README.md
- .gitignore
- LICENSE
- Project architecture
- Setup instructions
- Screenshots
- Testing instructions

## 11. First Task for Codex

START WITH MILESTONE 0 ONLY.

Inspect the current VS Code workspace.

Verify the following tools:

node --version
npm --version
python --version
git --version

Explain:
- What each tool is used for.
- Whether the installed version is suitable.
- What needs to be installed or updated.

Do not create application files yet.

After Milestone 0 is complete, stop and
wait for user confirmation before proceeding.
