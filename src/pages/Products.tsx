import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories as catData, brands } from '@/data/products';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { SlidersHorizontal, X, RefreshCw, ChevronRight, Home, LayoutGrid, List, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/lib/api';
import { Product, Category } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  // Auto-expand parent if a child category is selected via URL
  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const findParentId = (cats: Category[], targetSlugOrId: string): number | null => {
        for (const cat of cats) {
          if (cat.children) {
            if (cat.children.some(child => child.slug === targetSlugOrId || child.id.toString() === targetSlugOrId)) {
              return cat.id;
            }
            const foundId = findParentId(cat.children, targetSlugOrId);
            if (foundId) return foundId;
          }
        }
        return null;
      };
      
      const parentId = findParentId(categories, categoryParam);
      if (parentId) {
        setExpandedCategories(prev => ({ ...prev, [parentId]: true }));
      }
    }
  }, [categoryParam, categories]);

  const toggleCategory = (id: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (categoryParam) {
      // Find the selected category and all its children's IDs
      const getCategoryIds = (slugOrId: string, cats: Category[]): number[] => {
        const findCat = (list: Category[]): Category | undefined => {
          for (const c of list) {
            if (c.slug === slugOrId || c.id.toString() === slugOrId) return c;
            if (c.children) {
              const found = findCat(c.children);
              if (found) return found;
            }
          }
        };
        const target = findCat(cats);
        if (!target) return [];

        const ids: number[] = [target.id];
        const collectIds = (children: Category[]) => {
          children.forEach(child => {
            ids.push(child.id);
            if (child.children) collectIds(child.children);
          });
        };
        if (target.children) collectIds(target.children);
        return ids;
      };

      const allowedIds = getCategoryIds(categoryParam, categories);
      result = result.filter(p => p.category_id && allowedIds.includes(p.category_id));
    }
    
    if (searchParam) {
      const lowerQuery = searchParam.toLowerCase();
      result = result.filter(p => {
        const name = p.name[language] || p.name.fr || p.name.en || '';
        const description = typeof p.description === 'string' ? p.description : (p.description?.[language] || p.description?.fr || p.description?.en || '');
        return name.toLowerCase().includes(lowerQuery) || 
               description.toLowerCase().includes(lowerQuery) ||
               (p.brand && p.brand.toLowerCase().includes(lowerQuery));
      });
    }

    if (selectedBrand) result = result.filter(p => p.brand === selectedBrand);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a, b) => (a.name[language] || '').localeCompare(b.name[language] || ''));
    else result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    return result;
  }, [products, categoryParam, searchParam, categories, selectedBrand, sortBy, language]);

  const setCategory = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat) newParams.set('category', cat);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  const currentCategoryName = useMemo(() => {
    if (!categoryParam) return '';
    const findCategory = (cats: Category[]): Category | undefined => {
      for (const cat of cats) {
        if (cat.slug === categoryParam || cat.id.toString() === categoryParam) return cat;
        if (cat.children) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
    };
    const cat = findCategory(categories);
    return cat?.name[language] || categoryParam.toUpperCase();
  }, [categoryParam, categories, language]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Header />

      <div className="bg-white border-b border-border/50 py-6">
        <div className="container mx-auto px-4 lg:px-12">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary flex items-center gap-1 transition-colors">
              <Home className="h-3 w-3" />
              {t('products.breadcrumbHome')}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-20" />
            <span className="text-foreground">{t('products.breadcrumbShop')}</span>
            {categoryParam && (
              <>
                <ChevronRight className="h-3 w-3 opacity-20" />
                <span className="text-primary italic">{currentCategoryName}</span>
              </>
            )}
            {searchParam && (
              <>
                <ChevronRight className="h-3 w-3 opacity-20" />
                <span className="text-primary italic">Search: {searchParam}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
                {searchParam ? (
                  <>Results for <span className="text-primary italic">"{searchParam}"</span></>
                ) : (
                  <>{t('products.title')} <span className="text-primary italic">{t('products.titleHighlight')}</span></>
                )}
              </h1>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                {filtered.length} {t('products.found')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
              <div className="flex bg-secondary/50 p-1 rounded-lg">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}>
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border-border rounded-lg text-xs font-bold uppercase tracking-widest px-4 py-2.5 focus:ring-primary focus:border-primary"
              >
                <option value="popularity">{t('products.sort.popularity')}</option>
                <option value="price-asc">{t('products.sort.priceAsc')}</option>
                <option value="price-desc">{t('products.sort.priceDesc')}</option>
                <option value="name">{t('products.sort.name')}</option>
              </select>
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {t('products.filters')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 lg:px-12 flex gap-10">
          <aside className={`fixed inset-y-0 left-0 z-[60] w-80 bg-white p-8 overflow-y-auto transition-transform duration-300 lg:relative lg:translate-x-0 lg:p-0 lg:w-64 lg:bg-transparent lg:z-0 lg:block ${showFilters ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <h2 className="text-xl font-black uppercase tracking-tighter">{t('products.filters')}</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 bg-secondary rounded-full"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-10">
              <div className="bg-white lg:rounded-2xl lg:p-6 lg:border lg:border-border/50 lg:shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" />
                  {t('products.categoriesLabel')}
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setCategory('')}
                    className={`text-start text-[10px] font-black uppercase tracking-widest px-3 py-2.5 rounded-lg transition-all ${!categoryParam ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-secondary'}`}
                  >
                    {t('products.allCatalog')}
                  </button>
                  {categories.map(cat => {
                    const isExpanded = expandedCategories[cat.id];
                    const hasChildren = cat.children && cat.children.length > 0;
                    const isActive = categoryParam === cat.slug;
                    
                    return (
                      <div key={cat.id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 group/cat">
                          <button
                            onClick={() => {
                              setCategory(cat.slug);
                              if (hasChildren) toggleCategory(cat.id);
                            }}
                            className={`flex-1 text-start text-[10px] font-black uppercase tracking-widest px-3 py-2.5 rounded-lg transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-secondary'}`}
                          >
                            {cat.name[language]}
                          </button>
                          {hasChildren && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(cat.id);
                              }}
                              className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
                            >
                              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {hasChildren && isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 pl-2 border-l-2 border-primary/20 flex flex-col gap-1 mt-1 mb-2">
                                {cat.children?.map(child => (
                                  <button
                                    key={child.id}
                                    onClick={() => setCategory(child.slug)}
                                    className={`text-start text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded-md transition-all ${categoryParam === child.slug ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground/70 hover:text-primary hover:bg-primary/5'}`}
                                  >
                                    {child.name[language]}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white lg:rounded-2xl lg:p-6 lg:border lg:border-border/50 lg:shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" />
                  {t('products.brandsLabel')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedBrand('')}
                    className={`text-center text-[10px] font-black uppercase tracking-widest py-2 rounded-lg border transition-all ${!selectedBrand ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                  >
                    {t('products.allBrands')}
                  </button>
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`text-center text-[10px] font-black uppercase tracking-widest py-2 rounded-lg border transition-all ${selectedBrand === brand ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24">
                  <RefreshCw className="h-12 w-12 animate-spin text-primary opacity-20 mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">{t('products.loading')}</p>
                </motion.div>
              ) : filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24">
                  <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                    <SlidersHorizontal className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t('products.noResults')}</p>
                  <button
                    onClick={() => { 
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('category');
                      newParams.delete('search');
                      setSearchParams(newParams);
                      setSelectedBrand(''); 
                    }}
                    className="mt-6 text-xs font-black text-primary underline underline-offset-4 uppercase tracking-widest"
                  >
                    {t('products.resetFilters')}
                  </button>
                </motion.div>
              ) : (
                <motion.div layout className={`grid gap-3 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
      {showFilters && <div className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setShowFilters(false)} />}
    </div>
  );
};

export default Products;
