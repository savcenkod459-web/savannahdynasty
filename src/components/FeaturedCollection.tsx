import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Crown, Sparkles, Loader2, Star, Calendar, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CatGallery } from "@/components/CatGallery";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import savannah1 from "@/assets/savannah-f1-1.jpg";
import savannah2 from "@/assets/savannah-f2-1.jpg";
import kitten from "@/assets/savannah-kitten-1.jpg";
type Cat = {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  price: number;
  image: string;
  description: string;
  traits: string[];
  additional_images: string[];
};
const imageMap: Record<string, string> = {
  '/src/assets/savannah-f1-1.jpg': savannah1,
  '/src/assets/savannah-f2-1.jpg': savannah2,
  '/src/assets/savannah-kitten-1.jpg': kitten
};
const FeaturedCollection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const openGallery = (image: string, additionalImages: string[]) => {
    const allImages = [image, ...(additionalImages || [])];
    setGalleryImages(allImages);
    setGalleryInitialIndex(0);
    setGalleryOpen(true);
  };

  // Fetch cats from Supabase
  const {
    data: cats,
    isLoading
  } = useQuery({
    queryKey: ['featured-cats'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('cats').select('*').order('created_at', {
        ascending: true
      }).limit(3);
      if (error) throw error;
      return (data as Cat[]).map(cat => ({
        ...cat,
        image: imageMap[cat.image] || cat.image,
        price: `${cat.price.toLocaleString("en-US")} €`
      }));
    }
  });
  return <section className="py-32 relative overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{
        animationDelay: '3s'
      }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center space-y-6 mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 micro-interaction">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold tracking-widest uppercase text-primary">{t('featuredCollection.badge')}</span>
          </div>
          <h2 className="font-display font-black text-luxury-gradient luxury-text-shadow py-[10px]">
            {t('featuredCollection.title')}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            {t('featuredCollection.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div> : cats && cats.length > 0 ? cats.map((cat, index) => <div key={cat.id} style={{
          animationDelay: `${index * 100}ms`
        }} className="group animate-scale-in py-[30px]">
              <div className="relative rounded-3xl overflow-hidden shadow-soft hover:shadow-[0_0_60px_rgba(217,179,112,0.8)] transition-all duration-500 hover:scale-105 hover:-translate-y-3" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/40 to-primary/40 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
                <div className="absolute inset-[2px] bg-background/95 backdrop-blur-xl rounded-3xl" />
                
                {/* Content */}
                <div className="relative">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    openGallery(cat.image, cat.additional_images);
                  }}>
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    
                    {/* Gradient overlay on hover - softer colors */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Crown icon with LuxuryCats text */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 flex items-center gap-3">
                      <span className="font-display font-black text-2xl text-primary drop-shadow-[0_0_20px_rgba(217,179,112,0.8)] luxury-text-shadow">SavannahDynasty</span>
                      <div className="relative">
                        <Crown className="w-8 h-8 text-primary animate-pulse drop-shadow-[0_0_12px_rgba(217,179,112,0.8)]" />
                      </div>
                    </div>
                    
                    {/* Bottom gradient fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
                  </div>
                  
                  <div className="p-6 space-y-5 py-[30px]">
                    <div className="space-y-4 cursor-pointer" onClick={() => navigate('/catalog')}>
                      <h3 className="text-3xl font-display font-black luxury-text-shadow bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 origin-left leading-tight drop-shadow-[0_0_20px_rgba(217,179,112,0.4)]">
                        {cat.name}
                      </h3>
                      <p className="text-foreground/80 text-base leading-relaxed font-light tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] group-hover:text-foreground transition-colors duration-300">{cat.description}</p>
                      <div className="flex gap-3 text-sm font-bold">
                        <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-full border border-primary/30 backdrop-blur-sm shadow-sm hover:shadow-[0_0_16px_rgba(217,179,112,0.4)] transition-all duration-300 hover:scale-105">
                          <Calendar className="w-4 h-4" />
                          {cat.age}
                        </span>
                        <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/20 to-accent/10 text-accent rounded-full border border-accent/30 backdrop-blur-sm shadow-sm hover:shadow-[0_0_16px_rgba(217,179,112,0.4)] transition-all duration-300 hover:scale-105">
                          <Users className="w-4 h-4" />
                          {cat.gender}
                        </span>
                      </div>
                    </div>
                    
                    {/* Traits grid with icons */}
                    <div className="flex flex-col gap-3 p-5 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-2xl border border-primary/20 backdrop-blur-sm shadow-inner group-hover:shadow-[0_0_20px_rgba(217,179,112,0.2)] transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/catalog')}>
                      {cat.traits.map((trait, i) => <div key={i} className="flex items-center gap-2 text-sm font-semibold text-foreground/90 group/trait">
                          <Sparkles className="w-4 h-4 text-primary group-hover/trait:animate-pulse drop-shadow-[0_0_8px_rgba(217,179,112,0.6)]" />
                          <span className="group-hover/trait:text-primary group-hover/trait:drop-shadow-[0_0_8px_rgba(217,179,112,0.4)] transition-all duration-300">{trait}</span>
                        </div>)}
                    </div>
                    
                    {/* Price section with enhanced styling */}
                    <div className="pt-6 border-t border-gradient-to-r from-transparent via-primary/30 to-transparent">
                      <div className="space-y-4 pb-2 cursor-pointer" onClick={() => navigate('/catalog')}>
                        <div className="flex items-end justify-between">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">Цена</span>
                            <div className="font-display font-black text-luxury-gradient text-4xl leading-none drop-shadow-[0_4px_16px_rgba(217,179,112,0.5)] group-hover:drop-shadow-[0_4px_24px_rgba(217,179,112,0.7)] transition-all duration-300">
                              {cat.price}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Star className="h-5 w-5 text-primary animate-pulse drop-shadow-[0_0_12px_rgba(217,179,112,0.8)]" />
                            </div>
                            <div onClick={e => {
                          e.stopPropagation();
                          navigate('/contact');
                        }} className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 group-hover:shadow-[0_0_16px_rgba(217,179,112,0.4)] transition-all duration-300 cursor-pointer">
                              <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(217,179,112,0.6)]" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-8">
                        <Link to={`/pedigree/${cat.id}`} onClick={e => e.stopPropagation()} className="flex-1">
                          <Button variant="ghost-gold" size="sm" className="w-full hover:-translate-y-1 transition-all duration-300">
                            Родословная
                          </Button>
                        </Link>
                        <Link to="/payment#booking" onClick={e => e.stopPropagation()} className="flex-1">
                          <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(217,179,112,0.7)] hover:-translate-y-1 transition-all duration-300">
                            Забронировать
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>) : null}
        </div>

        <div className="text-center">
          <Link to="/catalog">
            <Button size="lg" variant="ghost-gold" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
              Посмотреть всю коллекцию
              <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
            </Button>
          </Link>
        </div>
      </div>
      
      <CatGallery images={galleryImages} isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} initialIndex={galleryInitialIndex} />
    </section>;
};
export default FeaturedCollection;