import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Languages, Save, Search, Plus, Trash2, Loader2, Edit, X, Check, Globe, Sparkles, Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type Translation = {
  id: string;
  language_code: string;
  translation_key: string;
  translation_value: string;
  created_at?: string;
  updated_at?: string;
};

const LANGUAGES = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

const AdminTranslations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ru');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTranslateDialogOpen, setIsTranslateDialogOpen] = useState(false);
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translationKey, setTranslationKey] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin && selectedLang) {
      loadTranslations();
    }
  }, [selectedLang, isAdmin]);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roles) {
        toast({
          title: "Доступ запрещен",
          description: "У вас нет прав администратора",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language_code', selectedLang)
        .order('translation_key');

      if (error) throw error;
      setTranslations(data || []);
    } catch (error) {
      console.error('Error loading translations:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить переводы",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, newValue: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('translations')
        .update({ translation_value: newValue })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Перевод обновлен"
      });
      
      setEditingKey(null);
      loadTranslations();
    } catch (error) {
      console.error('Error updating translation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить перевод",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!newKey.trim() || !newValue.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from('translations')
        .insert({
          language_code: selectedLang,
          translation_key: newKey.trim(),
          translation_value: newValue.trim()
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Ошибка",
            description: "Ключ перевода уже существует для этого языка",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Успех",
        description: "Перевод добавлен"
      });
      
      setNewKey('');
      setNewValue('');
      setIsAddDialogOpen(false);
      loadTranslations();
    } catch (error) {
      console.error('Error adding translation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить перевод",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Перевод удален"
      });
      
      loadTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить перевод",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBulkTranslate = async () => {
    if (!textToTranslate.trim() || !translationKey.trim() || selectedLanguages.length === 0) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля и выберите хотя бы один язык",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsTranslating(true);
      
      // Call edge function for AI translation
      const { data, error } = await supabase.functions.invoke('translate-bulk', {
        body: {
          text: textToTranslate.trim(),
          sourceLanguage: 'ru',
          targetLanguages: selectedLanguages
        }
      });

      if (error) {
        if (error.message.includes('Rate limit')) {
          toast({
            title: "Лимит запросов",
            description: "Превышен лимит запросов. Попробуйте позже.",
            variant: "destructive"
          });
        } else if (error.message.includes('Payment required')) {
          toast({
            title: "Требуется оплата",
            description: "Добавьте средства в ваш workspace.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      if (!data || !data.translations) {
        throw new Error('Invalid response from translation service');
      }

      // Save all translations to database
      const translationsToInsert = Object.entries(data.translations).map(([lang, value]) => ({
        language_code: lang,
        translation_key: translationKey.trim(),
        translation_value: value as string
      }));

      const { error: insertError } = await supabase
        .from('translations')
        .upsert(translationsToInsert, {
          onConflict: 'language_code,translation_key'
        });

      if (insertError) throw insertError;

      toast({
        title: "Успех",
        description: `Переводы добавлены для ${selectedLanguages.length} языков`
      });

      setIsTranslateDialogOpen(false);
      setTextToTranslate('');
      setTranslationKey('');
      setSelectedLanguages([]);
      loadTranslations();

    } catch (error) {
      console.error('Error in bulk translation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить перевод",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleLanguage = (langCode: string) => {
    setSelectedLanguages(prev =>
      prev.includes(langCode)
        ? prev.filter(l => l !== langCode)
        : [...prev, langCode]
    );
  };

  const filteredTranslations = translations.filter(t =>
    t.translation_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.translation_value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Languages className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold">Управление переводами</h1>
              </div>
              <p className="text-muted-foreground">
                Редактируйте переводы для всех языков сайта
              </p>
            </div>

            {/* Controls */}
            <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-primary/10">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <Label htmlFor="search" className="mb-2 block text-sm">
                    Поиск по ключу или значению
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Введите запрос..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Language Selector */}
                <div className="w-full md:w-[220px]">
                  <Label htmlFor="language" className="mb-2 block text-sm">
                    Выберите язык
                  </Label>
                  <Select value={selectedLang} onValueChange={setSelectedLang}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Add & Translate Buttons */}
                <div className="w-full md:w-auto flex gap-2">
                  <Label className="mb-2 block text-sm opacity-0 w-full">
                    Action
                  </Label>
                  <Dialog open={isTranslateDialogOpen} onOpenChange={setIsTranslateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full md:w-auto">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Перевод
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>AI Автоперевод на все языки</DialogTitle>
                        <DialogDescription>
                          Введите текст на русском языке, и AI переведет его на выбранные языки
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="translationKey">Ключ перевода</Label>
                          <Input
                            id="translationKey"
                            placeholder="catalog.title"
                            value={translationKey}
                            onChange={(e) => setTranslationKey(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Используйте точки для вложенности (например: catalog.title)
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="textToTranslate">Текст на русском языке</Label>
                          <Textarea
                            id="textToTranslate"
                            placeholder="Наши роскошные кошки"
                            value={textToTranslate}
                            onChange={(e) => setTextToTranslate(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <div>
                          <Label className="mb-3 block">Выберите языки для перевода</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {LANGUAGES.filter(l => l.code !== 'ru').map((lang) => (
                              <div key={lang.code} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`lang-${lang.code}`}
                                  checked={selectedLanguages.includes(lang.code)}
                                  onCheckedChange={() => toggleLanguage(lang.code)}
                                />
                                <label
                                  htmlFor={`lang-${lang.code}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {lang.flag} {lang.name}
                                </label>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLanguages(LANGUAGES.filter(l => l.code !== 'ru').map(l => l.code))}
                            >
                              Выбрать все
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLanguages([])}
                            >
                              Снять все
                            </Button>
                          </div>
                        </div>

                        <Button
                          onClick={handleBulkTranslate}
                          disabled={isTranslating}
                          className="w-full"
                        >
                          {isTranslating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Перевод в процессе...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Перевести на {selectedLanguages.length} {selectedLanguages.length === 1 ? 'язык' : 'языков'}
                            </>
                          )}
                        </Button>
                        
                        <p className="text-xs text-muted-foreground text-center">
                          Переводы будут автоматически сохранены в базу данных
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full md:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить перевод
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить новый перевод</DialogTitle>
                        <DialogDescription>
                          Язык: {LANGUAGES.find(l => l.code === selectedLang)?.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="newKey">Ключ перевода</Label>
                          <Input
                            id="newKey"
                            placeholder="nav.home"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Используйте точки для вложенности (например: nav.home)
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="newValue">Значение</Label>
                          <Textarea
                            id="newValue"
                            placeholder="Главная"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={handleAdd}
                          disabled={saving}
                          className="w-full"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Добавление...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Добавить
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Всего переводов: <strong className="text-foreground">{translations.length}</strong>
                  </span>
                  {searchQuery && (
                    <span>
                      Найдено: <strong className="text-foreground">{filteredTranslations.length}</strong>
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Translations List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredTranslations.length === 0 ? (
              <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-primary/10">
                <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? "Переводы не найдены" : "Нет переводов для выбранного языка"}
                </p>
              </Card>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-2 pr-4">
                  {filteredTranslations.map((translation) => (
                    <Card
                      key={translation.id}
                      className="p-4 hover:shadow-md transition-all bg-card/50 backdrop-blur-sm border-primary/10"
                    >
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        {/* Key */}
                        <div className="flex-1 w-full">
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-xs text-muted-foreground">
                              Ключ
                            </Label>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2"
                              onClick={() => {
                                navigator.clipboard.writeText(translation.translation_key);
                                toast({
                                  title: "Скопировано",
                                  description: "Ключ скопирован в буфер обмена"
                                });
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="font-mono text-sm bg-muted/50 px-3 py-2 rounded border border-border/50">
                            {translation.translation_key}
                          </p>
                        </div>

                        {/* Value */}
                        <div className="flex-[2] w-full">
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            Перевод
                          </Label>
                          {editingKey === translation.translation_key ? (
                            <Textarea
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              rows={3}
                              className="w-full"
                              autoFocus
                            />
                          ) : (
                            <p className="bg-muted/50 px-3 py-2 rounded whitespace-pre-wrap border border-border/50">
                              {translation.translation_value}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 w-full md:w-auto md:pt-5">
                          {editingKey === translation.translation_key ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleUpdate(translation.id, editingValue)}
                                disabled={saving}
                              >
                                {saving ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingKey(null)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingKey(translation.translation_key);
                                  setEditingValue(translation.translation_value);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={saving}
                                  >
                                    {saving ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Удалить перевод?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Вы действительно хотите удалить перевод для ключа "{translation.translation_key}"?
                                      Это действие нельзя отменить.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(translation.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminTranslations;
