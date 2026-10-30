# Module 3: CRUD Management & Third-Party API Integration

## 1. Overview & Objective
Module 3 implements enterprise-grade Product & Inventory CRUD operations powered by the **DummyJSON public REST API** (`https://dummyjson.com/products`). The catalog serves as the central demonstration environment for dynamic permission controls, showcasing how runtime RBAC rules govern data mutation across Create, Read, Update, and Delete actions.

---

## 2. API Integration & Payload Architecture

### 2.1 HTTP Client Configuration (`src/api/axiosClient.js`)
All outgoing API interactions route through a centralized Axios client configured with:
- **Base URL**: `https://dummyjson.com`
- **Timeout**: 15,000 ms with error interceptors handling offline states and slow connections.
- **Content-Type**: `application/json`

### 2.2 Endpoints & HTTP Methods

| Action | HTTP Method | Endpoint | Query / Path Parameters | Primary Key (ID) |
| :--- | :--- | :--- | :--- | :--- |
| **List Products** | `GET` | `/products` | `?limit=10&skip=0&sortBy=title&order=asc` | Item `id` (integer) |
| **Search Products** | `GET` | `/products/search` | `?q={keyword}&limit=10&skip=0` | Matching `id` |
| **Filter by Category** | `GET` | `/products/category/{category}` | `limit=10&skip=0` | Matching `id` |
| **Get Categories** | `GET` | `/products/categories` | None | String slug |
| **Get Single Product** | `GET` | `/products/{id}` | Path variable `:id` | Item `id` |
| **Create Product** | `POST` | `/products/add` | Body payload (see below) | Auto-generated ID (`> 194`) |
| **Update Product** | `PUT` | `/products/{id}` | Body with modified fields | Existing `:id` |
| **Delete Product** | `DELETE` | `/products/{id}` | Path variable `:id` | Deleted `:id` confirmation |

### 2.3 Payload Structure

#### Create / Update Request Payload:
```json
{
  "title": "Ergonomic Lumbar Office Task Chair",
  "description": "Breathable mesh back with adjustable lumbar support and 3D armrests.",
  "price": 289.99,
  "discountPercentage": 12.5,
  "rating": 4.8,
  "stock": 42,
  "brand": "ErgoHuman",
  "category": "furniture",
  "thumbnail": "https://images.unsplash.com/photo-1580481077195-c228ff34a03a"
}
```

#### API Response Payload (Created / Fetched Record):
```json
{
  "id": 195,
  "title": "Ergonomic Lumbar Office Task Chair",
  "description": "Breathable mesh back with adjustable lumbar support and 3D armrests.",
  "price": 289.99,
  "discountPercentage": 12.5,
  "rating": 4.8,
  "stock": 42,
  "brand": "ErgoHuman",
  "category": "furniture",
  "thumbnail": "https://images.unsplash.com/photo-1580481077195-c228ff34a03a",
  "dimensions": { "width": 64, "height": 110, "depth": 60 },
  "warrantyInformation": "3 year manufacturer warranty",
  "shippingInformation": "Ships in 1-2 business days",
  "availabilityStatus": "In Stock",
  "reviews": []
}
```

### 2.4 Error Handling & Client-Side Synchronization
- **API Simulation Caveat**: Public APIs like DummyJSON simulate `POST`, `PUT`, and `DELETE` requests (returning mock HTTP 200/201 responses without permanently altering their upstream servers).
- **Client Synchronization**: `ProductContext.jsx` maintains an in-memory and local storage synchronized state. When a colleague creates, updates, or removes an item:
  1. The API request is dispatched to confirm validation and status code.
  2. The local state updates immediately to persist changes across browser navigation and refreshes.
  3. An entry is dispatched to the audit trail via `logActivity()`.

---

## 3. Core Features & Capabilities

### 3.1 List Records & Paginated View (`/products`)
- Displays records in responsive card grid and tabular formats.
- Visual badges denote inventory status: **In Stock** (`> 10` units), **Low Stock** (`1 - 10` units), and **Out of Stock** (`0` units).
- Each record surfaces image thumbnail, category tag, rating with star indicators, pricing, and action triggers.

### 3.2 3-Tab Universal Inspection Modal (`ProductDetailModal.jsx`)
Clicking any product launches the detailed modal with 3 distinct tabs:
1. **Colleague Overview**: High-resolution image, stock counts, SKU, and operational curator.
2. **Specifications & Logistics**: Physical dimensions (width, height, depth), weight, warranty coverage, shipping policies, and return periods.
3. **Customer Reviews**: Individual customer comments, star ratings, review dates, and verified buyer tags.

### 3.3 Create Record (`ProductFormModal.jsx`)
- Accessible via the **"Add New Product"** button in the catalog header.
- **Permission Guard**: Wrapped inside `<CanAccess permission="records.create">`. If the Admin revokes this permission, the button completely disappears from the UI.
- Validates title, price, initial stock, and category before dispatching `POST /products/add`.

### 3.4 Edit Record
- Accessible via the edit button on each product card or table row.
- **Permission Guard**: Wrapped inside `<CanAccess permission="records.edit">`.
- Pre-fills form fields with current record data. Dispatches `PUT /products/{id}` upon submission.

### 3.5 Delete Record
- Accessible via the trash button on each product card.
- **Permission Guard**: Wrapped inside `<CanAccess permission="records.delete">`.
- Triggers a human-friendly confirmation dialog to prevent accidental data deletion.

### 3.6 Search, Filter, & Sorting Suite
- **Search**: Real-time debounced query searching titles, descriptions, and brand names.
- **Category Filter**: Dropdown filter for `beauty`, `fragrances`, `furniture`, `groceries`, `laptops`, and `smartphones`.
- **Stock Filter**: Instant filter by `All`, `In Stock`, `Low Stock`, or `Out of Stock`.
- **Sorting**: Multi-parameter sort by:
  - Price: Low to High / High to Low
  - Title: Alphabetical (A–Z / Z–A)
  - Rating: Highest Rated First
  - Stock Count: Most Available First

---

## 4. Component Structure

```
src/
├── api/
│   ├── axiosClient.js          # Configured Axios instance with interceptors
│   └── productsApi.js          # REST methods for GET, POST, PUT, DELETE
├── context/
│   └── ProductContext.jsx      # Global catalog state, filters, sorting & pagination
└── pages/products/
    ├── ProductList.jsx         # Catalog table/grid with search, sort, filter controls
    ├── ProductDetailModal.jsx  # 3-tab click-to-inspect modal
    └── ProductFormModal.jsx    # Create / Edit modal with field validation
```

---

## 5. Step-by-Step Evaluation Guide
1. Log in as **Sarah Connor** (`admin@enterprise.com`).
2. Navigate to **Product Records** (`/products`).
3. Verify that the **Add New Product** button is visible in the top right.
4. Click **Add New Product**, fill in the title, price, category, and stock, then submit. Verify the new product appears at the top of the list.
5. Click on the product card to open **ProductDetailModal** and inspect the 3 tabs (Overview, Logistics, Reviews).
6. Click the edit icon to change the price or stock count. Confirm the update persists.
7. Click the trash icon on the item to test deletion. Verify the confirmation prompt and subsequent removal.
8. Test filtering by category and sorting by price to verify responsive client-side state handling.
