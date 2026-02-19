import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('contactPage.title')}</h1>
          <p className="text-white/60">{t('contactPage.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            {[
              { icon: Phone, title: t('contactPage.phone'), lines: ['+1 (555) 123-4567', 'Mon–Fri 9AM–6PM PT'] },
              { icon: Mail, title: t('contactPage.email'), lines: ['support@techfixpro.com', 'sales@techfixpro.com'] },
              { icon: MapPin, title: t('contactPage.workshop'), lines: ['123 Tech Street', 'San Francisco, CA 94102'] },
              { icon: Clock, title: t('contactPage.hours'), lines: ['Mon–Fri: 9AM–6PM', 'Sat: 10AM–4PM'] },
            ].map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">{title}</div>
                  {lines.map(l => <div key={l} className="text-sm text-muted-foreground">{l}</div>)}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> {t('contactPage.sendMessage')}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t('contactPage.name')}</label>
                    <Input placeholder={t('contactPage.namePlaceholder')} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t('contactPage.emailLabel')}</label>
                    <Input type="email" placeholder={t('contactPage.emailPlaceholder')} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t('contactPage.subject')}</label>
                  <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>{t('contactPage.subjects.productQuestion')}</option>
                    <option>{t('contactPage.subjects.orderSupport')}</option>
                    <option>{t('contactPage.subjects.repairService')}</option>
                    <option>{t('contactPage.subjects.returnsWarranty')}</option>
                    <option>{t('contactPage.subjects.other')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t('contactPage.message')}</label>
                  <textarea rows={5} placeholder={t('contactPage.messagePlaceholder')} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <Button className="w-full shadow-blue" size="lg">{t('contactPage.send')}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
