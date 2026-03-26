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
      subtitle: 'Premium Hardware',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      link: '/products?category=laptops-portables',
      span: 'col-span-1 lg:col-span-2 row-span-1 lg:row-span-2'
    },
    {
      id: 'screens',
      title: t('categories.monitors'),
      subtitle: 'UltraWide View',
      image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80',
      link: '/products?category=screens-monitors',
      span: 'col-span-1 row-span-1'
    },
    {
      id: 'peripherals',
      title: t('categories.peripherals'),
      subtitle: 'Gaming Gear',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
      link: '/products?category=pc-peripherals',
      span: 'col-span-1 row-span-1'
    },
    {
      id: 'gaming',
      title: t('categories.gaming'),
      subtitle: 'Pro Gaming',
      image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
      link: '/products?category=consoles-gaming',
      span: 'col-span-1 lg:col-span-2 row-span-1'
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter text-foreground leading-tight md:leading-none mb-4">
              {t('categories.title')} <span className="text-primary italic">{t('categories.titleHighlight')}</span>
            </h2>
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground">{t('categories.subtitle')}</p>
          </div>
          <Link to="/products" className="hidden lg:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-4 transition-all group">
            {t('nav.allCatalog')}
            <ChevronRight className="h-4 w-4 bg-primary text-white rounded-full p-0.5 group-hover:scale-125 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-none lg:grid-rows-2 gap-4 lg:gap-6">
          {mainCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 min-h-[180px] sm:min-h-[220px] lg:min-h-0 ${cat.span}`}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-500 z-10" />
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 z-20 p-4 sm:p-6 lg:p-8 flex flex-col justify-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {cat.subtitle}
                </span>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white uppercase tracking-tighter translate-y-2 group-hover:translate-y-0 transition-all duration-300">
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
