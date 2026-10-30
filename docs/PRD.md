# Product Requirements Document (PRD)

## 1. Product Vision & Problem Statement

### 1.1. Problem Statement
Traditional enterprise software treats authorization as static code logic: changing an employee’s capabilities requires modifying source code, updating configuration files, and waiting on a full redeployment cycle. Furthermore, interfaces are often cold, robotic, and punitive when access limits are reached.

### 1.2. Product Vision
**PeopleRBAC** is a modern, human-centered enterprise Role-Based Access Management platform where administrators dynamically manage permissions for Managers and Specialists at runtime with immediate effect across all user sessions. The system integrates real-world REST API inventory management, rich analytics, and multi-modal biometric passkey authentication.

---

## 2. Target User Personas

| Persona | Role | Primary Goals & Jobs to be Done |
| :--- | :--- | :--- |
| **Sarah Connor** | **Executive Administrator** | Has universal governance over all systems; configures the Permission Matrix at runtime; defines what Managers and Specialists can view, add, modify, or remove; monitors audit trails. |
| **Marcus Vance** | **Team Manager** | Oversees catalog operations; reviews valuations; manages inventory within the operational boundaries granted dynamically by the Administrator. |
| **Elena Rostova** | **Operations Specialist** | Front-line colleague executing daily catalog inquiries, updating product notes when authorized, and inspecting inventory conditions. |

---

## 3. Module Functional Requirements

### Module 1: Authentication & Identity Management
* **FR-1.1: Responsive Sign-In**: Login using corporate email and password with show/hide password toggle.
* **FR-1.2: Passkey & Biometric Authentication**: Support for WebAuthn Level 3 (Windows Hello Facial Recognition, Touch ID / Fingerprint sensor) and one-click test simulation.
* **FR-1.3: User Registration**: Registration form capturing Full Name, Email, Role Selection (`Admin`, `Manager`, `Employee`), Password, and optional biometric passkey enrollment.
* **FR-1.4: Pre-Configured Test Accounts**: One-click demo credentials banner allowing rapid switching between Sarah (Admin), Marcus (Manager), and Elena (Specialist).

### Module 2: Enterprise Analytics Dashboard
* **FR-2.1: Key Metric KPI Cards**: Real-time summary cards displaying:
  * Total Curated Records
  * In-Stock Abundant Records
  * Low-Stock / Restock Recommended Records
  * Team Managers Count
  * Operations Specialists Count
  * Configured RBAC Matrix Rules
  * Recent Colleague Activities Count
  * New Additions This Month
* **FR-2.2: Multi-Chart Visualizations (Recharts)**:
  * **Bar Chart**: Product Category distribution across departments.
  * **Line Chart**: 6-Month catalog growth and addition trajectory.
  * **Donut Chart**: Supply health breakdown (In Stock vs Low Stock vs Out of Stock).
  * **Pie Chart**: Role-tier distribution across active staff members.
* **FR-2.3: Live Activity Feed**: Chronological stream of colleague actions with human photo avatars and time-ago timestamps.
* **FR-2.4: Sign-In History**: Security audit log tracking login timestamps, browsers, and authentication methods.

### Module 3: Third-Party REST API CRUD Management
* **FR-3.1: Catalog Retrieval**: Integrate `https://dummyjson.com/products` to fetch paginated collections of products.
* **FR-3.2: Universal Click-to-Inspect**: Clicking any product card or table row launches a rich 3-tab inspection modal displaying:
  * Multi-image photo gallery with thumbnail switching
  * Pricing, retail comparison, and discount savings
  * Primary colleague curator attribution
  * Shipping, warranty, dimensions, weight, and return policy
  * Customer reviews with star ratings and comments
* **FR-3.3: Product Creation (`POST`)**: Accessible form modal with client validation submitting new items to the REST API.
* **FR-3.4: Product Modification (`PUT`)**: In-place edit form updating product properties.
* **FR-3.5: Product Removal (`DELETE`)**: Danger-styled confirmation modal removing products from the catalog.
* **FR-3.6: Search, Filter & Sort**: Live instant search by title/brand/colleague, category filtering, stock status filtering, and multi-field sorting.

### Module 4: Dynamic Role-Based Access Control (Core Engine)
* **FR-4.1: Three Role Tiers**: Distinct `Admin`, `Manager`, and `Employee` tiers.
* **FR-4.2: Universal Admin Authority**: The Admin maintains complete access to all modules and CRUD actions at all times.
* **FR-4.3: Runtime Reconfigurability**: Managers and Employees have zero hardcoded permissions; their capabilities are dynamically evaluated from the Permission Matrix.

### Module 5: Admin Settings & Permission Matrix (Mandatory)
* **FR-5.1: Admin-Only Governance**: Only users authenticated as `Admin` can access this module.
* **FR-5.2: Dynamic Permission Matrix**: Interactive table with toggle switches allowing the Admin to grant or revoke:
  * Dashboard Access (`dashboard.view`)
  * Analytics Access (`analytics.view`)
  * View Records (`records.view`)
  * Create Records (`records.create`)
  * Edit Records (`records.edit`)
  * Delete Records (`records.delete`)
  * Reports Access (`reports.view`)
  * Settings Management (`settings.manage`)
  * Profile Access (`profile.view`)
* **FR-5.3: Instant Propagation**: Clicking **"Save Permission Settings"** immediately updates active user sessions without requiring app redeployment or page restart.
* **FR-5.4: Reset to Defaults**: Restores role privileges to baseline defaults with one click.
* **FR-5.5: Perspective Simulation**: Embedded test buttons allowing the Admin to immediately experience the app through the eyes of Marcus (Manager) or Elena (Specialist).

### Module 6: Dynamic Sidebar & Protected Routes
* **FR-6.1: Dynamic Navigation**: The sidebar automatically hides navigation links for modules the active role is not permitted to access.
* **FR-6.2: Route Guarding (`ProtectedRoute`)**: Manually typing or navigating to an unauthorized URL intercepts the user and redirects to a dedicated **403 – Access Denied** page.
* **FR-6.3: Empathetic 403 Page**: Displays the attempted path, the governing policy required, the user's role, and an immediate switch-role testing shortcut.

---

## 4. Acceptance Criteria & Verification Matrix

| Requirement | Acceptance Test | Status |
| :--- | :--- | :--- |
| **AC-1: Dynamic Permission Matrix** | Admin disables "Delete Records" for Manager $\rightarrow$ Delete button disappears for Manager $\rightarrow$ Admin enables it $\rightarrow$ Delete button reappears immediately. | Verified |
| **AC-2: Protected Route 403** | Specialist manually enters `/reports` when Reports permission is revoked $\rightarrow$ System redirects to `/access-denied`. | Verified |
| **AC-3: Third-Party REST API CRUD** | Creating, reading, updating, and deleting products interacts with the DummyJSON API and persists locally across browser reloads. | Verified |
| **AC-4: Click-to-Inspect** | Clicking any product row or card on the Catalog, Dashboard, or Reports opens the full product specification modal. | Verified |
| **AC-5: Dark Theme Consistency** | All 9 pages, modals, tables, and Recharts strokes toggle smoothly with high contrast and zero white flashes. | Verified |
| **AC-6: Passkey Biometrics** | Users can sign in using Windows Hello / Fingerprint passkeys with automated fallback simulation. | Verified |

