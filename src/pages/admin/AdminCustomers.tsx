import { useState } from 'react';
import { mockCustomers } from '@/data/adminMockData';
import { Search, Mail, Phone } from 'lucide-react';

const AdminCustomers = () => {
  const [search, setSearch] = useState('');

  const filtered = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-background ps-9 pe-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
        />
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">{c.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.city}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {c.orders} orders
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span>{c.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span>{c.phone}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="font-display text-sm font-semibold text-foreground">{c.totalSpent.toLocaleString()} DH</p>
              </div>
              <div className="text-end">
                <p className="text-xs text-muted-foreground">Last Order</p>
                <p className="text-xs font-medium text-foreground">{c.lastOrder}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">No customers found.</p>
      )}
    </div>
  );
};

export default AdminCustomers;
