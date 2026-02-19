import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { t } = useTranslation();
  const questions = t('faq.questions', { returnObjects: true }) as { q: string; a: string }[];

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('faq.title')}</h1>
          <p className="text-white/60">{t('faq.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-3">
          {questions.map((faq, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left rtl:text-right">
                <span className="font-semibold text-foreground text-sm">{faq.q}</span>
                {open === i ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
