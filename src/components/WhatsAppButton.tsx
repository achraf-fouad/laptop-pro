import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaWhatsapp } from "react-icons/fa6";

const WHATSAPP_NUMBER = '212644459980';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useLanguage();

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsapp.message'))}`;

  return (
    <div className="fixed bottom-32 start-4 sm:end-6 z-40 flex flex-col items-start sm:items-end gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 md:px-4 md:py-2.5 text-[10px] md:text-sm font-medium text-foreground shadow-elevated"
          >
            <span>{t('whatsapp.tooltip')}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Dismiss tooltip"
            >
              <X className="h-3 w-3 md:h-3.5 md:w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('whatsapp.label')}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:ring-offset-2"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/30" style={{ animationDuration: '2.5s' }} />

        <FaWhatsapp className="h-5 w-5 md:h-8 md:w-8 fill-white stroke-white" />
      </a>
    </div>

  );
};

export default WhatsAppButton;
