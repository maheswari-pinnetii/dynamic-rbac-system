# Module 2: Analytics Dashboard

## 1. Overview & Objective
Module 2 delivers an enterprise-grade analytics dashboard that renders immediate operational metrics, live Recharts data visualizations, a colleague activity audit feed, recent login history, and a universal click-to-inspect product modal.

---

## 2. Core Features & Capabilities

### 2.1 The 8 Required Summary KPI Cards
All cards are dynamically computed from catalog state, colleague registry, and live audit logs:

| Card Metric | Human Label | Icon | Purpose |
| :--- | :--- | :--- | :--- |
| **Total Records** | Curated Catalog | `<HeartHandshake />` | Total products active in central catalog (`190+` items) |
| **Total Active Records** | In Stock | `<Heart />` | High-volume items available for immediate order (`> 10` units) |
| **Total Inactive Records** | Needs Restock | `<Smile />` | Low-volume or empty items requiring restock (`<= 10` units) |
| **Total Managers** | Team Leads | `<Briefcase />` | Number of registered Team Managers |
| **Total Employees** | Specialists | `<Users />` | Number of registered Operations Specialists |
| **Total Roles** | RBAC Active | `<Crown />` | Total permission tiers (`3 Roles`: Admin, Manager, Employee) |
| **Recent Activities** | Live Audit Trail | `<Sparkles />` | Total audited actions recorded in the system |
| **New Records This Month** | +18% Growth | `<UserPlus />` | New items introduced by staff this month |

### 2.2 Live Recharts Visualizations
All charts dynamically adjust stroke and axis colors based on Light ("Human Warm Daylight") and Dark ("Human Warm Twilight") themes:

1. **Bar Chart – Record Distribution by Category**:
   - Compares catalog inventory across beauty, fragrances, furniture, groceries, laptops, and smartphones.
2. **Line Chart – Monthly Growth Over Time**:
   - Tracks six-month inventory expansion against active delivery readiness.
3. **Donut Chart – Status Distribution (Inventory Health)**:
   - Visualizes proportions of abundant stock, low stock, and out-of-stock items.
4. **Pie Chart – Colleague Role Distribution**:
   - Depicts organizational balance across Administrators, Team Managers, and Operations Specialists.

### 2.3 Universal Click-to-Inspect
- Clicking any featured card or product row launches [`ProductDetailModal.jsx`](file:///f:/dynamic-rbac-system/src/pages/products/ProductDetailModal.jsx) with 3 comprehensive tabs:
  1. **Colleague Overview**: Curator attribution, stock health, catalog SKU.
  2. **Specifications & Logistics**: Shipping methods, warranty coverage, return policies, and dimensions.
  3. **Customer Reviews**: Star breakdown and verified buyer testimonials.

### 2.4 Colleague Audit Feeds & Login History
- **Recent Activities Feed**: Real-time audit trail of actions taken by team members with `<Footprints />` timestamps.
- **Recent Sign-In History**: Table tracking user sign-ins, browser client, authentication method (Passkey vs Password), and verification status.

---

## 3. Component Architecture

```
src/
├── pages/dashboard/
│   ├── Dashboard.jsx        # Main executive dashboard with 8 KPI cards & 4 charts
│   └── Analytics.jsx        # Deep-dive analytics, area chart & capacity metrics
├── components/common/
│   ├── Card.jsx             # Reusable card container with headers & actions
│   └── Badge.jsx            # Dynamic role and status badge
└── pages/products/
    └── ProductDetailModal.jsx # 3-tab universal click-to-inspect modal
```

---

## 4. Step-by-Step Evaluation Guide
1. Log in as Sarah Connor (`admin@enterprise.com`).
2. Verify all **8 Summary Cards** display with accurate numbers and icons.
3. Inspect the **Bar, Line, Donut, and Pie charts**. Toggle the theme using the top header button to confirm SVGs adapt between light and dark modes.
4. Click on any product in the **Featured Catalog Highlights** section.
5. Verify that [`ProductDetailModal.jsx`](file:///f:/dynamic-rbac-system/src/pages/products/ProductDetailModal.jsx) opens displaying specs, dimensions, and customer reviews.

