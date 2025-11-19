import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useState, useEffect, memo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowRight, Filter, Crown, Sparkles, Diamond, Star, Loader2, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CatDetailModal } from "@/components/CatDetailModal";
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
  video?: string;
};
const imageMap: Record<string, string> = {
  '/src/assets/savannah-f1-1.jpg': savannah1,
  '/src/assets/savannah-f2-1.jpg': savannah2,
  '/src/assets/savannah-kitten-1.jpg': kitten
};
const Catalog = () => {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const breedFromUrl = searchParams.get('breed') || 'all';
  const [selectedBreed, setSelectedBreed] = useState<string>(breedFromUrl);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalVideo, setModalVideo] = useState<string | undefined>();
  useEffect(() => {
    if (breedFromUrl !== 'all') {
      setSelectedBreed(breedFromUrl);
    }
  }, [breedFromUrl]);
  const openCatDetail = (cat: Cat) => {
    const allImages = [cat.image, ...(cat.additional_images || [])];
    setModalImages(allImages);
    setModalVideo(cat.video);
    setModalOpen(true);
  };

  // Fetch cats from Supabase
  const {
    data: cats,
    isLoading,
    error
  } = useQuery({
    queryKey: ['cats'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('cats').select('*').order('created_at', {
        ascending: true
      });
      if (error) throw error;
      return (data as Cat[]).map(cat => ({
        ...cat,
        image: imageMap[cat.image] || cat.image
      }));
    }
  });
  const allCats = cats || [];
  const filteredCats = allCats.filter(cat => {
    if (selectedBreed !== "all" && cat.breed !== selectedBreed) return false;
    return true;
  });
  return <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
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
                <span className="text-sm font-bold tracking-widest uppercase text-primary">{t('catalog.badge')}</span>
              </div>
              <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow py-[10px]">
                {t('catalog.title')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                {t('catalog.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        

        {/* Catalog Grid */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section className="py-20">
          <div className="container mx-auto px-6">
            {isLoading ? <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div> : error ? <div className="text-center py-20">
                <p className="text-xl text-red-500">
                  Ошибка загрузки данных. Попробуйте перезагрузить страницу.
                </p>
              </div> : filteredCats.length === 0 ? <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  Нет кошек, соответствующих выбранным фильтрам
                </p>
              </div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {filteredCats.map((cat, index) => <div key={cat.id} onClick={() => openCatDetail(cat)} className="group animate-scale-in cursor-pointer" style={{
                animationDelay: `${index * 100}ms`
              }}>
                    <div className="relative rounded-3xl overflow-hidden shadow-soft hover:shadow-[0_0_60px_rgba(217,179,112,0.8)] transition-all duration-500 hover:scale-105 hover:-translate-y-3" style={{
                  transform: 'translateZ(0)',
                  willChange: 'transform'
                }}>
                      {/* Gradient border effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/40 to-primary/40 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
                      <div className="absolute inset-[2px] bg-background/95 backdrop-blur-xl rounded-3xl" />
                      
                      {/* Content */}
                      <div className="relative">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl">
                          <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            loading="lazy"
                            decoding="async"
                          />
                          
                          {/* Gradient overlay on hover - softer colors */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Crown icon with glow */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                            <div className="relative">
                              <Crown className="w-8 h-8 text-primary animate-pulse drop-shadow-[0_0_12px_rgba(217,179,112,0.8)]" />
                            </div>
                          </div>
                          
                          {/* Breed tag with glass effect */}
                          <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105">
                            <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs rounded-full font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm border border-white/20">
                              {cat.breed}
                            </span>
                          </div>
                          
                          {/* Bottom gradient fade */}
                          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
                        </div>
                        
                        <div className="p-6 space-y-5 py-[30px]">
                          <div className="space-y-4">
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
                          <div className="flex flex-col gap-3 p-5 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-2xl border border-primary/20 backdrop-blur-sm shadow-inner group-hover:shadow-[0_0_20px_rgba(217,179,112,0.2)] transition-shadow duration-300">
                            {cat.traits.map((trait, i) => <div key={i} className="flex items-center gap-2 text-sm font-semibold text-foreground/90 group/trait">
                                <Sparkles className="w-4 h-4 text-primary group-hover/trait:animate-pulse drop-shadow-[0_0_8px_rgba(217,179,112,0.6)]" />
                                <span className="group-hover/trait:text-primary group-hover/trait:drop-shadow-[0_0_8px_rgba(217,179,112,0.4)] transition-all duration-300">{trait}</span>
                              </div>)}
                          </div>
                          
                    {/* Price section with enhanced styling */}
                    <div className="pt-6 border-t border-gradient-to-r from-transparent via-primary/30 to-transparent py-0">
                      <div className="space-y-4 pb-2">
                              <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">Цена</span>
                                  <div className="font-display font-black text-luxury-gradient text-5xl leading-none drop-shadow-[0_4px_16px_rgba(217,179,112,0.5)] group-hover:drop-shadow-[0_4px_24px_rgba(217,179,112,0.7)] transition-all duration-300">
                                    {cat.price.toLocaleString("en-US")} €
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
                          <Button variant="ghost-gold" size="sm" className="w-full py-[20px] hover:-translate-y-1 transition-all duration-300">
                            Родословная
                          </Button>
                        </Link>
                        <Link to="/payment#booking" onClick={e => e.stopPropagation()} className="flex-1">
                          <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(217,179,112,0.7)] hover:-translate-y-1 transition-all duration-300 py-[20px]">
                            Забронировать
                          </Button>
                        </Link>
                      </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>
        </section>
        </ScrollAnimationWrapper>
      </main>
      
      <Footer />
      <ScrollToTop />
      <CatDetailModal images={modalImages} video={modalVideo} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>;
};
export default memo(Catalog);