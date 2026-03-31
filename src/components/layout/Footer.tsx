import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Instagram , Mail, Phone, MapPin, ChevronRight, CreditCard } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  const categories = [
    { label: t('categories.laptops'), to: '/products?category=laptops-portables' },
    { label: t('categories.pcComponents'), to: '/products?category=pc-components' },
    { label: t('categories.spareParts'), to: '/products?category=spare-parts' },
    { label: t('categories.monitors'), to: '/products?category=screens-monitors' },
    { label: t('categories.peripherals'), to: '/products?category=pc-peripherals' },
    { label: t('categories.chairs'), to: '/products?category=chairs' },
    { label: t('categories.bags'), to: '/products?category=bags-cases' },
    { label: t('categories.storage'), to: '/products?category=storage' },
    { label: t('categories.cables'), to: '/products?category=cables' },
    { label: t('categories.printers'), to: '/products?category=printers-scanners' },
    { label: t('categories.gaming'), to: '/products?category=consoles-gaming' },
    { label: t('categories.camera'), to: '/products?category=camera-universe' },
  ];

  const usefulLinks = [
    { label: t('footer.about'), to: '/#about' },
    { label: t('footer.account'), to: '#' },
    { label: t('footer.trackOrder'), to: '#' },
    { label: t('footer.deliveryModes'), to: '#' },
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-4 mb-20 text-start">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="group flex items-center gap-2.5 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <span className="text-2xl font-black italic text-white flex items-center justify-center">ML</span>
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter text-white">
                Maroc <span className="text-primary italic">Laptop</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                {t('footer.brandSub')}
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-sm">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4">
              <a href="https://web.facebook.com/profile.php?id=61583715811645" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8 border-l-4 border-primary pl-4">{t('footer.categories')}</h3>
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
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8 border-l-4 border-primary pl-4">{t('footer.usefulLinks')}</h3>
            <ul className="space-y-4">
              {usefulLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-all flex items-center gap-2 group">
                    <ChevronRight className="h-3 w-3 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8 border-l-4 border-primary pl-4">{t('footer.contactLabel')}</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{t('footer.headquarters')}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">Casablanca, Derb Ghallef, Souk Selk</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{t('footer.customerService')}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">+212 644-459980</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{t('footer.supportEmail')}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-white italic">contact@MarocLaptop.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 text-center md:text-start">
            {t('footer.rights')}
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
