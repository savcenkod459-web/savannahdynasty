import { Crown, Diamond, Gem, Star, Heart, Trophy, Sparkles, Cat, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

const PricingSection = () => {
  const { t } = useTranslation();
  
  return <section className="py-20 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{
      animationDelay: '3s'
    }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-full mb-6 micro-interaction">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-base font-bold tracking-widest uppercase text-primary">{t('pricingSection.badge')}</span>
            </div>
            <h2 className="font-display font-black text-5xl md:text-6xl luxury-text-shadow mb-6">
              {t('pricingSection.title')}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
              {t('pricingSection.subtitle')}
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
          </div>

          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Crown className="w-10 h-10 text-primary" />
              <h3 className="text-3xl font-display font-bold luxury-text-shadow text-center">{t('pricingSection.generationTitle')}</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-fade-in hover-lift micro-interaction border-2 border-primary/20">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl">
                    <span className="text-3xl font-display font-black text-white">F1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-display font-bold mb-2 luxury-text-shadow">{t('pricingSection.f1.title')}</h4>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {t('pricingSection.f1.description')}
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-primary/5 rounded-2xl mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Diamond className="w-6 h-6 text-primary" />
                    <span className="text-2xl font-display font-bold text-luxury-gradient">
                      {t('pricingSection.f1.price')}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-light">
                    {t('pricingSection.f1.priceNote')}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground font-light">{t('pricingSection.f1.note')}</p>
                  </div>
                </div>
                
                <Link to="/catalog?breed=Саванна F1" className="block mt-6">
                  <Button className="w-full text-sm md:text-lg py-6 group whitespace-normal h-auto min-h-[3rem] hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(217,179,112,0.6),0_5px_20px_rgba(0,0,0,0.3)] transition-all duration-300">
                    {t('pricingSection.f1.button')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform flex-shrink-0" />
                  </Button>
                </Link>
              </div>

              
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Sparkles className="w-10 h-10 text-primary" />
              <h3 className="text-3xl font-display font-bold luxury-text-shadow text-center">{t('pricingSection.factorsTitle')}</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="p-6 glass-card rounded-2xl hover-lift micro-interaction">
                  <div className="flex items-start gap-3">
                    <Trophy className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-2 text-foreground">
                        {t(`pricingSection.factor${num}.title`)}
                      </h4>
                      <p className="text-muted-foreground font-light text-sm">
                        {t(`pricingSection.factor${num}.description`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center p-10 glass-card rounded-3xl shadow-soft animate-fade-in">
            <Gem className="w-16 h-16 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-display font-bold luxury-text-shadow mb-4">{t('pricingSection.valueTitle')}</h3>
            <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
              {t('pricingSection.valueDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default PricingSection;