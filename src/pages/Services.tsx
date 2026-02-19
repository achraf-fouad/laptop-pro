import { useState } from 'react';
import { Search, Monitor, Battery, HardDrive, Thermometer, Settings, CheckCircle, Clock, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { repairServices } from '@/data/products';
import repairImg from '@/assets/repair-service.jpg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const iconMap: Record<string, React.ElementType> = { Search, Monitor, Battery, HardDrive, Thermometer, Settings };

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background">
      <div className="relative bg-hero overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${repairImg})` }} aria-hidden="true" />
        <div className="relative container mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">{t('servicesPage.badge')}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('servicesPage.title')}</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">{t('servicesPage.subtitle')}</p>
          <Button size="lg" className="shadow-blue" asChild>
            <a href="#booking">{t('servicesPage.bookRepair')} <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 w-4 h-4" /></a>
          </Button>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">{t('servicesPage.ourServices')}</h2>
          <p className="text-muted-foreground text-center mb-10">{t('servicesPage.ourServicesDesc')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repairServices.map(svc => {
              const Icon = iconMap[svc.icon] || Settings;
              return (
                <div key={svc.id} className={`relative bg-card border rounded-2xl p-6 shadow-product card-hover cursor-pointer transition-all ${selectedService === svc.id ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`} onClick={() => setSelectedService(svc.id === selectedService ? null : svc.id)}>
                  {svc.popular && <span className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{t('servicesPage.popular')}</span>}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-primary" /></div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{svc.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{svc.description}</p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-foreground">{svc.price === 0 ? t('servicesPage.free') : `$${svc.price}`}</span>
                    {svc.price > 0 && <span className="text-xs text-muted-foreground">{t('servicesPage.startingFrom')}</span>}
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {svc.duration}</span>
                    <span className="flex items-center gap-1">⚡ {svc.turnaround}</span>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {svc.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-foreground"><CheckCircle className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="booking" className="py-16 bg-muted/40 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">{t('servicesPage.bookingTitle')}</h2>
          <p className="text-muted-foreground text-center mb-8">{t('servicesPage.bookingSubtitle')}</p>
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-foreground mb-1.5 block">{t('servicesPage.firstName')}</label><Input placeholder="John" /></div>
                <div><label className="text-sm font-medium text-foreground mb-1.5 block">{t('servicesPage.lastName')}</label><Input placeholder="Doe" /></div>
              </div>
              <div><label className="text-sm font-medium text-foreground mb-1.5 block">{t('servicesPage.email')}</label><Input type="email" placeholder="john@example.com" /></div>
              <div><label className="text-sm font-medium text-foreground mb-1.5 block">{t('servicesPage.phone')}</label><Input type="tel" placeholder="+1 (555) 123-4567" /></div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t('servicesPage.serviceNeeded')}</label>
                <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">{t('servicesPage.selectService')}</option>
                  {repairServices.map(s => <option key={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div><label className="text-sm font-medium text-foreground mb-1.5 block">{t('servicesPage.laptopModel')}</label><Input placeholder={t('servicesPage.laptopModelPlaceholder')} /></div>
              <div><label className="text-sm font-medium text-foreground mb-1.5 block">{t('servicesPage.preferredDate')}</label><Input type="date" /></div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t('servicesPage.describeIssue')}</label>
                <textarea rows={3} placeholder={t('servicesPage.describeIssuePlaceholder')} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button className="w-full" size="lg">{t('servicesPage.submitBooking')}</Button>
              <p className="text-xs text-muted-foreground text-center">{t('servicesPage.bookingDisclaimer')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70 mb-2">{t('servicesPage.callPrefer')}</p>
          <a href="tel:+15551234567" className="inline-flex items-center gap-2 text-lg font-bold text-white hover:text-primary transition-colors">
            <Phone className="w-5 h-5" /> +1 (555) 123-4567
          </a>
        </div>
      </section>
    </main>
  );
}
