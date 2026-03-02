import { Package, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, Users, CreditCard, Calendar, ChevronRight, MoreVertical } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Stats {
  total_sales: number;
  orders_count: number;
  products_count: number;
  pending_orders: number;
}

interface SaleData {
  date: string;
  total: number;
}

interface Order {
  id: number;
  customer_name: string;
  status: string;
  total_amount: string;
  created_at?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, salesRes, ordersRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/sales-graph'),
        api.get('/orders')
      ]);
      setStats(statsRes.data);
      setSalesData(salesRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOrderAction = async (id: number, action: 'confirm' | 'decline') => {
    try {
      await api.post(`/orders/${id}/${action}`);
      toast.success(`Commande ${action === 'confirm' ? 'confirmée' : 'annulée'}`);
      fetchData();
    } catch (error) {
      toast.error('L\'action a échoué');
    }
  };

  const statCards = [
    { label: 'Chiffre d\'Affaires', value: `${(stats?.total_sales || 0).toLocaleString()} DH`, change: '+8.2%', up: true, icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Commandes Totales', value: String(stats?.orders_count || 0), change: '+4.1%', up: true, icon: ShoppingCart, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Catalogue Produits', value: String(stats?.products_count || 0), change: '0%', up: true, icon: Package, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Commandes En Attente', value: String(stats?.pending_orders || 0), change: '-2.4%', up: false, icon: RefreshCw, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  if (loading) return (
    <div className="flex flex-col h-[600px] items-center justify-center">
       <RefreshCw className="h-12 w-12 animate-spin text-primary opacity-20 mb-4" />
       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Synchronisation des données...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-[1] mb-2 italic">Aperçu <span className="text-primary">Général</span></h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">PERFORMANCE DE VOTRE ACTIVITÉ EN TEMPS RÉEL</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground shadow-sm">
               <Calendar className="h-4 w-4" />
               Derniers 30 Jours
            </div>
            <button 
              onClick={fetchData} 
              className="p-3 bg-white rounded-xl border border-border/50 hover:bg-secondary transition-all shadow-sm group"
            >
               <RefreshCw className="h-4 w-4 text-muted-foreground group-hover:rotate-180 transition-transform duration-500" />
            </button>
         </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="group relative overflow-hidden rounded-3xl border border-border/40 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-secondary/30 scale-150 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("rounded-2xl p-4 transition-transform group-hover:scale-110 duration-300", s.bg, s.color)}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div className={cn("flex items-center gap-1 text-[10px] font-black tracking-widest uppercase", s.up ? 'text-success' : 'text-destructive')}>
                    {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {s.change}
                  </div>
                </div>
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{s.label}</h3>
                    <p className="text-2xl font-black text-foreground italic tracking-tight italic">{s.value}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-border/40 bg-white p-8 shadow-sm">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic">Analyse des <span className="text-primary">Revenus</span></h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">ÉVOLUTION QUOTIDIENNE DES VENTES</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary">VENTES DIRECTES</span>
               </div>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(215, 90%, 40%)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(215, 90%, 40%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 900 }} 
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 900 }}
                  tickFormatter={(v) => `${v.toLocaleString()}`} 
                />
                <Tooltip
                  cursor={{ stroke: 'hsl(215, 90%, 40%)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    backgroundColor: '#0a0a0a',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    color: '#fff',
                    padding: '12px'
                  }}
                  labelStyle={{ fontSize: '10px', fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 900, color: 'hsl(215, 90%, 40%)', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(215, 90%, 40%)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories or other info */}
        {/*<div className="rounded-3xl border border-border/40 bg-[#0a0a0a] p-8 shadow-sm flex flex-col">
            <div className="mb-10">
              <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">Objectifs <span className="text-primary text-2xl">•</span></h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">SUIVI DES VENTES MENSUELLES</p>
            </div>
            
            <div className="space-y-10 flex-1 flex flex-col justify-center">
                {[
                  { label: 'PC Portables', value: 85, color: 'bg-primary' },
                  { label: 'Gaming PC', value: 65, color: 'bg-accent' },
                  { label: 'Périphériques', value: 45, color: 'bg-warning' },
                ].map(cat => (
                  <div key={cat.label} className="space-y-3">
                     <div className="flex justify-between items-end">
                        <span className="text-xs font-black uppercase tracking-widest text-white">{cat.label}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{cat.value}% DU QUOTA</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${cat.value}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={cn("h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]", cat.color)} 
                        />
                     </div>
                  </div>
                ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-white/5">
                <button className="w-full flex items-center justify-between text-white/40 hover:text-white transition-colors group">
                   <span className="text-[10px] font-black uppercase tracking-widest">Voir le rapport détaillé</span>
                   <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>*/}
      </div>

      {/* Recent orders */}
      <div className="rounded-3xl border border-border/40 bg-white p-0 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border/40 flex items-center justify-between">
           <div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic">Dernières <span className="text-primary italic">Commandes</span></h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">ACTIONS REQUISES SUR LES NOUVEAUX ACHATS</p>
           </div>
           <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">Afficher tout</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                <th className="px-8 py-5 text-start font-black">Réf. Commande</th>
                <th className="px-8 py-5 text-start font-black">Client</th>
                <th className="px-8 py-5 text-start font-black">Date</th>
                <th className="px-8 py-5 text-start font-black">Statut</th>
                <th className="px-8 py-5 text-end font-black">Montant</th>
                <th className="px-8 py-5 text-end font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-xs font-black uppercase tracking-tighter text-foreground">#{o.id.toString().padStart(6, '0')}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest text-foreground">{o.customer_name}</span>
                      <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Contact Direct</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Aujourd'hui</span>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-8 py-5 text-end">
                    <span className="text-sm font-black italic tracking-tighter text-primary">{parseFloat(o.total_amount).toLocaleString()} DH</span>
                  </td>
                  <td className="px-8 py-5 text-end">
                    {o.status === 'pending' ? (
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOrderAction(o.id, 'confirm')} 
                          className="px-3 py-1.5 bg-success text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-success/10 hover:scale-110 transition-transform"
                        >
                          Valider
                        </button>
                        <button 
                          onClick={() => handleOrderAction(o.id, 'decline')} 
                          className="px-3 py-1.5 bg-destructive text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-destructive/10 hover:scale-110 transition-transform"
                        >
                          Refuser
                        </button>
                      </div>
                    ) : (
                      <button className="p-2 text-muted-foreground/30 hover:text-foreground">
                         <MoreVertical className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
                      Aucune commande récente à afficher
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  confirmed: 'bg-success/10 text-success border-success/20',
  declined: 'bg-destructive/10 text-destructive border-destructive/20',
  shipped: 'bg-accent/10 text-accent border-accent/20',
  delivered: 'bg-success/10 text-success border-success/20',
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-[8px] font-black uppercase tracking-widest", statusColors[status] || 'bg-secondary text-muted-foreground border-border')}>
    <div className={cn("h-1 w-1 rounded-full mr-1.5", status === 'pending' ? 'bg-warning animate-pulse' : 'bg-current')} />
    {status === 'pending' ? 'En Attente' : 
     status === 'confirmed' ? 'Confirmée' : 
     status === 'declined' ? 'Annulée' : status}
  </span>
);

export default AdminDashboard;
