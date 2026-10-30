/**
 * Human-Centric RBAC Constants, Personas, and Baseline Permission Matrix
 */

export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
};

export const ROLE_HUMAN_TITLES = {
  [ROLES.ADMIN]: 'Executive Administrator',
  [ROLES.MANAGER]: 'Department Team Lead',
  [ROLES.EMPLOYEE]: 'Operations Specialist',
};

export const ROLE_LIST = [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE];

export const ROLE_BADGE_COLORS = {
  [ROLES.ADMIN]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    dot: 'bg-purple-600',
    humanLabel: 'Executive Administrator',
  },
  [ROLES.MANAGER]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-600',
    humanLabel: 'Team Manager',
  },
  [ROLES.EMPLOYEE]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600',
    humanLabel: 'Team Specialist',
  },
};

/**
 * All permission identifiers in the system
 */
export const PERMISSIONS = {
  DASHBOARD: 'dashboard.view',
  ANALYTICS: 'analytics.view',
  VIEW_RECORDS: 'records.view',
  CREATE_RECORDS: 'records.create',
  EDIT_RECORDS: 'records.edit',
  DELETE_RECORDS: 'records.delete',
  REPORTS: 'reports.view',
  SETTINGS: 'settings.manage',
  PROFILE: 'profile.view',
};

/**
 * Human-Friendly Permission Metadata
 */
export const PERMISSION_DEFINITIONS = [
  {
    key: PERMISSIONS.DASHBOARD,
    label: 'Overview Dashboard',
    humanQuestion: 'Can colleagues view the main team overview & executive metrics?',
    category: 'Team Workspace',
    description: 'Access summary cards, colleague activities, and today’s operational pulse.',
    route: '/dashboard',
  },
  {
    key: PERMISSIONS.ANALYTICS,
    label: 'Visual Team Analytics',
    humanQuestion: 'Can colleagues inspect visual growth charts & performance trends?',
    category: 'Insights & Health',
    description: 'Inspect category volume, monthly progress, and throughput charts.',
    route: '/analytics',
  },
  {
    key: PERMISSIONS.VIEW_RECORDS,
    label: 'Browse Catalog Records',
    humanQuestion: 'Can colleagues browse and search the product catalog?',
    category: 'Catalog Management',
    description: 'Search, filter, and view detailed specifications for all items.',
    route: '/products',
  },
  {
    key: PERMISSIONS.CREATE_RECORDS,
    label: 'Add New Products',
    humanQuestion: 'Can colleagues contribute new items to the inventory?',
    category: 'Catalog Management',
    description: 'Register fresh products with pricing, stock levels, and descriptions.',
    action: 'create',
  },
  {
    key: PERMISSIONS.EDIT_RECORDS,
    label: 'Update Existing Products',
    humanQuestion: 'Can colleagues edit details, prices, and stock counts?',
    category: 'Catalog Management',
    description: 'Modify specifications, adjust inventory counts, and update photos.',
    action: 'edit',
  },
  {
    key: PERMISSIONS.DELETE_RECORDS,
    label: 'Remove Products',
    humanQuestion: 'Can colleagues permanently delete items from inventory?',
    category: 'Catalog Management',
    description: 'Permanently remove obsolete records from the catalog.',
    action: 'delete',
  },
  {
    key: PERMISSIONS.REPORTS,
    label: 'Operational Reports',
    humanQuestion: 'Can colleagues export inventory summaries and valuation sheets?',
    category: 'Team Workspace',
    description: 'Review stock valuations and download spreadsheet CSV summaries.',
    route: '/reports',
  },
  {
    key: PERMISSIONS.SETTINGS,
    label: 'Admin Permission Settings',
    humanQuestion: 'Can colleagues configure who is allowed to do what across the team?',
    category: 'Governance & Security',
    description: 'Manage the dynamic permission matrix and govern colleague privileges.',
    route: '/admin/settings',
    adminRestricted: true,
  },
  {
    key: PERMISSIONS.PROFILE,
    label: 'Personal Identity & Passkeys',
    humanQuestion: 'Can colleagues view their personal identity profile & linked passkeys?',
    category: 'Personal Identity',
    description: 'Inspect personal bio, role privileges, and register Windows Hello / Fingerprints.',
    route: '/profile',
  },
];

