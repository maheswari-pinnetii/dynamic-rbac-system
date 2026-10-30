# Dynamic Role-Based Access Control (RBAC) System

An enterprise-grade, responsive **Role-Based Access Management (RBAC)** web application built with **React.js (Vite)**, **Tailwind CSS**, **React Router**, **React Context API**, and a **Third-Party REST API (DummyJSON)**.

The core objective of this application is not merely User or Product CRUD, but a **runtime-configurable Dynamic Role-Based Access Control system**, where the **Admin** manages page-level and feature-level permissions for **Managers** and **Employees** dynamically through the Admin Settings matrix—without modifying a single line of source code.

---

## 🚀 Live Demo & Quick Start

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+` (tested on Node v24)
- **Package Manager**: `npm` or `pnpm`

### 2. Installation
```bash
# Clone or navigate to the project directory
cd dynamic-rbac-system

# Install dependencies
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## 👥 Default Demo Personas (Pre-Seeded)

The login page features **One-Click Demo Personas** to enable rapid evaluation and testing:

| Persona | Email | Password | Default Scope & Privilege |
|---|---|---|---|
| **Admin** | `admin@enterprise.com` | `Password123!` | **Full Master Access**: Complete CRUD, Analytics, Reports, and Admin Settings Matrix. |
| **Manager** | `manager@enterprise.com` | `Password123!` | **Configurable Access**: Dashboard, Analytics, View Records, Create Records, Edit Records, Reports. (Delete restricted by default). |
| **Employee** | `employee@enterprise.com` | `Password123!` | **Restricted Access**: Dashboard, Analytics, View Records, Profile. (Create, Edit, Delete, Reports restricted by default). |

> **Pro-Tip for Evaluators**: An **Interactive RBAC Testing Bar** is fixed at the top of the application. It allows you to switch active personas between Admin, Manager, and Employee with one click to observe dynamic sidebar updates and action guards in real time!

---

## 🏗️ Architecture & Modules Overview

### Module 1 – Authentication (Passkey, Windows Hello, Fingerprint & Password)
- **Multi-Modal Sign-In**:
  - **Passkey / Biometric**:
    - Uses native W3C Web Authentication API (`navigator.credentials.create` and `navigator.credentials.get`).
    - Supports **Fingerprint Scanner**, **Windows Hello** (facial recognition, PIN, fingerprint), and **FIDO2 / YubiKey Security Keys**.
    - Discoverable credential support with `autocomplete="username webauthn"`.
    - Integrated interactive Biometric Verification modal with scanning radar animation and seamless fallback simulation for machines without biometric hardware.
  - **Password Sign-In**:
    - Email, Password with **Show/Hide Password** toggle.
    - Comprehensive form validation (email format, minimum 6 characters).
    - Remember Me session checkbox.
- **Signup Page**:
  - Register with **Passkey (Fingerprint / Windows Hello)** or **Password**.
  - Name, Email, Role Selection (`Admin`, `Manager`, `Employee`), Password / Biometric link.
- **Passkey Management**:
  - Users can view their registered passkeys and link additional Windows Hello keys or fingerprints directly from their **Profile** page (`/profile`).
- **One-Click Demo Personas**: Instant pre-fills for Admin, Manager, and Employee configured for both passkey and password testing.
- **Storage**: Persists authenticated session, passkeys list, and registered users to `localStorage`.
- **Login Audit**: Records login attempts with authentication method (`Passkey (Windows Hello)`, `Passkey (Fingerprint)`, `Password`), timestamps, simulated IP addresses, and status.

### Module 2 – Analytics Dashboard
- **Key Summary Metric Cards**:
  - Total Records (from REST API)
  - Total Active Records (stock > 0)
  - Total Inactive Records (stock = 0)
  - Total Managers & Employees
  - Total Roles & Active Policies
  - Recent Activities count
  - New Records This Month
- **Interactive Visualizations (Recharts)**:
  - **Bar Chart**: Record distribution across top product categories.
  - **Line Chart**: 6-month catalog growth and active inventory trends.
  - **Donut Chart**: Stock health status distribution (In Stock vs Low Stock vs Out of Stock).
  - **Pie Chart**: System role distribution and access tiers.
  - **Area Chart**: Daily CRUD and query operations throughput.
- **Additional Sections**:
  - Recent Activities & Audit Trail feed (live updates on CRUD and permission modifications).
  - Recent Login History table with timestamps and status badges.
  - Top API Categories breakdown with visual progress meters.
  - System Statistics and API health monitor.

