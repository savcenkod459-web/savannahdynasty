import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Filter, Crown, Sparkles, Diamond, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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
};

const imageMap: Record<string, string> = {
  '/src/assets/savannah-f1-1.jpg': savannah1,
  '/src/assets/savannah-f2-1.jpg': savannah2,
  '/src/assets/savannah-kitten-1.jpg': kitten,
};
const Catalog = () => {
  const [searchParams] = useSearchParams();
  const breedFromUrl = searchParams.get('breed') || 'all';
  
  const [selectedBreed, setSelectedBreed] = useState<string>(breedFromUrl);
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  
  useEffect(() => {
    if (breedFromUrl !== 'all') {
      setSelectedBreed(breedFromUrl);
    }
  }, [breedFromUrl]);

  // Fetch cats from Supabase
  const { data: cats, isLoading, error } = useQuery({
    queryKey: ['cats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return (data as Cat[]).map(cat => ({
        ...cat,
        image: imageMap[cat.image] || cat.image,
      }));
    },
  });

  const allCats = cats || [];

  const filteredCats = allCats.filter(cat => {
    if (selectedBreed !== "all" && cat.breed !== selectedBreed) return false;
    if (selectedAge !== "all" && cat.age !== selectedAge) return false;
    if (selectedGender !== "all" && cat.gender !== selectedGender) return false;
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
                <span className="text-sm font-bold tracking-widest uppercase text-primary">Эксклюзивная коллекция</span>
              </div>
              <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow">
                Наши роскошные кошки
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Откройте для себя идеального кошачьего друга из нашей эксклюзивной коллекции
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-12 border-b glass-effect">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground micro-interaction">
                <Filter className="h-5 w-5 text-primary" />
                <span className="font-bold">Фильтры:</span>
              </div>
              
              <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Порода" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все породы</SelectItem>
                  <SelectItem value="Саванна F1">Саванна F1</SelectItem>
                  <SelectItem value="Саванна F2">Саванна F2</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Возраст" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все возрасты</SelectItem>
                  <SelectItem value="Котёнок">Котёнок</SelectItem>
                  <SelectItem value="Взрослый">Взрослый</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Пол" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="Самец">Самец</SelectItem>
                  <SelectItem value="Самка">Самка</SelectItem>
                </SelectContent>
              </Select>

              {(selectedBreed !== "all" || selectedAge !== "all" || selectedGender !== "all") && <Button variant="ghost" onClick={() => {
              setSelectedBreed("all");
              setSelectedAge("all");
              setSelectedGender("all");
            }}>
                  Сбросить фильтры
                </Button>}
            </div>
          </div>
        </section>

        {/* Catalog Grid */}
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
            ) : filteredCats.length === 0 ? <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  Нет кошек, соответствующих выбранным фильтрам
                </p>
              </div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCats.map((cat, index) => <Link key={cat.id} to={`/catalog/${cat.id}`} className="group animate-scale-in" style={{
              animationDelay: `${index * 100}ms`
            }}>
                    <div className="glass-card rounded-3xl overflow-hidden shadow-soft hover:shadow-glow transition-all duration-500 hover-lift micro-interaction">
                      <div className="relative aspect-[3/4] overflow-hidden image-blur-edges">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <Crown className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        
                        {/* Tags */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                            {cat.breed}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-2xl font-display font-bold mb-2 luxury-text-shadow">{cat.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3 font-light">{cat.description}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground font-light">
                            <span>{cat.age}</span>
                            <span>•</span>
                            <span>{cat.gender}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                          {cat.traits.map((trait, i) => <span key={i} className="px-3 py-1 bg-gradient-to-r from-primary/20 to-accent/20 text-foreground text-xs rounded-full border border-primary/20 font-medium micro-interaction" style={{ wordSpacing: '0.25rem' }}>
                              {trait}
                            </span>)}
                        </div>
                        
                        <div className="pt-4 border-t border-primary/20 flex items-center justify-between">
                          <span className="font-display font-bold text-luxury-gradient text-5xl py-[5px]">
                            {cat.price.toLocaleString("en-US")} €
                          </span>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-primary animate-pulse" />
                            <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-2 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>)}
              </div>}
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>;
};
export default Catalog;