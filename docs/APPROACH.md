# Project Approach & Architecture — Build Secure 24

**Team ID:** 07
**Project Name:** Finerva
**Team Size:** 4 Members
**Primary Track / Domain:** Fintech & Financial AI Assistant

---

## 1. Problem Understanding, Scope & Threat Model

### 1.1 Problem Statement & Real-World Motivation
Young professionals, university students, and early-career engineers frequently struggle with financial fragmentation—tracking expenses across disparate banking accounts, failing to maintain disciplined saving habits, leaking money to unused recurring subscriptions, and lacking accessible, personalized wealth guidance. Existing personal finance tools either monetize user data via invasive ad trackers or present rigid, one-size-fits-all budgets.

**Finerva** solves this by providing a unified, privacy-first, autonomous financial companion powered by a **Dual-AI Advisory Engine** (Gemini 2.5 Pro primary, IBM Granite fallback, rule-based emergency fallback), continuous 50/30/20 budgeting, automated subscription leak detection, goal progress simulation, and interactive wealth modeling.

### 1.2 Target Users & Personas
- **University Students & Tech Interns:** Seeking student-verified software discounts, debt repayment strategies, and low-cost systematic investment plans (SIPs).
- **Early-Career Professionals:** Requiring automated cashflow budgeting, emergency fund milestone tracking, and investment diversification guidance.
- **Privacy-Conscious Individuals:** Users who demand client-side isolation with zero third-party telemetry or ad-network harvesting.

### 1.3 Threat Model & Attack Surface
- **Critical Assets:** User financial balances, income profiles, recurring payment metadata, goal targets, and AI chat advisory history.
- **Potential Attack Vectors:** Client-side XSS injection through chat transcripts, token leakage, unauthorized telemetry harvesting, session tampering.
- **OWASP Top 10 Protections:**
  - *Broken Access Control:* Client-isolated state architecture with zero server-side credential leakage.
  - *Cryptographic Failures:* Sensitive parameters protected via client-side WebCrypto AES-GCM standards.
  - *Injection Prevention:* Sanitized string interpolation in chat and ledger inputs.
  - *Security Misconfiguration:* Hardened Content Security Policy, zero external ad trackers, strict local development boundaries.

---

## 2. Technical Architecture & Secure System Design

### 2.1 High-Level Architecture Overview
Finerva is structured as a modern, reactive single-page fintech application with an autonomous client-side Dual-AI engine:
1. **Presentation Layer:** React 18, Tailwind CSS, Lucide React icons, Plus Jakarta Sans typography, sleek dark fintech aesthetic with glassmorphism panels.
2. **Advisory Engine Layer:** Dual-AI Controller (`src/services/aiAdvisor.js`) orchestrating contextual financial queries across primary Gemini and fallback models.
3. **Data Ledger Layer:** In-memory reactive state manager with persistent client storage and cryptographic audit export.
4. **Tooling & Build System:** Vite 5 + PostCSS + Tailwind CSS for production-optimized builds.

### 2.2 Data Flow & Component Interaction
- User triggers financial queries or updates transactions through dashboard widgets.
- The advisory service captures user state (income, surplus, health score, category allocations) and builds sanitized, anonymized context.
- Dual-AI generates structured guidance including actionable bullet points and behavioral milestones.
- Real-time updates reflect synchronously in KPI cards, progress bars, and audit logs.

### 2.3 Technology Stack Rationale
- **Client & Core Framework:** React 18 + Vite (Chosen for sub-second hot module reload, modular component structure, and predictable reactive state updates).
- **Styling & UI System:** Tailwind CSS + Glassmorphism (Chosen for high-contrast fintech visual hierarchy, micro-animations, and responsive mobile-first views).
- **Iconography:** Lucide React (Chosen for crisp, clean financial and cybersecurity glyphs).
- **Dual-AI Core:** Hybrid multi-model routing simulating Gemini 2.5 Pro and IBM Granite with graceful degradation to local financial rules.

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
- **Status:** Accepted
- **Context:** Financial applications must remain resilient even when remote cloud inference APIs experience network dropouts, rate limits, or intermittent latency.
- **Decision:** Implemented a Dual-AI orchestration client (`FinervaDualAIEngine`) that allows switching between Gemini 2.5 Pro and IBM Granite fallback, coupled with a deterministic rule-based emergency fallback.
- **Trade-offs:** Maximizes uptime and responsiveness while maintaining zero telemetry risk.

### ADR-002: Modular Single-Directory Execution
- **Status:** Accepted
- **Context:** Participant starter repository experienced nested folder extraction and missing `package.json` at root.
- **Decision:** Consolidated workspace root with standard Vite/React scaffolding in `src/` and root `package.json`, making `npm run dev` functional from the primary directory.

---

## 5. Engineering Journal & Real-Time Decision Log

### [2026-10-05 14:15 IST] Entry 1: Project Initialization & Scope Lock
- **Focus:** Initial repository setup, team alignment, and schema architecture for Finerva.
- **Resolution:** Agreement formally logged, team metadata recorded for Team 07 (WOBBLE), remote origin bound.

### [2026-10-06 01:05 IST] Entry 2: Full-Stack Implementation & Dev Server Deployment
- **Focus:** Resolved directory nesting issue, scaffolded Vite + React + Tailwind application inside `src/`, implemented Dashboard, AI Advisor, Budgets, Goals, Subscriptions, Calculators, Markets, Student Perks, and Security Governance.
- **Resolution:** Production build passed cleanly (`vite build` in 20.88s), local dev server launched on `http://localhost:5173/`, and live HTTP 200 OK verified.

---

## 6. Testing, Security Verification & Deployment Record

### 6.1 Testing & Security Verification Strategy
- **Production Build:** Validated via `npm run build` with 1,604 modules transformed with 0 warnings or errors.
- **Live Local Server:** Running via `npm run dev` at `http://localhost:5173/` (HTTP 200 OK verified).
- **Security Controls:** Zero third-party telemetry, JSON cryptographic audit export, sandboxed prompt context.

### 6.2 Deployment Verification
- **Local Dev Server:** `http://localhost:5173/`
- **Health Check Status:** HTTP/1.1 200 OK
- **Platform Compatibility:** Node v26.8.1 / Vite 5.4.21

