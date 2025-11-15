import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Shield, Clock, Headphones, RefreshCw, Crown, Sparkles, Star, Award, HeartPulse, Stethoscope, Heart, FileText, DollarSign, ClipboardCheck, ListChecks, Package, ClipboardList, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const Warranty = () => {
  const {
    toast
  } = useToast();
  const copyEmail = () => {
    navigator.clipboard.writeText("savannahdynastyofficial@gmail.com");
    toast({
      title: "Email скопирован!",
      description: "savannahdynastyofficial@gmail.com скопирован в буфер обмена"
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
            <Shield className="w-40 h-40 text-accent animate-float" style={{
            animationDelay: '2s'
          }} />
          </div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 micro-interaction">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold tracking-widest uppercase text-primary">Премиум защита</span>
              </div>
              <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow py-[10px]">
                Гарантия здоровья
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Ваше спокойствие - наш приоритет. Мы поддерживаем каждую элитную кошку комплексными 
                гарантиями здоровья и пожизненной поддержкой.
              </p>
            </div>
          </div>
        </section>

        {/* Main Guarantees */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="font-display font-black text-4xl text-center mb-16 flex items-center justify-center gap-3">
              <HeartPulse className="w-10 h-10 text-primary" />
              Комплексная гарантия здоровья
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="group p-10 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 text-center animate-scale-in hover-lift micro-interaction">
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500 shadow-soft">
                  <Clock className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 luxury-text-shadow">1 месяц гарантии здоровья</h3>
                <p className="text-base text-muted-foreground font-light">Полное покрытие наследственных и врожденных заболеваний</p>
                <div className="mt-6 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-primary animate-pulse" />
                  <Star className="w-4 h-4 text-primary animate-pulse" style={{
                  animationDelay: '0.2s'
                }} />
                  <Star className="w-4 h-4 text-primary animate-pulse" style={{
                  animationDelay: '0.4s'
                }} />
                </div>
              </div>
              
              <div className="group p-10 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 text-center animate-scale-in hover-lift micro-interaction" style={{
              animationDelay: "100ms"
            }}>
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500 shadow-soft">
                  <Headphones className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 luxury-text-shadow">Пожизненная поддержка</h3>
                <p className="text-base text-muted-foreground font-light">24/7 доступ к нашим ветеринарным экспертам</p>
                <div className="mt-6 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-primary animate-pulse" />
                  <Star className="w-4 h-4 text-primary animate-pulse" style={{
                  animationDelay: '0.2s'
                }} />
                  <Star className="w-4 h-4 text-primary animate-pulse" style={{
                  animationDelay: '0.4s'
                }} />
                </div>
              </div>
              
              <div className="group p-10 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 text-center animate-scale-in hover-lift micro-interaction" style={{
              animationDelay: "200ms"
            }}>
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500 shadow-soft">
                  <Shield className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 luxury-text-shadow">Комплексная защита</h3>
                <p className="text-base text-muted-foreground font-light">Покрытие генетических заболеваний и врожденных дефектов</p>
                <div className="mt-6 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-primary animate-pulse" />
                  <Star className="w-4 h-4 text-primary animate-pulse" style={{
                  animationDelay: '0.2s'
                }} />
                  <Star className="w-4 h-4 text-primary animate-pulse" style={{
                  animationDelay: '0.4s'
                }} />
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* What's Covered */}
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <h2 className="font-display font-black text-4xl text-center mb-16">
              Что покрывается?
            </h2>
            
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Top centered card - larger */}
              <div className="max-w-2xl mx-auto">
                <div className="group p-10 glass-card rounded-3xl shadow-glow border border-primary/20 hover:border-primary/40 transition-all duration-500 hover-lift">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500">
                      <Stethoscope className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-display font-bold luxury-text-shadow">Наследственные заболевания</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-light text-lg">
                    Дисплазия тазобедренного сустава, заболевания сердца, проблемы с глазами и другие 
                    генетические расстройства, характерные для породы
                  </p>
                </div>
              </div>
              
              {/* Bottom two cards */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group p-8 glass-card rounded-3xl shadow-glow border border-primary/20 hover:border-primary/40 transition-all duration-500 hover-lift">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold luxury-text-shadow">Врожденные дефекты</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Врожденные дефекты, влияющие на нормальное функционирование или качество жизни, 
                    выявленные лицензированным ветеринаром
                  </p>
                </div>
                
                <div className="group p-8 glass-card rounded-3xl shadow-glow border border-primary/20 hover:border-primary/40 transition-all duration-500 hover-lift">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold luxury-text-shadow">Серьезные заболевания</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Опасные для жизни состояния, развивающиеся в течение первого года, за исключением 
                    предотвратимых заболеваний
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-black text-4xl mb-12 flex items-center gap-3">
                <ClipboardCheck className="w-10 h-10 text-primary" />
                Важные требования
              </h2>
              
              <div className="p-8 glass-card rounded-3xl shadow-glow border border-primary/20 space-y-4">
                <h3 className="text-2xl font-display font-bold mb-6">Условия гарантии</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Должен быть осмотрен лицензированным ветеринаром в течение 72 часов после получения</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Следовать рекомендованному графику вакцинации и профилактического ухода</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Поддерживать правильное питание и условия проживания</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Предоставлять ветеринарные записи для любых претензий по здоровью</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Немедленно уведомлять нас о любых проблемах со здоровьем</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Claims Process */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-black text-4xl text-center mb-12 flex items-center justify-center gap-3">
                <ListChecks className="w-10 h-10 text-primary" />
                Процесс подачи претензии
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {["Немедленно свяжитесь с нами при возникновении проблем со здоровьем", "Получите профессиональный ветеринарный диагноз и документацию", "Подайте претензию со всеми необходимыми медицинскими записями и квитанциями", "Получите решение в течение 5-7 рабочих дней после полной подачи"].map((step, index) => <div key={index} className="p-6 glass-card rounded-2xl shadow-glow border border-primary/20 flex items-start gap-4 hover-lift transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground">{step}</p>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* Beyond Warranty */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-black text-4xl text-center mb-12">Помимо гарантии:</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="group p-6 glass-card rounded-2xl shadow-glow border border-primary/20 hover:border-primary/40 transition-all duration-300 text-center hover-lift">
                  <div className="mb-3 inline-flex p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500">
                    <Headphones className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold mb-2 font-display luxury-text-shadow">Горячая линия поддержки 24/7</h4>
                  <p className="text-sm text-muted-foreground font-light">
                    Доступ к ветеринарным специалистам и экспертам по уходу за кошками круглосуточно
                  </p>
                </div>
                
                <div className="group p-6 glass-card rounded-2xl shadow-glow border border-primary/20 hover:border-primary/40 transition-all duration-300 text-center hover-lift">
                  <div className="mb-3 inline-flex p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold mb-2 font-display luxury-text-shadow">Набор для ухода</h4>
                  <p className="text-sm text-muted-foreground font-light">
                    Бесплатный стартовый набор, включающий премиальный корм и игрушки
                  </p>
                </div>
                
                <div className="group p-6 glass-card rounded-2xl shadow-glow border border-primary/20 hover:border-primary/40 transition-all duration-300 text-center hover-lift">
                  <div className="mb-3 inline-flex p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold mb-2 font-display luxury-text-shadow">Медицинские записи</h4>
                  <p className="text-sm text-muted-foreground font-light">
                    Полная медицинская история и записи о вакцинации
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Contact CTA */}
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="font-display font-black text-4xl flex items-center justify-center gap-3">
                <Shield className="w-10 h-10 text-primary" />
                Вопросы о нашей гарантии?
              </h2>
              <p className="text-lg text-muted-foreground">
                Наша команда готова помочь вам понять каждый аспект нашей гарантии здоровья.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                
                <div className="group p-6 glass-card rounded-2xl shadow-glow border border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-bold font-display luxury-text-shadow">Напишите нам:</p>
                  </div>
                  <button onClick={copyEmail} className="text-primary font-semibold text-lg hover:text-primary/80 transition-colors cursor-pointer">savannahdynastyofficial@gmail.com</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>;
};
export default Warranty;