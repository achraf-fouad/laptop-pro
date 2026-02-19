import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Shield, Truck, RotateCcw, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: t('footer.trustWarranty'), sub: t('footer.trustWarrantyDesc') },
              { icon: Truck, label: t('footer.trustShipping'), sub: t('footer.trustShippingDesc') },
              { icon: RotateCcw, label: t('footer.trustReturns'), sub: t('footer.trustReturnsDesc') },
              { icon: Star, label: t('footer.trustRating'), sub: t('footer.trustRatingDesc') },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="text-xs text-white/60">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-lg text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                TechFix Pro
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">{t('footer.description')}</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary/30 flex items-center justify-center transition-colors" aria-label="Social link">
                  <Icon className="w-4 h-4 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t('footer.shop')}</h4>
            <ul className="space-y-2">
              {[
                [t('footer.refurbishedLaptops'), '/laptops?condition=Refurbished'],
                [t('footer.newLaptops'), '/laptops?condition=New'],
                [t('footer.partsAccessories'), '/parts'],
                [t('footer.batteries'), '/parts?tag=battery'],
                [t('footer.screens'), '/parts?tag=screen'],
                [t('footer.chargersHubs'), '/parts?tag=charger'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-white/60 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t('footer.services')}</h4>
            <ul className="space-y-2">
              {[
                [t('footer.bookRepair'), '/services'],
                [t('footer.screenReplacement'), '/services#screen'],
                [t('footer.batteryReplacement'), '/services#battery'],
                [t('footer.dataRecovery'), '/services#data-recovery'],
                [t('footer.thermalService'), '/services#thermal'],
                [t('footer.osInstallation'), '/services#os'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-white/60 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t('footer.contact')}</h4>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <a href="tel:+15551234567" className="hover:text-white transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <a href="mailto:support@techfixpro.com" className="hover:text-white transition-colors">support@techfixpro.com</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>123 Tech Street, San Francisco, CA 94102</span>
              </li>
            </ul>
            <div className="text-xs text-white/50 whitespace-pre-line">{t('footer.hours')}</div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <span>{t('footer.rights')}</span>
            <div className="flex gap-4">
              {[
                [t('footer.privacy'), '/privacy'],
                [t('footer.terms'), '/terms'],
                [t('footer.returnsWarranty'), '/returns'],
                [t('footer.faq'), '/faq'],
              ].map(([label, href]) => (
                <Link key={href} to={href} className="hover:text-white/70 transition-colors">{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
