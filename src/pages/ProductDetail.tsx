
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { ShoppingCart, Star, ChevronRight, Check, XCircle, RefreshCw, Shield, Truck, RotateCcw, Box, Home, Send, User, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Product as BaseProduct } from '@/types/product';
import { toast } from 'sonner';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Product extends BaseProduct {
  reviews?: Review[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [activeImage, setActiveImage] = useState<string>('');
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const currency = t('currency');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, allRes] = await Promise.all([api.get(`/products/${id}`), api.get('/products')]);
      setProduct(prodRes.data);
      setActiveImage(prodRes.data.images?.[0] || '');
      setActiveTab('desc');
      setAllProducts(allRes.data);
    } catch (error) {
      console.error('Failed to fetch product', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); window.scrollTo(0, 0); }, [id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product?.id}/reviews`, reviewForm);
      toast.success(t('product.reviewSuccess'));
      setReviewForm({ author: '', rating: 5, comment: '' });
    } catch {
      toast.error(t('product.reviewError'));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center"><RefreshCw className="h-10 w-10 animate-spin text-primary opacity-20" /></div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('product.notFound')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('fr-MA').format(price);
  const related = allProducts.filter(p => p.category_id === product.category_id && String(p.id) !== String(product.id)).slice(0, 4);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleQuickBuy = () => {
    addToCart(product);
    navigate('/cart');
  };

  const name = product.name[language] || product.name.fr || product.name.en || '';
  const description = product.description[language] || product.description.fr || product.description.en || '';
  const galleryImages = product.images || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc] overflow-x-hidden w-full">
      <Header />
      <main className="flex-1 py-6 md:py-12">
        <div className="container mx-auto px-4 lg:px-12">
          {/* Breadcrumb */}
          <nav className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Link to="/" className="hover:text-primary flex items-center gap-1 transition-colors"><Home className="h-3 w-3" />{t('products.breadcrumbHome')}</Link>
            <ChevronRight className="h-3 w-3 opacity-20" />
            <Link to="/products" className="hover:text-primary transition-colors">{t('products.breadcrumbShop')}</Link>
            <ChevronRight className="h-3 w-3 opacity-20" />
            <span className="text-foreground">{name}</span>
          </nav>

          <div className="grid gap-6 lg:gap-16 lg:grid-cols-2">
            {/* Gallery */}
            <div className="space-y-4 sm:mx-0 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-white p-4 sm:p-10 flex items-center justify-center shadow-sm aspect-video sm:aspect-square lg:aspect-auto lg:h-[600px] w-full max-h-[250px] sm:max-h-none"
              >
                <img src={activeImage} alt={name} className="max-h-full max-w-full object-contain" />
                <button className="absolute top-4 right-4 h-8 w-8 sm:h-10 sm:w-10 bg-secondary/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Box className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </motion.div>
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scrollbar-hide max-w-full">
                  {galleryImages.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImage(img)} 
                      className={`h-12 w-12 sm:h-24 sm:w-24 shrink-0 rounded-lg border-2 p-1 bg-white flex items-center justify-center transition-all ${activeImage === img ? 'border-primary' : 'border-border/50 hover:border-primary/50'}`}
                    >
                      <img src={img} className="max-h-full max-w-full object-contain" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col pt-2 sm:pt-0 overflow-hidden">
              <div className="mb-6 sm:mb-8 border-b border-border/50 pb-6 sm:pb-8">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] sm:text-xs font-black tracking-widest uppercase mb-4 rounded-sm">{product.brand}</span>
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-black uppercase tracking-tighter text-foreground leading-[1.1] mb-2">{name}</h1>
                <div className="flex items-center gap-4 sm:gap-6 mb-4">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveTab('reviews')}>
                    {[...Array(5)].map((_, i) => (<Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating || 0) ? 'fill-accent text-accent' : 'text-muted/30'}`} />))}
                    <span className="text-[10px] font-black text-muted-foreground ml-2">({product.reviewCount || 0})</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${product.stock_status === 'out_of_stock' ? 'text-destructive' : 'text-primary'}`}>
                    {product.stock_status === 'out_of_stock' ? <XCircle className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                    {product.stock_status === 'out_of_stock' ? t('product.outOfStock') : t('product.inStock')}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xl sm:text-3xl lg:text-5xl font-black text-primary italic tracking-tighter whitespace-nowrap">{formatPrice(product.price)} <span className="text-base sm:text-xl font-bold not-italic">{currency}</span></span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through font-bold whitespace-nowrap">{formatPrice(product.originalPrice)} {currency}</span>
                    )}
                  </div>
                </div>
                <p className="text-[9px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mt-2">{t('product.taxIncluded')}</p>
              </div>

              <div className="flex flex-col gap-3 mb-10 w-full">
                <button 
                  onClick={handleAdd} 
                  disabled={product.stock_status === 'out_of_stock'} 
                  className="flex w-full items-center justify-center gap-3 bg-primary text-white py-4 sm:py-5 px-8 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 min-h-[60px]"
                >
                  {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                  <span>{added ? t('product.addedToCart') : t('product.addToCart')}</span>
                </button>
                <button 
                  onClick={handleQuickBuy}
                  className="flex w-full items-center justify-center gap-3 border-2 border-foreground text-foreground py-4 sm:py-5 px-8 rounded-full text-sm font-black uppercase tracking-[0.2em] hover:bg-foreground hover:text-white active:scale-95 transition-all disabled:opacity-50 min-h-[60px]" 
                  disabled={product.stock_status === 'out_of_stock'}
                >
                  <Zap className="h-5 w-5 fill-current" />
                  <span>{t('product.quickBuy')}</span>
                </button>
              </div>

              {/* USP Bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 border-y border-border/50 py-6 mb-10">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Truck className="h-5 w-5 text-primary" /></div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-tight">{t('product.delivery')} <br /> 48H</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Shield className="h-5 w-5 text-primary" /></div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-tight">{t('product.warrantyLabel')} <br /> 1 AN</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><RotateCcw className="h-5 w-5 text-primary" /></div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-tight">{t('product.pickup')} <br /> BOUTIQUE</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border/50 mb-6 overflow-x-auto scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {[
                  { id: 'desc', label: t('product.description') },
                  { id: 'specs', label: t('product.specs') },
                  { id: 'reviews', label: `${t('product.reviews')} (${product.reviewCount || 0})` }
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-4 px-4 text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                {activeTab === 'desc' && (
                  <p className="text-sm leading-relaxed text-muted-foreground font-medium uppercase tracking-wide">
                    {description || t('product.noDescription')}
                  </p>
                )}

                {activeTab === 'specs' && (
                  <div className="divide-y border border-border/50 rounded-xl overflow-hidden bg-white">
                    {product.specs && Object.keys(product.specs).length > 0 ? Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex text-[10px] sm:text-xs">
                        <span className="w-2/5 sm:w-1/3 shrink-0 bg-secondary/50 px-4 sm:px-6 py-4 font-black uppercase tracking-widest text-foreground">{key}</span>
                        <span className="px-4 sm:px-6 py-4 text-muted-foreground font-bold">{value as React.ReactNode}</span>
                      </div>
                    )) : (
                      <p className="p-6 text-xs italic font-bold text-muted-foreground uppercase tracking-widest text-center">{t('product.noSpecs')}</p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      {product.reviews && product.reviews.length > 0 ? product.reviews.map(review => (
                        <div key={review.id} className="bg-secondary/20 p-6 rounded-2xl border border-border/50">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><User className="h-4 w-4" /></div>
                              <div className="flex flex-col">
                                <span className="text-xs font-black uppercase tracking-widest">{review.author}</span>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground font-bold italic leading-relaxed">"{review.comment}"</p>
                        </div>
                      )) : (
                        <div className="text-center py-8">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{t('product.noReviews')}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-white border text-foreground p-6 rounded-2xl border-border/50 shadow-sm mt-8">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-6">{t('product.addReview')}</h3>
                      <form onSubmit={submitReview} className="space-y-4">
                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-6 w-6 cursor-pointer hover:scale-110 transition-transform ${i < reviewForm.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} onClick={() => setReviewForm(prev => ({ ...prev, rating: i + 1 }))} />
                          ))}
                        </div>
                        <input type="text" required placeholder={t('product.reviewName')} value={reviewForm.author} onChange={(e) => setReviewForm(prev => ({ ...prev, author: e.target.value }))} className="w-full bg-secondary/30 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 border-none" />
                        <textarea required placeholder={t('product.reviewComment')} rows={4} value={reviewForm.comment} onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))} className="w-full bg-secondary/30 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 border-none resize-none" />
                        <button type="submit" disabled={submittingReview} className="w-full bg-foreground text-background py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2 group disabled:opacity-50">
                          {submittingReview ? t('product.reviewSubmitting') : t('product.reviewSubmit')}
                          {!submittingReview && <Send className="h-3 w-3 group-hover:translate-x-1 transition-transform" />}
                        </button>
                        <p className="text-center text-[8px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mt-2">{t('product.reviewModeration')}</p>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16 sm:mt-24 lg:mt-32 pt-12 lg:pt-16 border-t border-border/50">
              <div className="flex items-end justify-between mb-8 lg:mb-12">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-foreground leading-[0.8] mb-4">
                    {t('product.related')} <span className="text-primary italic">{t('product.relatedHighlight')}</span>
                  </h2>
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t('product.relatedSubtitle')}</p>
                </div>
                <Link to="/products" className="text-xs font-black uppercase tracking-widest text-primary hover:underline underline-offset-8">{t('product.viewAll')}</Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {related.map((p, i) => (<ProductCard key={p.id} product={p as any} index={i} />))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
