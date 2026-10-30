import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Sparkles,
  Heart,
  Users,
  Eye,
  Footprints,
  HelpingHand,
  CheckCircle2,
  Smile,
} from 'lucide-react';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES } from '../../utils/constants';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export const Analytics = () => {
  const { analyticsData, allProducts } = useProduct();
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const [timeRange, setTimeRange] = useState('30d');

  const gridStroke = isDark ? '#334155' : '#f1f5f9';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const axisLineColor = isDark ? '#334155' : '#e2e8f0';
  const targetBarColor = isDark ? '#334155' : '#e2e8f0';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white text-xs p-2.5 rounded-lg shadow-xl border border-slate-700 dark:border-slate-800 backdrop-blur-xs">
          <p className="font-semibold text-slate-200">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-slate-300 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name}: <span className="font-bold text-white">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Colleague Insights & Human Analytics"
        subtitle="Multi-dimensional trend analysis, team throughput metrics, and catalog vitality intelligence."
        badge="Human Insights"
        badgeVariant="blue"
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 text-xs">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${timeRange === range
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={HelpingHand}
              onClick={() => window.print()}
            >
              Export View
            </Button>
          </div>
        }
      />

      {/* Analytics KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-brand-600 to-teal-700 text-white p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-brand-100 text-xs">
            <span>Catalog Vitality Index</span>
            <Heart className="w-4 h-4 text-brand-200" />
          </div>
          <div className="text-3xl font-extrabold mt-2 tracking-tight">94.8%</div>
          <p className="text-xs text-brand-100 mt-1">
            +3.2% operational care across active curated items
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Human Team Throughput</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            1,420 <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+18%</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Daily REST calls coordinated by colleagues</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Colleague Trust Permissions</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            9 Matrix Rules
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamically evaluated on every route & UI action
          </p>
        </div>
      </div>

      {/* Main Charts: Activity Trend Area Chart & Monthly Growth Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Activity Trend (Dispatched CRUD Operations)"
          subtitle="Reads, Writes, and Updates dispatched by client sessions this week"
          action={<Badge variant="primary" size="sm">Area Chart • Activity Trend</Badge>}
        >
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData.activityTrend}
                margin={{ top: 10, right: 15, left: -20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorReads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorWrites" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={{ stroke: axisLineColor }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={{ stroke: axisLineColor }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="reads"
                  name="Read / Query Ops"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReads)"
                />
                <Area
                  type="monotone"
                  dataKey="writes"
                  name="Create / Delete Ops"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWrites)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Growth Projection vs Capacity"
          subtitle="Monthly record addition trajectory against capacity targets"
          action={<Badge variant="blue" size="sm">Bar Chart</Badge>}
        >
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.monthlyGrowth}
                margin={{ top: 10, right: 15, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={{ stroke: axisLineColor }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={{ stroke: axisLineColor }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar
                  dataKey="records"
                  name="Actual Inventory"
                  fill="#0284c7"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="target"
                  name="Capacity Target"
                  fill={targetBarColor}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

