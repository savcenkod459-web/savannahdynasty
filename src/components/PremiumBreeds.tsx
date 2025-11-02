import { Crown, Diamond, Sparkles, Star } from "lucide-react";
const breeds = [{
  name: "Саванна F1",
  description: "Отличается экзотической внешностью, высоким интеллектом и энергичным темпераментом. Эти кошки — первые в поколении гибрида с африканским сервалом, сочетающие дикую грацию с преданностью домашнего питомца. Саванна F1 — выбор для тех, кто ищет не просто кошку, а настоящего компаньона с характером.",
  traits: ["Активная", "Умная", "Экзотическая", "Преданная"]
}];
const PremiumBreeds = () => {
  return <section className="py-20 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-10 right-10 opacity-5">
        <Crown className="w-40 h-40 text-primary animate-float" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 micro-interaction">
            <Diamond className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold tracking-widest uppercase text-primary">ЭКСКЛЮЗИВНАЯ КОЛЛЕКЦИЯ</span>
          </div>
          <h2 className="font-display font-black text-5xl md:text-6xl luxury-text-shadow">
            Наши избранные породы
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {breeds.map((breed, index) => <div key={index} className="p-8 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 animate-scale-in hover-lift micro-interaction" style={{
          animationDelay: `${index * 200}ms`
        }}>
              <h3 className="font-display font-black text-3xl mb-4 luxury-text-shadow">{breed.name}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 font-light text-lg">
                {breed.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {breed.traits.map((trait, i) => <span key={i} className="px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 text-foreground rounded-full text-sm font-medium border border-primary/20 micro-interaction">
                    {trait}
                  </span>)}
              </div>
              <div className="mt-6 pt-6 border-t border-primary/10 flex items-center gap-2">
                <Star className="w-4 h-4 text-primary animate-pulse" />
                <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default PremiumBreeds;