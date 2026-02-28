import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Pencil, Trash2, Plus, Search, RefreshCw, X, Save, ImagePlus, MoreVertical, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Product {
  id: number;
  name: { fr: string; en: string; ar: string };
  description: { fr: string; en: string; ar: string };
  price: number;
  category: string;
  brand: string;
  image: string;
  image_2?: string;
  image_3?: string;
  stock_status: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [selectedFile3, setSelectedFile3] = useState<File | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produit supprimé');
      fetchProducts();
    } catch (error) {
      toast.error('La suppression a échoué');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const formData = new FormData();
      
      if (selectedFile) formData.append('image', selectedFile);
      else if (editingProduct.image === '') formData.append('image', ''); 

      if (selectedFile2) formData.append('image_2', selectedFile2);
      else if (editingProduct.image_2 === '') formData.append('image_2', '');

      if (selectedFile3) formData.append('image_3', selectedFile3);
      else if (editingProduct.image_3 === '') formData.append('image_3', '');

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
      formData.append('category', editingProduct.category || '');
      formData.append('stock_status', editingProduct.stock_status || '');
      formData.append('brand', editingProduct.brand || '');

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
      setSelectedFile(null);
      setSelectedFile2(null);
      setSelectedFile3(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const openAddDialog = () => {
    setEditingProduct({
      name: { fr: '', en: '', ar: '' },
      description: { fr: '', en: '', ar: '' },
      price: 0,
      category: 'laptops',
      brand: '',
      image: '',
      image_2: '',
      image_3: '',
      stock_status: 'in_stock'
    });
    setSelectedFile(null);
    setSelectedFile2(null);
    setSelectedFile3(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct({ ...product });
    setSelectedFile(null);
    setSelectedFile2(null);
    setSelectedFile3(null);
    setIsDialogOpen(true);
  };

  const filtered = products.filter((p) =>
    (p.name?.fr || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(search.toLowerCase())
  );

  const clearImage = (field: 'image' | 'image_2' | 'image_3') => {
      setEditingProduct(prev => ({ ...prev!, [field]: '' }));
      if (field === 'image') setSelectedFile(null);
      if (field === 'image_2') setSelectedFile2(null);
      if (field === 'image_3') setSelectedFile3(null);
  };

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
         <button onClick={fetchProducts} className="h-12 w-12 flex items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all">
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
                        {p.image ? (
                           <img src={p.image} alt="" className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
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
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{p.category}</span>
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
                    value={editingProduct?.category || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  >
                    <option value="laptops">PC PORTABLES</option>
                    <option value="screens">ÉCRANS & MONITEURS</option>
                    <option value="peripherals">PÉRIPHÉRIQUES</option>
                    <option value="gaming">GAMING SETUP</option>
                    <option value="printers">IMPRIMANTES</option>
                  </select>
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

            <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">Visuels du Produit (Jusqu'à 3 images)</Label>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Image 1 */}
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-border/40 rounded-3xl bg-secondary/10 relative">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Image Principale</p>
                     <div className="h-32 w-32 rounded-2xl bg-white border border-border/20 p-2 flex items-center justify-center shrink-0 shadow-sm relative group overflow-hidden">
                       {(selectedFile || editingProduct?.image) ? (
                         <>
                           <img src={selectedFile ? URL.createObjectURL(selectedFile) : editingProduct?.image} alt="Preview" className="max-h-full max-w-full object-contain" />
                           <button type="button" onClick={() => clearImage('image')} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="h-5 w-5" />
                           </button>
                         </>
                       ) : (
                         <ImagePlus className="h-8 w-8 text-muted-foreground/20" />
                       )}
                     </div>
                     <label className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 mt-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all cursor-pointer">
                        <Download className="h-3 w-3 -rotate-180" /> Choisir
                        <input type="file" className="hidden" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                     </label>
                  </div>
                  
                  {/* Image 2 */}
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-border/40 rounded-3xl bg-secondary/10 relative">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Image 2 (Optionnelle)</p>
                     <div className="h-32 w-32 rounded-2xl bg-white border border-border/20 p-2 flex items-center justify-center shrink-0 shadow-sm relative group overflow-hidden">
                       {(selectedFile2 || editingProduct?.image_2) ? (
                         <>
                           <img src={selectedFile2 ? URL.createObjectURL(selectedFile2) : editingProduct?.image_2} alt="Preview" className="max-h-full max-w-full object-contain" />
                           <button type="button" onClick={() => clearImage('image_2')} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="h-5 w-5" />
                           </button>
                         </>
                       ) : (
                         <ImagePlus className="h-8 w-8 text-muted-foreground/20" />
                       )}
                     </div>
                     <label className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 mt-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all cursor-pointer">
                        <Download className="h-3 w-3 -rotate-180" /> Choisir
                        <input type="file" className="hidden" accept="image/*" onChange={e => setSelectedFile2(e.target.files?.[0] || null)} />
                     </label>
                  </div>

                  {/* Image 3 */}
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-border/40 rounded-3xl bg-secondary/10 relative">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Image 3 (Optionnelle)</p>
                     <div className="h-32 w-32 rounded-2xl bg-white border border-border/20 p-2 flex items-center justify-center shrink-0 shadow-sm relative group overflow-hidden">
                       {(selectedFile3 || editingProduct?.image_3) ? (
                         <>
                           <img src={selectedFile3 ? URL.createObjectURL(selectedFile3) : editingProduct?.image_3} alt="Preview" className="max-h-full max-w-full object-contain" />
                           <button type="button" onClick={() => clearImage('image_3')} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="h-5 w-5" />
                           </button>
                         </>
                       ) : (
                         <ImagePlus className="h-8 w-8 text-muted-foreground/20" />
                       )}
                     </div>
                     <label className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 mt-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all cursor-pointer">
                        <Download className="h-3 w-3 -rotate-180" /> Choisir
                        <input type="file" className="hidden" accept="image/*" onChange={e => setSelectedFile3(e.target.files?.[0] || null)} />
                     </label>
                  </div>
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
