import { useState } from 'react';
import { mockOrders } from '@/data/adminMockData';
import { Search, Filter } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  processing: 'bg-primary/10 text-primary',
  shipped: 'bg-accent/10 text-accent',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const AdminOrders = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockOrders.filter((o) => {
    const matchesSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background ps-9 pe-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 text-start">Order ID</th>
              <th className="px-4 py-3 text-start">Customer</th>
              <th className="px-4 py-3 text-start">City</th>
              <th className="px-4 py-3 text-center">Items</th>
              <th className="px-4 py-3 text-end">Total</th>
              <th className="px-4 py-3 text-start">Status</th>
              <th className="px-4 py-3 text-start">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{o.id}</td>
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium text-foreground">{o.customer}</span>
                    <p className="text-xs text-muted-foreground">{o.phone}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{o.city}</td>
                <td className="px-4 py-3 text-center text-muted-foreground">{o.items}</td>
                <td className="px-4 py-3 text-end font-medium text-foreground">{o.total.toLocaleString()} DH</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[o.status] || ''}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
