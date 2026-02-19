import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Star, BadgeCheck, ChevronRight, Truck, RotateCcw, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { allProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { t } = useTranslation();

  const product = allProducts.find(p => p.id === id);

  if (!product) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{t('productDetail.productNotFound')}</h1>
          <Button asChild><Link to="/laptops">{t('productDetail.browseLaptops')}</Link></Button>
        </div>
      </main>
    );
  }

  const related = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">{t('productDetail.home')}</Link>
          <ChevronRight className="w-3 h-3 rtl:rotate-180" />
          <Link to={product.category === 'laptop' ? '/laptops' : '/parts'} className="hover:text-foreground">
            {product.category === 'laptop' ? t('productDetail.laptops') : t('productDetail.parts')}
          </Link>
          <ChevronRight className="w-3 h-3 rtl:rotate-180" />
          <span className="text-foreground truncate max-w-[200px]">{product.brand} {product.model}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div>
            <div className="relative bg-muted rounded-2xl overflow-hidden mb-3 aspect-square max-h-[460px]">
              <img src={product.image} alt={product.title} className="w-full h-full object-contain p-6" />
              <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex flex-col gap-2">
                {product.badge && <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-primary text-primary-foreground">{product.badge}</span>}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${product.condition === 'New' ? 'badge-new' : 'badge-refurbished'}`}>{product.condition}</span>
              </div>
              {discount > 0 && <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-12 h-12 rounded-full badge-sale flex items-center justify-center text-sm font-bold">-{discount}%</div>}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-primary mb-1">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">{product.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'fill-warning text-warning' : 'fill-muted text-muted'}`} />)}</div>
              <span className="text-sm font-semibold text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} {t('productDetail.reviews')})</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-5">{product.shortDescription}</p>
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-4xl font-bold text-foreground">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                  <span className="badge-sale text-sm font-bold px-2 py-0.5 rounded-lg">Save ${product.originalPrice - product.price}</span>
                </>
              )}
            </div>
            {product.condition === 'Refurbished' && (
              <div className="flex items-center gap-2 text-success text-sm font-semibold mb-5">
                <BadgeCheck className="w-4 h-4" /> {t('productDetail.warrantyIncluded')}
              </div>
            )}
            <div className={`text-sm font-medium mb-5 ${product.inStock ? 'text-success' : 'text-destructive'}`}>
              {product.inStock
                ? product.stockCount <= 5
                  ? t('productDetail.lowStock', { count: product.stockCount })
                  : t('productDetail.inStock')
                : t('productDetail.outOfStock')}
            </div>
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-foreground hover:bg-muted transition-colors text-lg font-medium">−</button>
                <span className="px-4 py-2 text-sm font-semibold text-foreground min-w-[40px] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stockCount, q + 1))} className="px-3 py-2 text-foreground hover:bg-muted transition-colors text-lg font-medium">+</button>
              </div>
              <Button size="lg" className="flex-1 shadow-blue" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingCart className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {added ? t('productDetail.addedToCart') : product.inStock ? t('productDetail.addToCart') : t('productDetail.outOfStockBtn')}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4 bg-muted/50 rounded-xl border border-border">
              {[
                { icon: Truck, label: t('productDetail.freeShipping'), sub: t('productDetail.freeShippingDesc') },
                { icon: RotateCcw, label: t('productDetail.returns'), sub: t('productDetail.returnsDesc') },
                { icon: Shield, label: t('productDetail.securePayment'), sub: t('productDetail.securePaymentDesc') },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                  <div className="text-xs font-semibold text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">SKU: {product.sku}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {product.features.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">{t('productDetail.keyFeatures')}</h2>
              <ul className="space-y-2.5">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.specs && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">{t('productDetail.specifications')}</h2>
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4 rtl:pr-0 rtl:pl-4 text-sm font-medium text-muted-foreground w-1/3">{key}</td>
                      <td className="py-2 text-sm text-foreground">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {product.compatibility && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-12">
            <h2 className="text-lg font-bold text-foreground mb-4">{t('productDetail.compatibleWith')}</h2>
            <div className="flex flex-wrap gap-2">
              {product.compatibility.map(c => <span key={c} className="text-sm bg-primary/10 text-primary font-medium px-3 py-1 rounded-full">{c}</span>)}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">{t('productDetail.youMightAlsoLike')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
