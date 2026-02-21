import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { revenueData, categoryBreakdown, mockOrders } from '@/data/adminMockData';
import { products } from '@/data/products';

const stats = [
  { label: 'Total Revenue', value: '2,430,000 DH', change: '+12.5%', up: true, icon: TrendingUp, color: 'text-primary' },
  { label: 'Orders', value: '299', change: '+8.2%', up: true, icon: ShoppingCart, color: 'text-accent' },
  { label: 'Products', value: String(products.length), change: '0', up: true, icon: Package, color: 'text-warning' },
  { label: 'Customers', value: '187', change: '+15.3%', up: true, icon: Users, color: 'text-success' },
];

const AdminDashboard = () => {
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{s.value}</p>
            <div className="mt-1 flex items-center gap-1 text-xs font-medium">
              {s.up ? (
                <ArrowUpRight className="h-3 w-3 text-success" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-destructive" />
              )}
              <span className={s.up ? 'text-success' : 'text-destructive'}>{s.change}</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <h3 className="font-display text-base font-semibold text-foreground">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground">Last 6 months</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215,15%,70%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,15%,70%)" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString()} DH`, 'Revenue']}
                  contentStyle={{ borderRadius: 8, border: '1px solid hsl(214,20%,90%)', fontSize: 13 }}
                />
                <Bar dataKey="revenue" fill="hsl(213,94%,48%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display text-base font-semibold text-foreground">Sales by Category</h3>
          <p className="text-sm text-muted-foreground">Revenue share</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} contentStyle={{ borderRadius: 8, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.fill }} />
                {c.name} ({c.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <h3 className="font-display text-base font-semibold text-foreground">Recent Orders</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-start text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pe-4 text-start">Order</th>
                <th className="pb-3 pe-4 text-start">Customer</th>
                <th className="pb-3 pe-4 text-start">Status</th>
                <th className="pb-3 text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pe-4 font-medium text-foreground">{o.id}</td>
                  <td className="py-3 pe-4 text-muted-foreground">{o.customer}</td>
                  <td className="py-3 pe-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-3 text-end font-medium text-foreground">{o.total.toLocaleString()} DH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  processing: 'bg-primary/10 text-primary',
  shipped: 'bg-accent/10 text-accent',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[status] || ''}`}>
    {status}
  </span>
);

export default AdminDashboard;
