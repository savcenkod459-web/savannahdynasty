import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, Phone, Clock, Search, CheckCircle, Circle } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
}

const AdminMessages = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAndFetchMessages();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Realtime обновления для новых сообщений
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('contact-messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          // Перезагружаем сообщения при любом изменении
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const checkAdminAndFetchMessages = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Проверяем роль администратора
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast({
          title: "Доступ запрещен",
          description: "У вас нет прав администратора",
          variant: "destructive"
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await fetchMessages();
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/");
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMessages(data || []);
      setFilteredMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить сообщения",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = (query: string, tab: string) => {
    let filtered = messages;

    // Фильтрация по вкладке
    if (tab === "unread") {
      filtered = filtered.filter(msg => !msg.read);
    } else if (tab === "read") {
      filtered = filtered.filter(msg => msg.read);
    } else if (tab === "recent") {
      // Недавние - за последние 24 часа
      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24);
      filtered = filtered.filter(msg => new Date(msg.created_at) >= oneDayAgo);
    }

    // Поиск
    if (query) {
      filtered = filtered.filter(msg =>
        msg.name.toLowerCase().includes(query.toLowerCase()) ||
        msg.email.toLowerCase().includes(query.toLowerCase()) ||
        msg.message.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  };

  useEffect(() => {
    filterMessages(searchQuery, activeTab);
  }, [searchQuery, activeTab, messages]);

  const toggleReadStatus = async (messageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ read: !currentStatus })
        .eq("id", messageId);

      if (error) throw error;

      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, read: !currentStatus } : msg
      ));

      toast({
        title: "Статус обновлен",
        description: !currentStatus ? "Сообщение отмечено как прочитанное" : "Сообщение отмечено как непрочитанное"
      });
    } catch (error) {
      console.error("Error updating message:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус сообщения",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Вы уверены, что хотите удалить это сообщение?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== messageId));

      toast({
        title: "Сообщение удалено",
        description: "Сообщение успешно удалено"
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить сообщение",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="font-display font-black text-4xl md:text-5xl luxury-text-shadow mb-4">
                Управление сообщениями
              </h1>
              <p className="text-muted-foreground text-lg">
                Просмотр и управление сообщениями от пользователей
              </p>
            </div>

            {/* Поиск */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Поиск по имени, email или сообщению..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Вкладки и статистика */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="all">
                    Все ({messages.length})
                  </TabsTrigger>
                  <TabsTrigger value="recent">
                    Недавние ({messages.filter(m => {
                      const oneDayAgo = new Date();
                      oneDayAgo.setHours(oneDayAgo.getHours() - 24);
                      return new Date(m.created_at) >= oneDayAgo;
                    }).length})
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Непрочитанные ({messages.filter(m => !m.read).length})
                  </TabsTrigger>
                  <TabsTrigger value="read">
                    Прочитанные ({messages.filter(m => m.read).length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchQuery ? "Сообщения не найдены" : "Нет сообщений"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredMessages.map((message) => (
                    <Card key={message.id} className={`transition-all hover:shadow-lg ${!message.read ? 'border-primary/30' : ''}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-xl">{message.name}</CardTitle>
                              {!message.read && (
                                <Badge variant="default" className="text-xs">
                                  Новое
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="flex flex-col gap-1">
                              <span className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {message.email}
                              </span>
                              {message.phone && (
                                <span className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {message.phone}
                                </span>
                              )}
                              <span className="flex items-center gap-2 text-xs">
                                <Clock className="w-3 h-3" />
                                {formatDate(message.created_at)}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleReadStatus(message.id, message.read)}
                              title={message.read ? "Отметить как непрочитанное" : "Отметить как прочитанное"}
                            >
                              {message.read ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteMessage(message.id)}
                              title="Удалить сообщение"
                            >
                              <Trash2 className="w-5 h-5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-secondary/30 rounded-lg">
                          <p className="whitespace-pre-wrap">{message.message}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminMessages;
