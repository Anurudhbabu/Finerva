# Build Secure 24 — Participant Starter Repository

**Abhedya — VBIT Cybersecurity Forum, Vignana Bharathi Institute of Technology, Hyderabad**

Welcome to the official Build Secure 24 starter repository.

---

## 1. Challenge Overview

- **Schedule**: October 5, 2026, 11:00 AM IST to October 6, 2026, 11:00 AM IST
- **Duration**: Exactly 24 Hours
- **Submission Deadline**: October 6, 2026, 11:00 AM IST (`2026-10-06T11:00:00+05:30`)
- **Team Size**: Exactly 2 or 4 participants per team (teams of 1, 3, or >4 are not permitted)
- **Core Requirement**: All project code must be created live during the 24-hour hackathon. Importing pre-built or third-party repositories is strictly prohibited.

---

## 2. Repository Structure

```
├── AGENTS.md                  ← AI agent behavioral contract & logging gate
├── README.md                  ← This file
├── PARTICIPANT_RULES.md       ← Competition rules
│
├── docs/                      ← Autonomous documentation layer
│   ├── APPROACH.md            ← Problem breakdown & architecture approach
│   └── logs.txt               ← Turn-by-turn prompt, file location & timeline log
│
├── metadata/                  ← Submission metadata
│   ├── team.yaml              ← Team information (2 or 4 members)
│   └── submission.yaml        ← Final submission details
│
├── src/                       ← Application source code directory
└── deployment/                ← Deployment configuration directory
    └── README.md              ← Deployment record
```

---

## 3. Getting Started

### Step 1: Team Registration & GitHub Repository Setup
1. Create a new GitHub repository for your team's project.
2. Fill in `metadata/team.yaml` with your assigned Team ID, team name, your newly created GitHub repository URL (`team.repository`), and all 2 or 4 member details.

### Step 2: AI Agent Onboarding
When you open this repository in an AI coding assistant (Cursor, Windsurf, Claude Code, Copilot, ChatGPT, etc.):
- The agent will read `AGENTS.md`, greet your team, recite the competition ground rules, display the remaining time until **October 6, 2026, 11:00 AM IST**, and collect your `I agree` confirmation.
- Once confirmed, the agent records your team details and GitHub repository URL, and configures your Git remote origin.
- The agent will **automatically log every prompt, the full agent response, the Git commit SHA, exact file changes, and timeline** in `docs/logs.txt` as you build.

### Step 3: Build & Ship with Continuous Push
- Author your application code inside `src/`.
- After each prompt, changes are committed with the exact commit SHA recorded in `docs/logs.txt`, and can be pushed directly to your team's GitHub repository (`git push origin main`).
- Document your technical approach in `docs/APPROACH.md`.
- Deploy your application and record live details in `deployment/README.md`.
- Update `metadata/submission.yaml` with your final commit SHA before the **October 6, 2026, 11:00 AM IST** deadline.

---

## 4. Multi-Device Team Collaboration

All 4 team members can work simultaneously across separate laptops:

1. **Clone**: Every teammate clones your team's GitHub repository to their device.
2. **Syncing Progress**:
   - When one teammate finishes a feature or prompt:
     ```bash
     git add src/ docs/
     git commit -m "feat: implement feature description"
     git push origin main
     ```
   - Other teammates pull the latest updates:
     ```bash
     git pull origin main
     ```
3. **Agent Continuity**: When a teammate opens the updated repo on their laptop, their AI assistant automatically reads `docs/APPROACH.md` and recent `docs/logs.txt` entries, immediately picking up where the team left off.

---

*Build freely. Use AI freely. Secure what you build. Document what you claim. Prove what you implemented.*

---

## Run Finerva locally

The current demo uses a React/Vite frontend and a local Node API. From the repository root:

```powershell
npm install
npm run dev:all
```

Open the local URL printed by Vite (normally `http://localhost:5000`; if that port is occupied, Vite may select another). The combined command starts both services, and Vite forwards `/api` requests to the API on port `5174`.

### Configure Google sign-in

Google sign-in uses Google Identity Services in the browser and verifies the returned ID token in the Finerva API. To enable it:

1. In Google Cloud Console, configure the OAuth consent screen and create an OAuth 2.0 client ID for a **Web application**. Add your account as a test user if the consent screen is in testing mode.
2. Add the exact frontend origin under **Authorized JavaScript origins** (for example, `http://localhost:5000`; also add the actual port if Vite selects another one).
3. Set the same client ID for the frontend and backend in the PowerShell window where you start Finerva:

   ```powershell
   $env:GOOGLE_CLIENT_ID = "<your-web-client-id>"
   $env:VITE_GOOGLE_CLIENT_ID = $env:GOOGLE_CLIENT_ID
   npm run dev:all
   ```

For deployment, set `GOOGLE_CLIENT_ID` in the API environment, `VITE_GOOGLE_CLIENT_ID` when building the frontend, and `FINERVA_ALLOWED_ORIGINS` to the exact deployed frontend origin in the API environment. Separate multiple allowed origins with commas. Register that same site origin in Google Cloud. The client ID is public configuration; this flow does not use a client secret. Without the Google variables, Google sign-in remains unavailable and password sign-in continues to work.

Create an account at `/login` with a password or Google. Password registration asks for your name, email, password, currency, monthly income, current savings, monthly expenses, savings goal, debt balance, occupation, and risk preference. Google registration asks for the financial profile after identity verification. The demo stores profile and finance data in `src/backend/data.json`; do not enter real account credentials or payment-card details.

Google-authenticated users provide the same financial profile before their first account is created. The API verifies Google's signed ID token, audience, and verified email before linking or creating an account; the token itself is not stored.

The separate administrator sign-in is `/admin/login`. For a local demo, the default credentials are `admin@finerva.local` / `FinervaAdmin!2026`. Set a private `FINERVA_ADMIN_PASSWORD` environment variable before sharing the service. This prototype stores financial data in plain local JSON and uses in-memory sessions. It is not production-ready and must not be exposed publicly without stronger storage, session, transport, and operational controls.

The assistant uses local rule-based guidance based on the profile you save. It does not connect to a bank or an external AI service, and its output is educational rather than financial advice.
