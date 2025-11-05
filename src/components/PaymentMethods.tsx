import { DollarSign, Lock, Landmark, ShieldCheck, EyeOff, Bitcoin, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
const paymentMethods = [{
  icon: Bitcoin,
  title: "Криптовалюта",
  subtitle: "USDT, TON, SOL, ETH",
  features: ["Анонимная оплата", "Низкие комиссии", "Мировая валюта"]
}, {
  icon: Banknote,
  title: "Наличные",
  subtitle: "Курьерская доставка",
  features: ["Оплата при получении", "Личная передача", "Международная доставка"]
}];
const securityFeatures = [{
  icon: Landmark,
  title: "Банковский уровень безопасности",
  description: "256-битное SSL шифрование защищает все транзакции"
}, {
  icon: ShieldCheck,
  title: "Защита данных",
  description: "Данные карт никогда не сохраняются на наших серверах"
}, {
  icon: EyeOff,
  title: "Конфиденциальность",
  description: "Ваши личные данные надежно защищены и никогда не передаются третьим лицам"
}];
const PaymentMethods = () => {
  const navigate = useNavigate();

  return <section className="py-32 bg-secondary/30 relative overflow-hidden">
      {/* Декоративный фон безопасности */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center space-y-6 mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 micro-interaction">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold tracking-widest uppercase text-primary">Защищённые платежи</span>
          </div>
          <h2 className="font-display font-black text-luxury-gradient luxury-text-shadow">
            Безопасные способы оплаты
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Выберите предпочтительный способ оплаты для покупки элитной кошки
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 max-w-4xl mx-auto">
          {paymentMethods.map((method, index) => <div key={index} onClick={() => {
            if (index === 0) {
              navigate("/payment?tab=crypto");
            } else if (index === 1) {
              navigate("/payment?tab=cash");
            }
          }} className={`p-10 glass-card rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500 hover-lift hover-scale animate-scale-in micro-interaction cursor-pointer`} style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500 shadow-soft">
                <method.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-2 luxury-text-shadow">{method.title}</h3>
              <p className="text-muted-foreground mb-6 font-light">{method.subtitle}</p>
              <ul className="space-y-3">
                {method.features.map((feature, i) => <li key={i} className="flex items-center text-sm font-light">
                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {feature}
                  </li>)}
              </ul>
            </div>)}
        </div>

        {/* Security Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => <div key={index} className="text-center p-8 glass-card rounded-2xl animate-fade-in micro-interaction hover:scale-105 transition-all duration-500" style={{
          animationDelay: `${(index + 3) * 100}ms`
        }}>
              <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="mb-3 text-xl font-display font-bold luxury-text-shadow">{feature.title}</h4>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default PaymentMethods;