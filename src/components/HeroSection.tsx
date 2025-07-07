import heroForest from "@/assets/hero-forest.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroForest} 
          alt="Peaceful forest landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="space-y-8 animate-fade-in-up">
          {/* Main Emoji */}
          <div className="text-8xl animate-gentle-bounce">🌱</div>
          
          {/* Main Headline */}
          <h1 className="font-pretendard text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            식물도 오늘 하루를<br />
            <span className="text-primary">남기고 싶었대요</span>
          </h1>
          
          {/* Subtitle */}
          <p className="font-pretendard text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            만약 식물이 SNS를 한다면,<br />
            어떤 순간들을 기록하고 싶을까요?
          </p>

          {/* CTA */}
          <div className="pt-8">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-pretendard font-medium px-8 py-4 rounded-full text-lg shadow-natural hover:shadow-glow transition-all duration-300 animate-float">
              식물의 하루 구경하기 🌿
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-gentle-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};