import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
  { to: '/admin/products', icon: Package, label: 'Produits' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
  { to: '/admin/customers', icon: Users, label: 'Clients' },
  { to: '/admin/reviews', icon: Bell, label: 'Avis Clients' },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const isActive = (to: string, end?: boolean) => {
    if (end) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white">
      {/* Brand */}
      <div className="flex h-20 items-center gap-3 border-b border-white/5 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
          <span className="text-lg font-black italic text-white flex items-center justify-center">CA</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black uppercase tracking-tighter">
            Computer <span className="text-primary italic">Access</span>
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
            Control Panel
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6">
         <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
               <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
               <span className="text-xs font-black uppercase tracking-widest truncate">Administrateur</span>
            </div>
         </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1.5 p-4 overflow-y-auto">
        <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Menu Principal</p>
        {navItems.map((item) => {
          const active = isActive(item.to, item.end);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-4 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 group',
                active
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1'
                  : 'text-white/40 hover:bg-white/5 hover:text-white hover:translate-x-1'
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", active ? "text-white" : "text-white/20 group-hover:text-primary")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
      </nav>

      {/* Footer Actions */}
      <div className="p-4 mt-auto space-y-2">
        <Link
          to="/"
          className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-[0.11em] text-white/60 bg-white/5 hover:bg-white/10 transition-all group"
        >
          <ArrowLeft className="h-5 w-5 text-white/20 group-hover:text-primary transition-transform group-hover:-translate-x-1" />
          <span>Boutique</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-[0.15em] text-destructive/60 hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-foreground font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 flex-col md:flex shadow-2xl z-50">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex h-full w-80 flex-col bg-card"
            >
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top bar */}
        <header className="flex h-20 items-center justify-between bg-white px-6 md:px-10 border-b border-border/50 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2.5 bg-secondary text-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="md:hidden font-black uppercase tracking-tighter text-xl italic">
              Dashboard
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-3 bg-secondary/50 rounded-full text-muted-foreground hover:bg-primary hover:text-white transition-all group">
               <Link to="/admin/orders">
                  <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
               </Link>
               <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-border mx-2" />
            <div className="flex items-center gap-4 pl-2">
               <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Super Admin</span>
                  <span className="text-[8px] font-bold text-success uppercase tracking-widest">En Ligne</span>
               </div>
               <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">
                  AD
               </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa]">
           <div className="min-h-full">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
