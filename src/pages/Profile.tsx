import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setEmail(session.user.email || "");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <Navigation />

      <main className="flex-1 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-display font-black text-luxury-gradient luxury-text-shadow">
              Профиль
            </h1>
            <p className="text-lg text-foreground/70">
              Управление аккаунтом
            </p>
          </div>

          <Card className="glass-card border-2 border-primary/30 shadow-glow hover-lift transition-all duration-300">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl font-display font-bold text-luxury-gradient">
                Информация об аккаунте
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </div>
                <div className="glass-card border-2 border-primary/20 bg-muted/30 h-12 px-4 flex items-center rounded-md">
                  {email}
                </div>
                <p className="text-sm text-muted-foreground">Email не может быть изменен</p>
              </div>

              <div className="pt-4">
                <ChangePasswordDialog />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
