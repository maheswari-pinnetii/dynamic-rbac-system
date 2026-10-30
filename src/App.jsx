import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PERMISSIONS, ROLES } from './utils/constants';

// Layout & Security Wrappers
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/rbac/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Logout from './pages/auth/Logout';
import Dashboard from './pages/dashboard/Dashboard';
import Analytics from './pages/dashboard/Analytics';
import ProductList from './pages/products/ProductList';
import AdminSettings from './pages/admin/AdminSettings';
import Reports from './pages/reports/Reports';
import Profile from './pages/profile/Profile';
import AccessDenied from './pages/error/AccessDenied';
import NotFound from './pages/error/NotFound';

export const App = () => {
  return (
    <Routes>
      {/* Public Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Logout />} />

      {/* Standalone Error Pages */}
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Protected Enterprise Portal Routes wrapped in AppLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Index redirect to Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Module 2: Dashboard */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.DASHBOARD}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Module 2: Analytics Dashboard */}
        <Route
          path="analytics"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.ANALYTICS}>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Module 3: Third-Party REST API CRUD Management */}
        <Route
          path="products"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_RECORDS}>
              <ProductList />
            </ProtectedRoute>
          }
        />

        {/* Reports & Export */}
        <Route
          path="reports"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.REPORTS}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Module 5: Admin Settings & Dynamic RBAC Engine (Admin Only) */}
        <Route
          path="admin/settings"
          element={
            <ProtectedRoute
              adminOnly={true}
              requiredPermission={PERMISSIONS.SETTINGS}
            >
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* User Profile */}
        <Route
          path="profile"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.PROFILE}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

