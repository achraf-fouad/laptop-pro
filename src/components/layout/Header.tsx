import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ShoppingCart, Menu, X, ChevronRight, Search, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const categories = [
    { id: 'laptops', label: t('nav.laptops'), to: '/products?category=laptops' },
    { id: 'screens', label: t('nav.screens'), to: '/products?category=screens' },
    { id: 'peripherals', label: t('nav.peripherals'), to: '/products?category=peripherals' },
    { id: 'gaming', label: t('nav.gaming'), to: '/products?category=gaming' },
    { id: 'printers', label: t('nav.printers'), to: '/products?category=printers' },
  ];

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/products', label: t('nav.products') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname + location.search === to;
  };

  return (
    <div className="flex flex-col">
      {/* Top Bar */}
      <div className="bg-primary px-4 py-2 text-primary-foreground text-xs hidden lg:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Phone className="h-3.5 w-3.5" />
              <span>+212 6 69 97 34 83</span>
            </div>
            <a href="mailto:contact@computeraccess.ma" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="h-3 w-3" />
              <span>contact@computeraccess.ma</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link>
            <Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link>            
          </div>
        </div>
      </div>

      <header
        className={`z-50 transition-all duration-300 ${
          scrolled ? 'sticky top-0 bg-card shadow-md border-b' : 'bg-card'
        }`}
      >
        {/* Main Header */}
        <div className="border-b border-border">
          <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8 gap-8">
            <Link to="/" className="group flex items-center gap-2.5 shrink-0">
              <div className="flex h-12 w-12 items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20">
                <span className="text-2xl font-black italic text-white flex items-center justify-center">CA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black uppercase tracking-tighter">
                  Computer <span className="text-primary italic">Access</span>
                </span>
                <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:block">
                  High-End Solutions
                </span>
              </div>
            </Link>

            <div className="hidden flex-1 max-w-2xl lg:flex items-center relative">
              <div className={`flex flex-1 items-center rounded-full bg-secondary/80 border transition-all duration-200 px-4 py-1 ${isSearchFocused ? 'border-primary ring-4 ring-primary/10' : 'border-transparent'}`}>
                <Search className="h-4 w-4 text-muted-foreground mr-3" />
                <input 
                  type="text"
                  placeholder={t('nav.search')}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm h-10 placeholder:text-muted-foreground/60"
                />
                <button className="bg-primary text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-primary/90 transition-colors ml-2">
                  {t('nav.searchBtn')}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <Link to="/cart" className="flex flex-col items-center gap-0.5 group px-2 relative text-foreground">
                <div className="rounded-full p-2.5 bg-secondary/80 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-black text-accent-foreground border-2 border-card">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors uppercase">{t('nav.cart')}</span>
              </Link>
              <LanguageSwitcher />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-full bg-secondary/80 p-2.5 text-foreground lg:hidden hover:bg-primary hover:text-white transition-all"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Categories Nav */}
        <div className="hidden lg:block border-b border-border py-3 bg-card shadow-sm">
          <div className="container mx-auto px-8">
            <nav className="flex items-center gap-10">
              <Link to="/products" className="flex items-center gap-2 group">
                <Menu className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-wide group-hover:text-primary transition-colors">{t('nav.allCatalog')}</span>
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={cat.to}
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors pb-1 border-b-2 border-transparent hover:border-primary"
                >
                  {cat.label}
                </Link>
              ))}
              <div className="ml-auto">
                <Link 
                  to="/promotions" 
                  className="flex items-center gap-2 text-xs font-black text-destructive uppercase tracking-widest animate-pulse"
                >
                  <span className="flex h-2 w-2 rounded-full bg-destructive" />
                  {t('nav.flashSales')}
                </Link>
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-border bg-card md:hidden"
            >
              <nav className="flex flex-col gap-0.5 p-3">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? 'bg-primary/5 text-primary'
                        : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                ))}
                <div className="h-px bg-border my-2 mx-4" />
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={cat.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  >
                    <span>{cat.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

export default Header;
