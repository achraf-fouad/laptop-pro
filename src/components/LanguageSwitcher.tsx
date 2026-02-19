import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'fr', label: 'FR', dir: 'ltr' },
  { code: 'ar', label: 'عر', dir: 'rtl' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];
  const nextLang = languages.find(l => l.code !== i18n.language) || languages[1];

  return (
    <button
      onClick={() => i18n.changeLanguage(nextLang.code)}
      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label={`Switch to ${nextLang.label}`}
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{nextLang.label}</span>
    </button>
  );
}
