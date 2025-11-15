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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Languages, Save, Search, Plus, Trash2, Download, Upload, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

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
    }
  };

  const saveTranslation = async (key: string, value: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('translations')
        .upsert({
          language_code: selectedLang,
          translation_key: key,
          translation_value: value
        }, {
          onConflict: 'language_code,translation_key'
        });

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Перевод сохранен"
      });

      await loadTranslations();
      setEditingKey(null);
    } catch (error) {
      console.error('Error saving translation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить перевод",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteTranslation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Перевод удален"
      });

      await loadTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить перевод",
        variant: "destructive"
      });
    }
  };

  const addNewTranslation = async () => {
    if (!newKey || !newValue) {
      toast({
        title: "Ошибка",
        description: "Заполните ключ и значение",
        variant: "destructive"
      });
      return;
    }

    await saveTranslation(newKey, newValue);
    setNewKey('');
    setNewValue('');
  };

  const exportTranslations = () => {
    const data = JSON.stringify(translations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translations-${selectedLang}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTranslations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        for (const item of json) {
          await saveTranslation(item.translation_key, item.translation_value);
        }

        toast({
          title: "Успешно",
          description: "Переводы импортированы"
        });
      } catch (error) {
        console.error('Error importing translations:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось импортировать переводы",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const filteredTranslations = translations.filter(t =>
    t.translation_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.translation_value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Languages className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Управление переводами</h1>
                  <p className="text-muted-foreground">Редактирование переводов для всех языков</p>
                </div>
              </div>
            </div>

            <Card className="p-6">
              {/* Language Selector & Actions */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Select value={selectedLang} onValueChange={setSelectedLang}>
                  <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Выберите язык" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по ключу или значению..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Button variant="outline" size="icon" onClick={exportTranslations}>
                    <Download className="w-4 h-4" />
                  </Button>

                  <Button variant="outline" size="icon" asChild>
                    <label className="cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept=".json"
                        onChange={importTranslations}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>
              </div>

              {/* Add New Translation */}
              <Card className="p-4 mb-6 bg-muted/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить новый перевод
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Ключ (например: nav.home)"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Значение перевода"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                    <Button onClick={addNewTranslation} disabled={saving}>
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Translations List */}
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {filteredTranslations.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      {searchQuery ? 'Переводы не найдены' : 'Нет переводов для этого языка'}
                    </div>
                  ) : (
                    filteredTranslations.map((translation) => (
                      <Card key={translation.id} className="p-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="text-sm font-mono text-muted-foreground mb-2">
                                {translation.translation_key}
                              </div>
                              
                              {editingKey === translation.translation_key ? (
                                <Textarea
                                  value={translation.translation_value}
                                  onChange={(e) => {
                                    const updated = translations.map(t =>
                                      t.id === translation.id
                                        ? { ...t, translation_value: e.target.value }
                                        : t
                                    );
                                    setTranslations(updated);
                                  }}
                                  className="min-h-[100px]"
                                />
                              ) : (
                                <div className="text-foreground whitespace-pre-wrap">
                                  {translation.translation_value}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {editingKey === translation.translation_key ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => saveTranslation(
                                      translation.translation_key,
                                      translation.translation_value
                                    )}
                                    disabled={saving}
                                  >
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingKey(null);
                                      loadTranslations();
                                    }}
                                  >
                                    Отмена
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingKey(translation.translation_key)}
                                  >
                                    Изменить
                                  </Button>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="sm" variant="destructive">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Удалить перевод?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Это действие нельзя отменить. Перевод будет удален из базы данных.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteTranslation(translation.id)}
                                          className="bg-destructive text-destructive-foreground"
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
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminTranslations;