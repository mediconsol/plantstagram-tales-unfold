export const ReflectionSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-forest">
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-8 animate-fade-in-up">
          {/* Main Question */}
          <div className="space-y-6">
            <div className="text-6xl animate-gentle-bounce">🌱</div>
            <h2 className="font-pretendard text-3xl md:text-5xl font-bold text-foreground leading-tight">
              당신의 하루도<br />
              <span className="text-primary">식물처럼 아름답지 않았나요?</span>
            </h2>
          </div>

          {/* Reflection Text */}
          <div className="space-y-6 max-w-2xl mx-auto">
            <p className="font-pretendard text-lg md:text-xl text-muted-foreground leading-relaxed">
              식물들은 매일 작은 변화와 성장을 기록해요.<br />
              햇살을 받는 순간, 새로운 친구를 만나는 순간,<br />
              조용히 변화하는 순간들을...
            </p>
            
            <p className="font-pretendard text-lg md:text-xl text-foreground leading-relaxed">
              오늘 당신은 어떤 순간을<br />
              기록하고 싶으신가요?
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-pretendard font-medium px-8 py-4 rounded-full text-lg shadow-natural hover:shadow-glow transition-all duration-300">
              나의 하루 기록하기 ✨
            </button>
            <button className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-pretendard font-medium px-8 py-4 rounded-full text-lg transition-all duration-300">
              친구들과 공유하기 🌿
            </button>
          </div>

          {/* Inspirational Quote */}
          <div className="pt-12 max-w-xl mx-auto">
            <blockquote className="font-pretendard text-xl italic text-muted-foreground border-l-4 border-primary pl-6">
              "모든 식물은 자신만의 속도로 자라고,<br />
              자신만의 방식으로 아름다워진다."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};