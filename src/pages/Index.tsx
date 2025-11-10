import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import PremiumBreeds from "@/components/PremiumBreeds";
import RaritySection from "@/components/RaritySection";
import PricingSection from "@/components/PricingSection";
import FeaturedCollection from "@/components/FeaturedCollection";
import PaymentMethods from "@/components/PaymentMethods";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <WhyChooseUs />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <PremiumBreeds />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <FeaturedCollection />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <RaritySection />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <PricingSection />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper animation="fade" delay={150}>
          <PaymentMethods />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper animation="fade" delay={100}>
          <FinalCTA />
        </ScrollAnimationWrapper>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
