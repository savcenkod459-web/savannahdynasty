import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Clock } from "lucide-react";

const UpdatePassword = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите email адрес"
      });
      return;
    }

    setResendLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("send-reset-code", {
        body: { email }
      });
      
      if (error) throw error;
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      setResendTimer(60); // 1 minute timer
      toast({
        title: "Код отправлен повторно",
        description: "Проверьте почту для получения нового кода"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !code) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите email и код подтверждения"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пароли не совпадают"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пароль должен быть не менее 8 символов"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("verify-reset-code", {
        body: { 
          email,
          code,
          newPassword 
        }
      });
      
      if (error) throw error;
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      toast({
        title: "Пароль успешно изменен",
        description: "Теперь вы можете войти с новым паролем"
      });
      
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Произошла ошибка при обновлении пароля"
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
              Подтверждение сброса
            </CardTitle>
            <CardDescription className="text-center text-foreground/70 text-base font-medium">
              Введите код из письма и новый пароль
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleUpdatePassword} className="space-y-6">
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
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="code" className="text-sm font-semibold text-foreground/80">
                  Код подтверждения
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  maxLength={6}
                  className="h-12 px-4 glass-card border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Введите 6-значный код из письма
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="new-password" className="text-sm font-semibold text-foreground/80">
                  Новый пароль
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 px-4 glass-card border-2 border-primary/20 focus:border-primary/50 transition-all duration-300"
                  placeholder="Введите новый пароль"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="confirm-password" className="text-sm font-semibold text-foreground/80">
                  Подтвердите пароль
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 px-4 glass-card border-2 border-primary/20 focus:border-primary/50 transition-all duration-300"
                  placeholder="Повторите новый пароль"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Обновление..." : "Изменить пароль"}
              </Button>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-sm hover:bg-secondary/50 hover:text-foreground transition-all duration-300"
                  onClick={handleResendCode}
                  disabled={resendLoading || !email || resendTimer > 0}
                >
                  {resendTimer > 0 ? (
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Подождите {resendTimer}с
                    </span>
                  ) : resendLoading ? (
                    "Отправка..."
                  ) : (
                    "Отправить код повторно"
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 text-sm hover:bg-secondary/50 hover:text-foreground transition-all duration-300"
                  onClick={() => navigate("/reset-password")}
                >
                  Назад
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default UpdatePassword;
