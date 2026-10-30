# Module 6: Dynamic Sidebar & Protected Routes

## 1. Overview & Objective
Module 6 connects the dynamic permissions established in Modules 4 and 5 directly into the application's visual navigation and routing infrastructure. The sidebar adjusts its menu items dynamically in real time, and route-level guards block unauthorized direct URL access with a 403 Access Denied screen.

---

## 2. Dynamic Sidebar Generation (`Sidebar.jsx`)

The sidebar navigation is generated programmatically from an item descriptor array that maps each link to a permission requirement:

```javascript
const navItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: Users,
    permission: PERMISSIONS.DASHBOARD,
  },
  {
    name: 'Analytics Dashboard',
    path: '/analytics',
    icon: Smile,
    permission: PERMISSIONS.ANALYTICS,
    badge: 'Live',
  },
  {
    name: 'Product Records',
    path: '/products',
    icon: HeartHandshake,
    permission: PERMISSIONS.VIEW_RECORDS,
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: Award,
    permission: PERMISSIONS.REPORTS,
  },
  {
    name: 'Admin Settings',
    path: '/admin/settings',
    icon: Crown,
    permission: PERMISSIONS.SETTINGS,
    adminOnly: true,
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: UserCheck,
    permission: PERMISSIONS.PROFILE,
  },
];
```

### 2.1 Filtering Rules
Before rendering, the items are filtered against the current user's role and dynamic permissions:
```javascript
const visibleNavItems = navItems.filter((item) => {
  // 1. Administrators see all navigation items
  if (userRole === ROLES.ADMIN) return true;

  // 2. Hide admin-only items for non-admins
  if (item.adminOnly && userRole !== ROLES.ADMIN) return false;

  // 3. Check dynamic runtime permission
  if (item.permission) {
    return hasPermission(item.permission, userRole);
  }

  return true;
});
```

### 2.2 Live Visual Manifestations

| Administrative Action | Direct Result in Sidebar | Direct Result on Page |
| :--- | :--- | :--- |
| **Disable Reports** for Manager | `Reports` menu item is completely hidden from the sidebar. | Attempting to visit `/reports` redirects to `/access-denied`. |
| **Disable Analytics** for Employee | `Analytics Dashboard` menu item disappears. | Attempting to visit `/analytics` triggers 403 Access Denied. |
| **Disable View Records** | `Product Records` menu item disappears. | Attempting to visit `/products` triggers 403 Access Denied. |
| **Grant Delete Records** | *(Sidebar unchanged)* | Trash can icon automatically appears on every product card. |
| **Disable Create Records** | *(Sidebar unchanged)* | "Add New Product" button disappears from `/products`. |

---

## 3. Protected Routes Architecture (`ProtectedRoute.jsx`)

To ensure security cannot be bypassed by typing paths directly into the browser URL bar, all internal routes are wrapped with `<ProtectedRoute>`:

```jsx
// src/App.jsx Route Setup
<Route
  path="/analytics"
  element={
    <ProtectedRoute requiredPermission={PERMISSIONS.ANALYTICS}>
      <Analytics />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/settings"
  element={
    <ProtectedRoute adminOnly requiredPermission={PERMISSIONS.SETTINGS}>
      <AdminSettings />
    </ProtectedRoute>
  }
/>
```

### 3.1 Route Verification Logic
When a route change occurs:
1. **Authentication Check**: If the user is unauthenticated, redirect to `/login` with return intent.
2. **Admin Universal Access**: If `currentUser.role === 'Admin'`, allow access immediately.
3. **Admin-Only Guard**: If `adminOnly` is set and `role !== 'Admin'`, redirect to `/access-denied`.
4. **Permission Guard**: If `requiredPermission` is set, evaluate `hasPermission(requiredPermission, role)`. If `false`, redirect to `/access-denied` with informative contextual parameters.
5. **Route Mapping Guard**: Verify `canAccessRoute(pathname, role)` to prevent path traversal attempts.

---

## 4. 403 Access Denied Gateway (`src/pages/error/AccessDenied.jsx`)

When unauthorized access is attempted, the system displays an empathetic 403 screen providing:
- **Status Code**: `403 – Access Denied`
- **Contextual Reason**: Explains why access was blocked (e.g. *"Your role (Employee) lacks the required 'analytics.view' permission configured in Admin Settings."*).
- **Required Permission**: Identifies the exact missing permission key.
- **Human Guidance**: Instructions on how to request privilege updates from team administrators.
- **Action Buttons**: Quick triggers to return to the safe Overview Dashboard or return to previous screen.

---

## 5. Feature-Level Action Guards (`<CanAccess />`)

In-page actions (buttons, modals, toolbars) are guarded by `<CanAccess>`:

```jsx
// Example: Create Record Button
<CanAccess permission={PERMISSIONS.CREATE_RECORDS}>
  <Button onClick={() => setIsCreateModalOpen(true)}>
    Add New Product
  </Button>
</CanAccess>

// Example: Delete Record Button
<CanAccess permission={PERMISSIONS.DELETE_RECORDS}>
  <button onClick={() => handleDelete(item.id)}>
    <Trash2 className="w-4 h-4 text-rose-500" />
  </button>
</CanAccess>
```

---

## 6. Step-by-Step Evaluation Guide
1. Log in as **Elena Rostova** (`employee@enterprise.com`).
2. Verify the sidebar displays only the permissions granted to Elena (Dashboard, Analytics, Product Records, Profile).
3. Confirm that **Admin Settings** is completely absent from the sidebar.
4. Now, manually type `http://localhost:5173/admin/settings` into the browser address bar and press Enter.
5. **Expected Result**: The route guard blocks access immediately, redirecting to `/access-denied` with a clear explanation that Administrator privileges are required.
6. Open `/products` as Elena. Notice the absence of "Add New Product" and trash icons.
7. Switch to Sarah Connor's account, grant Employee `records.create` and `records.delete` in Admin Settings, and click Save.
8. Switch back to Elena: verify the buttons now immediately appear without code changes.
