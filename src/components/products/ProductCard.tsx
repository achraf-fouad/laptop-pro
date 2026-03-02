import { Product } from '@/types/product';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const stockLabel =
    product.stock === 'in_stock' ? t('featured.inStock') :
    product.stock === 'low_stock' ? t('featured.lowStock') :
    t('featured.outOfStock');

  const stockColor =
    product.stock === 'in_stock' ? 'text-success' :
    product.stock === 'low_stock' ? 'text-warning' :
    'text-destructive';

  const formatPrice = (price: number) => new Intl.NumberFormat('fr-MA').format(price);
  const name = product.name[language] || product.name.fr || product.name.en || '';
  const currency = t('currency');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative flex flex-col bg-card border border-border/60 hover:border-primary/30 transition-all duration-300 rounded-lg overflow-hidden h-full"
    >
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 font-black uppercase text-[9px] tracking-widest">
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="bg-destructive text-white px-2 py-1 rounded-sm shadow-sm flex items-center gap-1">
            <Zap className="h-2.5 w-2.5 fill-current" />
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}
        {product.featured && (
          <span className="bg-primary text-white px-2 py-1 rounded-sm shadow-sm">{t('featured.favorite')}</span>
        )}
      </div>

      <div className="relative aspect-square overflow-hidden bg-[#fcfcfc] flex items-center justify-center p-6">
        <Link to={`/product/${product.id}`} className="w-full h-full">
          <img src={product.image} alt={name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        </Link>
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-10 pointer-events-none group-hover:pointer-events-auto">
          <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-lg translate-y-4 group-hover:translate-y-0 duration-300">
            <Link to={`/product/${product.id}`}><Eye className="h-4 w-4" /></Link>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-2 border-t border-border/30">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
          {product.category || t('product.informatique')}
        </p>
        <Link to={`/product/${product.id}`} className="flex-1">
          <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem] mb-2 uppercase">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-2.5 w-2.5 ${i < Math.floor(product.rating || 0) ? 'fill-accent text-accent' : 'text-muted/40'}`} />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1 font-bold">({product.reviewCount || 0})</span>
        </div>
        <div className="mt-auto">
          <div className="flex flex-col mb-3">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through font-medium">
                {formatPrice(product.originalPrice)} {currency}
              </span>
            )}
            <span className="text-lg font-black text-primary italic tracking-tight">
              {formatPrice(product.price)} <span className="text-xs font-bold not-italic">{currency}</span>
            </span>
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 'out_of_stock'}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-2.5 text-[10px] font-black uppercase tracking-widest text-foreground transition-all hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          >
            <ShoppingCart className="h-3.5 w-3.5 transition-transform group-hover/btn:-rotate-12" />
            {t('featured.addToCart')}
          </button>
          <div className="mt-2 flex items-center justify-between text-[8px] font-black uppercase tracking-wider">
            <span className={stockColor}>{stockLabel}</span>
            <span className="text-muted-foreground/40">REF: {product.id.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
