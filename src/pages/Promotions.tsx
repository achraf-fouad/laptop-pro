import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Zap, RefreshCw, ShoppingBag } from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';

const Promotions = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        // Filter products with original price > price (those on sale)
        const saleProducts = res.data.filter((p: Product) => p.originalPrice && p.originalPrice > p.price);
        setProducts(saleProducts);
      } catch (error) {
        console.error('Failed to fetch promotions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Header />
      <main className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-1.5 bg-destructive rounded-full" />
              <div>
                <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-foreground leading-none flex items-center gap-3">
                  <Zap className="h-8 w-8 text-destructive fill-current animate-pulse" />
                  {t('nav.flashSales')}
                </h1>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                   Profitez des meilleures réductions du moment
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <RefreshCw className="h-12 w-12 animate-spin text-primary opacity-20 mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">{t('products.loading')}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Aucune promotion flash en ce moment.</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-2">Revenez bientôt pour de nouvelles offres !</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Promotions;
