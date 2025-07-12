import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { PlantPostsFeed } from "@/components/PlantPostsFeed";
import { ReflectionSection } from "@/components/ReflectionSection";
import { SEOHead, SEOPresets } from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead {...SEOPresets.home} />
      <Header />
      <div className="body-safe-area">
        <HeroSection />
        <div className="container mx-auto px-4 py-12">
          <PlantPostsFeed />
        </div>
        <ReflectionSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
