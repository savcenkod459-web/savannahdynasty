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
    let normalizedMap: Map<string, string> = new Map(); // нормализованный текст -> ключ перевода
    
    // Функция для нормализации текста (убираем переносы строк, лишние пробелы)
    const normalizeText = (text: string): string => {
      return text
        .replace(/\n/g, ' ')        // заменяем переносы строк на пробелы
        .replace(/\s+/g, ' ')       // заменяем множественные пробелы на один
        .trim()                      // убираем пробелы в начале и конце
        .toLowerCase();              // приводим к нижнему регистру для сравнения
    };
    
    // Функция для обработки текстовых узлов
    const processTextNode = (node: Text, currentLang: string) => {
      const text = node.textContent?.trim();
      if (!text || text.length < 3) return; // игнорируем очень короткие тексты

      const normalizedText = normalizeText(text);
      
      // Сначала проверяем точное совпадение по оригинальному тексту
      if (translationMap[text]) {
        const translationKey = translationMap[text];
        const translatedText = i18n.t(translationKey);
        
        if (translatedText && translatedText !== translationKey) {
          console.log('✅ Точное совпадение:', text.substring(0, 50), '→', translatedText.substring(0, 50));
          node.textContent = translatedText;
          return;
        }
      }
      
      // Затем проверяем по нормализованному тексту
      if (normalizedMap.has(normalizedText)) {
        const translationKey = normalizedMap.get(normalizedText)!;
        const translatedText = i18n.t(translationKey);
        
        if (translatedText && translatedText !== translationKey) {
          console.log('✅ Нормализованное совпадение:', text.substring(0, 50), '→', translatedText.substring(0, 50));
          node.textContent = translatedText;
          return;
        }
      }
      
      // Проверяем, не является ли текущий текст частью большого многострочного текста из БД
      for (const [originalText, key] of Object.entries(translationMap)) {
        // Если оригинальный текст содержит переносы строк
        if (originalText.includes('\n')) {
          const originalLines = originalText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
          const normalizedLines = originalLines.map(line => normalizeText(line));
          
          // Проверяем, совпадает ли текущий текст с одной из строк
          const lineIndex = normalizedLines.indexOf(normalizedText);
          if (lineIndex !== -1) {
            // Получаем полный переведенный текст
            const fullTranslation = i18n.t(key);
            if (fullTranslation && fullTranslation !== key) {
              // Разбиваем переведенный текст на строки
              const translatedLines = fullTranslation.split('\n').map(line => line.trim()).filter(line => line.length > 0);
              
              // Берём соответствующую строку из перевода
              if (translatedLines[lineIndex]) {
                console.log('✅ Многострочное совпадение:', text.substring(0, 30), '→', translatedLines[lineIndex].substring(0, 30));
                node.textContent = translatedLines[lineIndex];
                return;
              }
            }
          }
        }
      }
    };

    // Рекурсивная функция для обхода всех узлов DOM
    const walkDOM = (node: Node, currentLang: string) => {
      if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node as Text, currentLang);
      } else {
        node.childNodes.forEach((child) => walkDOM(child, currentLang));
      }
    };
    
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
          // Создаем карты: оригинальный текст -> ключ перевода
          translationMap = {};
          normalizedMap = new Map();
          
          ruTranslations.forEach((t) => {
            const originalText = t.translation_value.trim();
            translationMap[originalText] = t.translation_key;
            
            // Также добавляем нормализованную версию
            const normalized = normalizeText(originalText);
            normalizedMap.set(normalized, t.translation_key);
          });
          
          console.log('📋 Карта переводов загружена:', Object.keys(translationMap).length, 'записей');
          console.log('📋 Нормализованная карта:', normalizedMap.size, 'записей');
          
          // Запускаем замену текста сразу после загрузки
          replaceTextInDOM();
        }
      } catch (error) {
        console.error('Ошибка в loadTranslationMap:', error);
      }
    };

    const replaceTextInDOM = () => {
      if (Object.keys(translationMap).length === 0) {
        console.log('⚠️ Карта переводов пустая, пропускаем замену');
        return;
      }
      
      const currentLang = i18n.language;
      
      // Если текущий язык русский, ничего не делаем
      if (currentLang === 'ru') {
        console.log('ℹ️ Текущий язык русский, автозамена не требуется');
        return;
      }

      console.log('🔄 Запускаем автозамену текста для языка:', currentLang);

      // Обходим весь документ
      walkDOM(document.body, currentLang);
      
      console.log('✅ Автозамена завершена');
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
      const currentLang = i18n.language;
      if (currentLang === 'ru' || Object.keys(translationMap).length === 0) return;
      
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            walkDOM(node, currentLang);
          }
        });
      });
    });

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
