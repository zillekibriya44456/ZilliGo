import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const CURRENCY_DATA = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.93 },
  GBP: { symbol: '£', rate: 0.79 },
  INR: { symbol: '₹', rate: 83.45 },
  JPY: { symbol: '¥', rate: 155.20 },
};

export function SettingsProvider({ children }) {
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');

  const isRTL = language === 'ar' || language === 'he';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const formatPrice = (amount) => {
    const data = CURRENCY_DATA[currency];
    const converted = (amount * data.rate).toFixed(2);
    return `${data.symbol}${converted}`;
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'jp', label: '日本語', flag: '🇯🇵' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <SettingsContext.Provider value={{ 
      currency, setCurrency, 
      language, setLanguage, 
      isRTL, languages,
      formatPrice, currencies: Object.keys(CURRENCY_DATA) 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