/**
 * Default permission matrix as requested in Module 5 specifications
 */
export const DEFAULT_PERMISSIONS = {
  [ROLES.ADMIN]: {
    [PERMISSIONS.DASHBOARD]: true,
    [PERMISSIONS.ANALYTICS]: true,
    [PERMISSIONS.VIEW_RECORDS]: true,
    [PERMISSIONS.CREATE_RECORDS]: true,
    [PERMISSIONS.EDIT_RECORDS]: true,
    [PERMISSIONS.DELETE_RECORDS]: true,
    [PERMISSIONS.REPORTS]: true,
    [PERMISSIONS.SETTINGS]: true,
    [PERMISSIONS.PROFILE]: true,
  },
  [ROLES.MANAGER]: {
    [PERMISSIONS.DASHBOARD]: true,
    [PERMISSIONS.ANALYTICS]: true,
    [PERMISSIONS.VIEW_RECORDS]: true,
    [PERMISSIONS.CREATE_RECORDS]: true,
    [PERMISSIONS.EDIT_RECORDS]: true,
    [PERMISSIONS.DELETE_RECORDS]: false,
    [PERMISSIONS.REPORTS]: true,
    [PERMISSIONS.SETTINGS]: false,
    [PERMISSIONS.PROFILE]: true,
  },
  [ROLES.EMPLOYEE]: {
    [PERMISSIONS.DASHBOARD]: true,
    [PERMISSIONS.ANALYTICS]: true,
    [PERMISSIONS.VIEW_RECORDS]: true,
    [PERMISSIONS.CREATE_RECORDS]: false,
    [PERMISSIONS.EDIT_RECORDS]: false,
    [PERMISSIONS.DELETE_RECORDS]: false,
    [PERMISSIONS.REPORTS]: false,
    [PERMISSIONS.SETTINGS]: false,
    [PERMISSIONS.PROFILE]: true,
  },
};

/**
 * Real Human Team Personas with authentic human portraits and friendly bios
 */
export const DEMO_USERS = [
  {
    id: 'usr_admin_01',
    name: 'Sarah Connor',
    email: 'admin@enterprise.com',
    password: 'Password123!',
    role: ROLES.ADMIN,
    title: 'Lead Executive Administrator',
    department: 'People Operations & Security',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bio: 'Oversees organizational policy, staff privileges, and team operations.',
    statusMessage: 'Coordinating team permission policies',
    online: true,
    hasPasskey: true,
    passkeys: [
      {
        id: 'pk_sarah_hello',
        name: 'Sarah’s Windows Hello (Facial & PIN)',
        type: 'platform',
        createdAt: '2026-01-15T08:00:00.000Z',
      },
    ],
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'usr_manager_02',
    name: 'Marcus Vance',
    email: 'manager@enterprise.com',
    password: 'Password123!',
    role: ROLES.MANAGER,
    title: 'Senior Product Lead',
    department: 'Product Logistics & Supply',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Leads product curation, reviews team contributions, and manages catalog inventory.',
    statusMessage: 'Reviewing quarterly supplier shipments',
    online: true,
    hasPasskey: true,
    passkeys: [
      {
        id: 'pk_marcus_fp',
        name: 'Marcus’s Fingerprint Sensor',
        type: 'platform',
        createdAt: '2026-02-10T10:30:00.000Z',
      },
    ],
    createdAt: '2026-02-10T10:30:00.000Z',
  },
  {
    id: 'usr_employee_03',
    name: 'Elena Rostova',
    email: 'employee@enterprise.com',
    password: 'Password123!',
    role: ROLES.EMPLOYEE,
    title: 'Operations Specialist',
    department: 'Customer Fulfillment & Catalog',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    bio: 'Coordinates day-to-day order fulfillments and keeps catalog specifications up to date.',
    statusMessage: 'Auditing current in-stock goods',
    online: true,
    hasPasskey: true,
    passkeys: [
      {
        id: 'pk_elena_touch',
        name: 'Elena’s Device Biometrics',
        type: 'platform',
        createdAt: '2026-03-01T09:15:00.000Z',
      },
    ],
    createdAt: '2026-03-01T09:15:00.000Z',
  },
];
