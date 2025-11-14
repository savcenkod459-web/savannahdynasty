import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Award, Shield, Trophy, MapPin, Crown, Sparkles, Diamond, Star, Lightbulb, ShieldCheck, MessageCircle } from "lucide-react";
const features = [{
  icon: Award,
  title: "Сертифицированное превосходство",
  description: "Все заводчики имеют признанные сертификаты и членство в профессиональных ассоциациях заводчиков"
}, {
  icon: Shield,
  title: "Этичные практики",
  description: "Приверженность гуманным методам разведения с упором на благополучие и здоровье кошек"
}, {
  icon: Trophy,
  title: "Чемпионские линии",
  description: "Специализация на кошках из призовых выставочных линий с документированными родословными"
}, {
  icon: MapPin,
  title: "Местная экспертиза",
  description: "Стратегически расположенные заводчики, обеспечивающие легкий доступ и постоянную поддержку"
}];
const Breeders = () => {
  return <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
          <div className="absolute top-20 left-10 opacity-5">
            <Crown className="w-32 h-32 text-primary animate-float" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-5">
            <Trophy className="w-40 h-40 text-accent animate-float" style={{
            animationDelay: '2s'
          }} />
          </div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 micro-interaction">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold tracking-widest uppercase text-primary">Профессионалы</span>
              </div>
              <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow">
                Наши опытные заводчики
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Познакомьтесь с увлеченными профессионалами, стоящими за нашими исключительными кошками. 
                Наша сеть сертифицированных заводчиков представляет десятилетия опыта в области генетики и ухода за кошками.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              <h2 className="font-display font-black text-4xl text-center flex items-center justify-center gap-3">
                <Lightbulb className="w-10 h-10 text-primary" />
                Наша философия разведения
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                Мы сотрудничаем исключительно с этичными заводчиками, которые ставят здоровье, темперамент 
                и стандарты породы превыше всего. Каждый заводчик в нашей сети был тщательно проверен на 
                предмет приверженности совершенству, гарантируя, что каждая кошка соответствует нашим 
                строгим стандартам качества и ухода.
              </p>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Features Grid */}
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <section className="py-20 bg-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <Star className="absolute top-1/4 left-1/4 w-24 h-24 text-primary animate-pulse" />
            <Diamond className="absolute bottom-1/4 right-1/4 w-20 h-20 text-accent animate-pulse" style={{
            animationDelay: '1.5s'
          }} />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => <div key={index} className="group p-8 glass-card rounded-3xl shadow-soft hover:shadow-glow transition-all duration-500 hover-lift animate-scale-in micro-interaction" style={{
              animationDelay: `${index * 100}ms`
            }}>
                  <div className="mb-6 inline-flex p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500 shadow-soft">
                    <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3 luxury-text-shadow">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">{feature.description}</p>
                  
                  <div className="mt-6 pt-6 border-t border-primary/10 flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary animate-pulse" />
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                  </div>
                </div>)}
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Standards Section */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4 animate-fade-in">
                <h2 className="font-display font-black text-4xl flex items-center justify-center gap-3">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                  Стандарты качества
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Каждый заводчик в нашей сети придерживается строжайших стандартов качества и ухода
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 animate-fade-in" style={{
                animationDelay: "200ms"
              }}>
                  <h3 className="text-2xl font-display font-bold">Здоровье и генетика</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>Комплексное генетическое тестирование всех производителей</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>Регулярные ветеринарные осмотры и вакцинация</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>Документированные родословные</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4 animate-fade-in" style={{
                animationDelay: "300ms"
              }}>
                  <h3 className="text-2xl font-display font-bold">Условия содержания</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>Просторные, чистые помещения с естественным освещением</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>Сбалансированное питание премиум-класса</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>Ежедневная социализация и обогащение среды</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* CTA Section */}
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
              <h2 className="font-display font-black text-4xl flex items-center justify-center gap-3">
                <MessageCircle className="w-10 h-10 text-primary" />
                Хотите узнать больше о наших заводчиках?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Свяжитесь с нами, чтобы узнать больше о конкретных заводчиках и их подходе к разведению элитных кошек
              </p>
              <div className="pt-4">
                <a href="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full font-bold text-lg hover:shadow-glow transition-all duration-500 hover-lift hover-scale group">
                  <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Связаться
                </a>
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
export default Breeders;