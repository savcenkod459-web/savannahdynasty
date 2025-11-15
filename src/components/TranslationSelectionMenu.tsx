import { useState, useEffect, useCallback } from 'react';
import { X, Globe, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
  }, [selectedText]);

  const handleTranslate = async () => {
    if (!translationKey.trim()) {
      toast.error('Введите ключ перевода');
      return;
    }

    setIsTranslating(true);
    try {
      const targetLanguages = LANGUAGES.map(lang => lang.code).filter(code => code !== 'ru');
      
      const { data, error } = await supabase.functions.invoke('translate-bulk', {
        body: {
          text: selectedText,
          sourceLanguage: 'ru',
          targetLanguages
        }
      });

      if (error) throw error;

      if (data?.translations) {
        setTranslations({ ru: selectedText, ...data.translations });
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
      const translationsToSave = LANGUAGES.map(lang => ({
        translation_key: translationKey,
        language_code: lang.code,
        translation_value: translations[lang.code] || selectedText
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

  if (showEditDialog) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
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
                <Label>{lang.name} ({lang.code})</Label>
                <Input
                  value={translations[lang.code] || ''}
                  onChange={(e) => updateTranslation(lang.code, e.target.value)}
                  placeholder={`Перевод на ${lang.name}`}
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
      className="fixed z-[9999] p-4 shadow-lg border-2 border-primary/20"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '300px'
      }}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Выделенный текст:</p>
            <p className="text-xs text-muted-foreground line-clamp-3">{selectedText}</p>
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

        <Button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="w-full h-9 text-sm"
        >
          <Globe className="h-4 w-4 mr-2" />
          {isTranslating ? 'Перевод...' : 'Перевести на все языки'}
        </Button>
      </div>
    </Card>
  );
};
