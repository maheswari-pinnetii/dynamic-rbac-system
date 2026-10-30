# Design Brief & Human-Centered UX Specification

## 1. Design Philosophy: The "Human Theme"

Most enterprise administrative and RBAC interfaces are cold, robotic, and intimidating—dominated by technical jargon, harsh tables, and cryptic error numbers.

The **PeopleRBAC Human Theme** reverses this paradigm. Every screen, component, modal, and state is designed to treat colleagues as people first:

* **Warmth over Sterility**: Greetings incorporate time-of-day human warmth ("Good afternoon, Sarah! 👋") and conversational context.
* **Empathy over Punishment**: When a user attempts an unauthorized action or navigates to a restricted route, instead of an abrasive "403 Forbidden Error", they receive an empathetic notice: *"Hold on, Colleague! Your current role does not have authorization based on policies set by the Admin in the Permission Matrix"*, paired with a one-click shortcut to switch roles or request access.
* **Curator Attribution**: Products in the catalog are not anonymous database rows; each item highlights the **primary human colleague curator** who manages it, complete with real photo avatars and team departments.
* **Human-Centered Stock Health**: Raw stock integers are supplemented with human-friendly descriptions: *"Abundant Stock (>10 units)"*, *"Low Stock (1-10 units)"*, and *"Out of Stock (Needs restock)"*.

---

## 2. Iconography: People-First Semantic Icons

The application strictly utilizes **human-centric icons** from `lucide-react`:

| Concept / Role | Icon | Purpose & Rationale |
| :--- | :--- | :--- |
| **Executive Administrator** | `Crown` | Conveys governance, stewardship, and master permission authority. |
| **Team Manager** | `Briefcase` | Represents organizational leadership, operational management, and team oversight. |
| **Operations Specialist** | `UserCheck` / `Users` | Represents front-line colleagues handling everyday catalog activities. |
| **Passkey / Windows Hello** | `ScanFace` | Friendly human biometric visual for facial recognition. |
| **Passkey / Fingerprint** | `Fingerprint` | Direct, familiar touch verification icon. |
| **Catalog & Collaboration** | `HeartHandshake` | Represents teamwork and mutual responsibility across departments. |
| **Growth & Insights** | `Smile` | Promotes positive reinforcement and celebratory data achievements. |
| **Access Interception** | `HeartHandshake` / `ShieldAlert` | Welcoming, non-punitive security boundary reminder. |
| **Live Synchronization** | `Sparkles` | Indicates real-time dynamic reactivity across user sessions. |

---

## 3. Color Palette & Hierarchy

The visual palette blends modern enterprise neutrals with warm human tones:

### 3.1. Neutral Foundation
* **Light Mode Background**: `bg-slate-50` (`#f8fafc`) with pure white card surfaces (`#ffffff`).
* **Dark Mode Background**: Deep slate canvas (`bg-slate-950` `#020617`) with rich card elevation (`bg-slate-900` `#0f172a`) and border dividers (`border-slate-800` `#1e293b`).

### 3.2. Role-Tier Accent Hierarchy
* **Admin (Leadership)**: Royal Purple (`text-purple-600`, `bg-purple-50`, `dark:bg-purple-950/60`, `dark:text-purple-300`).
* **Manager (Team Coordination)**: Corporate Blue (`text-blue-600`, `bg-blue-50`, `dark:bg-blue-950/60`, `dark:text-blue-300`).
* **Employee (Specialist Operations)**: Fresh Emerald (`text-emerald-600`, `bg-emerald-50`, `dark:bg-emerald-950/60`, `dark:text-emerald-300`).

### 3.3. Primary Action & Brand
* **Primary Teal Brand**: `from-teal-600 to-brand-600` (`#0d9488` to `#0284c7`), evoking trust, health, and calm.

---

## 4. Typography & Information Hierarchy

* **Font Stack**: Clean system sans-serif (`Inter`, system-ui, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`).
* **Headings**:
  * Page Titles: `text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white`.
  * Card Titles: `text-base font-bold text-slate-900 dark:text-white`.
  * Subtitles: `text-xs text-slate-500 dark:text-slate-400 leading-relaxed`.
* **Numbers & Metrics**:
  * KPI Counters: `text-3xl font-extrabold tracking-tight`.
  * Currencies: Bold formatted numbers with currency symbols (`formatCurrency(val)`).

---

## 5. Accessibility (a11y) & Usability Principles

1. **High-Contrast Dark Mode**: All text meets **WCAG 2.1 AA** contrast ratios ($> 4.5:1$ for normal text, $> 3:1$ for large text).
2. **Keyboard Navigation & Focus Rings**: Interactive elements (`Button`, `Toggle`, `Input`, `Select`) include visible `focus:ring-2 focus:ring-brand-500` outlines.
3. **Semantic Structure**: Proper heading levels (`h1`, `h2`, `h3`), semantic landmarks (`<header>`, `<aside>`, `<main>`), and ARIA attributes (`aria-label`, `aria-hidden`, `role="alert"`).
4. **FOUC Prevention**: Inline `<head>` script eliminates visual flash during cold boot in dark mode.
5. **Multi-Modal Redundancy**: Information is never conveyed by color alone; all status badges pair color with text descriptions and icon indicators.

