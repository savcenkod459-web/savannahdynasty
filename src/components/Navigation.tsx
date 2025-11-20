import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Crown, ChevronDown, Star, Diamond, DollarSign, AlertCircle, Cat, Baby, Award, LogOut, Settings, Image, FileText, MessageSquare, User, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutPopoverOpen, setAboutPopoverOpen] = useState(false);
  const [adminPopoverOpen, setAdminPopoverOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const {
          data: roles
        } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
        setIsAdmin(!!roles);
      }
    };
    checkAuth();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(async () => {
          const {
            data: roles
          } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
          setIsAdmin(!!roles);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    await supabase.auth.signOut();
    navigate("/");
  };
  const navItems = [{
    name: t('nav.home'),
    path: "/"
  }, {
    name: t('nav.about'),
    path: "/about",
    hasSubmenu: true
  }, {
    name: t('nav.catalog'),
    path: "/catalog"
  }, {
    name: t('nav.breeders'),
    path: "/breeders"
  }, {
    name: t('nav.guide'),
    path: "/guide"
  }, {
    name: t('nav.payment'),
    path: "/payment"
  }, {
    name: t('nav.warranty'),
    path: "/warranty"
  }, {
    name: t('nav.contact'),
    path: "/contact"
  }];
  const aboutSections = [{
    name: "О наших роскошных кошках",
    hash: "#luxury-cats",
    icon: Crown
  }, {
    name: t("nav.featured_breeds"),
    hash: "#featured-breeds",
    icon: Award
  }, {
    name: "Редкость и Уникальность",
    hash: "#rarity",
    icon: Diamond
  }, {
    name: "Цена",
    hash: "#pricing",
    icon: DollarSign
  }, {
    name: t("nav.important_info"),
    hash: "#important-info",
    icon: AlertCircle
  }, {
    name: t("nav.adult_cats"),
    hash: "#adult-cats",
    icon: Cat
  }, {
    name: t("nav.kittens"),
    hash: "#kittens",
    icon: Baby
  }];
  const handleSectionClick = (hash: string) => {
    setAboutPopoverOpen(false);
    setIsOpen(false);
    navigate(`/about${hash}`);
  };

  const adminSections = [
    { name: "Управление кошками", path: "/admin/cats", icon: Cat },
    { name: "Управление родословными", path: "/admin/pedigree", icon: FileText },
    { name: "Управление изображениями", path: "/admin/images", icon: Image },
    { name: "Управление сообщениями", path: "/admin/messages", icon: MessageSquare },
    { name: "Управление переводами", path: "/admin/translations", icon: Languages }
  ];

  const handleAdminClick = (path: string) => {
    setAdminPopoverOpen(false);
    setIsOpen(false);
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;
  return <nav 
    className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-2xl border-b border-primary/10"
    style={{
      willChange: 'transform',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      WebkitBackdropFilter: 'saturate(180%) blur(32px)',
      backdropFilter: 'saturate(180%) blur(32px)',
    }}
  >
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center space-x-2 group micro-interaction ml-1">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-gold hover:shadow-glow transition-all duration-500 group-hover:rotate-12">
              <Crown className="w-5 h-5 md:w-6 md:h-6 text-luxury-black" />
            </div>
            <h1 className="text-lg md:text-[1.75rem] font-display font-black text-luxury-gradient group-hover:scale-105 transition-transform luxury-text-shadow py-[5px]">SavannahDynasty</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 flex-1 justify-end mr-6">
            {navItems.map(item => {
            if (item.hasSubmenu) {
              return <Popover key={item.path} open={aboutPopoverOpen} onOpenChange={setAboutPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button className={`text-[0.75rem] font-semibold transition-all duration-300 relative group micro-interaction flex items-center gap-1 ${isActive(item.path) ? "text-primary luxury-text-shadow" : "text-foreground/70 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(217,179,112,0.8)]"}`}>
                        {item.name}
                        <ChevronDown className="w-4 h-4" />
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full ${isActive(item.path) ? "w-full shadow-glow" : "w-0 group-hover:w-full"}`} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3 bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-xl border-2 border-primary/20 shadow-glow animate-scale-in">
                      <div className="space-y-1">
                        {aboutSections.map((section, index) => {
                      const IconComponent = section.icon;
                      return <button key={section.hash} onClick={() => handleSectionClick(section.hash)} className="group w-full text-left px-4 py-3 text-sm text-foreground/80 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 rounded-xl transition-all duration-300 micro-interaction flex items-center gap-3 hover:shadow-gold hover:scale-[1.02] animate-fade-in relative overflow-hidden" style={{
                        animationDelay: `${index * 50}ms`
                      }}>
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                                <IconComponent className="w-4 h-4 text-primary group-hover:animate-pulse" />
                              </div>
                              <span className="relative font-medium group-hover:luxury-text-shadow">{section.name}</span>
                              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300 rounded-full" />
                            </button>;
                    })}
                      </div>
                    </PopoverContent>
                  </Popover>;
            }
            return <Link key={item.path} to={item.path} className={`text-[0.75rem] font-semibold transition-all duration-300 relative group micro-interaction ${isActive(item.path) ? "text-primary luxury-text-shadow" : "text-foreground/70 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(217,179,112,0.8)]"}`}>
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full ${isActive(item.path) ? "w-full shadow-glow" : "w-0 group-hover:w-full"}`} />
                </Link>;
          })}
            
            {isAdmin && (
              <Popover open={adminPopoverOpen} onOpenChange={setAdminPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className={`text-[0.75rem] font-semibold transition-all duration-300 relative group micro-interaction flex items-center gap-1 ${location.pathname.startsWith("/admin") ? "text-primary luxury-text-shadow" : "text-foreground/70 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(217,179,112,0.8)]"}`}>
                    ⚙️ Админ
                    <ChevronDown className="w-4 h-4" />
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full ${location.pathname.startsWith("/admin") ? "w-full shadow-glow" : "w-0 group-hover:w-full"}`} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3 bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-xl border-2 border-primary/20 shadow-glow animate-scale-in">
                  <div className="space-y-1">
                    {adminSections.map((section, index) => {
                      const IconComponent = section.icon;
                      return (
                        <button
                          key={section.path}
                          onClick={() => handleAdminClick(section.path)}
                          className="group w-full text-left px-4 py-3 text-sm text-foreground/80 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 rounded-xl transition-all duration-300 micro-interaction flex items-center gap-3 hover:shadow-gold hover:scale-[1.02] animate-fade-in relative overflow-hidden"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                            <IconComponent className="w-4 h-4 text-primary group-hover:animate-pulse" />
                          </div>
                          <span className="relative font-medium group-hover:luxury-text-shadow">{section.name}</span>
                          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300 rounded-full" />
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <div className="hidden md:flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>

            {user ? (
              <div className="flex items-center gap-1">
                <Button 
                  onClick={() => navigate("/profile")} 
                  variant="ghost" 
                  size="icon" 
                  className="micro-interaction h-8 w-8 hover:shadow-gold hover:-translate-y-0.5"
                  title="Профиль"
                >
                  <User className="h-4 w-4" />
                </Button>
                <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="micro-interaction text-[0.75rem] hover:shadow-gold hover:-translate-y-0.5"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      {t("nav.logout")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("auth.logout.confirm.title")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("auth.logout.confirm.description")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("auth.logout.confirm.cancel")}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>
                        {t("auth.logout.confirm.confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="ghost" size="sm" className="micro-interaction text-[0.75rem] hover:shadow-gold hover:-translate-y-0.5">
                {t("auth.signin.button")}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden micro-interaction hover:shadow-gold relative group" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative">
              {isOpen ? (
                <X className="h-6 w-6 text-primary transition-all duration-300 group-hover:rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-all duration-300 group-hover:scale-110" />
              )}
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 animate-slide-down glass-card rounded-2xl border-2 border-primary/20 shadow-glow">
            <ScrollArea className="h-[calc(100vh-140px)] px-4 py-4">
              <div className="space-y-2 pb-4">
                {navItems.map(item => {
              if (item.hasSubmenu) {
                return <div key={item.path} className="space-y-1">
                        <Link to={item.path} onClick={() => setIsOpen(false)} className={`block py-3 px-4 rounded-xl transition-all duration-300 micro-interaction hover:-translate-y-0.5 hover:shadow-gold ${isActive(item.path) ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-gold font-semibold" : "text-foreground/70 hover:bg-primary/10 hover:text-primary"}`}>
                          {item.name}
                        </Link>
                        <div className="ml-4 space-y-2 pl-4 border-l-2 border-gradient-to-b from-primary/40 to-accent/40">
                          {aboutSections.map((section, index) => {
                      const IconComponent = section.icon;
                      return <button key={section.hash} onClick={() => handleSectionClick(section.hash)} className="group flex items-center gap-3 w-full text-left py-2.5 px-3 text-sm text-foreground/60 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 rounded-lg transition-all duration-300 hover:shadow-gold hover:scale-[1.02] animate-fade-in relative overflow-hidden" style={{
                        animationDelay: `${index * 50}ms`
                      }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-all duration-300 group-hover:rotate-12">
                                  <IconComponent className="w-3.5 h-3.5 text-primary group-hover:animate-pulse" />
                                </div>
                                <span className="relative font-medium">{section.name}</span>
                              </button>;
                    })}
                        </div>
                      </div>;
              }
              return <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`block py-3 px-4 rounded-xl transition-all duration-300 micro-interaction hover:-translate-y-0.5 hover:shadow-gold ${isActive(item.path) ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-gold font-semibold" : "text-foreground/70 hover:bg-primary/10 hover:text-primary"}`}>
                      {item.name}
                    </Link>;
            })}
                
                {isAdmin && (
                  <div className="space-y-1">
                    <div className="block py-3 px-4 rounded-xl transition-all duration-300 micro-interaction bg-primary/10 text-primary font-semibold">
                      ⚙️ Админ
                    </div>
                    <div className="ml-4 space-y-2 pl-4 border-l-2 border-gradient-to-b from-primary/40 to-accent/40">
                      {adminSections.map((section, index) => {
                        const IconComponent = section.icon;
                        return (
                          <button
                            key={section.path}
                            onClick={() => handleAdminClick(section.path)}
                            className="group flex items-center gap-3 w-full text-left py-2.5 px-3 text-sm text-foreground/60 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 rounded-lg transition-all duration-300 hover:shadow-gold hover:scale-[1.02] animate-fade-in relative overflow-hidden"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-all duration-300 group-hover:rotate-12">
                              <IconComponent className="w-3.5 h-3.5 text-primary group-hover:animate-pulse" />
                            </div>
                            <span className="relative font-medium">{section.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {user ? (
                  <>
                    <Button 
                      onClick={() => {
                        navigate("/profile");
                        setIsOpen(false);
                      }} 
                      variant="ghost" 
                      className="w-full justify-start micro-interaction hover:shadow-gold hover:-translate-y-0.5"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t("profile.title")}
                    </Button>
                    <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start micro-interaction hover:shadow-gold hover:-translate-y-0.5"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {t("nav.logout")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("auth.logout.confirm.title")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("auth.logout.confirm.description")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("auth.logout.confirm.cancel")}</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLogout}>
                            {t("auth.logout.confirm.confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <Button 
                    onClick={() => {
                      navigate("/auth");
                      setIsOpen(false);
                    }} 
                    variant="ghost" 
                    className="w-full justify-start micro-interaction hover:shadow-gold hover:-translate-y-0.5"
                  >
                    {t("auth.signin.button")}
                  </Button>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </nav>;
};
export default Navigation;