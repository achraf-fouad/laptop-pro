import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import api from '@/lib/api';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  product?: {
    id: number;
    name: { fr: string; en?: string; ar?: string };
    image: string;
  };
}

const TestimonialsSection = () => {
  const { t, language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/reviews/featured');
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-30" />
      
      <div className="container relative z-10 px-4 md:px-12 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-6"
          >
            {t('testimonials.tag')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight mb-4"
          >
            {t('testimonials.title')} <span className="text-primary italic">{t('testimonials.titleHighlight')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-white/60 font-medium tracking-wide uppercase"
          >
            {t('testimonials.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 relative group hover:bg-white/10 transition-colors"
            >
              <Quote className="absolute top-8 right-8 h-12 w-12 text-white/5 group-hover:text-primary/10 transition-colors" />
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className={`h-4 w-4 ${index < review.rating ? 'fill-accent text-accent' : 'text-white/20'}`} />
                ))}
              </div>
              <p className="text-white/80 font-medium italic text-sm leading-relaxed mb-8 line-clamp-4">
                "{review.comment}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-lg shadow-inner">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white text-xs font-black uppercase tracking-widest">{review.author}</h4>
                  {review.product && (
                    <p className="text-primary/80 text-[9px] font-bold uppercase tracking-widest mt-1 truncate max-w-[150px]">
                      {t('testimonials.purchased')} {(review.product.name as any)[language] || review.product.name.fr}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
