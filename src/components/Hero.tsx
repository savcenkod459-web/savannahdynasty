import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Crown } from "lucide-react";
import heroImage from "@/assets/hero-cat-new.png";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
const Hero = () => {
  const { t } = useTranslation();
  
  const { data: heroImages } = useQuery({
    queryKey: ["site-images", "home", "hero"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_images")
        .select("*")
        .eq("page", "home")
        .eq("section", "hero")
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const displayImage = heroImages?.image_url || heroImage;

  return <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{
      animationDelay: '3s'
    }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20 hover-shine micro-interaction bg-slate-200 mx-0 px-[15px] py-[10px] my-[20px]">
                <Crown className="w-4 h-4 text-primary animate-gold-pulse" />
                <span className="tracking-widest uppercase text-neutral-950 font-extrabold text-sm">{t('hero.badge')}</span>
              </div>
              <h1 className="font-display font-black text-luxury-gradient leading-tight relative luxury-text-shadow text-3xl sm:text-4xl md:text-5xl lg:text-6xl py-[10px]">
                {t('hero.title')}
                <div className="absolute -bottom-4 left-0 w-32 h-1.5 bg-gradient-to-r from-primary via-accent to-transparent rounded-full" />
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl font-light">
                {t('hero.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog">
                <Button size="lg" className="group w-full sm:w-auto text-lg px-10 py-7 rounded-2xl shadow-gold hover:shadow-glow transition-all duration-500 hover:-translate-y-1 hover-shine relative overflow-hidden micro-interaction">
                  <span className="relative z-10 font-semibold">{t('hero.cta')}</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform relative z-10" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost-gold" size="lg" className="w-full sm:w-auto px-10 py-7 rounded-2xl text-lg micro-interaction font-semibold">
                  {t('hero.learn')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in group/hero">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl animate-gold-pulse" />
            <div className="relative rounded-3xl overflow-hidden shadow-deep hover:shadow-glow transition-all duration-700 hover:scale-[1.02] image-blur-edges">
              <img src={displayImage} alt={heroImages?.alt_text || "Элитная кошка Саванна F1"} className="w-full h-[600px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-primary/10" />
              
              {/* Logo with Crown - appears on hover */}
              <div className="absolute top-4 left-4 opacity-0 group-hover/hero:opacity-100 transition-all duration-500 transform group-hover/hero:scale-110 flex items-center gap-3">
                <div className="relative">
                  <Crown className="w-8 h-8 animate-pulse drop-shadow-[0_0_20px_rgba(217,179,112,1)]" style={{ color: 'hsl(43, 96%, 65%)' }} />
                </div>
                <span className="font-display font-black text-2xl drop-shadow-[0_0_30px_rgba(217,179,112,1)] luxury-text-shadow text-luxury-gradient">SavannahDynasty</span>
              </div>
              
              {/* Gold accent overlay */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/30 to-transparent rounded-bl-full" />
            </div>
            
            {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-primary via-accent to-primary text-luxury-black rounded-2xl shadow-gold animate-gold-pulse micro-interaction hover:scale-105 mx-0 my-[20px] px-[30px] py-[20px]" style={{
            boxShadow: '0 0 60px 20px rgba(217, 179, 112, 0.6), 0 0 100px 40px rgba(217, 179, 112, 0.4), 0 0 140px 60px rgba(217, 179, 112, 0.2)'
          }}>
              <p className="text-sm font-bold opacity-90 tracking-wider uppercase">{t('breeds.f1.name')}</p>
              <p className="text-3xl font-display font-black luxury-text-shadow">{t('hero.premiumClass')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;