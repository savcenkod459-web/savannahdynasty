import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { EmailVerificationDialog } from "@/components/EmailVerificationDialog";

const Auth = () => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const getRedirectUrl = (path: string = "/") => {
    const origin = window.location.origin;
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return `${origin}${path}`;
    }
    return origin.replace(/^http:/, "https:") + path;
  };
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate("/");
      }
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (authMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              variant: "destructive",
              title: "Неверные данные для входа",
              description: "Email или пароль неверны. Если вы забыли пароль, нажмите 'Забыли пароль?'"
            });
          } else {
            toast({
              variant: "destructive",
              title: "Ошибка входа",
              description: error.message
            });
          }
          return;
        }
        
        toast({
          title: "Успешный вход",
          description: "Вы успешно вошли в систему"
        });
      } else if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getRedirectUrl("/")
          }
        });
        
        if (error) {
          if (error.message.includes("User already registered") || error.message.includes("user_already_exists")) {
            toast({
              variant: "destructive",
              title: "Пользователь уже существует",
              description: "Этот email уже зарегистрирован. Попробуйте войти вместо регистрации."
            });
            setAuthMode("signin");
          } else if (error.message.includes("weak_password") || error.message.includes("Password")) {
            toast({
              variant: "destructive",
              title: "Слабый пароль",
              description: "Пароль должен содержать минимум 8 символов, включая буквы, цифры и специальные символы. Попробуйте другой пароль."
            });
          } else {
            toast({
              variant: "destructive",
              title: "Ошибка регистрации",
              description: error.message
            });
          }
          return;
        }
        
        // Показываем диалог подтверждения email
        setPendingEmail(email);
        setShowVerification(true);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <Navigation />
      
      <main className="flex-1 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-xl glass-card border-2 border-primary/30 shadow-glow animate-scale-in backdrop-blur-xl">
          <CardHeader className="space-y-3 pb-6 pt-10 px-8">
            <div className="flex justify-center mb-4 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            
            <CardTitle className="text-3xl font-display font-black text-center text-luxury-gradient luxury-text-shadow">
              {authMode === "signup" ? "Создать аккаунт" : "Добро пожаловать"}
            </CardTitle>
            <CardDescription className="text-center text-foreground/70 text-base font-medium">
              {authMode === "signup" ? "Зарегистрируйтесь для доступа" : "Войдите в свой аккаунт"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleEmailAuth} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 px-4 glass-card border-2 border-primary/20 focus:border-primary/50 transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 px-4 glass-card border-2 border-primary/20 focus:border-primary/50 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>

              {authMode === "signin" && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-primary hover:text-primary/80 p-0 h-auto hover-lift"
                    onClick={() => navigate("/reset-password")}
                  >
                    Забыли пароль?
                  </Button>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-glow transition-all duration-300 hover-lift"
                disabled={loading}
              >
                {loading ? "Загрузка..." : authMode === "signin" ? "Войти" : "Зарегистрироваться"}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                className="w-full h-12 text-base font-semibold glass-card border-2 border-primary/30 hover:border-primary text-primary hover:bg-primary/10 transition-all duration-300"
                onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
              >
                {authMode === "signin" ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <EmailVerificationDialog
        email={pendingEmail}
        open={showVerification}
        onOpenChange={setShowVerification}
        onVerified={() => {
          toast({
            title: "Email подтвержден",
            description: "Теперь вы можете войти в систему"
          });
          setAuthMode("signin");
        }}
      />
      
      <Footer />
    </div>
  );
};

export default Auth;
