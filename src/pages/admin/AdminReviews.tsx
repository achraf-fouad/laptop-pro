import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Star, CheckCircle, XCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: { fr: string };
  image: string;
}

interface Review {
  id: number;
  product_id: number;
  product: Product;
  author: string;
  rating: number;
  comment: string;
  status: string;
  is_featured: boolean;
  created_at: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reviews/pending');
      setReviews(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'decline' | 'toggle-featured' | 'delete') => {
    try {
      if (action === 'delete') {
         if (!confirm('Voulez-vous vraiment supprimer cet avis ?')) return;
         await api.delete(`/reviews/${id}`);
         toast.success('Avis supprimé');
      } else {
         await api.post(`/reviews/${id}/${action}`);
         toast.success(`Action ${action} effectuée`);
      }
      fetchReviews();
    } catch (error) {
      toast.error('L\'action a échoué');
    }
  };

  const filtered = reviews.filter(r => filter === 'all' || r.status === filter);

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-[1] mb-2 italic">Avis <span className="text-primary">Clients</span></h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">GÉREZ LES TÉMOIGNAGES DE VOS CLIENTS</p>
         </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
         <select
           value={filter}
           onChange={(e) => setFilter(e.target.value)}
           className="h-12 flex-1 rounded-xl bg-secondary/30 border-none px-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20"
         >
            <option value="all">TOUS LES AVIS</option>
            <option value="pending">EN ATTENTE</option>
            <option value="approved">APPROUVÉS</option>
            <option value="declined">REFUSÉS</option>
         </select>
         <button onClick={fetchReviews} className="h-12 w-12 flex items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
         </button>
      </div>

      <div className="rounded-3xl border border-border/40 bg-white shadow-sm overflow-hidden p-8">
        {loading ? (
            <div className="py-24 text-center"><RefreshCw className="h-10 w-10 animate-spin mx-auto text-primary opacity-20" /></div>
        ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 flex flex-col items-center">
                <MessageSquare className="h-12 w-12 opacity-20 mb-4" />
                Aucun avis trouvé
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filtered.map(review => (
                 <motion.div key={review.id} layout className="rounded-2xl border border-border/50 p-6 flex flex-col bg-secondary/10 relative group">
                    <div className="absolute top-4 right-4 flex gap-2">
                       {review.status === 'pending' && (
                         <>
                           <button onClick={() => handleAction(review.id, 'approve')} className="h-8 w-8 rounded-full bg-success/20 text-success flex items-center justify-center hover:bg-success hover:text-white transition-colors" title="Approuver">
                              <CheckCircle className="h-4 w-4" />
                           </button>
                           <button onClick={() => handleAction(review.id, 'decline')} className="h-8 w-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-colors" title="Refuser">
                              <XCircle className="h-4 w-4" />
                           </button>
                         </>
                       )}
                       {review.status === 'approved' && (
                          <button 
                            onClick={() => handleAction(review.id, 'toggle-featured')} 
                            className={cn("h-8 px-3 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center justify-center transition-colors", review.is_featured ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white')}
                          >
                             {review.is_featured ? 'Retirer de Accueil' : 'Mettre en Accueil'}
                          </button>
                       )}
                    </div>

                    <div className="flex items-center gap-4 mb-4 mt-2">
                       <div className="h-10 w-10 rounded-xl bg-white p-1 border border-border/20 shadow-sm shrink-0">
                          {review.product?.image ? (
                              <img src={review.product.image} className="w-full h-full object-contain" alt="product" />
                          ) : (
                              <div className="w-full h-full bg-secondary rounded flex items-center justify-center text-[8px] font-black text-muted-foreground">N/A</div>
                          )}
                       </div>
                       <div className="flex flex-col min-w-0 pr-16">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate">
                             {review.product ? review.product.name.fr : 'Produit supprimé'}
                          </span>
                          <span className="text-xs font-black uppercase tracking-widest truncate">{review.author}</span>
                       </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                       {Array.from({ length: 5 }).map((_, i) => (
                           <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-warning text-warning" : "text-muted-foreground/30")} />
                       ))}
                    </div>

                    <p className="text-xs text-muted-foreground italic leading-relaxed mb-6 flex-1 line-clamp-4">
                       "{review.comment}"
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
                       <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
                          {new Date(review.created_at).toLocaleDateString()}
                       </span>
                       <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md", 
                          review.status === 'pending' ? 'bg-warning/20 text-warning' : 
                          review.status === 'approved' ? 'bg-success/20 text-success' : 
                          'bg-destructive/20 text-destructive'
                       )}>
                          {review.status === 'pending' ? 'EN ATTENTE' : review.status === 'approved' ? 'APPROUVÉ' : 'REFUSÉ'}
                       </span>
                    </div>
                 </motion.div>
               ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
