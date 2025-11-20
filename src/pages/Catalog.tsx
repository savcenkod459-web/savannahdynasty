import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useState, useEffect, memo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Crown, Sparkles, Diamond, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CatDetailModal } from "@/components/CatDetailModal";
import { CatCard } from "@/components/CatCard";
import { useTranslation } from "react-i18next";
import { useDataCache } from "@/hooks/useImageCache";
import { useVirtualizer } from "@tanstack/react-virtual";
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

// Preload images for next/previous cards
const preloadImages = (cats: Cat[], currentIndex: number) => {
  const imagesToPreload: string[] = [];
  
  // Preload next card images
  if (currentIndex < cats.length - 1) {
    const nextCat = cats[currentIndex + 1];
    imagesToPreload.push(nextCat.image);
    if (nextCat.additional_images) {
      imagesToPreload.push(...nextCat.additional_images);
    }
  }
  
  // Preload previous card images
  if (currentIndex > 0) {
    const prevCat = cats[currentIndex - 1];
    imagesToPreload.push(prevCat.image);
    if (prevCat.additional_images) {
      imagesToPreload.push(...prevCat.additional_images);
    }
  }
  
  // Create image objects to trigger preloading
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};
const Catalog = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const breedFromUrl = searchParams.get('breed') || 'all';
  const [selectedBreed, setSelectedBreed] = useState<string>(breedFromUrl);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalVideo, setModalVideo] = useState<string | undefined>();
  const { getFromCache, saveToCache } = useDataCache<Cat[]>('catalog_cats', 30 * 60 * 1000); // 30 минут
  const parentRef = useRef<HTMLDivElement>(null);

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
    
    // Preload adjacent cat images for faster navigation
    const currentIndex = filteredCats.findIndex(c => c.id === cat.id);
    if (currentIndex !== -1) {
      preloadImages(filteredCats, currentIndex);
    }
  };

  // Fetch cats from Supabase with caching
  const {
    data: cats,
    isLoading,
    error
  } = useQuery({
    queryKey: ['cats'],
    queryFn: async () => {
      // Проверяем кэш
      const cached = getFromCache();
      if (cached) {
        return cached;
      }

      const {
        data,
        error
      } = await supabase.from('cats').select('*').order('created_at', {
        ascending: true
      });
      if (error) throw error;
      
      const processedData = (data as Cat[]).map(cat => ({
        ...cat,
        image: imageMap[cat.image] || cat.image
      }));
      
      // Сохраняем в кэш
      saveToCache(processedData);
      
      return processedData;
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });
  const allCats = cats || [];
  const filteredCats = allCats.filter(cat => {
    if (selectedBreed !== "all" && cat.breed !== selectedBreed) return false;
    return true;
  });

  // Virtual scrolling configuration
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(filteredCats.length / 3), // 3 columns
    getScrollElement: () => parentRef.current,
    estimateSize: () => 500, // Estimated row height
    overscan: 2, // Number of items to render outside visible area
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

        {/* Catalog Grid with Virtualization */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section className="py-20">
            <div className="container mx-auto px-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-xl text-red-500">
                    Ошибка загрузки данных. Попробуйте перезагрузить страницу.
                  </p>
                </div>
              ) : filteredCats.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">
                    Нет кошек, соответствующих выбранным фильтрам
                  </p>
                </div>
              ) : (
                <div ref={parentRef} style={{ height: '100%', overflow: 'auto' }}>
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const startIndex = virtualRow.index * 3;
                      const rowCats = filteredCats.slice(startIndex, startIndex + 3);
                      
                      return (
                        <div
                          key={virtualRow.key}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rowCats.map((cat, colIndex) => {
                              const index = startIndex + colIndex;
                              return (
                                <div
                                  key={cat.id}
                                  onMouseEnter={() => {
                                    preloadImages(filteredCats, index);
                                  }}
                                  style={{ touchAction: 'manipulation' }}
                                >
                                  <CatCard 
                                    cat={cat} 
                                    onCardClick={openCatDetail}
                                    animationDelay={0}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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