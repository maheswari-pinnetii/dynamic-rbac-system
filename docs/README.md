# PeopleRBAC Documentation Suite

Welcome to the comprehensive technical and operational documentation for the **Dynamic Role-Based Access Management System**.

---

## Documentation Navigation Index

| Document | Focus & Scope | File Link |
| :--- | :--- | :--- |
| **API Integration Guide** | Comprehensive specification of third-party REST API integration (`DummyJSON`), request/response schemas, Axios interceptors, error handling, and hybrid offline-first client persistence. | [API_INTEGRATION.md](file:///f:/dynamic-rbac-system/docs/API_INTEGRATION.md) |
| **Architecture & System Design** | High-level system architecture, pure React Context API state topology (No Redux), component layering, WebAuthn Level 3 biometrics, dynamic RBAC evaluation pipeline, and Mermaid diagrams. | [ARCHITECTURE.md](file:///f:/dynamic-rbac-system/docs/ARCHITECTURE.md) |
| **Data Model & Schemas** | Detailed entity schemas for Users, Passkey Credentials, Roles, Permission Matrices, Products, Reviews, Activity Logs, and LocalStorage keys. | [DATA_MODEL.md](file:///f:/dynamic-rbac-system/docs/DATA_MODEL.md) |
| **Design Brief & Human UX** | UX philosophy ("Human Theme & Human Icons"), color palette, typography hierarchy, people-first iconography, and WCAG 2.1 AA accessibility guidelines. | [DESIGN_BRIEF.md](file:///f:/dynamic-rbac-system/docs/DESIGN_BRIEF.md) |
| **Engineering Plan** | Phased engineering breakdown, technical constraints, bundle size budgets, LCP/INP performance budgets, and risk mitigation strategies. | [ENG_PLAN.md](file:///f:/dynamic-rbac-system/docs/ENG_PLAN.md) |
| **Product Requirements Document (PRD)** | Problem statement, user personas (Sarah, Marcus, Elena), functional requirements across all 6 core modules, and acceptance verification criteria. | [PRD.md](file:///f:/dynamic-rbac-system/docs/PRD.md) |
| **Setup & Deployment Guide** | Step-by-step developer setup, prerequisites, development & production build commands, pre-configured demo credentials, passkey testing, and troubleshooting. | [SETUP_GUIDE.md](file:///f:/dynamic-rbac-system/docs/SETUP_GUIDE.md) |
| **Technical Design & Test Strategy (TDD)** | Technical design decisions, React Context vs Redux trade-off analysis, unit test suites, integration test suites, E2E test scenarios, and threat modeling. | [TDD.md](file:///f:/dynamic-rbac-system/docs/TDD.md) |
| **User Flows & Journeys** | Step-by-step user journeys and Mermaid flowcharts: Authentication, Admin Dynamic Permission Governance, Catalog Exploration, and 403 Interception. | [USER_FLOW.md](file:///f:/dynamic-rbac-system/docs/USER_FLOW.md) |

---

## Modular Specification Guides

| Module Document | Scope & Key Capabilities | Link |
| :--- | :--- | :--- |
| **Module 1: Authentication** | Login, Signup, Passkey (Windows Hello / Fingerprint), Show/Hide password toggle, form validation, and dedicated Logout page flow. | [MODULE_1_AUTHENTICATION.md](file:///f:/dynamic-rbac-system/docs/MODULE_1_AUTHENTICATION.md) |
| **Module 2: Analytics Dashboard** | The 8 KPI summary cards, Recharts visualizations (Bar, Line, Donut, Pie) adapting to light/dark themes, colleague activity feed, login history, and universal click-to-inspect 3-tab modal. | [MODULE_2_ANALYTICS_DASHBOARD.md](file:///f:/dynamic-rbac-system/docs/MODULE_2_ANALYTICS_DASHBOARD.md) |
| **Module 3: CRUD Management** | DummyJSON Products REST API integration, HTTP methods (POST, PUT, DELETE), pagination, category/stock filtering, multi-field sorting, search, and 3-tab modal click-to-inspect. | [MODULE_3_CRUD_MANAGEMENT.md](file:///f:/dynamic-rbac-system/docs/MODULE_3_CRUD_MANAGEMENT.md) |
| **Module 4: Dynamic RBAC** | Role hierarchy (Admin, Manager, Employee), runtime permission resolution (`hasPermission`), and zero-Redux Context architecture. | [MODULE_4_DYNAMIC_RBAC.md](file:///f:/dynamic-rbac-system/docs/MODULE_4_DYNAMIC_RBAC.md) |
| **Module 5: Admin Settings** | Admin Settings governance page, permission matrix with toggles matching the required table, immediate propagation, reset to defaults, and Colleague Roles management. | [MODULE_5_ADMIN_SETTINGS.md](file:///f:/dynamic-rbac-system/docs/MODULE_5_ADMIN_SETTINGS.md) |
| **Module 6: Sidebar & Protected Routes** | Dynamic sidebar filtering based on runtime permissions, `<ProtectedRoute>` with `requiredPermission` and `adminOnly`, `<CanAccess>` in-page action guards, and empathetic 403 Access Denied redirect on URL tampering. | [MODULE_6_SIDEBAR_AND_PROTECTED_ROUTES.md](file:///f:/dynamic-rbac-system/docs/MODULE_6_SIDEBAR_AND_PROTECTED_ROUTES.md) |

---

## Quick Reference: Demo Accounts

| Role Tier | Human Colleague | Corporate Email | Password | Biometric / Passkey Support |
| :--- | :--- | :--- | :--- | :--- |
| **Executive Admin** | Sarah Connor (Director) | `admin@enterprise.com` | `Password123!` | Windows Hello Face / Touch Fingerprint |
| **Team Manager** | Marcus Vance (Team Manager) | `manager@enterprise.com` | `Password123!` | Windows Hello Face / Touch Fingerprint |
| **Operations Specialist** | Elena Rostova (Specialist) | `employee@enterprise.com` | `Password123!` | Windows Hello Face / Touch Fingerprint |

