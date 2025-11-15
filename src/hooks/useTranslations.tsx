import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import i18n from '@/i18n/config';

export const useTranslations = () => {
  useEffect(() => {
    // Ждем инициализации i18next перед загрузкой переводов
    const initAndLoad = async () => {
      if (i18n.isInitialized) {
        await loadTranslationsFromDatabase();
      } else {
        i18n.on('initialized', async () => {
          await loadTranslationsFromDatabase();
        });
      }
    };

    initAndLoad();

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
        async () => {
          await loadTranslationsFromDatabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadTranslationsFromDatabase = async () => {
    try {
      console.log('🔄 Загружаем переводы из базы данных...');
      
      const { data, error } = await supabase
        .from('translations')
        .select('*');

      if (error) {
        console.error('❌ Ошибка загрузки переводов:', error);
        return;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ Нет переводов в базе данных');
        return;
      }

      console.log(`📊 Найдено ${data.length} переводов в базе данных`);

      // Группируем переводы по языкам
      const translationsByLang: Record<string, Record<string, string>> = {};

      data.forEach((translation) => {
        if (!translationsByLang[translation.language_code]) {
          translationsByLang[translation.language_code] = {};
        }
        translationsByLang[translation.language_code][translation.translation_key] = 
          translation.translation_value;
      });

      console.log('📦 Переводы по языкам:', Object.keys(translationsByLang).map(lang => 
        `${lang}: ${Object.keys(translationsByLang[lang]).length} ключей`
      ));

      // Добавляем переводы в i18next для каждого языка
      Object.keys(translationsByLang).forEach((lang) => {
        const existingResources = i18n.getResourceBundle(lang, 'translation') || {};
        const mergedResources = {
          ...existingResources,
          ...translationsByLang[lang]
        };
        
        i18n.addResourceBundle(lang, 'translation', mergedResources, true, true);
        console.log(`✅ Добавлены переводы для языка ${lang}`);
      });

      // Форсируем обновление текущего языка чтобы применить новые переводы
      const currentLang = i18n.language;
      await i18n.changeLanguage(currentLang);
      
      console.log('✅ Переводы успешно загружены и применены!');
      console.log('🌍 Текущий язык:', currentLang);
      console.log('📝 Пример ключей:', Object.keys(translationsByLang[currentLang] || {}).slice(0, 5));
    } catch (error) {
      console.error('❌ Ошибка в loadTranslationsFromDatabase:', error);
    }
  };
};
