import { HeroSection } from "@/components/HeroSection";
import { NarrativeSection } from "@/components/NarrativeSection";
import { ReflectionSection } from "@/components/ReflectionSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <NarrativeSection />
      <ReflectionSection />
    </div>
  );
};

export default Index;
