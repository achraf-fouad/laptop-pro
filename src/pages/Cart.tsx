import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle2, Phone, ChevronRight, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { language, t } = useLanguage();
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ fullName: '', phone: '', city: '', address: '', notes: '' });
  const currency = t('currency');

  const formatPrice = (price: number) => new Intl.NumberFormat('fr-MA').format(price);

  const orderSchema = z.object({
    fullName: z.string().trim().min(3, t('cart.required')).max(100),
    phone: z.string().trim().min(8, t('cart.invalidPhone')).regex(/^[0-9+\s()-]{8,20}$/, t('cart.invalidPhone')),
    city: z.string().trim().min(1, t('cart.required')).max(100),
    address: z.string().trim().min(5, t('cart.required')).max(300),
    notes: z.string().max(500).optional(),
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = orderSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    try {
      await api.post('/orders', {
        customer_name: form.fullName, customer_phone: form.phone,
        shipping_address: `${form.city}, ${form.address}`, notes: form.notes,
        total_amount: totalPrice,
        items: items.map(item => ({ product_id: item.product.id, quantity: item.quantity, price: item.product.price }))
      });
      setOrderPlaced(true);
      toast({ title: t('cart.orderSuccess') });
      clearCart();
    } catch {
      toast({ title: t('cart.orderError'), description: t('cart.orderErrorDesc'), variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Header />
      <main className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-10 w-1 bg-primary rounded-full" />
            <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
              {t('cart.title')} <span className="text-primary italic">{t('cart.titleHighlight')}</span>
            </h1>
          </div>

          {orderPlaced ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 flex flex-col items-center text-center bg-white p-12 rounded-3xl shadow-xl border border-border/50 max-w-2xl mx-auto">
              <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center text-success mb-8"><CheckCircle2 className="h-12 w-12" /></div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">{t('cart.orderConfirmed')}</h2>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm mb-10 leading-relaxed">{t('cart.orderConfirmedDesc')}</p>
              <Link to="/products" className="inline-flex items-center gap-3 bg-foreground text-background px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary transition-all">
                {t('cart.backToShop')}<ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 flex flex-col items-center text-center bg-white p-20 rounded-3xl border border-dashed border-border">
              <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-8"><ShoppingBag className="h-10 w-10 text-muted-foreground/30" /></div>
              <p className="text-xl font-bold uppercase tracking-widest text-muted-foreground mb-8">{t('cart.empty')}</p>
              <Link to="/products" className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
                {t('cart.orderProduct')}<ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-8 space-y-6">
                <div className="hidden lg:grid grid-cols-12 gap-4 px-6 pb-4 border-b text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                  <div className="col-span-6">{t('cart.product')}</div>
                  <div className="col-span-2 text-center">{t('cart.qty')}</div>
                  <div className="col-span-2 text-end">{t('cart.unitPrice')}</div>
                  <div className="col-span-2 text-end">{t('cart.totalCol')}</div>
                </div>
                {items.map(item => (
                  <motion.div key={item.product.id} layout className="group bg-white rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-6">
                    <Link to={`/product/${item.product.id}`} className="shrink-0 h-24 w-24 bg-secondary p-2 rounded-xl flex items-center justify-center">
                      <img src={item.product.image} alt={item.product.name[language] || item.product.name.fr} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 underline underline-offset-4">{item.product.brand}</p>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="text-sm font-black uppercase tracking-tighter text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight">{item.product.name[language] || item.product.name.fr}</h3>
                      </Link>
                      <button onClick={() => removeFromCart(item.product.id)} className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-destructive/40 hover:text-destructive transition-colors group/del">
                        <Trash2 className="h-3 w-3 group-hover:rotate-12 transition-transform" />{t('cart.remove')}
                      </button>
                    </div>
                    <div className="flex flex-col sm:items-center gap-4 sm:ml-auto">
                      <div className="flex items-center bg-secondary rounded-full p-1 border">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="h-8 w-8 flex items-center justify-center text-foreground/70 hover:bg-white hover:text-primary rounded-full transition-all"><Minus className="h-3 w-3" /></button>
                        <span className="min-w-[2.5rem] text-center text-xs font-black uppercase">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="h-8 w-8 flex items-center justify-center text-foreground/70 hover:bg-white hover:text-primary rounded-full transition-all"><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                    <div className="text-end hidden lg:block lg:min-w-[80px]"><p className="text-xs font-bold text-muted-foreground">{formatPrice(item.product.price)} {currency}</p></div>
                    <div className="text-end min-w-[100px]"><p className="text-lg font-black italic tracking-tighter text-primary">{formatPrice(item.product.price * item.quantity)} {currency}</p></div>
                  </motion.div>
                ))}
                <button onClick={() => clearCart()} className="text-xs font-black uppercase tracking-widest text-muted-foreground/30 hover:text-destructive transition-colors flex items-center gap-2">
                  <RotateCcw className="h-3 w-3" />{t('cart.clearCart')}
                </button>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl border border-border/50 p-8 shadow-xl sticky top-24">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic">{t('cart.summary')}</h3>
                  <div className="space-y-6 text-xs font-bold uppercase tracking-widest">
                    <div className="flex justify-between items-center pb-4 border-b border-border/10"><span className="text-muted-foreground/60">{t('cart.subtotal')}</span><span className="text-foreground">{formatPrice(totalPrice)} {currency}</span></div>
                    <div className="flex justify-between items-center pb-4 border-b border-border/10"><span className="text-muted-foreground/60">{t('cart.shipping')}</span><span className="text-primary italic">{t('cart.shippingFree')}</span></div>
                    <div className="flex justify-between items-center pt-2"><span className="text-lg font-black uppercase tracking-tighter">{t('cart.totalTTC')}</span><span className="text-2xl font-black italic tracking-tighter text-primary">{formatPrice(totalPrice)} {currency}</span></div>
                  </div>
                  {!showForm ? (
                    <button onClick={() => setShowForm(true)} className="mt-10 w-full bg-primary text-white py-5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all">{t('cart.checkout')}</button>
                  ) : (
                    <button onClick={() => setShowForm(false)} className="mt-10 w-full bg-secondary text-foreground py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-border transition-all flex items-center justify-center gap-2"><ArrowLeft className="h-4 w-4" />{t('cart.editCart')}</button>
                  )}
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-success"><ShieldCheck className="h-4 w-4" /> {t('cart.codPayment')}</div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50"><Truck className="h-4 w-4" /> {t('cart.shippingTime')}</div>
                  </div>
                </div>

                <AnimatePresence>
                  {showForm && (
                    <motion.form initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onSubmit={handleSubmit} className="bg-white rounded-3xl border border-primary/20 p-8 shadow-2xl relative z-10">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">{t('cart.orderForm')}</div>
                      <div className="space-y-6 pt-4">
                        <div>
                          <input value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} placeholder={t('cart.fullNamePlaceholder')} className={`w-full bg-secondary/30 border-none rounded-xl px-5 py-4 text-sm font-bold placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 ${errors.fullName ? 'ring-2 ring-destructive/20' : ''}`} />
                          {errors.fullName && <p className="mt-1 text-[10px] font-black text-destructive uppercase tracking-widest pl-2">{errors.fullName}</p>}
                        </div>
                        <div>
                          <input value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder={t('cart.phonePlaceholder')} type="tel" className={`w-full bg-secondary/30 border-none rounded-xl px-5 py-4 text-sm font-bold placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 ${errors.phone ? 'ring-2 ring-destructive/20' : ''}`} />
                          {errors.phone && <p className="mt-1 text-[10px] font-black text-destructive uppercase tracking-widest pl-2">{errors.phone}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input value={form.city} onChange={e => handleChange('city', e.target.value)} placeholder={t('cart.cityPlaceholder')} className={`w-full bg-secondary/30 border-none rounded-xl px-5 py-4 text-sm font-bold placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 ${errors.city ? 'ring-2 ring-destructive/20' : ''}`} />
                            {errors.city && <p className="mt-1 text-[10px] font-black text-destructive uppercase tracking-widest pl-2">{errors.city}</p>}
                          </div>
                          <div>
                            <input value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder={t('cart.addressPlaceholder')} className={`w-full bg-secondary/30 border-none rounded-xl px-5 py-4 text-sm font-bold placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 ${errors.address ? 'ring-2 ring-destructive/20' : ''}`} />
                            {errors.address && <p className="mt-1 text-[10px] font-black text-destructive uppercase tracking-widest pl-2">{errors.address}</p>}
                          </div>
                        </div>
                        <textarea value={form.notes} onChange={e => handleChange('notes', e.target.value)} placeholder={t('cart.notesPlaceholder')} rows={3} className="w-full bg-secondary/30 border-none rounded-xl px-5 py-4 text-sm font-bold placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 resize-none" />
                        <button type="submit" className="w-full bg-foreground text-background py-5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3">
                          {t('cart.placeOrder')}<CheckCircle2 className="h-4 w-4" />
                        </button>
                        <p className="text-[9px] font-bold text-muted-foreground/40 text-center uppercase tracking-widest leading-relaxed">{t('cart.orderDisclaimer')}</p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
