import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  PackageCheck,
  CreditCard,
  Download,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Order, OrderStatus } from '@/types/order';

const statusConfig: Record<OrderStatus, { label: string, color: string, icon: any }> = {
  pending: { label: 'En attente', color: 'bg-warning/10 text-warning border-warning/20', icon: Calendar },
  paid: { label: 'Payé', color: 'bg-success/10 text-success border-success/20', icon: CreditCard },
  shipped: { label: 'Expédié', color: 'bg-info/10 text-info border-info/20', icon: Truck },
  delivered: { label: 'Livré', color: 'bg-primary/10 text-primary border-primary/20', icon: PackageCheck },
  cancelled: { label: 'Annulé', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders', {
        params: {
          status: statusFilter,
          search: search
        }
      });
      // Handle Laravel Pagination or simple array
      const data = response.data.data || response.data;
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: number, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      toast.success('Statut mis à jour');
      fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-[1] mb-2 italic">Gestion <span className="text-primary">Commandes</span></h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">SUIVEZ ET GÉREZ VOS VENTES EN TEMPS RÉEL</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-xl bg-white border-border/50 text-[10px] font-black uppercase tracking-widest gap-2 shadow-sm">
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
        <form onSubmit={handleSearch} className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="RECHERCHER PAR CLIENT, N° COMMANDE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/30 border-none rounded-xl pl-12 pr-4 py-3.5 text-xs font-black uppercase tracking-widest placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20"
          />
        </form>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-xl bg-secondary/50 border-none px-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">TOUS LES STATUTS</option>
            <option value="pending">EN ATTENTE</option>
            <option value="paid">PAYÉ</option>
            <option value="shipped">EXPÉDIÉ</option>
            <option value="delivered">LIVRÉ</option>
            <option value="cancelled">ANNULÉ</option>
          </select>
          <button onClick={fetchOrders} className="h-12 w-12 flex items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-border/40 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm font-medium">
          <thead>
            <tr className="bg-secondary/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-border/20">
              <th className="px-8 py-5 text-start">Commande</th>
              <th className="px-8 py-5 text-start">Client</th>
              <th className="px-8 py-5 text-end">Total</th>
              <th className="px-8 py-5 text-start">Statut</th>
              <th className="px-8 py-5 text-start">Date</th>
              <th className="px-8 py-5 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {loading ? (
              <tr><td colSpan={6} className="py-24 text-center"><RefreshCw className="h-10 w-10 animate-spin mx-auto text-primary opacity-20" /></td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="py-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Aucune commande trouvée</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-xs font-black italic tracking-tighter text-primary">#{o.id.toString().padStart(6, '0')}</span>
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">{o.payment_method || 'Paiement à la livraison'}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{o.customer_name}</span>
                      <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">{o.customer_phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-end font-black italic tracking-tighter text-primary">
                    {parseFloat(o.total_amount.toString()).toLocaleString()} DH
                  </td>
                  <td className="px-8 py-5">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest",
                      statusConfig[o.status].color
                    )}>
                      {statusConfig[o.status].label}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-end">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedOrder(o)} className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl overflow-hidden rounded-3xl p-0 border-none shadow-2xl">
          <div className="bg-[#0a0a0a] text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                  Détails <span className="text-primary italic">Commande</span>
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">RECUE LE {selectedOrder && new Date(selectedOrder.created_at).toLocaleDateString()}</p>
              </div>
              {selectedOrder && (
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/10 text-white",
                )}>
                  #{selectedOrder.id.toString().padStart(6, '0')}
                </div>
              )}
            </div>
          </div>

          {selectedOrder && (
            <div className="p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary italic border-b border-primary/10 pb-2">Informations Client</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Nom Complet</p>
                      <p className="text-sm font-black uppercase">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Téléphone</p>
                      <p className="text-sm font-bold tracking-widest">{selectedOrder.customer_phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Adresse de livraison</p>
                      <p className="text-sm font-medium leading-relaxed">{selectedOrder.shipping_address}</p>
                    </div>
                    <div className="col-span-2">
                      <a
                        href={`https://wa.me/${selectedOrder.customer_phone.startsWith('0') ? '212' + selectedOrder.customer_phone.substring(1) : selectedOrder.customer_phone.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full h-11 rounded-xl bg-[#25D366] text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-xl shadow-[#25D366]/20"
                      >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Contacter sur WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary italic border-b border-primary/10 pb-2">Statut & Paiement</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-2">Changer le statut</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(statusConfig).map((st) => (
                          <button
                            key={st}
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(selectedOrder.id, st as OrderStatus)}
                            className={cn(
                              "h-10 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all",
                              selectedOrder.status === st
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "bg-secondary/30 text-muted-foreground border-transparent hover:bg-secondary/50"
                            )}
                          >
                            {statusConfig[st as OrderStatus].label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-secondary/20 border border-border/20">
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Mode de Paiement</p>
                      <p className="text-xs font-black uppercase tracking-widest text-primary italic">{selectedOrder.payment_method || 'Paiement à la livraison'}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4 pt-4 border-t border-border/40">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary italic">Articles Commandés</h3>
                  <div className="rounded-2xl border border-border/40 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-secondary/20 font-black uppercase tracking-widest text-[9px]">
                        <tr>
                          <th className="px-6 py-3 text-start">Produit</th>
                          <th className="px-6 py-3 text-center">Qté</th>
                          <th className="px-6 py-3 text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {selectedOrder.items?.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-black uppercase tracking-widest">{item.product ? item.product.name.fr : 'Produit supprimé'}</span>
                                <span className="text-[9px] text-muted-foreground mt-0.5">{parseFloat(item.price.toString()).toLocaleString()} DH</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center font-black italic">x{item.quantity}</td>
                            <td className="px-6 py-4 text-end font-black italic text-primary">{(item.price * item.quantity).toLocaleString()} DH</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-primary/5">
                        <tr>
                          <td colSpan={2} className="px-6 py-4 text-end text-[10px] font-black uppercase tracking-widest">Total Global</td>
                          <td className="px-6 py-4 text-end font-black text-lg italic text-primary tracking-tighter">{parseFloat(selectedOrder.total_amount.toString()).toLocaleString()} DH</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
