# Project Approach & Architecture — Build Secure 24

**Team ID:** 07
**Project Name:** Finerva
**Team Size:** 4 Members
**Primary Track / Domain:** Fintech & Financial AI Assistant

---

## 1. Problem Understanding, Scope & Threat Model

### 1.1 Problem Statement & Real-World Motivation
Young professionals, university students, and early-career engineers frequently struggle with financial fragmentation—tracking expenses across disparate banking accounts, failing to maintain disciplined saving habits, leaking money to unused recurring subscriptions, and lacking accessible, personalized wealth guidance. Existing personal finance tools either monetize user data via invasive ad trackers or present rigid, one-size-fits-all budgets.

**Finerva** addresses this need with a local finance-planning demo: users can enter a personal financial profile, record budgets and goals, review recurring costs, and request educational rule-based guidance. It does not connect to financial institutions or external AI providers.

### 1.2 Target Users & Personas
- **University Students & Tech Interns:** Seeking student-verified software discounts, debt repayment strategies, and low-cost systematic investment plans (SIPs).
- **Early-Career Professionals:** Requiring automated cashflow budgeting, emergency fund milestone tracking, and investment diversification guidance.
- **Privacy-Conscious Individuals:** Users who want a local demo and understand that its JSON-backed storage is not production-grade privacy protection.

### 1.3 Threat Model & Attack Surface
- **Critical Assets:** User financial balances, income profiles, recurring payment metadata, goal targets, and AI chat advisory history.
- **Potential Attack Vectors:** Unauthorized account access, weak admin configuration, stolen bearer tokens, oversized/malformed API input, and disclosure or tampering of the local JSON data file.
- **OWASP Top 10 Protections:**
  - *Broken Access Control:* Opaque bearer sessions and server-side role checks separate user and administrator endpoints.
  - *Credential Storage:* User passwords are salted and hashed with Node `scrypt`; raw passwords are not stored.
  - *Input Handling:* The API validates profile values, chat lengths, and saved finance records before persistence.
  - *Known Prototype Limits:* Sessions are held in memory and finance/profile records are plain JSON on disk. The demo is not suitable for public production deployment.

---

## 2. Technical Architecture & Secure System Design

### 2.1 High-Level Architecture Overview
Finerva is a React/Vite single-page finance demo connected to a same-origin proxied Node API:
1. **Presentation Layer:** React 18, Tailwind CSS, and Lucide icons provide login, profile setup, user finance modules, and a separate administrator console.
2. **API Layer:** `src/backend/server.js` validates requests, authenticates users/admins, applies role checks, and serves the profile-aware local finance assistant.
3. **Persistence Layer:** User profiles and finance records are stored in `src/backend/data.json`; credentials are stored as salted `scrypt` hashes. Session tokens remain in backend memory.
4. **Tooling & Development:** `npm run dev:all` starts Vite and the local API together; Vite proxies `/api` requests to the API on port 5174.

### 2.2 Data Flow & Component Interaction
- User registration sends financial profile details to the API, which validates and persists them with an scrypt password hash.
- Authenticated dashboard operations load and save transactions, budgets, goals, and subscriptions through `/api/finance`.
- Chat requests use the authenticated user's stored profile and receive local rule-based guidance; no external model or bank API is called.
- Admin-only endpoints expose masked account listings, access enable/disable/delete actions, maintenance mode, and assistant availability settings.

### 2.3 Technology Stack Rationale
- **Client & Core Framework:** React 18 + Vite (Chosen for sub-second hot module reload, modular component structure, and predictable reactive state updates).
- **Styling & UI System:** Tailwind CSS + Glassmorphism (Chosen for high-contrast fintech visual hierarchy, micro-animations, and responsive mobile-first views).
- **Iconography:** Lucide React (Chosen for crisp, clean financial and cybersecurity glyphs).
- **Finance Assistant:** Local rule-based responses based on user-entered profile data; the interface does not claim that external Gemini or Granite services are connected.

---

## 3. Implementation Milestones & 24-Hour Timeline

