# Module 1: Authentication & Identity Management

## 1. Overview & Objective
Module 1 provides a responsive, human-centered authentication gateway supporting both password-based and modern biometric WebAuthn / FIDO2 passkey credentials. User credentials and sessions are securely managed and persisted in browser local storage without Redux.

---

## 2. Core Features & Capabilities

### 2.1 Login System (`/login`)
- **Email & Password Authentication**: Validated with RFC-compliant email regex and minimum 6-character length checks.
- **Show/Hide Password**: `<Eye />` and `<EyeOff />` interactive toggle icons for clear credential inspection.
- **Biometric Passkey Authentication**: Windows Hello Facial Recognition, Touch ID, and hardware fingerprint sensor support via WebAuthn API (`navigator.credentials.get`).
- **1-Click Pre-Configured Colleague Credentials**:
  - **Sarah Connor** (`admin@enterprise.com` / `Password123!`) – Administrator
  - **Marcus Vance** (`manager@enterprise.com` / `Password123!`) – Team Manager
  - **Elena Rostova** (`employee@enterprise.com` / `Password123!`) – Operations Specialist
- **Form Validation & Error States**: Field-level feedback preventing invalid submissions.

### 2.2 Signup System (`/signup`)
- **Required Fields**:
  - Full Name (&ge; 2 characters)
  - Work Email Address (valid format)
  - Password (&ge; 6 characters) with Show/Hide toggle
  - Confirm Password (strict equality check)
  - Role Selection Tier: Administrator, Team Manager, Operations Specialist
- **Biometric Passkey Enrollment**: Direct WebAuthn registration during onboarding (`navigator.credentials.create`).

### 2.3 Dedicated Logout Gateway (`/logout`)
- Automatically clears session storage, active tokens, and biometric credentials upon entry.
- Displays an empathetic session closure confirmation with `<HeartHandshake />` and `<ShieldCheck />`.
- Quick action navigation to return to `/login` or register a new colleague via `/signup`.

---

## 3. Component Architecture

```
src/
├── pages/auth/
│   ├── Login.jsx           # Main login portal with Passkey & Password tabs
│   ├── Signup.jsx          # Colleague registration with role cards
│   └── Logout.jsx          # Empathetic session clearance and goodbye screen
├── components/common/
│   ├── BiometricModal.jsx  # Windows Hello & Touch ID hardware modal
│   └── Input.jsx           # Reusable input with Show/Hide password toggle
└── context/
    └── AuthContext.jsx     # Pure React Context API authentication provider
```

---

## 4. State & Session Persistence

Authentication state is managed by `AuthContext.jsx` using `localStorage`:

```javascript
// Stored User Session Schema
{
  id: "usr_admin_01",
  name: "Sarah Connor",
  email: "admin@enterprise.com",
  role: "Admin",
  title: "Lead Executive Administrator",
  department: "People Operations & Security",
  avatar: "https://images.unsplash.com/...",
  hasPasskey: true,
  passkeys: [
    {
      id: "pk_sarah_hello",
      name: "Sarah's Windows Hello (Facial & PIN)",
      type: "platform",
      createdAt: "2026-01-15T08:00:00.000Z"
    }
  ],
  loginTimestamp: "2026-10-30T12:00:00.000Z"
}
```

---

## 5. Step-by-Step Evaluation Guide
1. Navigate to `/login`. Verify that inputs start with clean placeholders.
2. Click **Sarah (Administrator)** chip below. Notice email and password populate automatically.
3. Click the password eye icon to toggle visibility between `••••••••` and `Password123!`.
4. Click **Sign In With Password**. Verify that user is redirected to `/dashboard`.
5. Open profile dropdown in the top right and click **Sign Out of Session**.
6. Verify redirection to `/logout` displaying *"Session Closed Safely"*.
7. Click **Register New Colleague** to test `/signup`. Fill in name, email, password, confirm password, select role, and register.

