import { useState, useEffect, lazy, Suspense, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useTranslations } from "./hooks/useTranslations";
import { useAutoTranslation } from "./hooks/useAutoTranslation";
import { AdminTranslationWrapper } from "./components/AdminTranslationWrapper";

// Lazy load эффектов для улучшения производительности
const GoldenParticles = lazy(() => import("./components/GoldenParticles"));
const InteractiveParticles = lazy(() => import("./components/InteractiveParticles"));
const SparkEffect = lazy(() => import("./components/SparkEffect"));
const GoldShimmer = lazy(() => import("./components/GoldShimmer"));
const MobileFloatingButtons = lazy(() => import("./components/MobileFloatingButtons"));
import Index from "./pages/Index";
import About from "./pages/About";
import Catalog from "./pages/Catalog";
import Breeders from "./pages/Breeders";
import Guide from "./pages/Guide";
import Payment from "./pages/Payment";
import Warranty from "./pages/Warranty";
import Contact from "./pages/Contact";
import AdminCats from "./pages/AdminCats";
import AdminPedigree from "./pages/AdminPedigree";
import AdminImages from "./pages/AdminImages";
import AdminMessages from "./pages/AdminMessages";
import AdminTranslations from "./pages/AdminTranslations";
import Pedigree from "./pages/Pedigree";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import NotFound from "./pages/NotFound";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";

// Оптимизированная конфигурация QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  
  useSmoothScroll();
  useTranslations(); // Загружаем переводы из базы данных
  useAutoTranslation(); // Автоматическая замена текста на переводы

  useEffect(() => {
    // Shorter delay for better perceived performance
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={null}>
        <GoldenParticles />
        <InteractiveParticles />
        <SparkEffect />
        <GoldShimmer />
        <MobileFloatingButtons />
      </Suspense>
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <AdminTranslationWrapper>
          <div 
            className={`transition-opacity duration-1000 ${
              isContentVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/breeders" element={<Breeders />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pedigree/:catId" element={<Pedigree />} />
          <Route path="/admin/cats" element={<AdminCats />} />
          <Route path="/admin/pedigree" element={<AdminPedigree />} />
          <Route path="/admin/images" element={<AdminImages />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/translations" element={<AdminTranslations />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AdminTranslationWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
