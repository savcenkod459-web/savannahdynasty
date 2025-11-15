import { Link } from "react-router-dom";
import { Instagram, Send, Crown, Sparkles, Menu, Headphones, Mail, Info, LayoutGrid, Users, BookOpen, CreditCard, Shield, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();
  const { t } = useTranslation();
  const copyEmail = () => {
    navigator.clipboard.writeText("savannahdynastyofficial@gmail.com");
    toast({
      title: "Email скопирован!",
      description: "savannahdynastyofficial@gmail.com скопирован в буфер обмена"
    });
  };
  return <footer className="bg-secondary/30 border-t border-primary/10 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 opacity-5">
        <Crown className="absolute top-10 right-20 w-24 h-24 text-primary animate-float" />
        <Sparkles className="absolute bottom-10 left-20 w-16 h-16 text-accent animate-float" style={{
        animationDelay: '2s'
      }} />
      </div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-full shadow-gold">
                <Crown className="w-5 h-5 text-luxury-black" />
              </div>
              <h3 className="text-2xl font-display font-black text-luxury-gradient luxury-text-shadow">SavannahDynasty</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-primary/20 shadow-glow">
                <Crown className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/90 leading-relaxed font-light">
                  Элитные кошки породы Саванна премиум класса
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg border border-accent/20 shadow-glow">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-foreground/90 leading-relaxed font-light">
                  Доставка по многим странам мира
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs text-primary font-semibold tracking-wider uppercase">С 2025 ГОДА</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold mb-6 text-lg luxury-text-shadow flex items-center gap-2">
              <Menu className="w-5 h-5 text-primary" />
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="flex items-center gap-2 p-3 glass-card rounded-lg border border-primary/10 text-sm text-foreground/80 hover:text-primary hover:border-primary/30 transition-all duration-300 font-light shadow-glow hover:shadow-gold micro-interaction">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="flex items-center gap-2 p-3 glass-card rounded-lg border border-primary/10 text-sm text-foreground/80 hover:text-primary hover:border-primary/30 transition-all duration-300 font-light shadow-glow hover:shadow-gold micro-interaction">
                  <LayoutGrid className="w-4 h-4 flex-shrink-0" />
                  {t('nav.catalog')}
                </Link>
              </li>
              <li>
                <Link to="/breeders" className="flex items-center gap-2 p-3 glass-card rounded-lg border border-primary/10 text-sm text-foreground/80 hover:text-primary hover:border-primary/30 transition-all duration-300 font-light shadow-glow hover:shadow-gold micro-interaction">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  {t('nav.breeders')}
                </Link>
              </li>
              <li>
                <Link to="/guide" className="flex items-center gap-2 p-3 glass-card rounded-lg border border-primary/10 text-sm text-foreground/80 hover:text-primary hover:border-primary/30 transition-all duration-300 font-light shadow-glow hover:shadow-gold micro-interaction">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  {t('nav.guide')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold mb-6 text-lg luxury-text-shadow flex items-center gap-2">
              <Headphones className="w-5 h-5 text-primary" />
              {t('footer.support')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/payment" className="flex items-center gap-2 p-3 glass-card rounded-lg border border-primary/10 text-sm text-foreground/80 hover:text-primary hover:border-primary/30 transition-all duration-300 font-light shadow-glow hover:shadow-gold micro-interaction">
                  <CreditCard className="w-4 h-4 flex-shrink-0" />
                  {t('nav.payment')}
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="flex items-center gap-2 p-3 glass-card rounded-lg border border-primary/10 text-sm text-foreground/80 hover:text-primary hover:border-primary/30 transition-all duration-300 font-light shadow-glow hover:shadow-gold micro-interaction">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  {t('nav.warranty')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center gap-2 p-3 glass-card rounded-lg border border-primary/10 text-sm text-foreground/80 hover:text-primary hover:border-primary/30 transition-all duration-300 font-light shadow-glow hover:shadow-gold micro-interaction">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold mb-6 text-lg luxury-text-shadow flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Контакты
            </h4>
            <div className="space-y-4 py-0">
              <p className="text-sm text-muted-foreground font-light">
                Email: <button onClick={copyEmail} className="text-primary hover:text-primary/80 transition-colors cursor-pointer font-normal">savannahdynastyofficial@gmail.com</button>
              </p>
              
              <div className="flex gap-4 pt-2">
                <a href="https://www.instagram.com/savannahdynasty?igsh=cjRvbTM5Y3p1N3Uz&utm_source=qr" target="_blank" rel="noopener noreferrer" className="p-3 glass-card rounded-full text-muted-foreground hover:text-primary shadow-glow border border-primary/20 hover:border-primary/40 transition-all duration-300 micro-interaction hover:scale-110 hover-lift">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://t.me/savannahdynasty_support" target="_blank" rel="noopener noreferrer" className="p-3 glass-card rounded-full text-muted-foreground hover:text-primary shadow-glow border border-primary/20 hover:border-primary/40 transition-all duration-300 micro-interaction hover:scale-110 hover-lift">
                  <Send className="h-5 w-5" />
                </a>
                <a href="https://www.tiktok.com/@savannahdynasty?_r=1&_t=ZM-9163yTY9hWK" target="_blank" rel="noopener noreferrer" className="p-3 glass-card rounded-full text-muted-foreground hover:text-primary shadow-glow border border-primary/20 hover:border-primary/40 transition-all duration-300 micro-interaction hover:scale-110 hover-lift">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary/10 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/50" />
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <p className="text-sm text-muted-foreground font-light">© 2025 SavannahDynasty. Все права защищены.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;