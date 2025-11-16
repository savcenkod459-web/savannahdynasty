import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Clock, Instagram, Send, Crown, Sparkles, MessageCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SimpleCaptcha from "@/components/SimpleCaptcha";
import { z } from "zod";

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  message: z.string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message must be less than 2000 characters")
});

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [user, setUser] = useState<User | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    try {
      contactFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive"
        });
        return;
      }
    }

    // Проверяем авторизацию
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт или зарегистрируйтесь, чтобы отправить сообщение",
        variant: "destructive",
        action: (
          <Button 
            size="sm" 
            onClick={() => window.location.href = '/auth'}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Войти
          </Button>
        )
      });
      return;
    }

    // Проверяем rate limiting
    try {
      // @ts-ignore - custom RPC function
      const { data: canSend, error: rateLimitError } = await supabase.rpc('check_message_rate_limit', {
        user_email: formData.email
      });

      if (rateLimitError) {
        console.error('Rate limit check error:', rateLimitError);
        toast({
          title: "Ошибка проверки",
          description: "Не удалось проверить лимит сообщений. Попробуйте позже.",
          variant: "destructive"
        });
        return;
      }

      if (canSend === false) {
        toast({
          title: "Слишком много сообщений",
          description: "Вы можете отправить максимум 3 сообщения в час. Пожалуйста, попробуйте позже.",
          variant: "destructive"
        });
        return;
      }
    } catch (error) {
      console.error('Rate limit check exception:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при проверке. Попробуйте позже.",
        variant: "destructive"
      });
      return;
    }

    // Показываем капчу
    setPendingSubmit(true);
    setShowCaptcha(true);
    setCaptchaVerified(false);
  };

  const handleCaptchaVerify = (isValid: boolean) => {
    setCaptchaVerified(isValid);
  };

  const handleCaptchaSubmit = async () => {
    if (!captchaVerified) {
      toast({
        title: "Неверная капча",
        description: "Пожалуйста, введите правильный код с картинки",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('contact_messages').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message
      }]);
      
      if (error) throw error;
      
      // Отправляем email-уведомление администратору
      try {
        await supabase.functions.invoke('send-contact-notification', {
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message
          }
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Не показываем ошибку пользователю, так как сообщение уже сохранено
      }

      toast({
        title: "Сообщение отправлено",
        description: "Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время."
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      
      setShowCaptcha(false);
      setPendingSubmit(false);
      setCaptchaVerified(false);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    }
  };
  
  const copyEmail = () => {
    navigator.clipboard.writeText("savannahdynastyofficial@gmail.com");
    toast({
      title: "Email скопирован",
      description: "savannahdynastyofficial@gmail.com скопирован в буфер обмена"
    });
  };
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
          <div className="absolute top-20 left-10 opacity-5">
            <Crown className="w-32 h-32 text-primary animate-float" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-5">
            <MessageCircle className="w-40 h-40 text-accent animate-float" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 micro-interaction">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold tracking-widest uppercase text-primary">{t('contact.badge')}</span>
              </div>
              <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow">
                {t('contact.title')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                {t('contact.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <ScrollAnimationWrapper animation="fade" delay={100}>
                <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant hover:shadow-[0_0_30px_rgba(217,179,112,0.3)] transition-all duration-500 group">
                  <div className="flex items-center gap-3 mb-8">
                    <Send className="w-6 w-6 text-primary" />
                    <h2 className="font-display font-black text-3xl luxury-text-shadow">{t('contact.form.title')}</h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.form.name')}</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={e => setFormData({ ...formData, name: e.target.value })} 
                        placeholder={t('contact.form.name_placeholder')} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact.form.email')}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                        placeholder={t('contact.form.email_placeholder')}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                        placeholder={t('contact.form.phone_placeholder')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.form.message')}</Label>
                      <Textarea 
                        id="message" 
                        value={formData.message} 
                        onChange={e => setFormData({ ...formData, message: e.target.value })} 
                        placeholder={t('contact.form.message_placeholder')}
                        rows={6} 
                        required 
                      />
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full relative overflow-hidden group/submit hover:shadow-[0_0_60px_rgba(217,179,112,0.8),_0_0_100px_rgba(217,179,112,0.6)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-700 ease-out hover:brightness-110 before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/0 before:via-primary/30 before:to-primary/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000">
                      <span className="relative z-10">Отправить сообщение</span>
                    </Button>
                  </form>
                </div>
              </ScrollAnimationWrapper>

              {/* Contact Info */}
              <ScrollAnimationWrapper animation="fade" delay={200}>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <MessageCircle className="w-6 h-6 text-primary" />
                      <h2 className="font-display font-black text-3xl luxury-text-shadow">Контактная информация</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-4 glass-card rounded-2xl hover-lift micro-interaction">
                        <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-soft">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1 luxury-text-shadow">Свяжитесь с нами</h4>
                          <button 
                            onClick={copyEmail} 
                            className="text-muted-foreground font-light hover:text-primary transition-colors cursor-pointer"
                          >
                            savannahdynastyofficial@gmail.com
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 glass-card rounded-2xl hover-lift micro-interaction">
                        <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-soft">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1 luxury-text-shadow">Часы работы</h4>
                          <p className="text-muted-foreground font-light">UTC 8:30-23:00</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-5 h-5 text-primary animate-pulse" />
                      <h3 className="font-display font-bold text-2xl luxury-text-shadow">Подписывайтесь на нас</h3>
                    </div>
                    <p className="text-muted-foreground mb-6 font-light">
                      Оставайтесь на связи и смотрите наших последних элитных кошек в социальных сетях
                    </p>
                    
                    <div className="flex gap-4 flex-wrap">
                      <a 
                        href="https://www.instagram.com/savannahdynasty?igsh=cjRvbTM5Y3p1N3Uz&utm_source=qr" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-[0_10px_40px_rgba(168,85,247,0.6)] hover:brightness-110"
                      >
                        <Instagram className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                        <span className="font-medium">@savannahdynasty</span>
                      </a>
                      
                      <a 
                        href="https://t.me/SavannahDynasty_bot" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-[0_10px_40px_rgba(59,130,246,0.6)] hover:brightness-110"
                      >
                        <Send className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
                        <span className="font-medium">@SavannahDynasty_bot</span>
                      </a>
                      
                      <a 
                        href="https://www.tiktok.com/@savannahdynasty?_r=1&_t=ZM-9163yTY9hWK" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:brightness-125"
                      >
                        <svg className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                        <span className="font-medium">@savannahdynasty</span>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTop />

      {/* Капча диалог */}
      <Dialog open={showCaptcha} onOpenChange={setShowCaptcha}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[420px] max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg sm:text-xl">Подтверждение безопасности</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Введите код с картинки
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6 py-2">
            <SimpleCaptcha onVerify={handleCaptchaVerify} />
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCaptcha(false);
                  setPendingSubmit(false);
                  setCaptchaVerified(false);
                }}
                className="flex-1 text-sm"
              >
                Отмена
              </Button>
              <Button
                onClick={handleCaptchaSubmit}
                disabled={!captchaVerified}
                className="flex-1 text-sm"
              >
                Отправить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contact;
