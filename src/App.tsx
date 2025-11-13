import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
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
import Pedigree from "./pages/Pedigree";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import NotFound from "./pages/NotFound";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";

const queryClient = new QueryClient();

const App = () => {
  useSmoothScroll();
  
  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
