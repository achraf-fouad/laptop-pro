import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const AboutSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: 'Expertise Technologique',
      desc: 'Plus de 10 ans d\'expérience dans le domaine de l\'informatique et du gaming au Maroc.'
    },
    {
      title: 'Qualité Garantie',
      desc: 'Tous nos produits sont rigoureusement testés et bénéficient d\'une garantie officielle.'
    },
    {
      title: 'Service Client Dédié',
      desc: 'Une équipe d\'experts à votre écoute pour vous conseiller et vous accompagner.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-4 rounded-sm">
              {t('footer.about')}
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-6">
              Votre Partenaire <br />
              <span className="text-primary italic">Informatique au Maroc</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              MarocLaptop est le leader de la vente de matériel informatique haute performance au Maroc. 
              Nous nous engageons à fournir les meilleures solutions technologiques pour les professionnels, 
              les gamers et les particuliers en quête de performance.
            </p>
            
            <div className="space-y-6">
              {features.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl -rotate-2" />
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img 
                    src="/images/banners/hero.png" 
                    alt="MarocLaptop Workspace" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div className="text-white">
                        <p className="text-4xl font-black italic">100%</p>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 text-primary">Satisfaction Client</p>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
