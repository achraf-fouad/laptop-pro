import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ChevronRight, CreditCard } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  const categories = [
    { label: 'PC Portables', to: '/products?category=laptops' },
    { label: 'Ecrans & Moniteurs', to: '/products?category=screens' },
    { label: 'Périphériques PC', to: '/products?category=peripherals' },
    { label: 'Gaming PC', to: '/products?category=gaming' },
    { label: 'Imprimantes', to: '/products?category=printers' },
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-4 mb-20 text-start">
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <Link to="/" className="group flex items-center gap-2.5 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <span className="text-2xl font-black italic text-white flex items-center justify-center">CA</span>
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter text-white">
                  Computer <span className="text-primary italic">Access</span>
              </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  MAROC TECHNOLOGY
                </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-sm">
              VOTRE PARTENAIRE DE CONFIANCE POUR TOUT VOTRE MATÉRIEL INFORMATIQUE ET GAMING AU MAROC. QUALITÉ, PERFORMANCE ET SERVICE APRÈS-VENTE D’EXCELLENCE.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8 border-l-4 border-primary pl-4">Nos Rayons</h3>
            <ul className="space-y-4">
              {categories.map((cat, i) => (
                <li key={i}>
                  <Link to={cat.to} className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-all flex items-center gap-2 group">
                    <ChevronRight className="h-3 w-3 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8 border-l-4 border-primary pl-4">Infos Utiles</h3>
            <ul className="space-y-4">
              {['A propos', 'Espace Client', 'Suivre ma commande', 'Modes de livraison', 'CGV & Mentions légales'].map((link, i) => (
                <li key={i}>
                  <Link to="#" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-all flex items-center gap-2 group">
                    <ChevronRight className="h-3 w-3 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8 border-l-4 border-primary pl-4">Contact</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Siège Social</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">Casablanca, Maarif, Rue des Technologie 20450</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Service Client</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">+212 5 22 45 45 45</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Support Email</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-white italic">contact@computeraccess.ma</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 text-center md:text-start">
            © 2026 COMPUTER ACCESS. TOUS DROITS RÉSERVÉS. DESIGNED FOR PERFORMANCE.
          </p>
          <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             <CreditCard className="h-6 w-6" />
             <div className="flex items-center gap-2 font-black italic tracking-tighter">
                <span className="text-xl">VISA</span>
                <span className="h-4 w-px bg-white/20" />
                <span className="text-xl">MASTERCARD</span>
                <span className="h-4 w-px bg-white/20" />
                <span className="text-xl text-primary">CMI</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
