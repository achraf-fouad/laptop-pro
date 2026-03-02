import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Truck, Headphones, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const { t } = useLanguage();

  const items = [
    { icon: Truck, title: t('trust.shipping'), desc: t('trust.shippingDesc'), color: 'text-primary' },
    { icon: Shield, title: t('trust.warranty'), desc: t('trust.warrantyDesc'), color: 'text-accent' },
    { icon: CreditCard, title: t('trust.payment'), desc: t('trust.paymentDesc'), color: 'text-success' },
    { icon: Headphones, title: t('trust.support'), desc: t('trust.supportDesc'), color: 'text-primary' },
  ];

  return (
    <section className="py-20 lg:py-32 border-t border-border/50 bg-white">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-center gap-6 group hover:translate-x-2 transition-transform duration-300"
            >
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary/50 transition-all duration-300 group-hover:bg-primary group-hover:shadow-xl group-hover:shadow-primary/20 ${item.color}`}>
                <item.icon className="h-7 w-7 transition-colors group-hover:text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-1 group-hover:text-primary transition-colors italic">
                  {item.title}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 leading-none">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
