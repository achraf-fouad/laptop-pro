import { useState } from 'react';
import { products } from '@/data/products';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

const AdminProducts = () => {
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.name.en.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const stockBadge = (stock: string) => {
    const map: Record<string, string> = {
      in_stock: 'bg-success/10 text-success',
      low_stock: 'bg-warning/10 text-warning',
      out_of_stock: 'bg-destructive/10 text-destructive',
    };
    const label: Record<string, string> = {
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
    };
    return (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${map[stock] || ''}`}>
        {label[stock] || stock}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background ps-9 pe-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
          />
        </div>
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 text-start">Product</th>
              <th className="px-4 py-3 text-start">Category</th>
              <th className="px-4 py-3 text-start">Brand</th>
              <th className="px-4 py-3 text-end">Price</th>
              <th className="px-4 py-3 text-start">Stock</th>
              <th className="px-4 py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium text-foreground line-clamp-1">{p.name.en}</span>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                <td className="px-4 py-3 text-end font-medium text-foreground">{p.price.toLocaleString()} DH</td>
                <td className="px-4 py-3">{stockBadge(p.stock)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
