# Module 5: Admin Settings & Dynamic Permission Management

## 1. Overview & Objective
Module 5 provides the dedicated governance control center for the entire system (`/admin/settings`). Accessible exclusively to Administrators, it empowers the Admin to reconfigure module access, CRUD capabilities, navigation visibility, and colleague roles at runtime **without writing or redeploying code**.

---

## 2. Core Features & Capabilities

### 2.1 Administrator-Only Access Restriction
- The route `/admin/settings` is strictly protected by:
  1. `<ProtectedRoute adminOnly>` wrapper.
  2. Direct user role assertion in `AdminSettings.jsx`:
     ```javascript
     if (currentUser?.role !== ROLES.ADMIN) {
       return <Navigate to="/access-denied" replace />;
     }
     ```
- Any unauthorized colleague attempting direct access is immediately blocked with an empathetic 403 Access Denied screen.

### 2.2 The Mandatory Dynamic Permission Matrix
The permission matrix features interactive toggle switches for every permission across **Manager** and **Employee** roles:

| Module / Permission Key | Manager Toggle | Employee Toggle | System Impact When Disabled |
| :--- | :---: | :---: | :--- |
| **Dashboard** (`dashboard.view`) | Toggle Switch | Toggle Switch | Hides sidebar menu; blocks `/dashboard` route with 403 |
| **Analytics Dashboard** (`analytics.view`) | Toggle Switch | Toggle Switch | Hides sidebar item; blocks `/analytics` with 403 |
| **View Records** (`records.view`) | Toggle Switch | Toggle Switch | Hides "Product Records"; blocks `/products` with 403 |
| **Create Records** (`records.create`) | Toggle Switch | Toggle Switch | Hides "Add New Product" button and modal trigger |
| **Edit Records** (`records.edit`) | Toggle Switch | Toggle Switch | Hides edit buttons across all product cards and table rows |
| **Delete Records** (`records.delete`) | Toggle Switch | Toggle Switch | Hides delete buttons and confirmation dialogs |
| **Reports** (`reports.view`) | Toggle Switch | Toggle Switch | Hides "Reports" menu; blocks `/reports` with 403 |
| **Settings** (`settings.manage`) | Fixed Lock (:lock:) | Fixed Lock (:lock:) | Strictly locked to Admin; cannot be granted to non-admins |
| **Profile** (`profile.view`) | Toggle Switch | Toggle Switch | Controls access to colleague profile and passkey registration |

### 2.3 Instant State Propagation & Persistence
- **Save Matrix Action**: Clicking **"Save Permission Matrix"** persists the entire matrix into `localStorage` via `PermissionContext.savePermissionsMatrix()`.
- **Immediate Propagation**: All open sessions, routes, and components subscribe to `PermissionContext`. State updates instantly propagate throughout the application without needing a page reload.
- **Reset Permissions to Default**: A dedicated reset button restores the matrix to the baseline enterprise specification at any time.

### 2.4 Colleague Role Governance (Promote / Demote)
- Lists all registered colleagues (e.g. Sarah Connor, Marcus Vance, Elena Rostova).
- Allows the Administrator to dynamically promote or demote any colleague:
  - Promote an Employee to Manager or Admin.
  - Demote a Manager to Employee.
  - Reassign department privileges.
- Changes update the colleague's session immediately in `AuthContext` and persist in storage.

### 2.5 Security Audit Trail Integration
Every administrative action (granting a permission, revoking access, saving the matrix, or reassigning a colleague) automatically creates a tamper-evident audit record dispatched to the system activity log:
- **Timestamp**: ISO 8601 string.
- **Actor**: Administrator name and email.
- **Action**: Exact permission or role altered.
- **Details**: Specific description of changes applied.

---

## 3. Component Architecture

```
src/
├── pages/admin/
│   └── AdminSettings.jsx       # Central governance interface with matrix & colleague tabs
├── components/rbac/
│   └── CanAccess.jsx           # Feature-level permission guard
└── context/
    ├── PermissionContext.jsx   # State manager for matrix, logs & route policies
    └── AuthContext.jsx         # User session & colleague registry manager
```

---

## 4. Step-by-Step Evaluation Guide
1. Log in as **Sarah Connor** (`admin@enterprise.com`).
2. Click **Admin Settings** in the sidebar.
3. In the **Permission Matrix**:
   - Turn **OFF** Reports for Manager.
   - Turn **ON** Create Records for Employee.
4. Click **Save Permission Matrix**. Observe the green confirmation alert.
5. Log out and log in as **Marcus Vance** (`manager@enterprise.com`).
   - Notice that the **Reports** link in the sidebar has disappeared.
   - Manually type `http://localhost:5173/reports` in the URL bar. Verify redirection to 403 Access Denied.
6. Log out and log in as **Elena Rostova** (`employee@enterprise.com`).
   - Navigate to **Product Records** (`/products`).
   - Verify that the **Add New Product** button is now visible and functional.
7. Return to Sarah’s account and click **Reset to Defaults**. Verify that standard roles are restored immediately.
