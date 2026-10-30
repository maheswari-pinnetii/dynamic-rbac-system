# User Flow & Interaction Journey Specifications

## 1. User Journey 1: Authentication & Biometric Sign-In

```mermaid
flowchart TD
    Start([User Arrives at /login]) --> Choice{Select Auth Method}
    
    Choice -->|Password Flow| P1[Enter Corporate Email & Password]
    P1 --> P2[Client Form Validation]
    P2 -->|Valid| P3[AuthContext Sets Session & Role]
    P2 -->|Invalid| P4[Display Inline Error]
    
    Choice -->|Passkey / Biometric Flow| B1[Click Use Windows Hello / Fingerprint]
    B1 --> B2[Open BiometricModal]
    B2 --> B3{Hardware Supported?}
    B3 -->|Yes| B4[Prompt OS Face / Touch Attestation]
    B3 -->|No / Sandboxed| B5[Click Confirm With Simulated Biometric]
    B4 -->|Attestation Validated| P3
    B5 -->|Test Verified| P3
    
    Choice -->|One-Click Demo Helper| D1[Click Admin, Manager, or Employee Pill]
    D1 --> P3
    
    P3 --> Redirect[Redirect to Enterprise Dashboard /dashboard]
```

---

## 2. User Journey 2: Admin Dynamic Permission Governance

```mermaid
sequenceDiagram
    autonumber
    actor Sarah as Sarah Connor (Admin)
    participant Settings as Admin Settings Page
    participant Matrix as Permission Matrix
    participant PContext as PermissionContext
    actor Marcus as Marcus Vance (Manager)
    participant Catalog as Curated Catalog (/products)

    Sarah->>Settings: Navigates to /admin/settings
    Settings->>Matrix: Renders interactive toggle matrix
    Sarah->>Matrix: Switches "Delete Records" for Team Manager to ON
    Matrix-->>Settings: Displays amber "You have unsaved changes!" alert
    Sarah->>Settings: Clicks "Save Permission Settings"
    Settings->>PContext: Dispatches savePermissionsMatrix()
    PContext-->>Settings: Emits Success Toast "Colleague Access Updated"

    Note over Sarah,Marcus: Role switch to test live effect
    Sarah->>Settings: Clicks "Marcus Vance (Team Manager)" perspective button
    Settings->>Catalog: Marcus navigates to /products
    Catalog->>PContext: Checks hasPermission("records.delete", "Manager")
    PContext-->>Catalog: Returns TRUE
    Catalog-->>Marcus: Red "Delete (Trash)" buttons appear across all products!
```

---

## 3. User Journey 3: Catalog Exploration & Click-to-Inspect

```mermaid
flowchart TD
    CatalogStart[User Opens Curated Catalog /products] --> Actions{Catalog Interactions}
    
    Actions -->|Live Search| S1[Type in Search Box: 'audio', 'phone', etc.]
    S1 --> TableUpdate[Table Filters Instantly]
    
    Actions -->|Department Filter| S2[Select Category: Beauty, Smartphones, etc.]
    S2 --> TableUpdate
    
    Actions -->|Supply Condition| S3[Select: Abundant, Low Stock, Out of Stock]
    S3 --> TableUpdate
    
    Actions -->|Click Any Product| Inspect[Click on Row, Thumbnail, or Title]
    Inspect --> Modal[ProductDetailModal Opens]
    
    Modal --> TabChoice{Select Modal Tab}
    TabChoice -->|Colleague Overview| M1[View Curator Avatar, Stock Pill, SKU & Catalog ID]
    TabChoice -->|Specs & Logistics| M2[View Shipping Timeline, Warranty, Return Policy, WxHxD Dimensions]
    TabChoice -->|Customer Reviews| M3[View Real Star Ratings, Review Testimonials & Author Dates]
    
    Modal --> RoleAction{Role Guarded Actions}
    RoleAction -->|Can Edit?| EA[Click Edit Product -> Launches Form Modal]
    RoleAction -->|Can Delete?| DA[Click Remove Item -> Launches Danger Confirm Modal]
    RoleAction -->|Done| Close[Click Done Reviewing -> Returns to Catalog]
```

---

## 4. User Journey 4: Unauthorized Access Interception (403 Flow)

```mermaid
flowchart TD
    User[Elena Rostova (Specialist)] --> Action[Manually Types /admin/settings in URL Bar]
    Action --> RouteGuard[ProtectedRoute Component Evaluates Access]
    RouteGuard --> AuthCheck{Is User Admin?}
    AuthCheck -->|No| Block[Block Navigation]
    Block --> Redirect[Redirect to /access-denied with State Metadata]
    
    Redirect --> Empathetic403[Render Human Empathetic 403 Page]
    Empathetic403 --> Info1[Role: Employee Specialist Operations]
    Empathetic403 --> Info2[Attempted Path: /admin/settings]
    Empathetic403 --> Info3[Governing Policy: Administrator Privileges]
    
    Empathetic403 --> Choices{User Action}
    Choices -->|Go Back| Previous[Returns to Previous Page]
    Choices -->|Back to Overview| Home[Navigates to /dashboard]
    Choices -->|Testing Shortcut| SwapAdmin[Click Switch to Sarah Admin -> Navigates to Admin Settings]
```

---

## 5. User Journey 5: Theme Switching (Light $\leftrightarrow$ Dark $\leftrightarrow$ System)

```mermaid
flowchart LR
    User -->|Clicks ThemeToggle in Header or Profile| Toggle[ThemeToggle Component]
    Toggle --> ThemeContext[ThemeContext State Updates]
    ThemeContext --> DOM[document.documentElement.classList.toggle 'dark']
    ThemeContext --> Storage[localStorage.setItem 'rbac_theme', mode]
    Storage --> Broadcast[Broadcasts storage event to other open tabs]
    DOM --> Recharts[Recharts SVG axes, lines & tooltips update stroke colors]
```

