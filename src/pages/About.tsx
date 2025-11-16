import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Crown, Sparkles, Diamond, Star, Award, HeartPulse, Users, Trophy, Headset, Apple, Home, PawPrint, Brain, Gem, Cat, Baby, AlertCircle, Wind, Drumstick, Snowflake, Activity, Heart, Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import breedingImage from "@/assets/breeding-facility-new.png";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const {
    data: breedingImages
  } = useQuery({
    queryKey: ["site-images", "about", "breeding"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("site_images").select("*").eq("page", "about").eq("section", "breeding").order("display_order", {
        ascending: true
      }).limit(1).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const displayBreedingImage = breedingImages?.image_url || breedingImage;
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth"
        });
      }
    }
  }, [location]);
  const healthChecks = ["Полное ветеринарное обследование", "Генетическое тестирование на специфические для породы заболевания", "Протоколы вакцинации", "Профилактика паразитов", "Документация сертификации здоровья"];
  const breeds = [{
    name: "Саванна F1",
    description: "Отличается экзотической внешностью, высоким интеллектом и энергичным темпераментом. Эти кошки — первые в поколении гибрида с африканским сервалом, сочетающие дикую грацию с преданностью домашнего питомца. Саванна F1 — выбор для тех, кто ищет не просто кошку, а настоящего компаньона с характером.",
    traits: ["Активная", "Умная", "Экзотическая", "Преданная"]
  }];
  return <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section id="luxury-cats" className="py-20 bg-secondary/30 relative overflow-hidden scroll-mt-24">
          {/* Декоративные элементы */}
          <div className="absolute top-20 left-10 opacity-5">
            <Crown className="w-32 h-32 text-primary animate-float" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-5">
            <Diamond className="w-40 h-40 text-accent animate-float" style={{
            animationDelay: '2s'
          }} />
          </div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 micro-interaction">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold tracking-widest uppercase text-primary">{t('about.badge')}</span>
              </div>
              <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow">
                {t('about.title')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Откройте для себя мир премиальных кошачьих компаньонов. Наши кошки представляют 
                вершину селекционного мастерства, сочетая красоту, интеллект и любящий темперамент.
              </p>
            </div>
          </div>
        </section>

        {/* Breeding Standards */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section className="py-20 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{
            animationDelay: '3s'
          }} />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Award className="w-6 h-6 text-primary" />
                  <span className="text-sm font-bold tracking-widest uppercase text-primary">Превосходство</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl luxury-text-shadow">
                  Стандарты премиального разведения
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                  Каждая кошка в нашей коллекции происходит от чемпионских родословных с 
                  проверенными родословными, охватывающими несколько поколений. Мы работаем 
                  исключительно с авторитетными заводчиками, которые поддерживают самые высокие 
                  стандарты ухода и разведения.
                </p>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-glow animate-scale-in hover-lift micro-interaction image-blur-edges">
                <img src={displayBreedingImage} alt={breedingImages?.alt_text || "Breeding Facility"} className="w-full h-[400px] object-cover hover-scale" />
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Health & Wellness */}
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <section className="py-20 bg-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <Star className="absolute top-1/4 left-1/4 w-24 h-24 text-primary animate-pulse" />
            <Sparkles className="absolute bottom-1/4 right-1/4 w-20 h-20 text-accent animate-pulse" style={{
              animationDelay: '1.5s'
            }} />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-black text-4xl md:text-5xl mb-8 animate-fade-in luxury-text-shadow flex items-center gap-4">
                <HeartPulse className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                Здоровье и благополучие
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-12 animate-fade-in font-light">
                Все наши кошки проходят комплексные обследования здоровья, включая:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {healthChecks.map((check, index) => <div key={index} className="flex items-start gap-3 p-4 glass-card rounded-2xl animate-fade-in hover-lift micro-interaction" style={{
                  animationDelay: `${index * 100}ms`
                }}>
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
                    <span className="text-lg font-light">{check}</span>
                  </div>)}
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Socialization */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="animate-fade-in">
                <h2 className="font-display font-black text-4xl mb-6 flex items-center gap-4">
                  <Users className="w-10 h-10 text-primary" />
                  Социализация и уход
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Наши кошки выращиваются в любящей домашней обстановке, где они получают 
                  индивидуальное внимание и правильную социализацию с раннего возраста. Это 
                  обеспечивает развитие уверенных, дружелюбных личностей, идеальных для семейной жизни.
                </p>
              </div>

              <div className="animate-fade-in">
                <h2 className="font-display font-black text-4xl mb-6 flex items-center gap-4">
                  <Trophy className="w-10 h-10 text-primary" />
                  Выставочное качество
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Многие из наших кошек происходят от призерных выставочных линий, представляя лучшие 
                  образцы своих пород. Ищете ли вы любящего компаньона или потенциальную выставочную 
                  кошку, наша коллекция предлагает исключительное качество.
                </p>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Featured Breeds */}
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <section id="featured-breeds" className="py-20 bg-secondary/30 relative overflow-hidden scroll-mt-24">
          <div className="absolute top-10 right-10 opacity-5">
            <Crown className="w-40 h-40 text-primary animate-float" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 micro-interaction">
                <Diamond className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold tracking-widest uppercase text-primary">Премиум коллекция</span>
              </div>
              <h2 className="font-display font-black text-5xl md:text-6xl luxury-text-shadow">
                Наша избранная порода
              </h2>
            </div>
            <div className="max-w-3xl mx-auto">
              {breeds.map((breed, index) => <div key={index} className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-scale-in hover-lift micro-interaction" style={{
                animationDelay: `${index * 200}ms`
              }}>
                  <h3 className="font-display font-black text-3xl mb-4 luxury-text-shadow">{breed.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 font-light text-lg">{breed.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {breed.traits.map((trait, i) => <span key={i} className="px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 text-foreground rounded-full text-sm font-medium border border-primary/20 micro-interaction">
                        {trait}
                      </span>)}
                  </div>
                  <div className="mt-6 pt-6 border-t border-primary/10 flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary animate-pulse" />
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                  </div>
                </div>)}
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Редкость и Уникальность */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section id="rarity" className="py-20 relative overflow-hidden scroll-mt-24">
          <div className="absolute top-20 left-10 opacity-5">
            <Diamond className="w-40 h-40 text-primary animate-float" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-5">
            <Gem className="w-48 h-48 text-accent animate-float" style={{
              animationDelay: '2s'
            }} />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-full mb-6 micro-interaction">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-base font-bold tracking-widest uppercase text-primary">ИСКЛЮЧИТЕЛЬНОСТЬ</span>
                </div>
                <h2 className="font-display font-black text-5xl md:text-6xl luxury-text-shadow mb-6">
                  Редкость и Уникальность
                </h2>
                <p className="text-3xl md:text-4xl font-display text-luxury-gradient mb-4">
                  Саванна — редчайший бриллиант в мире кошек
                </p>
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
              </div>

              <div className="space-y-6">
                <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-scale-in hover-lift micro-interaction">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Award className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light flex-1">
                      Саванна — это не просто кошка. Это <span className="text-foreground font-bold">воплощение дикой грации, интеллекта и настоящего статуса</span>. Эти кошки — результат уникального скрещивания африканского сервала и домашней кошки, и каждая Саванна — это живое произведение искусства, рождённое природой и генной точностью.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-12">
                  <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-fade-in hover-lift micro-interaction" style={{
                    animationDelay: '100ms'
                  }}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Diamond className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold mb-2 luxury-text-shadow">💫 Редкость, достойная коллекционеров</h3>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      Саванна — одна из самых редких и дорогих пород в мире. Из-за сложного процесса разведения и строгих стандартов качества рождается очень ограниченное количество котят в год. Каждый представитель этой породы — буквально единичный экземпляр, и попасть в число владельцев Саванны — привилегия, доступная немногим.
                    </p>
                  </div>

                  <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-fade-in hover-lift micro-interaction" style={{
                    animationDelay: '200ms'
                  }}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Crown className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold mb-2 luxury-text-shadow">⚜️ Статус и происхождение</h3>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      Покупка Саванны — это не просто выбор домашнего питомца. Это приобретение символа исключительности. Именно поэтому этих кошек выбирают коллекционеры, бизнесмены, артисты и те, кто по-настоящему ценит редкость и индивидуальность.
                    </p>
                  </div>

                  <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-fade-in hover-lift micro-interaction" style={{
                    animationDelay: '300ms'
                  }}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <PawPrint className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold mb-2 luxury-text-shadow">🌍 Экзотическая кровь — дикая душа</h3>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      Саванна унаследовала от своих африканских предков невероятную энергетику, интеллект и характер. Это животное, способное понимать команды, привязываться к человеку как собака, гулять на поводке и поражать всех своей королевской осанкой.
                    </p>
                  </div>

                  <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-fade-in hover-lift micro-interaction" style={{
                    animationDelay: '400ms'
                  }}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Gem className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold mb-2 luxury-text-shadow">💎 Инвестиция в уникальность</h3>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      Стоимость котят Саванны оправдана их происхождением, ограниченным числом заводчиков, редкими генетическими линиями и элитным уходом. Это не просто покупка — это инвестиция в живую редкость, в существо, которое невозможно заменить или повторить.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Информация о цене */}
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <section id="pricing" className="py-20 bg-secondary/30 relative overflow-hidden scroll-mt-24">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{
            animationDelay: '3s'
          }} />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-full mb-6 micro-interaction">
                  <Crown className="w-5 h-5 text-primary" />
                  <span className="text-base font-bold tracking-widest uppercase text-primary">ЦЕНООБРАЗОВАНИЕ</span>
                </div>
                <h2 className="font-display font-black text-5xl md:text-6xl luxury-text-shadow mb-6">
                  Информация о цене
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
                  Когда речь идёт о породе Саванна, цена — это не просто цифра. Это отражение исключительности, происхождения и неповторимости каждой кошки.
                </p>
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
              </div>

              <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 mb-12 animate-scale-in">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Scale className="w-7 h-7 text-primary animate-pulse" />
                  </div>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed font-light text-center">
                  Эта порода — одна из самых дорогих и редких в мире, и её стоимость формируется из множества факторов, от поколения и окраса до уровня социализации и генетической линии.
                </p>
              </div>

              <div className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <Crown className="w-10 h-10 text-primary" />
                  <h3 className="text-3xl font-display font-bold luxury-text-shadow">⚜️ Поколение имеет значение</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-8 font-light leading-relaxed">
                  Главный фактор, определяющий цену — это поколение (F1, F2, F3 и т.д.), то есть насколько близко животное к своим диким предкам — африканскому сервалу.
                </p>

                <div className="space-y-6">
                  <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-fade-in hover-lift micro-interaction border-2 border-primary/20">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl">
                        <span className="text-3xl font-display font-black text-white">F1</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-display font-bold mb-2 luxury-text-shadow">Savannah F1</h4>
                        <p className="text-muted-foreground font-light leading-relaxed">
                          Первое поколение, потомок прямого скрещивания сервала и домашней кошки. Уровень дикости и внешней схожести с сервалом здесь максимален.
                        </p>
                      </div>
                    </div>
                    <div className="p-6 bg-primary/5 rounded-2xl mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Diamond className="w-6 h-6 text-primary" />
                        <span className="text-2xl font-display font-bold text-luxury-gradient">
                          🐾 Цена: от 10 000 до 25 000 EUR
                        </span>
                      </div>
                      <p className="text-muted-foreground font-light">
                        Иногда доходит до <span className="text-foreground font-bold">35 000+ EUR</span> за кошек редкого окраса
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <p className="text-muted-foreground font-light">Высокий рост, длинные лапы и эффектная "дикая" внешность</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <p className="text-muted-foreground font-light">F1 — это статус, коллекционность и живая эксклюзивность</p>
                      </div>
                    </div>
                    
                    <Link to="/catalog?breed=Саванна F1" className="block mt-6">
                      <Button className="w-full text-sm md:text-lg py-6 group whitespace-normal h-auto min-h-[3rem]">
                        Посмотреть наших котов Саванны F1
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform flex-shrink-0" />
                      </Button>
                    </Link>
                  </div>

                  
                </div>
              </div>

              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <Sparkles className="w-10 h-10 text-primary" />
                  <h3 className="text-3xl font-display font-bold luxury-text-shadow">💫 Что влияет на стоимость</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                    <div className="flex items-start gap-3">
                      <Trophy className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold mb-2 text-foreground">Поколение (F1–F7)</h4>
                        <p className="text-muted-foreground font-light text-sm">Чем ближе к сервалу, тем выше цена</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold mb-2 text-foreground">Окрас и узор</h4>
                        <p className="text-muted-foreground font-light text-sm">Gold spotted, silver, snow, melanistic — самые редкие и ценные</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                    <div className="flex items-start gap-3">
                      <Cat className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold mb-2 text-foreground">Пол</h4>
                        <p className="text-muted-foreground font-light text-sm">Коты (особенно F1 и F2) ценятся дороже кошек</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                    <div className="flex items-start gap-3">
                      <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold mb-2 text-foreground">Линия разведения</h4>
                        <p className="text-muted-foreground font-light text-sm">Котята из элитных питомников с тестами и родословными (TICA, CFA)</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                    <div className="flex items-start gap-3">
                      <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold mb-2 text-foreground">Социализация и уход</h4>
                        <p className="text-muted-foreground font-light text-sm">Профессиональное воспитание с раннего возраста</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                    <div className="flex items-start gap-3">
                      <Diamond className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold mb-2 text-foreground">Редкость предложения</h4>
                        <p className="text-muted-foreground font-light text-sm">Менее нескольких сотен F1 Savannah во всём мире</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 glass-card rounded-3xl shadow-glow border-2 border-primary/30 text-center animate-scale-in">
                <Crown className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                <h3 className="text-3xl font-display font-bold mb-4 luxury-text-shadow">🌍 Цена — отражение статуса</h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-light mb-4">
                  Саванна не просто стоит дорого — она стоит настолько, насколько стоит редкость, невозможность подделки и настоящая природная роскошь.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Это не покупка, а <span className="text-foreground font-bold text-luxury-gradient">инвестиция в исключительность</span>. Владельцы Саванн — люди, которые выбирают лучшее не ради цены, а ради того, что ценится по-настоящему.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Дополнительная важная информация */}
        <section id="important-info" className="py-20 relative overflow-hidden scroll-mt-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
            <Sparkles className="w-64 h-64 text-primary animate-float" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-full mb-6 micro-interaction">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-base font-bold tracking-widest uppercase text-primary">ЭКСКЛЮЗИВНАЯ ИНФОРМАЦИЯ</span>
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl luxury-text-shadow mb-4 flex items-center justify-center gap-4">
                <AlertCircle className="w-20 h-20 md:w-24 md:h-24 text-primary" />
                О кошках дополнительно важная информация
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>
          </div>
        </section>

        {/* Питание */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <h2 className="font-display font-black text-4xl md:text-5xl mb-8 flex items-center gap-4 luxury-text-shadow">
                <Apple className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                Питание
              </h2>
              <div className="space-y-4">
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Drumstick className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Рацион составлен преимущественно из <span className="text-foreground font-medium">сырого мяса</span> — цыплёнок, перепёлки, шейки, курица и аналогичные виды.
                </p>
                  </div>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Snowflake className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Используется <span className="text-foreground font-medium">замороженное мясо высокого качества</span>, регулярно размораживается и подаётся свежим.
                </p>
                  </div>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Activity className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Всё это — <span className="text-foreground font-medium">богатый белком рацион</span>, важный для поддержания здоровья, сил, роста, мускулатуры и активности.
                </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Условия жизни и содержание */}
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <h2 className="font-display font-black text-4xl md:text-5xl mb-8 flex items-center gap-4 luxury-text-shadow">
                <Home className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                Условия жизни и содержание
              </h2>
              <div className="space-y-4">
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Wind className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Коты содержатся в <span className="text-foreground font-medium">просторных вольерах</span>, где они могут свободно двигаться, разворачиваются, прыгать, лазить.
                </p>
                  </div>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Home className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Также коты хорошо адаптируются к жизни в <span className="text-foreground font-medium">доме и квартире</span> — при условии достаточного пространства, возможности лазать вверх, охотиться на игрушки, активно играть.
                </p>
                  </div>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  Они любят <span className="text-foreground font-medium">свободу и разнообразные стимулы</span> (игрушки, полки, переходы, вертикальные пространства).
                </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Поведение */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <h2 className="font-display font-black text-4xl md:text-5xl mb-8 flex items-center gap-4 luxury-text-shadow">
                <PawPrint className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                Поведение с другими животными и с детьми
              </h2>
              <div className="space-y-4">
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      Саванна, особенно поколения F1 и F2, обладают <span className="text-foreground font-medium">сильным охотничьим инстинктом</span>. Это значит, что маленьких животных (грызуны, птицы и др.) стоит держать отдельно или под присмотром, т.к. могут проявлять инстинкты преследования.
                    </p>
                  </div>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      <span className="text-foreground font-medium">Собаки / другие крупные животные</span> — в большинстве случаев возможна дружба, если котёнок социализирован с ними с раннего возраста.
                    </p>
                  </div>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      <span className="text-foreground font-medium">С детьми</span>: при правильной социализации котята Саванны становятся ласковыми, преданными, могут играть, но требуется, чтобы дети уважали кошек — не дергали резко, не боялись и не нарушали личное пространство питомца.
                    </p>
                  </div>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      Они могут быть осторожны или настороженны с незнакомцами, но часто <span className="text-foreground font-medium">сильно привязываются к членам семьи</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Характер */}
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
          <div className="absolute bottom-10 right-10 opacity-5">
            <Star className="w-40 h-40 text-accent animate-float" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <h2 className="font-display font-black text-4xl md:text-5xl mb-8 flex items-center gap-4 luxury-text-shadow">
                <Brain className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                Характер
              </h2>
              <div className="space-y-4">
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <h3 className="text-xl font-bold mb-3 text-foreground flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Высокий уровень активности
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-light">
                    Любят играть, бегать, прыгать, лазать. Им важно давать возможности для физической нагрузки и ментальных игр.
                  </p>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <h3 className="text-xl font-bold mb-3 text-foreground flex items-center gap-3">
                    <Brain className="w-6 h-6 text-primary" />
                    Интеллект
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-light">
                    Быстро учатся, проявляют интерес к новому, могут осваивать трюки, реагировать на команды, учиться ходить на поводке / шлейке.
                  </p>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <h3 className="text-xl font-bold mb-3 text-foreground flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary" />
                    Социальность
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-light">
                    Они любят общаться, быть рядом с людьми, требуя внимания, но могут быть независимыми; иногда предпочитают заниматься сами по себе.
                  </p>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <h3 className="text-xl font-bold mb-3 text-foreground flex items-center gap-3">
                    <HeartPulse className="w-6 h-6 text-primary" />
                    Природный инстинкт
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-light">
                    Охотничий, исследовательский — любят высоту, смотреть с высоких точек, исследовать пространство. Это не просто домашний кот, а конкурентный, мощный, дикий в малой части питомец.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Взрослые коты */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section id="adult-cats" className="py-20 bg-secondary/30 relative overflow-hidden scroll-mt-24">
          <div className="absolute top-20 left-10 opacity-5">
            <Cat className="w-32 h-32 text-primary animate-float" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <h2 className="font-display font-black text-4xl md:text-5xl mb-6 luxury-text-shadow flex items-center gap-4">
                <Crown className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                Взрослые коты Savannah F1
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-light">
                Наши взрослые Саванны — это не просто экзотические животные, а зрелые, сформированные личности с яркой индивидуальностью и великолепным экстерьером.
              </p>
              <div className="p-6 glass-card rounded-2xl mb-8 hover-lift micro-interaction">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-muted-foreground leading-relaxed font-light">
                    Эти коты уже прошли этап взросления, полностью проявили свои черты характера и поведения. Вы сразу видите, какой темперамент у животного, и легко можете подобрать питомца под ваш образ жизни: активного, ручного, независимого или более контактного.
                  </p>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <Trophy className="w-7 h-7 text-primary" />
                Преимущества взрослых Саванн:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-base text-muted-foreground font-light">
                      <span className="font-medium text-foreground">Уже социализированы</span> — приучены к человеку, выгулу на шлейке, лотку, знают правила поведения в доме
                    </p>
                  </div>
                </div>
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-base text-muted-foreground font-light">
                      <span className="font-medium text-foreground">Сформировавшийся характер</span> — никаких "сюрпризов" как с котёнком, всё прозрачно
                    </p>
                  </div>
                </div>
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-base text-muted-foreground font-light">
                      <span className="font-medium text-foreground">Впечатляющий внешний вид</span> — яркий окрас, крупное телосложение, "дикий" типаж максимально выражен
                    </p>
                  </div>
                </div>
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-base text-muted-foreground font-light">
                      <span className="font-medium text-foreground">Отлично подходят для разведения</span> — с родословной, проверенным здоровьем и великолепной генетикой
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-6 glass-card rounded-2xl hover-lift micro-interaction">
                <div className="flex items-start gap-3">
                  <Gem className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-muted-foreground leading-relaxed font-light">
                    Многие наши взрослые коты — это потомки чемпионов или ценные производители. При этом они остаются контактными и умными — могут стать полноценными домашними питомцами и легко адаптироваться в новом доме.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Котята */}
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <section id="kittens" className="py-20 scroll-mt-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <h2 className="font-display font-black text-4xl md:text-5xl mb-6 luxury-text-shadow flex items-center gap-4">
                <Cat className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                Котята Savannah F1
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-light">
                Котята Саванны — это настоящее чудо. Маленькие "леопардики", в которых сочетается дикость внешности и невероятная любознательность, характерная для этой уникальной породы.
              </p>
              <div className="p-6 glass-card rounded-2xl mb-8 hover-lift micro-interaction">
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-muted-foreground leading-relaxed font-light">
                    С самого раннего возраста мы уделяем большое внимание социализации, поэтому котята: растут рядом с человеком, привыкают к ласке, голосу, прикосновениям, учатся играть, бегать, исследовать мир с доверием и интересом.
                  </p>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Что вы получаете с котёнком:</h3>
              <div className="space-y-3 mb-8">
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg text-muted-foreground font-light">
                      <span className="font-medium text-foreground">Домашнего любимца</span>, который с первых месяцев будет привязан к вам
                    </p>
                  </div>
                </div>
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg text-muted-foreground font-light">
                      <span className="font-medium text-foreground">Экзотику класса люкс</span> — редкую породу, которая вызывает восторг у всех гостей
                    </p>
                  </div>
                </div>
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg text-muted-foreground font-light">
                      <span className="font-medium text-foreground">Питомца с перспективой</span> — для выставок, разведения, участия в племенной программе
                    </p>
                  </div>
                </div>
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg text-muted-foreground font-light">
                      <span className="font-medium text-foreground">Умного и активного спутника</span> — котята Саванны обучаются быстро, проявляют интеллект, охотно играют и исследуют
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Все наши котята получают:</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction text-center">
                  <HeartPulse className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-base font-medium text-foreground">Возрастную вакцинацию</p>
                </div>
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction text-center">
                  <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-base font-medium text-foreground">Ветеринарный осмотр</p>
                </div>
                <div className="p-4 glass-card rounded-2xl hover-lift micro-interaction text-center">
                  <Trophy className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-base font-medium text-foreground">Родословные документы (TICA)</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Lifetime Support */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <h2 className="font-display font-black text-4xl flex items-center justify-center gap-4">
                <Headset className="w-10 h-10 text-primary" />
                Пожизненная поддержка
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">Когда вы приветствуете одну из наших роскошных кошек в своем доме, вы получаете не просто питомца - вы получаете члена семьи и нашу приверженность поддержке вас на протяжении всей жизни вашей кошки. От советов по питанию до руководства по поведению - мы здесь, чтобы помочь обеспечить вашему кошачьему другу лучшую жизнь.</p>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>;
};
export default About;