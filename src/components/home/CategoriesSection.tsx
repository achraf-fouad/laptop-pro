import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const CategoriesSection = () => {
  const { t } = useLanguage();

  const mainCategories = [
    {
      id: 'laptops',
      title: t('categories.laptops'),
      subtitle: t('categories.laptopsSub'),
      image: '/images/banners/hero.png',
      link: '/products?category=laptops',
      span: 'col-span-1 lg:col-span-2 row-span-1 lg:row-span-2'
    },
    {
      id: 'screens',
      title: t('categories.screens'),
      subtitle: t('categories.screensSub'),
      image: '/images/banners/monitors.png',
      link: '/products?category=screens',
      span: 'col-span-1 row-span-1'
    },
    {
      id: 'peripherals',
      title: t('categories.peripherals'),
      subtitle: t('categories.peripheralsSub'),
      image: '/images/banners/peripherals.png',
      link: '/products?category=peripherals',
      span: 'col-span-1 row-span-1'
    },
    {
      id: 'printers',
      title: t('categories.printers'),
      subtitle: t('categories.printersSub'),
      image: '/images/banners/printers.png',
      link: '/products?category=printers',
      span: 'col-span-1 lg:col-span-2 row-span-1'
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-[0.8] mb-4">
              {t('categories.title')} <span className="text-primary italic">{t('categories.titleHighlight')}</span>
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t('categories.subtitle')}</p>
          </div>
          <Link to="/products" className="hidden lg:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-4 transition-all group">
            {t('nav.allCatalog')}
            <ChevronRight className="h-4 w-4 bg-primary text-white rounded-full p-0.5 group-hover:scale-125 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-none lg:grid-rows-2 gap-4 lg:gap-6">
          {mainCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 ${cat.span}`}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-500 z-10" />
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {cat.subtitle}
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {cat.title}
                </h3>
                <Link
                  to={cat.link}
                  className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-primary w-fit pb-1 opacity-0 group-hover:opacity-100 transition-all delay-100 duration-300"
                >
                  {t('categories.discoverRange')}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
