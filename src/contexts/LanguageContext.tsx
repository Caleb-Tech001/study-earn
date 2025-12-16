import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
];

interface TranslationCache {
  [key: string]: { [langCode: string]: string };
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  isTranslating: boolean;
  t: (text: string) => string;
  translatePage: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationCache: TranslationCache = {};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [pageTranslations, setPageTranslations] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang) {
      const lang = languages.find(l => l.code === savedLang);
      if (lang) {
        setCurrentLanguage(lang);
        if (lang.code !== 'en') {
          setTimeout(() => translatePage(lang.code), 100);
        }
      }
    }
  }, []);

  const extractTextNodes = useCallback((): { node: Text; text: string }[] => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          // Skip scripts, styles, and inputs
          const tagName = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'textarea', 'input'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip empty or whitespace-only text
          const text = node.textContent?.trim();
          if (!text || text.length < 2) return NodeFilter.FILTER_REJECT;
          
          // Skip already translated or marked elements
          if (parent.hasAttribute('data-no-translate')) return NodeFilter.FILTER_REJECT;
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes: { node: Text; text: string }[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text)) {
      const text = node.textContent?.trim();
      if (text) {
        textNodes.push({ node, text });
      }
    }
    return textNodes;
  }, []);

  const translatePage = useCallback(async (targetLang?: string) => {
    const langCode = targetLang || currentLanguage.code;
    
    if (langCode === 'en') {
      // Reset to original
      setPageTranslations(new Map());
      return;
    }

    setIsTranslating(true);

    try {
      const textNodes = extractTextNodes();
      
      // Get unique texts to translate
      const uniqueTexts = [...new Set(textNodes.map(n => n.text))];
      
      // Filter out already cached
      const textsToTranslate = uniqueTexts.filter(text => {
        const cacheKey = `en:${text}`;
        return !translationCache[cacheKey]?.[langCode];
      });

      if (textsToTranslate.length > 0) {
        // Batch translate in chunks
        const chunkSize = 50;
        for (let i = 0; i < textsToTranslate.length; i += chunkSize) {
          const chunk = textsToTranslate.slice(i, i + chunkSize);
          
          const { data, error } = await supabase.functions.invoke('translate-text', {
            body: {
              texts: chunk,
              targetLanguage: langCode,
              sourceLanguage: 'en',
            },
          });

          if (error) {
            console.error('Translation error:', error);
            continue;
          }

          // Cache translations
          const translations = data.translations || [];
          chunk.forEach((text, index) => {
            const cacheKey = `en:${text}`;
            if (!translationCache[cacheKey]) {
              translationCache[cacheKey] = {};
            }
            translationCache[cacheKey][langCode] = translations[index] || text;
          });
        }
      }

      // Apply translations to DOM
      const newTranslations = new Map<string, string>();
      textNodes.forEach(({ node, text }) => {
        const cacheKey = `en:${text}`;
        const translation = translationCache[cacheKey]?.[langCode];
        if (translation && translation !== text) {
          node.textContent = translation;
          newTranslations.set(text, translation);
        }
      });

      setPageTranslations(newTranslations);
      toast.success(`Page translated to ${languages.find(l => l.code === langCode)?.name || langCode}`);
    } catch (error) {
      console.error('Page translation failed:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage.code, extractTextNodes]);

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred_language', lang.code);
    document.documentElement.lang = lang.code;
    
    // Trigger page translation
    translatePage(lang.code);
  }, [translatePage]);

  const t = useCallback((text: string): string => {
    if (currentLanguage.code === 'en') return text;
    
    const cacheKey = `en:${text}`;
    return translationCache[cacheKey]?.[currentLanguage.code] || pageTranslations.get(text) || text;
  }, [currentLanguage.code, pageTranslations]);

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      isTranslating, 
      t,
      translatePage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
