import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, MessageCircle, Sparkles, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";

const FinalCTA = () => {
  const { t } = useTranslation();
  return <section className="py-32 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 opacity-5 bg-stone-950">
        <Crown className="absolute top-20 left-20 w-32 h-32 text-primary animate-float" />
        <Sparkles className="absolute bottom-20 right-20 w-24 h-24 text-accent animate-float" style={{
        animationDelay: '2s'
      }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-accent to-primary p-12 md:p-20 shadow-glow image-blur-edges">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/5" />
          
          <div className="relative z-10 text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-4 micro-interaction border border-white/30">
              <Crown className="w-4 h-4 text-white" />
              <span className="text-sm font-bold tracking-widest uppercase text-white">{t('cta.badge')}</span>
            </div>
            
            <h2 className="font-display leading-tight luxury-text-shadow text-stone-950 text-center text-5xl mx-0 my-0 px-0 py-[10px] font-bold">
              {t('cta.title')}
            </h2>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
              {t('cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/catalog">
                <Button size="lg" variant="secondary" className="group w-full sm:w-auto text-lg px-10 py-7 rounded-2xl shadow-elegant transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(217,179,112,0.6)] micro-interaction font-semibold">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="group w-full sm:w-auto text-lg px-10 py-7 rounded-2xl border-2 border-white/80 hover:border-white backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] text-white micro-interaction font-semibold">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t('cta.button')}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative elements with animation */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{
          animationDelay: '3s'
        }} />
          
          {/* Floating luxury icons */}
          <div className="absolute top-10 left-10 opacity-20">
            <Sparkles className="w-16 h-16 text-white animate-pulse" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-20">
            <Crown className="w-20 h-20 text-white animate-pulse" style={{
            animationDelay: '1s'
          }} />
          </div>
        </div>
      </div>
    </section>;
};
export default FinalCTA;