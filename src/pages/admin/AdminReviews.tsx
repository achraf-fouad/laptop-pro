import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
   Star,
   RefreshCw,
   RefreshCcw,
   CheckCircle,
   XCircle,
   Trash2,
   MessageSquare,
   ThumbsUp,
   Image as ImageIcon,
   ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Review } from '@/types/review';

const AdminReviews = () => {
   const [reviews, setReviews] = useState<Review[]>([]);
   const [loading, setLoading] = useState(true);
   const [filter, setFilter] = useState<string>('all'); // all, approved:0, approved:1

   const fetchReviews = async () => {
      setLoading(true);
      try {
         const params: any = {};
         if (filter !== 'all') {
            params.approved = filter === 'approved' ? 1 : 0;
         }
         const { data } = await api.get('/reviews', { params });
         setReviews(data.data || data);
      } catch (error) {
         console.error(error);
         toast.error('Erreur lors du chargement des avis');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchReviews();
   }, [filter]);

   const handleAction = async (id: number, action: 'approve' | 'delete' | 'toggle-featured') => {
      try {
         if (action === 'delete') {
            if (!confirm('Voulez-vous vraiment supprimer cet avis ?')) return;
            await api.delete(`/reviews/${id}`);
            toast.success('Avis supprimé');
         } else if (action === 'approve') {
            await api.post(`/reviews/${id}/approve`);
            toast.success('Statut d\'approbation mis à jour');
         } else if (action === 'toggle-featured') {
            await api.post(`/reviews/${id}/toggle-featured`);
            toast.success('Statut de mise en avant mis à jour');
         }
         fetchReviews();
      } catch (error) {
         toast.error('L\'action a échoué');
      }
   };

   return (
      <div className="p-8 space-y-10">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-[1] mb-2 italic">Modération <span className="text-primary">Avis</span></h2>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">GÉREZ LES RETOURS ET TÉMOIGNAGES CLIENTS</p>
            </div>
         </div>

         <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
            <select
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="h-12 flex-1 md:flex-none md:w-64 rounded-xl bg-secondary/30 border-none px-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20"
            >
               <option value="all">TOUS LES AVIS</option>
               <option value="pending">EN ATTENTE (MODÉRATION)</option>
               <option value="approved">APPROUVÉS</option>
            </select>
            <button onClick={fetchReviews} className="h-12 w-12 flex items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
               <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
         </div>

         <div className="min-h-[400px]">
            {loading ? (
               <div className="py-24 text-center"><RefreshCw className="h-10 w-10 animate-spin mx-auto text-primary opacity-20" /></div>
            ) : reviews.length === 0 ? (
               <div className="py-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 flex flex-col items-center">
                  <MessageSquare className="h-12 w-12 opacity-20 mb-4" />
                  Aucun avis à afficher
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence>
                     {reviews.map(review => (
                        <motion.div
                           key={review.id}
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           className="rounded-3xl border border-border/40 p-6 flex flex-col bg-white shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                        >
                           <div className={cn(
                              "absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest",
                              review.approved ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                           )}>
                              {review.approved ? 'Approuvé' : 'En attente'}
                           </div>

                           <div className="flex items-center gap-4 mb-6">
                              <div className="h-12 w-12 rounded-xl bg-secondary/50 p-2 border border-border/20 flex items-center justify-center shrink-0">
                                 {review.product?.images && review.product.images.length > 0 ? (
                                    <img src={review.product.images[0]} className="w-full h-full object-contain" alt="P" />
                                 ) : (
                                    <ImageIcon className="h-4 w-4 text-muted-foreground/20" />
                                 )}
                              </div>
                              <div className="flex flex-col min-w-0 pr-12">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate leading-tight">
                                    {review.product ? (typeof review.product.name === 'string' ? review.product.name : (review.product.name.fr || Object.values(review.product.name)[0])) : 'Produit inconnu'}
                                 </span>
                                 <span className="text-xs font-black uppercase tracking-tighter truncate mt-0.5">{review.author}</span>
                              </div>
                           </div>

                           <div className="flex items-center gap-1 mb-4">
                              {Array.from({ length: 5 }).map((_, i) => (
                                 <Star key={i} className={cn("h-3.5 w-3.5", i < review.rating ? "fill-warning text-warning" : "text-muted-foreground/20")} />
                              ))}
                              <span className="ml-2 text-[10px] font-black text-muted-foreground/50">{new Date(review.created_at).toLocaleDateString()}</span>
                           </div>

                           <div className="flex-1 bg-secondary/20 p-4 rounded-2xl relative mb-6 group-hover:bg-primary/5 transition-colors">
                              <MessageSquare className="absolute -top-3 -left-2 h-6 w-6 text-primary/10" />
                              <p className="text-xs text-muted-foreground font-medium italic leading-relaxed line-clamp-4">
                                 "{review.comment}"
                              </p>
                           </div>

                           <div className="flex items-center gap-2 pt-4 border-t border-border/20">
                              <button
                                 onClick={() => handleAction(review.id, 'approve')}
                                 className={cn(
                                    "flex-1 h-10 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm",
                                    review.approved
                                       ? "bg-secondary text-muted-foreground hover:bg-warning/20 hover:text-warning"
                                       : "bg-success text-white hover:bg-success/90 shadow-success/20 shadow-lg"
                                 )}
                              >
                                 {review.approved ? <RefreshCcw className="h-3 w-3" /> : <ThumbsUp className="h-3 w-3" />}
                                 {review.approved ? 'ANNULER APPROBATION' : 'APPROUVER L\'AVIS'}
                              </button>
                              <button
                                 onClick={() => handleAction(review.id, 'toggle-featured')}
                                 className={cn(
                                    "h-10 px-3 rounded-xl border transition-all",
                                    review.is_featured
                                       ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                       : "bg-white text-muted-foreground border-border/50 hover:bg-secondary"
                                 )}
                                 title="Mettre en avant sur la page d'accueil"
                              >
                                 <Star className={cn("h-4 w-4", review.is_featured && "fill-current")} />
                              </button>
                              <button
                                 onClick={() => handleAction(review.id, 'delete')}
                                 className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground hover:bg-destructive hover:text-white transition-all shadow-sm"
                              >
                                 <Trash2 className="h-4 w-4" />
                              </button>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            )}
         </div>
      </div>
   );
};

export default AdminReviews;
