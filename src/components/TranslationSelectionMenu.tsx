import { useState, useEffect } from 'react';
import { X, Globe, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TranslationSelectionMenuProps {
  selectedText: string;
  position: { x: number; y: number };
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  { code: 'uk', name: 'Українська' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'pt', name: 'Português' }
];

export const TranslationSelectionMenu = ({ 
  selectedText, 
  position, 
  onClose 
}: TranslationSelectionMenuProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [translationKey, setTranslationKey] = useState('');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  useEffect(() => {
    // Генерируем ключ из выделенного текста
    const generateKey = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^a-zа-яё0-9\s]/gi, '')
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join('_');
    };
    setTranslationKey(generateKey(selectedText));
    setTranslations({ ru: selectedText });
    
    // По умолчанию выбираем все языки кроме русского
    setSelectedLanguages(LANGUAGES.filter(lang => lang.code !== 'ru').map(lang => lang.code));
  }, [selectedText]);

  const toggleLanguage = (langCode: string) => {
    setSelectedLanguages(prev => 
      prev.includes(langCode) 
        ? prev.filter(code => code !== langCode)
        : [...prev, langCode]
    );
  };

  const toggleAllLanguages = () => {
    const allExceptRu = LANGUAGES.filter(lang => lang.code !== 'ru').map(lang => lang.code);
    setSelectedLanguages(prev => 
      prev.length === allExceptRu.length ? [] : allExceptRu
    );
  };

  const handleTranslate = async () => {
    if (!translationKey.trim()) {
      toast.error('Введите ключ перевода');
      return;
    }

    if (selectedLanguages.length === 0) {
      toast.error('Выберите хотя бы один язык для перевода');
      return;
    }

    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-bulk', {
        body: {
          text: selectedText,
          sourceLanguage: 'ru',
          targetLanguages: selectedLanguages
        }
      });

      if (error) throw error;

      if (data?.translations) {
        setTranslations(prev => ({ ...prev, ...data.translations }));
        setShowEditDialog(true);
        toast.success('Перевод выполнен! Проверьте и сохраните');
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      toast.error(error.message || 'Ошибка перевода');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = async () => {
    try {
      const translationsToSave = LANGUAGES
        .filter(lang => translations[lang.code])
        .map(lang => ({
          translation_key: translationKey,
          language_code: lang.code,
          translation_value: translations[lang.code]
        }));

      for (const translation of translationsToSave) {
        const { error } = await supabase
          .from('translations')
          .upsert(translation, {
            onConflict: 'translation_key,language_code'
          });

        if (error) throw error;
      }

      toast.success('Переводы сохранены!');
      onClose();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Ошибка сохранения');
    }
  };

  const updateTranslation = (langCode: string, value: string) => {
    setTranslations(prev => ({ ...prev, [langCode]: value }));
  };

  const translateSingleLanguage = async (langCode: string) => {
    if (!translationKey.trim()) {
      toast.error('Введите ключ перевода');
      return;
    }

    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-bulk', {
        body: {
          text: selectedText,
          sourceLanguage: 'ru',
          targetLanguages: [langCode]
        }
      });

      if (error) throw error;

      if (data?.translations && data.translations[langCode]) {
        setTranslations(prev => ({ ...prev, [langCode]: data.translations[langCode] }));
        toast.success(`Перевод на ${LANGUAGES.find(l => l.code === langCode)?.name} выполнен`);
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      toast.error(error.message || 'Ошибка перевода');
    } finally {
      setIsTranslating(false);
    }
  };

  if (showEditDialog) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        style={{ zIndex: 2147483647 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEditDialog(false);
          }
        }}
      >
        <Card 
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Редактировать переводы</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Ключ перевода</Label>
            <Input 
              value={translationKey}
              onChange={(e) => setTranslationKey(e.target.value)}
              placeholder="translation_key"
            />
          </div>

          <div className="space-y-4">
            {LANGUAGES.map(lang => (
              <div key={lang.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{lang.name} ({lang.code})</Label>
                  {lang.code !== 'ru' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => translateSingleLanguage(lang.code)}
                      disabled={isTranslating}
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      {isTranslating ? 'Перевод...' : 'Перевести'}
                    </Button>
                  )}
                </div>
                <Input
                  value={translations[lang.code] || ''}
                  onChange={(e) => updateTranslation(lang.code, e.target.value)}
                  placeholder={`Перевод на ${lang.name}`}
                  disabled={lang.code === 'ru'}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Сохранить все переводы
            </Button>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card
      className="fixed shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '400px',
        zIndex: 2147483647
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Выделенный текст:</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{selectedText}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Ключ перевода:</Label>
          <Input
            value={translationKey}
            onChange={(e) => setTranslationKey(e.target.value)}
            placeholder="translation_key"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Выберите языки:</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAllLanguages}
              className="h-6 text-xs"
            >
              {selectedLanguages.length === LANGUAGES.length - 1 ? 'Снять все' : 'Выбрать все'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {LANGUAGES.filter(lang => lang.code !== 'ru').map(lang => (
              <div key={lang.code} className="flex items-center space-x-2">
                <Checkbox
                  id={lang.code}
                  checked={selectedLanguages.includes(lang.code)}
                  onCheckedChange={() => toggleLanguage(lang.code)}
                />
                <label
                  htmlFor={lang.code}
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {lang.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleTranslate}
          disabled={isTranslating || selectedLanguages.length === 0}
          className="w-full h-9 text-sm"
        >
          <Globe className="h-4 w-4 mr-2" />
          {isTranslating ? 'Перевод...' : `Перевести (${selectedLanguages.length})`}
        </Button>
      </div>
    </Card>
  );
};
