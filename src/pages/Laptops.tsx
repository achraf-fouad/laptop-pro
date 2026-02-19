import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { laptops } from '@/data/products';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const brands = ['All', 'Lenovo', 'Dell', 'HP', 'ASUS', 'Microsoft', 'Acer'];
const conditions = ['All', 'New', 'Refurbished'];
const priceRanges = [
  { label: 'anyPrice', min: 0, max: Infinity },
  { label: 'under400', min: 0, max: 400 },
  { label: '$400–$600', min: 400, max: 600 },
  { label: '$600–$900', min: 600, max: 900 },
  { label: 'over900', min: 900, max: Infinity },
];

export default function Laptops() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [condition, setCondition] = useState(params.get('condition') || 'All');
  const [priceRange, setPriceRange] = useState(0);
  const [sort, setSort] = useState('Featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    let list = [...laptops];
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (brand !== 'All') list = list.filter(p => p.brand === brand);
    if (condition !== 'All') list = list.filter(p => p.condition === condition);
    const range = priceRanges[priceRange];
    list = list.filter(p => p.price >= range.min && p.price <= range.max);
    if (sort === 'Price: Low to High') list.sort((a, b) => a.price - b.price);
    else if (sort === 'Price: High to Low') list.sort((a, b) => b.price - a.price);
    else if (sort === 'Top Rated') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [search, brand, condition, priceRange, sort]);

  const getPriceLabel = (i: number) => {
    if (i === 0) return t('laptopsPage.anyPrice');
    if (i === 1) return t('laptopsPage.under400');
    if (i === 4) return t('laptopsPage.over900');
    return priceRanges[i].label;
  };

  const activeFilters = [
    brand !== 'All' && brand,
    condition !== 'All' && condition,
    priceRange !== 0 && getPriceLabel(priceRange),
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-secondary text-secondary-foreground py-10">
        <div className="container mx-auto px-4">
          <nav className="text-xs text-white/50 mb-3">
            <a href="/" className="hover:text-white">{t('laptopsPage.breadcrumbHome')}</a> / <span className="text-white/80">{t('laptopsPage.breadcrumbLaptops')}</span>
          </nav>
          <h1 className="text-3xl font-bold text-white mb-2">{t('laptopsPage.title')}</h1>
          <p className="text-white/60">{t('laptopsPage.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('laptopsPage.searchPlaceholder')} className="pl-9 rtl:pl-3 rtl:pr-9" />
          </div>
          <div className="flex gap-2">
            <select value={sort} onChange={e => setSort(e.target.value)} className="px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="Featured">{t('laptopsPage.featured')}</option>
              <option value="Price: Low to High">{t('laptopsPage.priceLowHigh')}</option>
              <option value="Price: High to Low">{t('laptopsPage.priceHighLow')}</option>
              <option value="Top Rated">{t('laptopsPage.topRated')}</option>
              <option value="Newest">{t('laptopsPage.newest')}</option>
            </select>
            <Button variant="outline" onClick={() => setFiltersOpen(v => !v)} className="sm:hidden">
              <SlidersHorizontal className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('laptopsPage.filters')} {activeFilters.length > 0 && `(${activeFilters.length})`}
            </Button>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(f => (
              <span key={f} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                {f}
                <button onClick={() => { if (f === brand) setBrand('All'); else if (f === condition) setCondition('All'); else setPriceRange(0); }}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button onClick={() => { setBrand('All'); setCondition('All'); setPriceRange(0); }} className="text-xs text-muted-foreground hover:text-foreground underline">{t('laptopsPage.clearAll')}</button>
          </div>
        )}

        <div className="flex gap-6">
          <aside className={`${filtersOpen ? 'block' : 'hidden'} sm:block w-full sm:w-56 shrink-0 space-y-6`}>
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">{t('laptopsPage.brand')}</h3>
              <div className="space-y-2">
                {brands.map(b => (
                  <button key={b} onClick={() => setBrand(b)} className={`w-full text-left rtl:text-right text-sm px-2 py-1 rounded-lg transition-colors ${brand === b ? 'bg-primary text-primary-foreground font-medium' : 'text-foreground hover:bg-muted'}`}>
                    {b === 'All' ? t('laptopsPage.all') : b}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">{t('laptopsPage.condition')}</h3>
              <div className="space-y-2">
                {conditions.map(c => (
                  <button key={c} onClick={() => setCondition(c)} className={`w-full text-left rtl:text-right text-sm px-2 py-1 rounded-lg transition-colors ${condition === c ? 'bg-primary text-primary-foreground font-medium' : 'text-foreground hover:bg-muted'}`}>
                    {c === 'All' ? t('laptopsPage.all') : c}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">{t('laptopsPage.priceRange')}</h3>
              <div className="space-y-2">
                {priceRanges.map((_, i) => (
                  <button key={i} onClick={() => setPriceRange(i)} className={`w-full text-left rtl:text-right text-sm px-2 py-1 rounded-lg transition-colors ${priceRange === i ? 'bg-primary text-primary-foreground font-medium' : 'text-foreground hover:bg-muted'}`}>
                    {getPriceLabel(i)}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">{t('laptopsPage.found', { count: filtered.length })}</p>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">{t('laptopsPage.noResults')}</p>
                <Button onClick={() => { setBrand('All'); setCondition('All'); setPriceRange(0); setSearch(''); }}>{t('laptopsPage.clearFilters')}</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
