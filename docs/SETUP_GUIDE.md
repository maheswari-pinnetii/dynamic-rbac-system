# System Setup & Deployment Guide

## 1. System Requirements

* **Node.js**: `v18.0.0` or higher (`v20+` LTS recommended).
* **Package Manager**: `npm` (`v9+`), `pnpm` (`v8+`), or `yarn` (`v1.22+`).
* **Supported Browsers**: Chrome 108+, Edge 108+, Firefox 110+, Safari 16+, Opera 94+.
* **Operating Systems**: Windows 10/11 (with Windows Hello support), macOS 12+ (Touch ID), Linux.

---

## 2. Installation & Quick Start

### Step 1: Clone or Navigate to the Workspace Directory
```bash
cd f:\dynamic-rbac-system
```

### Step 2: Install Project Dependencies
```bash
npm install
```

### Step 3: Start the Vite Development Server
```bash
npm run dev
```
The application will launch locally at:
* Local URL: `http://localhost:5173`
* Network URL: `http://<your-ip>:5173`

### Step 4: Build for Production
To generate the production bundle with optimized chunking:
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

### Step 5: Preview the Production Build Locally
```bash
npm run preview
```
Launches a lightweight static server hosting the production artifacts.

---

## 3. Pre-Configured Colleague Demo Credentials

The application is pre-seeded with three enterprise colleague accounts:

| Role Tier | Human Colleague | Corporate Email | Password | Biometric / Passkey Support |
| :--- | :--- | :--- | :--- | :--- |
| **Executive Admin** | **Sarah Connor** | `admin@enterprise.com` | `Password123!` | Windows Hello Face / Touch Fingerprint |
| **Team Manager** | **Marcus Vance** | `manager@enterprise.com` | `Password123!` | Windows Hello Face / Touch Fingerprint |
| **Operations Specialist** | **Elena Rostova** | `employee@enterprise.com` | `Password123!` | Windows Hello Face / Touch Fingerprint |

> **One-Click Sign-In Helper**: The Login screen features a prefill banner allowing you to populate credentials with a single click.

---

## 4. Biometric & Passkey Testing Guide

### Testing Native WebAuthn (Windows Hello / Touch ID)
1. Navigate to the **Login** page.
2. Select the **"Biometric Sign-In"** tab or click **"Use Windows Hello Face"** / **"Use Fingerprint"**.
3. When the operating system prompt appears, glance at your camera or touch the biometric sensor.
4. The system validates the credential attestation and signs you in instantly.

### Testing Simulated Biometric Bypass (For Sandboxed / Headless Environments)
If testing in a virtual machine, sandbox, or headless browser where biometric hardware is unavailable:
1. Trigger the biometric scan modal.
2. If dismissed or unsupported, click the amber button: **"Confirm With Simulated Biometric (Instant Test)"**.
3. The app simulates a successful hardware authentication event, allowing complete verification of passkey workflows.

---

## 5. Testing Dynamic RBAC (Admin Matrix Evaluation)

Follow these steps to demonstrate real-time dynamic permission propagation:

1. **Sign in as Sarah Connor (Admin)**:
   * Navigate to `http://localhost:5173/admin/settings`.
2. **Observe the Permission Matrix**:
   * Locate the **Delete Records** row.
   * Notice that for **Team Managers**, the toggle switch is currently **OFF** (Restricted).
3. **Switch to Marcus Vance (Team Manager)**:
   * Click **"Marcus Vance (Team Manager)"** under *Inspect Colleague Perspectives*.
   * Navigate to **Curated Catalog** (`/products`).
   * **Verification**: Notice that the red **Delete (Trash)** button is **hidden** across all product rows.
4. **Grant Permission Dynamically**:
   * Switch back to Sarah (Admin).
   * Toggle **Delete Records** for Team Managers to **ON** (Permitted).
   * Click **"Save Permission Settings"**.
5. **Observe Immediate Runtime Effect**:
   * Switch back to Marcus (Manager).
   * Navigate to **Curated Catalog** (`/products`).
   * **Verification**: The red **Delete (Trash)** button is now **visible and fully operational**!
6. **Test Protected Route Guarding**:
   * While logged in as Elena (Specialist), manually type `http://localhost:5173/admin/settings` into the browser address bar.
   * **Verification**: The route guard intercepts navigation and renders the **403 – Access Denied** page with diagnostics and a return button.

---

## 6. Troubleshooting & Common Questions

### Port 5173 Already in Use
Vite will automatically increment to port 5174. To specify a custom port:
```bash
npm run dev -- --port 3000
```

### Resetting Local Storage State to Defaults
If you wish to wipe any custom products or permission modifications and return to fresh baseline seed data:
1. Open Developer Tools (`F12`).
2. Go to **Application** $\rightarrow$ **Local Storage** $\rightarrow$ `http://localhost:5173`.
3. Click **Clear All**, or in the Admin Settings page click **"Reset to Defaults"**.

