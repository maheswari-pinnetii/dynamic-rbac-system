import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Smile,
  Heart,
  Crown,
  Briefcase,
  UserCheck,
  UserPlus,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Footprints,
  ShieldCheck,
  Star,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES, PERMISSIONS, ROLE_HUMAN_TITLES, DEMO_USERS } from '../../utils/constants';
import { formatCurrency, formatNumber, formatDate, timeAgo, getHumanGreeting } from '../../utils/formatters';

import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ProductDetailModal from '../products/ProductDetailModal';

export const Dashboard = () => {
  const { allProducts, analyticsData, loading } = useProduct();
  const { users, loginHistory, currentUser } = useAuth();
  const { activityLogs, hasPermission } = usePermission();
  const { isDark } = useTheme();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const userRole = currentUser?.role || ROLES.EMPLOYEE;
  const humanRoleTitle = ROLE_HUMAN_TITLES[userRole] || 'Team Specialist';

  // Counts for summary metrics
  const totalRecords = analyticsData.total || allProducts.length;
  const totalActiveRecords = analyticsData.active;
  const totalInactiveRecords = analyticsData.inactive;

  const totalManagers = useMemo(
    () => users.filter((u) => u.role === ROLES.MANAGER).length,
    [users]
  );
  const totalEmployees = useMemo(
    () => users.filter((u) => u.role === ROLES.EMPLOYEE).length,
    [users]
  );

  const recentActivitiesCount = activityLogs.length;
  const newRecordsThisMonth = Math.round(totalRecords * 0.18) + 4;
  const greeting = getHumanGreeting();

  // Grid stroke and axis colors matching current theme
  const gridStroke = isDark ? '#334155' : '#f1f5f9';
  const axisColor = isDark ? '#94a3b8' : '#64748b';

  // Custom Chart Tooltip with human formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 dark:bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 dark:border-slate-600">
          <p className="font-bold text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {label || payload[0]?.name}
          </p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-slate-300 mt-1">
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              {entry.name}: <span className="font-bold text-white">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const humanSummaryCards = [
    {
      label: 'Total Records',
      value: formatNumber(totalRecords),
      subtitle: 'Items active in our central catalog',
      icon: HeartHandshake,
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-50 dark:bg-brand-950/60 border-brand-100 dark:border-brand-900',
      badge: 'Curated Catalog',
    },
    {
      label: 'Total Active Records',
      value: formatNumber(totalActiveRecords),
      subtitle: 'Abundant stock ready for delivery (>10 units)',
      icon: Heart,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900',
      badge: 'In Stock',
    },
    {
      label: 'Total Inactive Records',
      value: formatNumber(totalInactiveRecords),
      subtitle: 'Low or empty stock requiring restock',
      icon: Smile,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-900',
      badge: 'Needs Restock',
    },
    {
      label: 'Total Managers',
      value: formatNumber(totalManagers),
      subtitle: 'Coordinating operational departments',
      icon: Briefcase,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-900',
      badge: 'Team Leads',
    },
    {
      label: 'Total Employees',
      value: formatNumber(totalEmployees),
      subtitle: 'Managing daily catalog fulfillment',
      icon: Users,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-100 dark:border-teal-900',
      badge: 'Specialists',
    },
    {
      label: 'Total Roles',
      value: '3 Roles',
      subtitle: 'Admin • Manager • Employee',
      icon: Crown,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-100 dark:border-purple-900',
      badge: 'RBAC Active',
    },
    {
      label: 'Recent Activities',
      value: formatNumber(recentActivitiesCount),
      subtitle: 'Audit actions recorded across the team',
      icon: Sparkles,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900',
      badge: 'Live Audit Trail',
    },
    {
      label: 'New Records This Month',
      value: formatNumber(newRecordsThisMonth),
      subtitle: 'New products introduced by staff',
      icon: UserPlus,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900',
      badge: '+18% Growth',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Warm Human Page Header */}
      <PageHeader
        title={`${greeting}, ${currentUser?.name?.split(' ')[0] || 'Colleague'}!`}
        subtitle="Here is your team's live operational pulse, catalog status, and human access control overview."
        badge={humanRoleTitle}
        badgeVariant={userRole === ROLES.ADMIN ? 'purple' : userRole === ROLES.MANAGER ? 'blue' : 'success'}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/products">
              <Button variant="secondary" size="sm" icon={HeartHandshake}>
                Browse Curated Catalog
              </Button>
            </Link>
            {hasPermission(PERMISSIONS.ANALYTICS, userRole) && (
              <Link to="/analytics">
                <Button variant="primary" size="sm" icon={Smile}>
                  Growth & Insights
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Human Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {humanSummaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-tight">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl border ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{card.subtitle}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{card.badge}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live Sync
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section: Pie, Bar, Line, Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Bar Chart: Catalog Distribution by Categories */}
        <Card
          title="Record Distribution by Category"
          subtitle="Volume of goods currently overseen by staff across departments"
          action={
            <Badge variant="blue" size="sm">
              Bar Chart • Record Distribution
            </Badge>
          }
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.categoryBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? '#475569' : '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? '#475569' : '#e2e8f0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  name="Curated Items"
                  fill="#0d9488"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Line Chart: 6-Month Catalog Growth */}
        <Card
          title="Monthly Growth Over Time"
          subtitle="How our collective inventory has grown over the past six months"
          action={
            <Badge variant="primary" size="sm">
              Line Chart • Monthly Growth
            </Badge>
          }
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData.monthlyGrowth}
                margin={{ top: 10, right: 15, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? '#475569' : '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? '#475569' : '#e2e8f0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="records"
                  name="Total Inventory"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0f766e' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  name="Ready for Delivery"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 3. Donut Chart: Inventory Status Breakdown */}
        <Card
          title="Status Distribution (Inventory Health)"
          subtitle="Proportion of items in good hands vs items needing attention"
          action={
            <Badge variant="warning" size="sm">
              Donut Chart • Status Distribution
            </Badge>
          }
        >
          <div className="h-72 w-full flex flex-col sm:flex-row items-center justify-center">
            <div className="w-full sm:w-1/2 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analyticsData.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 flex flex-col justify-center gap-3 pl-4">
              {analyticsData.statusDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{item.value} units</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 4. Pie Chart: Colleague Role Composition */}
        <Card
          title="Role Distribution Across Staff"
          subtitle="Balance of Executive Administrators, Department Leads, and Specialists"
          action={
            <Badge variant="purple" size="sm">
              Pie Chart • Role Distribution
            </Badge>
          }
        >
          <div className="h-72 w-full flex flex-col sm:flex-row items-center justify-center">
            <div className="w-full sm:w-1/2 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Administrators', value: users.filter((u) => u.role === ROLES.ADMIN).length, color: '#8b5cf6' },
                      { name: 'Team Managers', value: totalManagers, color: '#3b82f6' },
                      { name: 'Specialists', value: totalEmployees, color: '#10b981' },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 flex flex-col justify-center gap-3 pl-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Administrators</span>
                </div>
                <Badge variant="purple" size="sm">Full Policy</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Team Managers</span>
                </div>
                <Badge variant="blue" size="sm">Configurable</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Specialists</span>
                </div>
                <Badge variant="success" size="sm">Frontline Staff</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Curated Products Highlights: Click Any Product to View Full Specs */}
      <Card
        title="Featured Catalog Highlights (Click to Inspect)"
        subtitle="Click any product below to view detailed specifications, inventory health, and customer reviews"
        action={
          <Link
            to="/products"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 group"
          >
            <span>Explore Full Catalog ({allProducts.length})</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allProducts.slice(0, 4).map((p, idx) => {
            const curator = DEMO_USERS[idx % DEMO_USERS.length];
            return (
              <div
                key={p.id}
                onClick={() => handleOpenProduct(p)}
                className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/80 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                title={`Click to view full specifications for ${p.title}`}
              >
                <div>
                  <div className="h-32 w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 p-2 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800 mb-3 group-hover:scale-[1.03] transition-transform">
                    <img
                      src={p.thumbnail || p.images?.[0]}
                      alt={p.title}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <Badge variant="primary" size="sm">
                      {p.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{p.rating || 4.5}</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-1 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(p.price)}
                    </span>
                    {p.discountPercentage ? (
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold ml-1.5">
                        {p.discountPercentage}% off
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    View Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Colleague Activity Feed & Login History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Colleague Activities Feed (2 Cols) */}
        <div className="lg:col-span-2">
          <Card
            title="Recent Colleague Activities"
            subtitle="Live human audit trail of actions taken by team members"
            action={
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                Updated in real time
              </span>
            }
          >
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 7).map((log) => {
                const matchedUser = DEMO_USERS.find(
                  (u) => u.name.toLowerCase() === (log.user || '').toLowerCase()
                ) || DEMO_USERS[0];

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    <img
                      src={matchedUser.avatar}
                      alt={log.user}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {log.user}
                          </span>
                          <Badge role={log.role} size="sm" />
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                          <Footprints className="w-3 h-3" />
                          {timeAgo(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 font-medium">{log.action}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{log.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Top Department Categories & Human Workspace Health (1 Col) */}
        <div className="space-y-6">
          <Card
            title="Popular Product Categories"
            subtitle="Goods most frequently managed by staff"
          >
            <div className="space-y-3">
              {analyticsData.topCategories.map((cat, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{cat.count} items</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Workspace Health">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Public REST API:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Authentication:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Passkey & Password Active</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Permission Enforcement:</span>
                <span className="font-semibold text-purple-700 dark:text-purple-400">Dynamic RBAC Matrix</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Human Login History Table */}
      <Card
        title="Recent Colleague Sign-In History"
        subtitle="Chronological record of colleagues signing in with Windows Hello, Fingerprint, or Password"
        action={
          <Badge variant="default" size="sm">
            Security Audit
          </Badge>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Colleague</th>
                <th className="py-2.5 px-3">Role Tier</th>
                <th className="py-2.5 px-3">Sign-In Method</th>
                <th className="py-2.5 px-3">Client / Browser</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loginHistory.slice(0, 6).map((item) => {
                const matched = DEMO_USERS.find(
                  (u) => u.name.toLowerCase() === (item.userName || '').toLowerCase()
                ) || DEMO_USERS[0];

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={matched.avatar}
                          alt={item.userName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{item.userName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge role={item.role} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-[11px]">
                        {item.method || 'Password'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{item.browser}</td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{timeAgo(item.timestamp)}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.status.includes('Success')
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Dashboard;
