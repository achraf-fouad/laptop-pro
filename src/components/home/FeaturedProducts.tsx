import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { RefreshCw, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturedProducts = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'new' | 'popular' | 'sale'>('new');

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch featured products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const getFilteredProducts = () => {
    if (activeTab === 'new') return products.slice(0, 8);
    if (activeTab === 'popular') return products.filter(p => (p.rating || 0) >= 4).slice(0, 8);
    if (activeTab === 'sale') return products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 8);
    return products.slice(0, 8);
  };

  const filtered = getFilteredProducts();

  const tabs = [
    { id: 'new' as const, label: t('featured.new') },
    { id: 'popular' as const, label: t('featured.popular') },
    { id: 'sale' as const, label: t('featured.sale') },
  ];

  return (
    <section className="bg-secondary/30 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="flex flex-col lg:flex-row items-baseline justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-[0.8] mb-4">
              {t('featured.title')} <span className="text-primary italic">{t('featured.titleHighlight')}</span>
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t('featured.subtitle')}</p>
          </div>
          
          <div className="flex bg-card p-1 rounded-full border border-border/50 shadow-sm overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-full ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <RefreshCw className="h-10 w-10 animate-spin text-primary opacity-20" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <ProductCard key={`${activeTab}-${product.id}`} product={product} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            to="/products"
            className="group flex items-center gap-4 bg-foreground text-background px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl hover:-translate-y-1"
          >
            {t('featured.viewAll')}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
