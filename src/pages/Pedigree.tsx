import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Crown, Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

type PedigreeEntry = {
  id: string;
  parent_type: string;
  parent_name: string;
  parent_breed: string;
  parent_description: string | null;
  parent_images: string[];
};

type Cat = {
  id: string;
  name: string;
  breed: string;
};

const Pedigree = () => {
  const { catId } = useParams();
  const navigate = useNavigate();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (images: string[], index: number) => {
    setGalleryImages(images);
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const { data: cat, isLoading: catLoading } = useQuery({
    queryKey: ["cat", catId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cats")
        .select("id, name, breed")
        .eq("id", catId)
        .single();

      if (error) throw error;
      return data as Cat;
    },
  });

  const { data: pedigree, isLoading: pedigreeLoading } = useQuery({
    queryKey: ["pedigree", catId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cat_pedigrees")
        .select("*")
        .eq("cat_id", catId)
        .order("parent_type", { ascending: true });

      if (error) throw error;
      return data as PedigreeEntry[];
    },
  });

  const isLoading = catLoading || pedigreeLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-20 flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const fathers = pedigree?.filter((p) => p.parent_type === "father") || [];
  const mothers = pedigree?.filter((p) => p.parent_type === "mother") || [];

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-24 pb-20">
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <div className="container mx-auto px-6">
          <Button
            variant="ghost-gold"
            onClick={() => navigate(-1)}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>

          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-full mb-6 group hover:shadow-[0_0_40px_rgba(217,179,112,0.6)] transition-all duration-500 cursor-default hover:scale-105">
              <Crown className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-xl font-bold tracking-widest uppercase text-primary luxury-text-shadow">
                Родословная
              </span>
            </div>
            <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow">
              {cat?.name}
            </h1>
          </div>

          {(!pedigree || pedigree.length === 0) ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                Информация о родословной пока не добавлена
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Отец */}
              {fathers.length > 0 && (
                <div>
                  <h2 className="text-3xl font-display font-bold text-primary mb-6 text-center">
                    Самец
                  </h2>
                  <div className="space-y-6">
                    {fathers.map((parent) => (
                      <Card
                        key={parent.id}
                        className="group animate-scale-in overflow-hidden glass-card border-primary/20 shadow-soft hover:shadow-[0_0_60px_rgba(217,179,112,0.6)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md -z-10" />
                        <CardContent className="p-0 relative">
                          {parent.parent_images && parent.parent_images.length > 0 && (
                            <div 
                              className="aspect-[3/4] overflow-hidden relative cursor-pointer"
                              onClick={() => openGallery(parent.parent_images, 0)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                              
                              {/* Breed label with animation */}
                              <div className="absolute top-4 left-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-20px] group-hover:translate-y-0">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground rounded-full shadow-lg backdrop-blur-md border border-white/20 animate-fade-in">
                                  <Crown className="w-4 h-4 animate-pulse" />
                                  <span className="text-sm font-bold uppercase tracking-wider">
                                    {parent.parent_breed}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Maximize2 className="w-12 h-12 text-white drop-shadow-lg" />
                              </div>
                              <img
                                src={parent.parent_images[0]}
                                alt={parent.parent_name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                          )}
                          <div className="p-6 space-y-4 bg-gradient-to-b from-background/80 to-background">
                            <div className="flex items-center gap-2">
                              <Crown className="w-5 h-5 text-primary animate-pulse" />
                              <h3 className="text-2xl font-display font-black text-luxury-gradient luxury-text-shadow">
                                {parent.parent_name}
                              </h3>
                            </div>
                            <p className="text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full inline-block">
                              {parent.parent_breed}
                            </p>
                            {parent.parent_description && (
                              <p className="text-foreground/80 text-sm leading-relaxed">
                                {parent.parent_description}
                              </p>
                            )}
                            {parent.parent_images && parent.parent_images.length > 1 && (
                              <div className="grid grid-cols-3 gap-2 pt-4">
                                {parent.parent_images.slice(1, 4).map((img, idx) => (
                                  <div 
                                    key={idx} 
                                    className="relative group/img overflow-hidden rounded-lg cursor-pointer"
                                    onClick={() => openGallery(parent.parent_images, idx + 1)}
                                  >
                                    <img
                                      src={img}
                                      alt={`${parent.parent_name} ${idx + 2}`}
                                      className="aspect-square object-cover transition-transform duration-500 group-hover/img:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <Maximize2 className="w-6 h-6 text-white drop-shadow-lg" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Мать */}
              {mothers.length > 0 && (
                <div>
                  <h2 className="text-3xl font-display font-bold text-primary mb-6 text-center">
                    Самка
                  </h2>
                  <div className="space-y-6">
                    {mothers.map((parent) => (
                      <Card
                        key={parent.id}
                        className="group animate-scale-in overflow-hidden glass-card border-primary/20 shadow-soft hover:shadow-[0_0_60px_rgba(217,179,112,0.6)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md -z-10" />
                        <CardContent className="p-0 relative">
                          {parent.parent_images && parent.parent_images.length > 0 && (
                            <div 
                              className="aspect-[3/4] overflow-hidden relative cursor-pointer"
                              onClick={() => openGallery(parent.parent_images, 0)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                              
                              {/* Breed label with animation */}
                              <div className="absolute top-4 left-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-20px] group-hover:translate-y-0">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground rounded-full shadow-lg backdrop-blur-md border border-white/20 animate-fade-in">
                                  <Crown className="w-4 h-4 animate-pulse" />
                                  <span className="text-sm font-bold uppercase tracking-wider">
                                    {parent.parent_breed}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Maximize2 className="w-12 h-12 text-white drop-shadow-lg" />
                              </div>
                              <img
                                src={parent.parent_images[0]}
                                alt={parent.parent_name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                          )}
                          <div className="p-6 space-y-4 bg-gradient-to-b from-background/80 to-background">
                            <div className="flex items-center gap-2">
                              <Crown className="w-5 h-5 text-primary animate-pulse" />
                              <h3 className="text-2xl font-display font-black text-luxury-gradient luxury-text-shadow">
                                {parent.parent_name}
                              </h3>
                            </div>
                            <p className="text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full inline-block">
                              {parent.parent_breed}
                            </p>
                            {parent.parent_description && (
                              <p className="text-foreground/80 text-sm leading-relaxed">
                                {parent.parent_description}
                              </p>
                            )}
                            {parent.parent_images && parent.parent_images.length > 1 && (
                              <div className="grid grid-cols-3 gap-2 pt-4">
                                {parent.parent_images.slice(1, 4).map((img, idx) => (
                                  <div 
                                    key={idx} 
                                    className="relative group/img overflow-hidden rounded-lg cursor-pointer"
                                    onClick={() => openGallery(parent.parent_images, idx + 1)}
                                  >
                                    <img
                                      src={img}
                                      alt={`${parent.parent_name} ${idx + 2}`}
                                      className="aspect-square object-cover transition-transform duration-500 group-hover/img:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <Maximize2 className="w-6 h-6 text-white drop-shadow-lg" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </ScrollAnimationWrapper>
      </main>

      <Footer />
      <ScrollToTop />

      {/* Fullscreen Gallery */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-primary/20">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setGalleryOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="relative w-full h-[95vh] flex items-center justify-center">
            <img
              src={galleryImages[currentImageIndex]}
              alt={`Изображение ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            {galleryImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white">
                  {currentImageIndex + 1} / {galleryImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pedigree;
