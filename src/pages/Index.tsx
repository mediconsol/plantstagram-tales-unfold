import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PlantPostsFeed } from "@/components/PlantPostsFeed";
import { ReflectionSection } from "@/components/ReflectionSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <PlantPostsFeed />
      </div>
      <ReflectionSection />
    </div>
  );
};

export default Index;
