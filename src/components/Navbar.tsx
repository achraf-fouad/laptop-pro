import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { totalItems } = useCart();
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    {
      label: t('nav.laptops'),
      href: '/laptops',
      dropdown: [
        { label: t('nav.allLaptops'), href: '/laptops' },
        { label: t('nav.refurbished'), href: '/laptops?condition=Refurbished' },
        { label: t('nav.newLaptops'), href: '/laptops?condition=New' },
        { label: t('nav.business'), href: '/laptops?tag=business' },
      ],
    },
    {
      label: t('nav.partsAccessories'),
      href: '/parts',
      dropdown: [
        { label: t('nav.allParts'), href: '/parts' },
        { label: t('nav.batteries'), href: '/parts?tag=battery' },
        { label: t('nav.screens'), href: '/parts?tag=screen' },
        { label: t('nav.storageRam'), href: '/parts?tag=upgrade' },
        { label: t('nav.chargers'), href: '/parts?tag=charger' },
      ],
    },
    { label: t('nav.repairServices'), href: '/services' },
    { label: t('nav.about'), href: '/about' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-secondary text-secondary-foreground py-1.5 text-xs text-center font-medium tracking-wide">
        {t('topBar')} <a href="tel:+15551234567" className="underline underline-offset-2">+1 (555) 123-4567</a>
      </div>

      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-blue">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-lg text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                TechFix<span className="text-primary"> Pro</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${location.pathname === link.href
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                  >
                    {link.label}
                    {link.dropdown && <ChevronDown className="w-3 h-3 opacity-60" />}
                  </Link>

                  {link.dropdown && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg py-2 min-w-[180px] z-50 rtl:left-auto rtl:right-0">
                      {link.dropdown.map(item => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />

              <Link
                to="/search"
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={t('nav.search')}
              >
                <Search className="w-4 h-4" />
              </Link>

              <Link
                to="/cart"
                className="relative flex w-9 h-9 items-center justify-center rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label={`Cart (${totalItems})`}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              <Button
                variant="default"
                size="sm"
                className="hidden sm:inline-flex"
                asChild
              >
                <Link to="/services">{t('nav.bookRepair')}</Link>
              </Button>

              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="container mx-auto px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <div key={link.href}>
                  <Link
                    to={link.href}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.dropdown && (
                    <div className="ml-4 rtl:ml-0 rtl:mr-4 mt-1 space-y-1">
                      {link.dropdown.map(item => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block px-3 py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors rounded"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2 pb-1">
                <Button className="w-full" asChild onClick={() => setMobileOpen(false)}>
                  <Link to="/services">{t('nav.bookRepair')}</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
