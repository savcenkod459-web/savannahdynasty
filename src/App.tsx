import { useState, useEffect, lazy, Suspense, startTransition } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useTranslations } from "./hooks/useTranslations";
import { useAutoTranslation } from "./hooks/useAutoTranslation";
import { AdminTranslationWrapper } from "./components/AdminTranslationWrapper";
import { PageLoader } from "./components/PageTransition";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";
import Preloader from "./components/Preloader";

// Lazy load эффектов для улучшения производительности
const GoldenParticles = lazy(() => import("./components/GoldenParticles"));
const InteractiveParticles = lazy(() => import("./components/InteractiveParticles"));
const SparkEffect = lazy(() => import("./components/SparkEffect"));
const GoldShimmer = lazy(() => import("./components/GoldShimmer"));
const PageLoadWave = lazy(() => import("./components/PageLoadWave"));
const MobileFloatingButtons = lazy(() => import("./components/MobileFloatingButtons"));

// Lazy load страниц для code splitting и улучшения производительности
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Breeders = lazy(() => import("./pages/Breeders"));
const Guide = lazy(() => import("./pages/Guide"));
const Payment = lazy(() => import("./pages/Payment"));
const Warranty = lazy(() => import("./pages/Warranty"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminCats = lazy(() => import("./pages/AdminCats"));
const AdminPedigree = lazy(() => import("./pages/AdminPedigree"));
const AdminImages = lazy(() => import("./pages/AdminImages"));
const AdminMessages = lazy(() => import("./pages/AdminMessages"));
const AdminTranslations = lazy(() => import("./pages/AdminTranslations"));
const Pedigree = lazy(() => import("./pages/Pedigree"));
const Profile = lazy(() => import("./pages/Profile"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Оптимизированная конфигурация QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      networkMode: 'offlineFirst', // Используем кэш первым
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});

const App = () => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  
  useSmoothScroll();
  useTranslations(); // Загружаем переводы из базы данных
  useAutoTranslation(); // Автоматическая замена текста на переводы

  useEffect(() => {
    // Быстрая загрузка для лучшей воспринимаемой производительности
    const timer = setTimeout(() => {
      startTransition(() => {
        setIsContentVisible(true);
      });
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Preloader />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Suspense fallback={null}>
          <GoldenParticles />
          <InteractiveParticles />
          <SparkEffect />
          <GoldShimmer />
          <PageLoadWave />
          <MobileFloatingButtons />
        </Suspense>
        <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <AdminTranslationWrapper>
          <div 
            className={`transition-opacity duration-500 ease-out ${
              isContentVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'opacity' }}
          >
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </div>
        </AdminTranslationWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
