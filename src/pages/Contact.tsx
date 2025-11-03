import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Instagram, Send, Crown, Sparkles, MessageCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Сообщение отправлено",
      description: "Мы свяжемся с вами в ближайшее время!"
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };
  const copyEmail = () => {
    navigator.clipboard.writeText("luxurycxts@gmail.com");
    toast({
      title: "Email скопирован",
      description: "luxurycxts@gmail.com скопирован в буфер обмена"
    });
  };
  return <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
          <div className="absolute top-20 left-10 opacity-5">
            <Crown className="w-32 h-32 text-primary animate-float" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-5">
            <MessageCircle className="w-40 h-40 text-accent animate-float" style={{
            animationDelay: '2s'
          }} />
          </div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 micro-interaction">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold tracking-widest uppercase text-primary">Свяжитесь с нами</span>
              </div>
              <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow">
                Связаться
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Готовы приветствовать своего идеального кошачьего друга? Мы здесь, чтобы помочь вам 
                найти элитную кошку, предназначенную для вашей семьи.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="animate-fade-in">
                <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <Send className="w-6 h-6 text-primary" />
                    <h2 className="font-display font-black text-3xl luxury-text-shadow">Отправить сообщение</h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input id="name" value={formData.name} onChange={e => setFormData({
                      ...formData,
                      name: e.target.value
                    })} placeholder="Ваше имя" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
                      ...formData,
                      email: e.target.value
                    })} placeholder="your@email.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({
                      ...formData,
                      phone: e.target.value
                    })} placeholder="+7 (999) 123-45-67" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Сообщение</Label>
                      <Textarea id="message" value={formData.message} onChange={e => setFormData({
                      ...formData,
                      message: e.target.value
                    })} placeholder="Расскажите нам о том, что вас интересует..." rows={6} required />
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full">
                      Отправить сообщение
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-8 animate-fade-in" style={{
              animationDelay: "200ms"
            }}>
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
                        <h4 className="font-bold mb-1 luxury-text-shadow">Cвяжитесь с нами</h4>
                        <button onClick={copyEmail} className="text-muted-foreground font-light hover:text-primary transition-colors cursor-pointer">savannahdynasty@gmail.com</button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 glass-card rounded-2xl hover-lift micro-interaction">
                      <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-soft">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1 luxury-text-shadow">Часы работы</h4>
                        <p className="text-muted-foreground font-light">
                          Пн - Пт: 9:00 - 18:00<br />
                          Сб: 10:00 - 16:00<br />
                          Вс: По записи
                        </p>
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
                    <a href="https://www.instagram.com/savannahdynasty?igsh=cjRvbTM5Y3p1N3Uz&utm_source=qr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity">
                      <Instagram className="h-5 w-5" />
                      <span className="font-medium">@savannahdynasty</span>
                    </a>
                    
                    <a href="https://t.me/SavannahDynasty_bot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl hover:opacity-90 transition-opacity">
                      <Send className="h-5 w-5" />
                      <span className="font-medium">@SavannahDynasty_bot</span>
                    </a>
                    
                    <a href="https://www.tiktok.com/@savannahdynasty?_r=1&_t=ZM-9163yTY9hWK" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl hover:opacity-90 transition-opacity">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                      <span className="font-medium">@savannahdynasty</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>;
};
export default Contact;