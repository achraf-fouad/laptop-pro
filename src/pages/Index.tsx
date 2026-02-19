import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, RotateCcw, Star, Wrench, Search, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/components/ProductCard';
import { laptops, parts, repairServices } from '@/data/products';
import heroImg from '@/assets/hero-laptops.jpg';
import repairImg from '@/assets/repair-service.jpg';
import partsImg from '@/assets/laptop-parts.jpg';

const featuredLaptops = laptops.slice(0, 4);
const featuredParts = parts.slice(0, 4);

const reviews = [
  { name: 'James R.', rating: 5, text: 'Got a refurbished ThinkPad T480 — it looks and works like new. The warranty gave me total peace of mind.', product: 'ThinkPad T480' },
  { name: 'Sarah M.', rating: 5, text: 'Screen replacement done same day, half the price of the Apple Store. Technicians were professional and fast.', product: 'Screen Replacement Service' },
  { name: 'David K.', rating: 5, text: 'Ordered a replacement battery for my HP. Arrived in 2 days, easy to install with the guide. Works perfectly.', product: 'HP Battery' },
  { name: 'Lisa T.', rating: 4, text: 'Great selection of refurbished laptops at fair prices. Customer support was very responsive.', product: 'Dell XPS 15' },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative min-h-[580px] lg:min-h-[660px] bg-hero overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${heroImg})` }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent rtl:bg-gradient-to-l" aria-hidden="true" />

        <div className="relative container mx-auto px-4 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 animate-fade-in-up">
              <Zap className="w-3 h-3" /> {t('hero.trustedBy')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 animate-fade-in-up-delay-1">
              {t('hero.title1')}{' '}
              <span className="text-gradient-hero">{t('hero.title2')}</span>
            </h1>
            <p className="text-lg text-white/75 mb-8 leading-relaxed animate-fade-in-up-delay-2">{t('hero.subtitle')}</p>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mb-8 animate-fade-in-up-delay-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('hero.searchPlaceholder')} className="pl-9 rtl:pl-3 rtl:pr-9 h-12 text-base bg-white/95 border-0 text-foreground" />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6 shadow-blue">{t('hero.searchBtn')}</Button>
            </form>

            <div className="flex flex-wrap gap-3 animate-fade-in-up-delay-3">
              <Button size="lg" asChild className="shadow-blue">
                <Link to="/laptops">{t('hero.shopLaptops')} <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <Link to="/services">{t('hero.bookRepair')} <Wrench className="ml-2 rtl:ml-0 rtl:mr-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 pb-8">
          <div className="grid grid-cols-3 max-w-lg gap-4">
            {[
              ['10,000+', t('stats.happyCustomers')],
              ['500+', t('stats.skusInStock')],
              ['4.8/5', t('stats.customerRating')],
            ].map(([stat, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat}</div>
                <div className="text-xs text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: t('trust.warranty'), sub: t('trust.warrantyDesc') },
              { icon: Truck, label: t('trust.freeShipping'), sub: t('trust.freeShippingDesc') },
              { icon: RotateCcw, label: t('trust.returns'), sub: t('trust.returnsDesc') },
              { icon: Star, label: t('trust.expertSupport'), sub: t('trust.expertSupportDesc') },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('categories.title')}</h2>
          <p className="text-muted-foreground mb-8">{t('categories.subtitle')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: t('categories.laptopsTitle'), sub: t('categories.laptopsSub'), href: '/laptops', image: heroImg, cta: t('categories.shopLaptops'), badge: `10 ${t('categories.models')}` },
              { title: t('categories.partsTitle'), sub: t('categories.partsSub'), href: '/parts', image: partsImg, cta: t('categories.browseParts'), badge: `200+ ${t('categories.skus')}` },
              { title: t('categories.servicesTitle'), sub: t('categories.servicesSub'), href: '/services', image: repairImg, cta: t('categories.bookRepair'), badge: t('categories.fromFree') },
            ].map(cat => (
              <Link key={cat.href} to={cat.href} className="group relative overflow-hidden rounded-2xl bg-card border border-border card-hover shadow-product">
                <div className="relative h-48 overflow-hidden">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                  <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 text-xs font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{cat.badge}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-1">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cat.sub}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all gap-1">
                    {cat.cta} <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Laptops ── */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{t('featuredLaptops.title')}</h2>
              <p className="text-muted-foreground">{t('featuredLaptops.subtitle')}</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/laptops">{t('featuredLaptops.viewAll')} <ChevronRight className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1 rtl:rotate-180" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredLaptops.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* ── Repair Services Banner ── */}
      <section className="py-16 bg-hero overflow-hidden relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${repairImg})` }} aria-hidden="true" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 bg-primary/30 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Wrench className="w-3 h-3" /> {t('repairBanner.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('repairBanner.title')} <span className="text-gradient-hero">{t('repairBanner.titleHighlight')}</span>
            </h2>
            <p className="text-white/70 mb-8 text-lg">{t('repairBanner.subtitle')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {repairServices.slice(0, 3).map(svc => (
                <div key={svc.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left rtl:text-right border border-white/20">
                  <div className="text-white font-semibold mb-1">{svc.title}</div>
                  <div className="text-primary font-bold text-lg">{svc.price === 0 ? t('servicesPage.free') : `$${svc.price}`}</div>
                  <div className="text-white/50 text-xs mt-1">{svc.turnaround}</div>
                </div>
              ))}
            </div>
            <Button size="lg" asChild className="shadow-blue">
              <Link to="/services">{t('repairBanner.bookNow')} <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Featured Parts ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{t('featuredParts.title')}</h2>
              <p className="text-muted-foreground">{t('featuredParts.subtitle')}</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/parts">{t('featuredParts.viewAll')} <ChevronRight className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1 rtl:rotate-180" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredParts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('reviews.title')}</h2>
            <div className="flex items-center justify-center gap-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-warning text-warning" />)}
              <span className="text-lg font-bold text-foreground ml-1 rtl:ml-0 rtl:mr-1">4.8</span>
              <span className="text-muted-foreground">{t('reviews.from')}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((review, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-product">
                <div className="flex mb-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-warning text-warning' : 'fill-muted text-muted'}`} />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-3">"{review.text}"</p>
                <div>
                  <div className="text-sm font-semibold text-foreground">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.product}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('newsletter.title')}</h2>
          <p className="text-muted-foreground mb-6">{t('newsletter.subtitle')}</p>
          <form className="flex gap-2 max-w-md mx-auto">
            <Input type="email" placeholder={t('newsletter.placeholder')} className="flex-1 h-11" />
            <Button type="submit" className="h-11 px-6">{t('newsletter.subscribe')}</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">{t('newsletter.disclaimer')}</p>
        </div>
      </section>
    </main>
  );
}
