import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      image: '/images/banners/hero.png',
      tag: t('hero.slide1.tag'),
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
      description: t('hero.slide1.desc'),
      cta: t('hero.slide1.cta'),
      link: '/products?category=gaming',
      btnColor: 'bg-primary'
    },
    {
      image: '/images/banners/monitors.png',
      tag: t('hero.slide2.tag'),
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
      description: t('hero.slide2.desc'),
      cta: t('hero.slide2.cta'),
      link: '/products?category=screens',
      btnColor: 'bg-accent'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[480px] lg:h-[600px] overflow-hidden bg-[#111]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <img src={slides[current].image} alt={slides[current].title} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4 lg:px-12 relative z-20 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 bg-primary text-[10px] font-black tracking-widest uppercase mb-4 rounded-sm">
              {slides[current].tag}
            </span>
            <h1 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
              {slides[current].title} <br />
              <span className="text-primary italic">{slides[current].subtitle}</span>
            </h1>
            <p className="text-sm lg:text-lg text-white/70 font-medium uppercase tracking-wide max-w-lg mb-8">
              {slides[current].description}
            </p>
            <div className="flex items-center gap-4">
              <Link
                to={slides[current].link}
                className={`${slides[current].btnColor} text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-110 transition-transform shadow-lg shadow-primary/20 flex items-center gap-2`}
              >
                {slides[current].cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3">
        <button onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)} className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={() => setCurrent((prev) => (prev + 1) % slides.length)} className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-1 transition-all rounded-full ${current === i ? 'w-12 bg-primary' : 'w-4 bg-white/20'}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