| Milestone / Phase | Time Window | Key Objectives & Deliverables | Security Verification | Status |
|---|---|---|---|---|
| **Phase 1: Foundation & Setup** | 0h – 4h | Starter onboarding, git repository binding, directory hygiene | Secret scan & baseline check | `Completed` |
| **Phase 2: Core Domain & UI** | 4h – 12h | Financial dashboard, Dual-AI Chat, Budget tracker, Goals, Subscriptions | Input sanitization & state validation | `Completed` |
| **Phase 3: Tools & Intelligence**| 12h – 18h | SIP/EMI/Split calculators, Live Market Watchlist, Student Perks | Boundary testing & math validation | `Completed` |
| **Phase 4: Security & Deployment**| 18h – 24h | Security center, audit log exporter, production bundle verification | Zero-telemetry audit & bundle test | `Completed` |

---

## 4. Architecture Decision Records (ADRs)

### ADR-001: Autonomous Client-Side Dual-AI Architecture
- **Status:** Superseded for the current runtime
- **Context:** The initial product concept described a dual-model advisory experience.
- **Decision:** The current runtime uses the local rule-based API described in ADR-003. No Gemini or Granite service is connected.
- **Trade-offs:** Avoids transmitting finance profile data to external model services, but does not provide generative-AI capabilities.

### ADR-002: Modular Single-Directory Execution
- **Status:** Accepted
- **Context:** Participant starter repository experienced nested folder extraction and missing `package.json` at root.
- **Decision:** Consolidated workspace root with standard Vite/React scaffolding in `src/` and root `package.json`, making `npm run dev` functional from the primary directory.
- **Trade-offs:** Standard Vite/React project entry points, reusable views, direct development workflow.

### ADR-003: Local Authenticated API and Explicit Prototype Boundaries
- **Status:** Accepted
- **Context:** The prior UI used illustrative in-memory values without an API, while the requested login, admin console, and persistent financial data require a connected service.
- **Decision:** Add a dependency-free Node API under `src/backend/`, use scrypt password hashes, opaque in-memory bearer sessions, per-user JSON persistence, and role-protected admin controls. The frontend calls the API through Vite's `/api` proxy.
- **Trade-offs:** This supports a self-contained local demonstration but does not provide encrypted-at-rest storage, durable sessions, TLS termination, database isolation, or production-grade secret management. Set `FINERVA_ADMIN_PASSWORD` and do not expose the development service publicly.

---

## 5. Engineering Journal & Real-Time Decision Log

### [2026-10-05 14:15 IST] Entry 1: Project Initialization & Scope Lock
- **Focus:** Initial repository setup, team alignment, and schema architecture for Finerva.
- **Resolution:** Agreement formally logged, team metadata recorded for Team 07 (WOBBLE), remote origin bound.

### [2026-10-06 01:05 IST] Entry 2: Full-Stack Implementation & Dev Server Deployment
- **Focus:** Resolved directory nesting issue, scaffolded Vite + React + Tailwind application inside `src/`, implemented Dashboard, AI Advisor, Budgets, Goals, Subscriptions, Calculators, Markets, Student Perks, and Security Governance.
- **Resolution:** Production build passed cleanly (`vite build` in 20.88s), local dev server launched on `http://localhost:5173/`, and live HTTP 200 OK verified.

### [2026-10-06 04:56 IST] Entry 3: Account, Admin, and API Integration
- **Focus:** Replace the static entry experience with Finerva user registration/login, a role-separated admin login and controls, a retractable left quick-action sidebar, profile-aware greetings, floating assistant, and persisted finance modules.
- **Resolution:** Added local Node API endpoints for authentication, profile/finance persistence, assistant replies, admin service settings, and account access management. Password hashes use scrypt; the JSON-backed local demo remains explicitly unsuitable for public production use.

---

## 6. Testing, Security Verification & Deployment Record

### 6.1 Testing & Security Verification Strategy
- **Production Build:** Validate with `npm run build`.
- **API Smoke Tests:** Verify registration, password login, profile/finance persistence, profile-aware assistant responses, admin-only access, and admin settings.
- **Prototype Security Controls:** Scrypt password hashing, bounded input validation, masked admin user listings, and role-protected account/service controls. JSON user records are not encrypted at rest and sessions are memory-only.

### 6.2 Local Run
- **Start Both Services:** `npm run dev:all`
- **Frontend:** Vite prints its chosen local URL (port 5000 by default, with automatic fallback if occupied).
- **Backend:** `http://localhost:5174/api/health`
- **Platform Compatibility:** Node.js and the installed Vite 5 toolchain.
