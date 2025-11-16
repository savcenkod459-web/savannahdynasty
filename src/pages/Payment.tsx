import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Copy, Check, Crown, Sparkles, Shield, Star, Plane, FileText, Headphones, HeartPulse, Wallet, Coins, CircleDollarSign, Bitcoin, AlertCircle, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const cryptoAddresses = [{
  name: "USDT (TRC20)",
  address: "TVkjYLi5Yn6XPYA8i5pRRqQdp6741YeGyt",
  icon: CircleDollarSign,
  color: "text-green-500"
}, {
  name: "USDT (BEP20)",
  address: "0xf9316a08cbfad5f5a32dae891d78a5a66e79bd16",
  icon: CircleDollarSign,
  color: "text-green-500"
}, {
  name: "TON (TONCOIN)",
  address: "UQAidQEaiQjljcDDqXBT8sivAC0y_ec1lf_qXR9T1kuEIDRp",
  icon: Coins,
  color: "text-blue-500"
}, {
  name: "SOL (SOLANA)",
  address: "6iNXvjj8uuQx1zFVYHKJGxN5LnstCN9CaUpH2VhUJD9x",
  icon: Star,
  color: "text-purple-500"
}, {
  name: "USDT (ERC20)",
  address: "0xf9316a08cbfad5f5a32dae891d78a5a66e79bd16",
  icon: CircleDollarSign,
  color: "text-green-500"
}];
const Payment = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"crypto" | "cash">("crypto");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "crypto") {
      setActiveTab("crypto");
    } else if (tab === "cash") {
      setActiveTab("cash");
    }
  }, [searchParams]);
  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast({
      title: "Скопировано",
      description: "Адрес скопирован в буфер обмена"
    });
    setTimeout(() => setCopiedAddress(null), 2000);
  };
  return <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
          <div className="absolute top-20 left-10 opacity-5">
            <Crown className="w-32 h-32 text-primary animate-float" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-5">
            <Shield className="w-40 h-40 text-accent animate-float" style={{
            animationDelay: '2s'
          }} />
          </div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 micro-interaction">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold tracking-widest uppercase text-primary">{t('payment.badge')}</span>
              </div>
              <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow">
                {t('payment.title')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Выберите один из множества способов оплаты для покупки элитной кошки
              </p>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section className="py-12 border-b glass-effect">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-12 max-w-4xl mx-auto">
              <div className="text-center space-y-2 glass-card rounded-2xl px-6 py-4 micro-interaction hover-lift">
                <Lock className="h-8 w-8 text-primary mx-auto animate-pulse" />
                <p className="font-bold luxury-text-shadow">SSL-шифрование</p>
                <p className="text-sm text-muted-foreground font-light">Защита данных</p>
              </div>
              <div className="text-center space-y-2 glass-card rounded-2xl px-6 py-4 micro-interaction hover-lift">
                <Shield className="h-8 w-8 text-primary mx-auto animate-pulse" />
                <p className="font-bold luxury-text-shadow">Конфиденциальность</p>
                <p className="text-sm text-muted-foreground font-light">Данные карты не сохраняются</p>
              </div>
              <div className="text-center space-y-2 glass-card rounded-2xl px-6 py-4 micro-interaction hover-lift">
                <Check className="h-8 w-8 text-primary mx-auto animate-pulse" />
                <p className="font-bold luxury-text-shadow">Гарантия</p>
                <p className="text-sm text-muted-foreground font-light">Возврат средств при отказе</p>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Payment Methods */}
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <section className="py-12 md:py-20 px-4 md:px-0">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Tabs */}
              <div className="flex gap-2 md:gap-4 mb-8 border-b justify-center max-w-2xl mx-auto">
                <button onClick={() => setActiveTab("crypto")} className={`flex-1 px-3 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium transition-all rounded-t-lg flex items-center justify-center gap-1 md:gap-2 ${activeTab === "crypto" ? "text-primary border-b-2 border-primary glass-card shadow-soft" : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"}`}>
                  <Bitcoin className="h-4 w-4 md:h-5 md:w-5" />
                  Криптовалюта
                </button>
                <button onClick={() => setActiveTab("cash")} className={`flex-1 px-3 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium transition-all rounded-t-lg flex items-center justify-center gap-1 md:gap-2 ${activeTab === "cash" ? "text-primary border-b-2 border-primary glass-card shadow-soft" : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"}`}>
                  <Banknote className="h-4 w-4 md:h-5 md:w-5" />
                  Наличные
                </button>
              </div>

              {/* Crypto */}
              {activeTab === "crypto" && <div className="space-y-6 animate-fade-in">
                  {cryptoAddresses.map((crypto, index) => <div key={index} className="p-6 bg-card rounded-3xl shadow-soft ring-2 ring-primary/30 hover:ring-primary/50 hover:shadow-[0_0_40px_rgba(217,179,112,0.4)] transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                          <crypto.icon className={`h-6 w-6 ${crypto.color}`} />
                        </div>
                        <h4 className="text-xl font-bold">{crypto.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <Input value={crypto.address} readOnly className="font-mono text-sm" />
                        <Button size="icon" variant="outline" onClick={() => copyToClipboard(crypto.address)}>
                          {copiedAddress === crypto.address ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>)}
                  
                  <div className="p-6 rounded-2xl bg-amber-300">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-zinc-950 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-zinc-950">
                        <strong>Важно:</strong> {t('payment.crypto_note')}
                      </p>
                    </div>
                  </div>
                </div>}

              {/* Cash */}
              {activeTab === "cash" && <div className="p-10 bg-card rounded-3xl shadow-soft animate-fade-in ring-2 ring-primary/30 hover:ring-primary/50 hover:shadow-[0_0_40px_rgba(217,179,112,0.4)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <Banknote className="w-8 h-8 text-primary" />
                    <h3 className="text-3xl font-display font-bold luxury-text-shadow">Наличные</h3>
                  </div>
                  
                  <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                    <p>
                      Для международных покупателей мы предлагаем доставку котят лично в руки через профессионального курьера.
                    </p>
                    
                    <div className="flex items-start gap-3 p-4 glass-card rounded-xl">
                      <Plane className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p>
                        Курьер сопровождает котёнка в салоне самолёта, контролирует весь путь и передаёт животное новому владельцу лично в аэропорту прибытия.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 glass-card rounded-xl">
                      <Wallet className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p>
                        Оплата происходит при получении. Предоплата вносится заранее для бронирования котёнка.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 glass-card rounded-xl">
                      <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p>
                        Такой способ гарантирует безопасность, спокойствие животного и комфортное сотрудничество между питомником и новыми владельцами.
                      </p>
                    </div>
                  </div>
                </div>}
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Booking Section */}
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <section id="booking" className="py-20 border-t glass-effect scroll-mt-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="p-10 rounded-3xl shadow-soft bg-stone-100 ring-2 ring-primary/30 hover:ring-primary/50 hover:shadow-[0_0_40px_rgba(217,179,112,0.4)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="w-8 h-8 text-primary" />
                  <h3 className="text-3xl font-display font-bold luxury-text-shadow">Бронирование</h3>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-lg text-muted-foreground">
                    Чтобы узнать детали - свяжитесь с нами
                  </p>
                  
                  <Button size="lg" onClick={() => navigate('/contact')} className="whitespace-nowrap relative overflow-hidden group/btn hover:shadow-[0_0_60px_rgba(217,179,112,0.8),_0_0_100px_rgba(217,179,112,0.6)] hover:-translate-y-1 hover:scale-105 transition-all duration-700 ease-out hover:brightness-110 before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/0 before:via-primary/30 before:to-primary/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000">
                    <span className="relative z-10">Связаться с нами</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>

        {/* Support Section */}
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-black text-4xl text-center mb-12">
                Поддержка и гарантии
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Headphones className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <h4 className="font-bold luxury-text-shadow">Служба поддержки</h4>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">24/7 через наши контакты</p>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <HeartPulse className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <h4 className="font-bold luxury-text-shadow">Гарантия здоровья</h4>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    7 дней с момента покупки
                  </p>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileText className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <h4 className="font-bold luxury-text-shadow">Документы</h4>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    Родословная, ветпаспорт
                  </p>
                </div>
                <div className="p-6 glass-card rounded-2xl hover-lift micro-interaction group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Plane className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <h4 className="font-bold luxury-text-shadow">Доставка</h4>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    По многим странам мира с документами
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimationWrapper>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>;
};
export default Payment;