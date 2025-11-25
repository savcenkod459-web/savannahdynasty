import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Crown, Sparkles, Star, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "./OptimizedImage";

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

interface CatCardProps {
  cat: Cat;
  onCardClick: (cat: Cat) => void;
  animationDelay?: number;
}

const CatCardComponent = ({ cat, onCardClick, animationDelay = 0 }: CatCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={() => onCardClick(cat)}
      className="group animate-scale-in cursor-pointer"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div
        className="relative rounded-3xl overflow-hidden shadow-soft hover:shadow-[0_0_60px_rgba(217,179,112,0.8)] transition-all duration-500 hover:scale-105 hover:-translate-y-3"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
          touchAction: 'manipulation'
        }}
      >
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/40 to-primary/40 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
        <div className="absolute inset-[2px] bg-background/95 backdrop-blur-xl rounded-3xl" />

        {/* Content */}
        <div className="relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl bg-muted border-2 border-primary/60 group-hover:border-primary/80 transition-all duration-500" style={{
            boxShadow: '0 0 30px rgba(217, 179, 112, 0.5), 0 0 50px rgba(217, 179, 112, 0.3), inset 0 0 20px rgba(217, 179, 112, 0.1)',
          }}>
            <OptimizedImage
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              lowQualitySrc={cat.image}
            />

            {/* Gradient overlay on hover */}
            <div className="absolute inset-[2px] bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
            <div className="absolute left-[2px] right-[2px] bottom-[2px] h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
          </div>

          <div className="p-6 space-y-5 py-[30px]">
            <div className="space-y-4">
              <h3 className="text-3xl font-display font-black luxury-text-shadow bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 origin-left leading-tight drop-shadow-[0_0_20px_rgba(217,179,112,0.4)]">
                {cat.name}
              </h3>
              <p className="text-foreground/80 text-base leading-relaxed font-light tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] group-hover:text-foreground transition-colors duration-300">
                {cat.description}
              </p>
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
              {cat.traits.map((trait, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-semibold text-foreground/90 group/trait">
                  <Sparkles className="w-4 h-4 text-primary group-hover/trait:animate-pulse drop-shadow-[0_0_8px_rgba(217,179,112,0.6)]" />
                  <span className="group-hover/trait:text-primary group-hover/trait:drop-shadow-[0_0_8px_rgba(217,179,112,0.4)] transition-all duration-300">
                    {trait}
                  </span>
                </div>
              ))}
            </div>

            {/* Price section */}
            <div className="pt-6 border-t border-gradient-to-r from-transparent via-primary/30 to-transparent py-0">
              <div className="space-y-4 pb-2">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                      Цена
                    </span>
                    <div className="font-display font-black text-luxury-gradient text-5xl leading-none drop-shadow-[0_4px_16px_rgba(217,179,112,0.5)] group-hover:drop-shadow-[0_4px_24px_rgba(217,179,112,0.7)] transition-all duration-300">
                      {cat.price.toLocaleString("en-US")} €
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Star className="h-5 w-5 text-primary animate-pulse drop-shadow-[0_0_12px_rgba(217,179,112,0.8)]" />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/contact');
                      }}
                      className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 group-hover:shadow-[0_0_16px_rgba(217,179,112,0.4)] transition-all duration-300 cursor-pointer"
                    >
                      <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(217,179,112,0.6)]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-8">
                <Link to={`/pedigree/${cat.id}`} onClick={(e) => e.stopPropagation()} className="flex-1">
                  <Button variant="ghost-gold" size="sm" className="w-full py-[20px] hover:-translate-y-1 transition-all duration-300">
                    Родословная
                  </Button>
                </Link>
                <Link to="/payment#booking" onClick={(e) => e.stopPropagation()} className="flex-1">
                  <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(217,179,112,0.7)] hover:-translate-y-1 transition-all duration-300 py-[20px]"
                  >
                    Забронировать
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CatCard = memo(CatCardComponent);
