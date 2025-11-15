import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import i18n from '@/i18n/config';

export const useTranslations = () => {
  useEffect(() => {
    loadTranslationsFromDatabase();

    // Подписываемся на изменения переводов в реальном времени
    const channel = supabase
      .channel('translations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'translations'
        },
        () => {
          loadTranslationsFromDatabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadTranslationsFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*');

      if (error) {
        console.error('Error loading translations:', error);
        return;
      }

      if (!data) return;

      // Группируем переводы по языкам
      const translationsByLang: Record<string, Record<string, string>> = {};

      data.forEach((translation) => {
        if (!translationsByLang[translation.language_code]) {
          translationsByLang[translation.language_code] = {};
        }
        translationsByLang[translation.language_code][translation.translation_key] = 
          translation.translation_value;
      });

      // Добавляем переводы в i18next для каждого языка
      Object.keys(translationsByLang).forEach((lang) => {
        const existingResources = i18n.getResourceBundle(lang, 'translation') || {};
        const mergedResources = {
          ...existingResources,
          ...translationsByLang[lang]
        };
        
        i18n.addResourceBundle(lang, 'translation', mergedResources, true, true);
      });

      console.log('✅ Переводы загружены из базы данных');
    } catch (error) {
      console.error('Error in loadTranslationsFromDatabase:', error);
    }
  };
};
