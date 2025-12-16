import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TranslationCache {
  [key: string]: {
    [langCode: string]: string;
  };
}

const translationCache: TranslationCache = {};

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const pendingTranslations = useRef<Map<string, Promise<string>>>(new Map());

  const translateTexts = useCallback(async (
    texts: string[],
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string[]> => {
    if (targetLanguage === sourceLanguage) {
      return texts;
    }

    // Filter out already cached translations
    const textsToTranslate: string[] = [];
    const cachedResults: Map<number, string> = new Map();

    texts.forEach((text, index) => {
      const cacheKey = `${sourceLanguage}:${text}`;
      if (translationCache[cacheKey]?.[targetLanguage]) {
        cachedResults.set(index, translationCache[cacheKey][targetLanguage]);
      } else {
        textsToTranslate.push(text);
      }
    });

    // If all cached, return immediately
    if (textsToTranslate.length === 0) {
      return texts.map((_, index) => cachedResults.get(index) || texts[index]);
    }

    setIsTranslating(true);

    try {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: {
          texts: textsToTranslate,
          targetLanguage,
          sourceLanguage,
        },
      });

      if (error) {
        console.error('Translation error:', error);
        return texts;
      }

      const translations = data.translations || textsToTranslate;

      // Cache the new translations
      let translationIndex = 0;
      texts.forEach((text, index) => {
        if (!cachedResults.has(index)) {
          const cacheKey = `${sourceLanguage}:${text}`;
          if (!translationCache[cacheKey]) {
            translationCache[cacheKey] = {};
          }
          translationCache[cacheKey][targetLanguage] = translations[translationIndex];
          cachedResults.set(index, translations[translationIndex]);
          translationIndex++;
        }
      });

      return texts.map((_, index) => cachedResults.get(index) || texts[index]);
    } catch (error) {
      console.error('Translation failed:', error);
      return texts;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const translateText = useCallback(async (
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string> => {
    const results = await translateTexts([text], targetLanguage, sourceLanguage);
    return results[0];
  }, [translateTexts]);

  return {
    translateText,
    translateTexts,
    isTranslating,
  };
};