### Module 3 – CRUD Management (Third-Party REST API)
- **Integration**: Real HTTP communication with [DummyJSON](https://dummyjson.com/products).
- **List Records**: Responsive table with thumbnails, categories, currency formatting, stock badges, and ratings.
- **View Details**: Modal with high-res images, pricing discounts, SKU, stock count, and REST API payload details.
- **Create Record**: Modal with schema validation, dispatches `POST /products/add`, merges with local store for persistence.
- **Edit Record**: Pre-populated modal, dispatches `PUT /products/{id}`.
- **Delete Record**: Confirmation modal with danger state, dispatches `DELETE /products/{id}`.
- **Search**: Debounced real-time search across titles and descriptions.
- **Filter**: Filter by Category (20+ categories) and Stock Status (In Stock, Low Stock, Out of Stock).
- **Sort**: Sorting by ID, Title, Price, Stock, Rating with Ascending/Descending toggle.
- **Pagination**: Configurable page size (10, 20, 50) and page numbering.

### Module 4 & 5 – Dynamic RBAC Engine & Admin Settings (Mandatory)
- **Dedicated Admin Settings Page**: Restricted strictly to Admin.
- **Runtime Modification**: Admin can toggle permissions on/off using switches.
- **Instant Propagation**: Clicking **"Save Permission Settings"** saves the matrix to `localStorage` and immediately broadcasts the updated policies to Manager and Employee sessions without page reload.
- **Reset to Baseline Defaults**: Confirmation dialog restoring default specifications.

#### Default Permission Matrix

| Module / Permission | Manager | Employee | Admin |
|---|:---:|:---:|:---:|
| **Dashboard** (`dashboard.view`) | ☑ | ☑ | ☑ |
| **Analytics Dashboard** (`analytics.view`) | ☑ | ☑ | ☑ |
| **View Records** (`records.view`) | ☑ | ☑ | ☑ |
| **Create Records** (`records.create`) | ☑ | ☐ | ☑ |
| **Edit Records** (`records.edit`) | ☑ | ☐ | ☑ |
| **Delete Records** (`records.delete`) | ☐ | ☐ | ☑ |
| **Reports** (`reports.view`) | ☑ | ☐ | ☑ |
| **Settings** (`settings.manage`) | ☐ | ☐ | ☑ |
| **Profile** (`profile.view`) | ☑ | ☑ | ☑ |

### Module 6 – Dynamic Sidebar & Route Protection
- **Dynamic Sidebar**:
  - Automatically filters navigation links according to the logged-in user's role and dynamic permissions.
  - If Admin disables **Reports**, the Reports menu disappears from the sidebar.
  - If Admin disables **Analytics**, the Analytics link is removed.
- **Feature-Level Authorization (`CanAccess`)**:
  - If Admin disables **Create Records**, the *"Add Product"* button is hidden.
  - If Admin grants **Delete Records**, the *"Delete"* button appears dynamically.
- **Route-Level Protection (`ProtectedRoute`)**:
  - Even if unauthorized users manually change the URL (e.g., Employee typing `/admin/settings` or `/reports`), navigation is intercepted.
  - Renders a dedicated **403 – Access Denied** page showing the missing permission key, current role, and reason.

---

## 📁 Clean Folder Structure

```
dynamic-rbac-system/
├── public/
├── src/
│   ├── api/
│   │   ├── axiosClient.js          # Axios client with base URL, timeout & response interceptors
│   │   └── productsApi.js          # DummyJSON REST API service methods
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx           # Role, status, and category badges
│   │   │   ├── Button.jsx          # Reusable buttons with variants, sizes & loading states
│   │   │   ├── Card.jsx            # Clean container cards
│   │   │   ├── ConfirmModal.jsx    # Accessible confirmation dialogs
│   │   │   ├── Input.jsx           # Input with show/hide password and validation
│   │   │   ├── Modal.jsx           # Accessible modal container with backdrop
│   │   │   ├── PageHeader.jsx      # Consistent header with title, badge & actions
│   │   │   ├── Pagination.jsx      # Pagination bar with page size selection
│   │   │   ├── Select.jsx          # Custom styled select dropdowns
│   │   │   ├── Skeleton.jsx        # Loading skeleton placeholders
│   │   │   ├── Toast.jsx           # Toast notification component
│   │   │   └── Toggle.jsx          # Accessible toggle switch for Permission Matrix
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx       # Layout shell (Sidebar + Header + Testing Bar + Outlet)
│   │   │   ├── Header.jsx          # Header with user avatar, profile menu, and quick links
│   │   │   ├── RoleSwitcherBar.jsx # Instant evaluator testing bar
│   │   │   └── Sidebar.jsx         # Dynamic navigation filtered by active permissions
│   │   └── rbac/
│   │       ├── CanAccess.jsx       # Feature-level permission guard
│   │       └── ProtectedRoute.jsx  # Route-level security guard (redirects to 403)
│   ├── context/
│   │   ├── AuthContext.jsx         # Authentication, login, signup, user store, login history
│   │   ├── PermissionContext.jsx   # Dynamic RBAC Engine, matrix state, grant/revoke, reset
│   │   ├── ProductContext.jsx      # REST API CRUD state, local store merge, search, filter
│   │   └── ToastContext.jsx        # Global toast notifications (success, error, warning, info)
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminSettings.jsx   # MANDATORY: Dynamic Permission Matrix editor
│   │   ├── auth/
│   │   │   ├── Login.jsx           # Responsive login page with one-click demo personas
│   │   │   └── Signup.jsx          # Signup page with role selection
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx       # Executive summary cards, Recharts, recent activities
│   │   │   └── Analytics.jsx       # Deep-dive analytics, area & bar charts
│   │   ├── error/
│   │   │   ├── AccessDenied.jsx    # 403 Forbidden Access Denied page
│   │   │   └── NotFound.jsx        # 404 Not Found page
│   │   ├── products/
│   │   │   ├── ProductDetailModal.jsx # Product view modal with specs & API payload details
│   │   │   ├── ProductFormModal.jsx   # Create/Edit product modal with validation
│   │   │   └── ProductList.jsx     # Products table with search, filter, sort & pagination
│   │   ├── profile/
│   │   │   └── Profile.jsx         # User profile and assigned permissions inspector
│   │   └── reports/
│   │       └── Reports.jsx         # Inventory valuation reports & CSV export
│   ├── utils/
│   │   ├── constants.js            # Roles, permissions, demo users & default matrix
│   │   ├── formatters.js           # Currency, date, time-ago & number formatters
│   │   └── storage.js              # Safe LocalStorage wrapper
│   ├── App.jsx                     # Route definitions & security hierarchies
│   ├── index.css                   # Tailwind base, components & custom scrollbars
│   └── main.jsx                    # Application entry point with providers tree
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🔍 Evaluation Criteria & Review Guide

During technical review, verify each of the following pillars:

1. **React Context API Implementation (No Redux)**:
   - Four distinct, decoupled contexts: `AuthContext`, `PermissionContext`, `ProductContext`, and `ToastContext`.
   - Clear separation of concerns with custom hooks (`useAuth`, `usePermission`, `useProduct`, `useToast`).

2. **Third-Party REST API Integration**:
   - Axios client configured with 10s timeouts and error interceptors.
   - Endpoints used: `GET /products`, `GET /products/search`, `GET /products/category/{cat}`, `GET /products/categories`, `POST /products/add`, `PUT /products/{id}`, `DELETE /products/{id}`.
   - Local state merging ensures user-created, edited, and deleted records persist and reflect immediately in lists and charts.

3. **Dynamic RBAC & Permission Matrix**:
   - Navigate to `/admin/settings` as Admin.
   - Toggle **"Delete Records"** for Manager to **ON** and click **"Save Permission Settings"**.
   - Switch active persona to **Manager** via the top testing bar.
   - Navigate to **Product Records** (`/products`). Notice that the **Delete** button now appears in the actions column!
   - Switch back to Admin, turn **Delete Records** back to **OFF**, and click Save. Notice that the Delete button disappears for Manager.

4. **Dynamic Sidebar & Route Security**:
   - As Admin, toggle **"Reports"** for Manager to **OFF** and save.
   - Switch persona to Manager. Notice the **Reports** link vanishes from the sidebar.
   - Attempt to visit `/reports` manually in the address bar. The route guard intercepts the navigation and renders the **403 – Access Denied** page.

5. **Visual Analytics & Chart Quality**:
   - Recharts implementation with smooth tooltips, responsive containers, and live data aggregation from API records.

---

## 🛠️ Tech Stack
- **UI Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM 6
- **Charts**: Recharts 2
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Code Standards**: ESLint, semantic HTML, accessible ARIA roles
