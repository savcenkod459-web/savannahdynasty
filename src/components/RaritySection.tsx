import { Diamond, Gem, Sparkles, Crown, PawPrint, Heart, Star, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const RaritySection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 relative overflow-visible">
      <div className="absolute top-20 left-10 opacity-5">
        <Diamond className="w-40 h-40 text-primary animate-float" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-5">
        <Gem className="w-48 h-48 text-accent animate-float" style={{animationDelay: '2s'}} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-full mb-6 micro-interaction">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-base font-bold tracking-widest uppercase text-primary">{t('raritySection.badge')}</span>
            </div>
            <h2 className="font-display font-black text-5xl md:text-6xl luxury-text-shadow mb-6">
              {t('raritySection.title')}
            </h2>
            <p className="text-3xl md:text-4xl font-display text-luxury-gradient mb-4">
              {t('raritySection.subtitle')}
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
                  {t('raritySection.intro')}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-fade-in hover-lift micro-interaction" style={{animationDelay: '100ms'}}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Diamond className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-2 luxury-text-shadow">{t('raritySection.rarity.title')}</h3>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  {t('raritySection.rarity.description')}
                </p>
              </div>

              <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-fade-in hover-lift micro-interaction" style={{animationDelay: '200ms'}}>
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

              <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-fade-in hover-lift micro-interaction" style={{animationDelay: '300ms'}}>
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

              <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-fade-in hover-lift micro-interaction" style={{animationDelay: '400ms'}}>
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
  );
};

export default RaritySection;
