import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'required').max(100),
  email: z.string().trim().email('invalid').max(255),
  subject: z.string().trim().min(1, 'required').max(200),
  message: z.string().trim().min(1, 'required').max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof ContactForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const infoItems = [
    { icon: Phone, label: t('contact.phone'), value: '+212 6 00 00 00 00' },
    { icon: Mail, label: t('contact.email'), value: 'contact@maroclaptop.ma' },
    { icon: MapPin, label: t('contact.address'), value: t('contact.addressValue') },
  ];

  return (
    <section id="contact" className="bg-secondary/30 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            {t('contact.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-5">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 lg:col-span-2"
          >
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 rounded-xl border bg-card p-5 shadow-soft">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 lg:col-span-3 rounded-xl border bg-card p-6 shadow-soft"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{t('contact.name')}</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={t('contact.namePlaceholder')}
                  maxLength={100}
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{t('contact.required')}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{t('contact.emailLabel')}</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={t('contact.emailPlaceholder')}
                  maxLength={255}
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{t('contact.invalidEmail')}</p>}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('contact.subject')}</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t('contact.subjectPlaceholder')}
                maxLength={200}
              />
              {errors.subject && <p className="mt-1 text-xs text-destructive">{t('contact.required')}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('contact.message')}</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="w-full resize-none rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t('contact.messagePlaceholder')}
                maxLength={2000}
              />
              {errors.message && <p className="mt-1 text-xs text-destructive">{t('contact.required')}</p>}
            </div>

            {submitted && (
              <p className="rounded-lg bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
                {t('contact.success')}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-hero py-3 font-display text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-hover sm:w-auto sm:px-8"
            >
              <Send className="h-4 w-4" />
              {t('contact.send')}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
