import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Search,
  RefreshCw,
  Download,
  User as UserIcon,
  ShoppingBag,
  CreditCard,
  Trash2,
  Eye,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { User, Order } from '@/types/order';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      // For Paginated response
      setCustomers(data.data || data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteClient = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ? Toutes ses données seront perdues.')) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success('Client supprimé avec succès');
      fetchCustomers();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-[1] mb-2 italic">Gestion <span className="text-primary">Clients</span></h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">GÉREZ VOTRE BASE DE DONNÉES CLIENTS</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-xl bg-white border-border/50 text-[10px] font-black uppercase tracking-widest gap-2 shadow-sm">
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="RECHERCHER PAR NOM, EMAIL, TÉLÉPHONE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/30 border-none rounded-xl pl-12 pr-4 py-3.5 text-xs font-black uppercase tracking-widest placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button onClick={fetchCustomers} className="h-12 w-12 flex items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
      </div>

      <div className="rounded-3xl border border-border/40 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-border/20">
              <th className="px-8 py-5 text-start">Client</th>
              <th className="px-8 py-5 text-start">Contact</th>
              <th className="px-8 py-5 text-center">Commandes</th>
              <th className="px-8 py-5 text-end">Total Dépensé</th>
              <th className="px-8 py-5 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {loading ? (
              <tr><td colSpan={5} className="py-24 text-center"><RefreshCw className="h-10 w-10 animate-spin mx-auto text-primary opacity-20" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Aucun client trouvé</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black italic">
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{c.name}</span>
                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">DEPUIS LE {new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">{c.email}</span>
                      <span className="text-[10px] text-muted-foreground">{c.phone || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="inline-flex h-8 min-w-[32px] items-center justify-center px-2 rounded-lg bg-secondary/50 border border-border/20 text-[10px] font-black text-primary italic">
                      {c.orders_count || 0}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-end font-black italic tracking-tighter text-primary">
                    {(c.total_spent || 0).toLocaleString()} DH
                  </td>
                  <td className="px-8 py-5 text-end">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedUser(c)} className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-all">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteClient(c.id)} className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-destructive hover:text-white transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-3xl p-0 border-none shadow-2xl">
          <div className="bg-[#0a0a0a] text-white p-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">
              Profil <span className="text-primary italic">Client</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">GOUVERNANCE DES DONNÉES UTILISATEUR</p>
          </div>

          {selectedUser && (
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-5 pb-6 border-b border-border/40">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-black italic shadow-xl shadow-primary/20">
                  {selectedUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black uppercase tracking-tighter leading-none mb-1">{selectedUser.name}</span>
                  <span className="text-xs font-bold text-muted-foreground">{selectedUser.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/20 p-4 rounded-2xl border border-border/20">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Commandes</span>
                  </div>
                  <p className="text-xl font-black italic text-primary leading-none">{selectedUser.orders_count || 0}</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-2xl border border-border/20">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Dépensé</span>
                  </div>
                  <p className="text-xl font-black italic text-primary leading-none">{(selectedUser.total_spent || 0).toLocaleString()} <span className="text-[10px]">DH</span></p>
                </div>
                <div className="col-span-2 bg-secondary/20 p-4 rounded-2xl border border-border/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Membre depuis</span>
                  </div>
                  <p className="text-sm font-black uppercase leading-none">{new Date(selectedUser.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button className="flex-1 h-12 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                  Historique Complet
                </Button>
                <Button onClick={() => handleDeleteClient(selectedUser.id)} variant="outline" className="h-12 w-12 rounded-xl border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
