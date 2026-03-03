import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Pencil, Trash2, Plus, Search, RefreshCw, X, Save, ImagePlus, MoreVertical, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Category {
  id: number;
  name: { fr: string; en: string; ar: string };
  slug: string;
  parent_id?: number | null;
  level?: number;
}

interface Product {
  id: number;
  name: { fr: string; en: string; ar: string };
  description: { fr: string; en: string; ar: string };
  price: number;
  original_price?: number;
  category_id?: number;
  category?: Category;
  brand: string;
  images: string[];
  stock: number;
  stock_status: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(productsData);

      // Flatten categories for dropdown
      const flattened: Category[] = [];
      const flatten = (cats: any[], level = 0) => {
        cats.forEach(cat => {
          flattened.push({ ...cat, level });
          if (cat.children && cat.children.length > 0) {
            flatten(cat.children, level + 1);
          }
        });
      };
      flatten(categoriesData);
      setCategories(flattened);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Generate previews for selected files
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Cleanup URLs on unmount or when selectedFiles changes
    return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produit supprimé');
      fetchData();
    } catch (error) {
      toast.error('La suppression a échoué');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedFiles.length + filesArray.length > 10) {
        toast.error('Maximum 10 images autorisées');
        return;
      }
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    if (editingProduct?.images) {
      const newImages = editingProduct.images.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, images: newImages });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const formData = new FormData();

      // Handle name and description (JSON)
      if (editingProduct.name) {
        Object.entries(editingProduct.name).forEach(([lang, val]) => {
          formData.append(`name[${lang}]`, val as string);
        });
      }
      if (editingProduct.description) {
        Object.entries(editingProduct.description).forEach(([lang, val]) => {
          formData.append(`description[${lang}]`, val as string);
        });
      }

      formData.append('price', String(editingProduct.price));
      if (editingProduct.original_price) {
        formData.append('original_price', String(editingProduct.original_price));
      }
      formData.append('category_id', String(editingProduct.category_id || ''));
      formData.append('stock', String(editingProduct.stock || 0));
      formData.append('stock_status', editingProduct.stock_status || 'in_stock');
      formData.append('brand', editingProduct.brand || '');

      // Append existing images that were NOT removed
      if (editingProduct.images) {
        editingProduct.images.forEach((img, idx) => {
          formData.append(`existing_images[${idx}]`, img);
        });
      }

      // Append new files
      selectedFiles.forEach((file) => {
        formData.append('images[]', file);
      });

      if (editingProduct.id) {
        formData.append('_method', 'PUT');
        await api.post(`/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Produit mis à jour');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Produit créé avec succès');
      }
      setIsDialogOpen(false);
      setSelectedFiles([]);
      fetchData();
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Erreur lors de l\'enregistrement';
      toast.error(message);
    }
  };

  const openAddDialog = () => {
    setEditingProduct({
      name: { fr: '', en: '', ar: '' },
      description: { fr: '', en: '', ar: '' },
      price: 0,
      original_price: 0,
      category_id: categories.length > 0 ? categories[0].id : 0,
      brand: '',
      images: [],
      stock: 0,
      stock_status: 'in_stock'
    });
    setSelectedFiles([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct({ ...product });
    setSelectedFiles([]);
    setIsDialogOpen(true);
  };

  const filtered = products.filter((p) =>
    (p.name?.fr || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-[1] mb-2 italic">Gestion <span className="text-primary">Produits</span></h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">GÉREZ VOTRE CATALOGUE ET VOS STOCKS</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-xl bg-white border-border/50 text-[10px] font-black uppercase tracking-widest gap-2 shadow-sm">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={openAddDialog} className="h-12 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            <Plus className="h-5 w-5" />
            Ajouter un Produit
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="RECHERCHER PAR NOM, MARQUE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/30 border-none rounded-xl pl-12 pr-4 py-3.5 text-xs font-black uppercase tracking-widest placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all">
          <Filter className="h-4 w-4" />
        </button>
        <button onClick={fetchData} className="h-12 w-12 flex items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
      </div>

      <div className="rounded-3xl border border-border/40 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-border/20">
              <th className="px-8 py-5 text-start">Produit</th>
              <th className="px-8 py-5 text-start">Catégorie</th>
              <th className="px-8 py-5 text-start">Marque</th>
              <th className="px-8 py-5 text-end">Prix</th>
              <th className="px-8 py-5 text-start">Stock</th>
              <th className="px-8 py-5 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {loading ? (
              <tr><td colSpan={6} className="py-24 text-center"><RefreshCw className="h-10 w-10 animate-spin mx-auto text-primary opacity-20" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Aucun produit trouvé</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-secondary/50 border border-border/20 p-2 flex items-center justify-center shrink-0">
                        {p.images && p.images.length > 0 ? (
                          <img src={p.images[0]} alt="" className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <ImagePlus className="h-4 w-4 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">{p.name.fr}</span>
                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">REF: {p.id.toString().padStart(6, '0')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{p.category?.name.fr || 'N/A'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary italic font-bold">{p.brand}</span>
                  </td>
                  <td className="px-8 py-5 text-end">
                    <span className="text-sm font-black italic tracking-tighter text-primary">{p.price.toLocaleString()} DH</span>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={p.stock_status} />
                  </td>
                  <td className="px-8 py-5 text-end">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditDialog(p)} className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-all">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-destructive hover:text-white transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
          <div className="bg-[#0a0a0a] text-white p-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">
              {editingProduct?.id ? 'Modifier' : 'Nouveau'} <span className="text-primary italic">Produit</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">ÉDITION DU CATALOGUE EN TEMPS RÉEL</p>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom du Produit (FR)</Label>
                <Input
                  value={editingProduct?.name?.fr}
                  onChange={e => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name!, fr: e.target.value } })}
                  required
                  className="h-12 rounded-xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/20"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prix de Vente (DH)</Label>
                <Input
                  type="number"
                  value={editingProduct?.price || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  required
                  className="h-12 rounded-xl bg-secondary/30 border-none font-black italic text-primary"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prix Original (DH)</Label>
                <Input
                  type="number"
                  value={editingProduct?.original_price || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, original_price: parseFloat(e.target.value) })}
                  className="h-12 rounded-xl bg-secondary/30 border-none font-black italic text-muted-foreground"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Marque</Label>
                <Input
                  value={editingProduct?.brand || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  className="h-12 rounded-xl bg-secondary/30 border-none font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catégorie</Label>
                <select
                  className="w-full h-12 rounded-xl bg-secondary/30 border-none px-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20"
                  value={editingProduct?.category_id || ''}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    setEditingProduct({ ...editingProduct, category_id: isNaN(val) ? undefined : val })
                  }}
                >
                  <option value="">SÉLECTIONNER UNE CATÉGORIE</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.level ? "— ".repeat(cat.level) : ""}{cat.name.fr.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quantité en Stock</Label>
                <Input
                  type="number"
                  value={editingProduct?.stock || 0}
                  onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                  className="h-12 rounded-xl bg-secondary/30 border-none font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">État du Stock</Label>
                <select
                  className="w-full h-12 rounded-xl bg-secondary/30 border-none px-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20"
                  value={editingProduct?.stock_status || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, stock_status: e.target.value })}
                >
                  <option value="in_stock">EN STOCK</option>
                  <option value="low_stock">STOCK FAIBLE</option>
                  <option value="out_of_stock">RUPTURE DE STOCK</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">
                Images du Produit ({(editingProduct?.images?.length || 0) + selectedFiles.length}/10)
              </Label>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Existing Images */}
                {editingProduct?.images?.map((img, index) => (
                  <div key={`existing-${index}`} className="group relative aspect-square rounded-2xl bg-secondary/10 border border-border/40 overflow-hidden shadow-sm">
                    <img src={img} alt="" className="h-full w-full object-contain p-2" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute inset-0 bg-destructive/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                {/* New Previews */}
                {previews.map((url, index) => (
                  <div key={`new-${index}`} className="group relative aspect-square rounded-2xl bg-primary/5 border border-primary/20 overflow-hidden shadow-sm">
                    <img src={url} alt="" className="h-full w-full object-contain p-2" />
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(index)}
                      className="absolute inset-0 bg-destructive/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <div className="absolute top-2 right-2 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">NOUVEAU</div>
                  </div>
                ))}

                {/* Add Button */}
                {(editingProduct?.images?.length || 0) + selectedFiles.length < 10 && (
                  <label className="aspect-square rounded-2xl bg-secondary/10 border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/20 hover:border-primary/50 transition-all group">
                    <ImagePlus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">Ajouter</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description Technique (FR)</Label>
              <textarea
                className="w-full min-h-[120px] rounded-2xl bg-secondary/30 border-none p-6 text-xs font-bold leading-relaxed placeholder:text-muted-foreground/20 focus:ring-2 focus:ring-primary/20"
                value={editingProduct?.description?.fr || ''}
                onChange={e => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description!, fr: e.target.value } })}
                placeholder="Saisissez les détails techniques du produit..."
              />
            </div>

            <DialogFooter className="flex items-center gap-4 bg-secondary/20 -mx-8 -mb-8 p-8 rounded-b-3xl mt-12">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent hover:text-primary">
                Annuler l'édition
              </Button>
              <Button type="submit" className="h-14 px-10 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                <Save className="h-5 w-5 mr-3" />
                Enregistrer les Modifications
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const statusColors: Record<string, string> = {
  in_stock: 'bg-success/10 text-success border-success/20',
  low_stock: 'bg-warning/10 text-warning border-warning/20',
  out_of_stock: 'bg-destructive/10 text-destructive border-destructive/20',
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-[8px] font-black uppercase tracking-widest", statusColors[status] || 'bg-secondary text-muted-foreground border-border')}>
    <div className={cn("h-1 w-1 rounded-full mr-1.5", status === 'in_stock' ? 'bg-success' : status === 'low_stock' ? 'bg-warning animate-pulse' : 'bg-destructive')} />
    {status === 'in_stock' ? 'En Stock' : status === 'low_stock' ? 'Faible' : 'Rupture'}
  </span>
);

export default AdminProducts;
