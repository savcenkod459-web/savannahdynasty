import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface TranslationMap {
  [originalText: string]: string; // originalText -> translationKey
}

export const useAutoTranslation = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    let translationMap: TranslationMap = {};
    
    const loadTranslationMap = async () => {
      try {
        // Загружаем русские переводы (они содержат оригинальный текст)
        const { data: ruTranslations, error } = await supabase
          .from('translations')
          .select('translation_key, translation_value')
          .eq('language_code', 'ru');

        if (error) {
          console.error('Ошибка загрузки карты переводов:', error);
          return;
        }

        if (ruTranslations) {
          // Создаем карту: оригинальный текст -> ключ перевода
          translationMap = {};
          ruTranslations.forEach((t) => {
            translationMap[t.translation_value.trim()] = t.translation_key;
          });
          
          console.log('📋 Карта переводов загружена:', Object.keys(translationMap).length, 'записей');
          
          // Запускаем замену текста
          replaceTextInDOM();
        }
      } catch (error) {
        console.error('Ошибка в loadTranslationMap:', error);
      }
    };

    const replaceTextInDOM = () => {
      if (Object.keys(translationMap).length === 0) return;
      
      const currentLang = i18n.language;
      
      // Если текущий язык русский, ничего не делаем
      if (currentLang === 'ru') return;

      console.log('🔄 Запускаем автозамену текста для языка:', currentLang);

      // Функция для обработки текстовых узлов
      const processTextNode = (node: Text) => {
        const text = node.textContent?.trim();
        if (!text) return;

        // Проверяем, есть ли этот текст в карте переводов
        if (translationMap[text]) {
          const translationKey = translationMap[text];
          
          // Получаем переведенный текст из i18next
          const translatedText = i18n.t(translationKey);
          
          // Если перевод найден и отличается от ключа, заменяем
          if (translatedText && translatedText !== translationKey) {
            console.log('✅ Заменяем:', text.substring(0, 50), '→', translatedText.substring(0, 50));
            node.textContent = translatedText;
          }
        }
      };

      // Рекурсивная функция для обхода всех узлов DOM
      const walkDOM = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          processTextNode(node as Text);
        } else {
          node.childNodes.forEach(walkDOM);
        }
      };

      // Обходим весь документ
      walkDOM(document.body);
    };

    // Загружаем карту переводов при монтировании
    loadTranslationMap();

    // Подписываемся на изменения языка
    const handleLanguageChange = () => {
      console.log('🌍 Язык изменен на:', i18n.language);
      setTimeout(() => replaceTextInDOM(), 100); // Небольшая задержка для применения
    };

    i18n.on('languageChanged', handleLanguageChange);

    // Подписываемся на изменения переводов в базе данных
    const channel = supabase
      .channel('auto-translation-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'translations'
        },
        async () => {
          console.log('🔔 Переводы обновлены, перезагружаем карту');
          await loadTranslationMap();
        }
      )
      .subscribe();

    // MutationObserver для отслеживания динамических изменений DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            walkDOM(node);
          }
        });
      });
    });

    // Функция для обхода DOM (нужна в observer)
    const walkDOM = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text && translationMap[text]) {
          const translationKey = translationMap[text];
          const translatedText = i18n.t(translationKey);
          if (translatedText && translatedText !== translationKey && i18n.language !== 'ru') {
            (node as Text).textContent = translatedText;
          }
        }
      } else {
        node.childNodes.forEach(walkDOM);
      }
    };

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
      supabase.removeChannel(channel);
      observer.disconnect();
    };
  }, [i18n]);
};
