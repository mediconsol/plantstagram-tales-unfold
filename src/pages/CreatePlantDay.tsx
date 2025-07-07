import { useState } from "react";
import { ArrowLeft, Camera, Heart, Leaf, Sun, Moon, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const timeSlots = [
  { id: "morning", label: "아침 (06:00-10:00)", icon: "🌅", emoji: "☀️" },
  { id: "noon", label: "낮 (10:00-14:00)", icon: "☀️", emoji: "🌞" },
  { id: "afternoon", label: "오후 (14:00-18:00)", icon: "🌤️", emoji: "🌻" },
  { id: "evening", label: "저녁 (18:00-22:00)", icon: "🌆", emoji: "🌙" }
];

const activities = {
  morning: [
    { id: "photosynthesis", label: "광합성하기", emoji: "🌱", description: "햇살을 받으며 에너지 충전" },
    { id: "dewdrops", label: "이슬방울 마시기", emoji: "💧", description: "상큼한 이슬로 수분 보충" },
    { id: "stretching", label: "가지 뻗기", emoji: "🌿", description: "새로운 하루를 위한 스트레칭" }
  ],
  noon: [
    { id: "sunbathing", label: "일광욕", emoji: "☀️", description: "강한 햇살 아래서 광합성 만끽" },
    { id: "bee_meeting", label: "벌 친구 만나기", emoji: "🐝", description: "수분을 도와주는 소중한 친구들" },
    { id: "growing", label: "성장하기", emoji: "📏", description: "조금씩 더 크고 강해지기" }
  ],
  afternoon: [
    { id: "butterfly", label: "나비와 놀기", emoji: "🦋", description: "아름다운 나비들과 함께 춤추기" },
    { id: "shade_rest", label: "그늘에서 휴식", emoji: "🍃", description: "뜨거운 오후, 잠시 쉬어가기" },
    { id: "flower_bloom", label: "꽃 피우기", emoji: "🌸", description: "아름다운 꽃으로 세상을 밝히기" }
  ],
  evening: [
    { id: "sunset", label: "노을 감상", emoji: "🌅", description: "하루를 마무리하는 아름다운 순간" },
    { id: "night_breeze", label: "밤바람 맞기", emoji: "🌬️", description: "시원한 바람으로 하루의 피로 풀기" },
    { id: "star_gazing", label: "별 바라보기", emoji: "⭐", description: "밤하늘의 별들과 조용한 대화" }
  ]
};

const moods = [
  { id: "happy", emoji: "😊", label: "기분 좋음" },
  { id: "peaceful", emoji: "😌", label: "평온함" },
  { id: "excited", emoji: "🤗", label: "설렘" },
  { id: "grateful", emoji: "🙏", label: "감사함" },
  { id: "sleepy", emoji: "😴", label: "졸림" },
  { id: "energetic", emoji: "💪", label: "활기참" }
];

export default function CreatePlantDay() {
  const [selectedActivities, setSelectedActivities] = useState<Record<string, string>>({});
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [hashtags, setHashtags] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  const handleActivitySelect = (timeSlot: string, activityId: string) => {
    setSelectedActivities(prev => ({
      ...prev,
      [timeSlot]: activityId
    }));
  };

  const generatePost = () => {
    const selectedCount = Object.keys(selectedActivities).length;
    if (selectedCount === 0) return;
    
    setStep(3);
  };

  const getSelectedActivity = (timeSlot: string, activityId: string) => {
    return activities[timeSlot as keyof typeof activities]?.find(activity => activity.id === activityId);
  };

  return (
    <div className="min-h-screen bg-gradient-forest">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </Link>
          <h1 className="font-pretendard text-3xl font-bold text-foreground">
            식물의 하루 구성하기 🌱
          </h1>
        </div>

        {step === 1 && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="font-pretendard text-2xl font-semibold text-foreground mb-4">
                오늘 어떤 시간들을 보내셨나요?
              </h2>
              <p className="font-pretendard text-muted-foreground">
                각 시간대별로 가장 의미있었던 활동을 선택해보세요
              </p>
            </div>

            {timeSlots.map((timeSlot) => (
              <Card key={timeSlot.id} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{timeSlot.icon}</span>
                  <h3 className="font-pretendard text-xl font-semibold text-foreground">
                    {timeSlot.label}
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-3">
                  {activities[timeSlot.id as keyof typeof activities]?.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => handleActivitySelect(timeSlot.id, activity.id)}
                      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                        selectedActivities[timeSlot.id] === activity.id
                          ? 'border-primary bg-primary-soft shadow-card'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{activity.emoji}</span>
                        <div>
                          <h4 className="font-pretendard font-medium text-foreground">
                            {activity.label}
                          </h4>
                          <p className="font-pretendard text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            ))}

            <div className="text-center pt-8">
              <Button 
                onClick={() => setStep(2)}
                disabled={Object.keys(selectedActivities).length === 0}
                className="font-pretendard px-8 py-4 text-lg"
              >
                다음 단계로 🌿
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <h2 className="font-pretendard text-2xl font-semibold text-foreground mb-4">
                오늘의 기분과 이야기를 들려주세요
              </h2>
            </div>

            {/* Mood Selection */}
            <Card className="p-6">
              <h3 className="font-pretendard text-lg font-semibold text-foreground mb-4">
                오늘 기분은 어떠셨나요?
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      selectedMood === mood.id
                        ? 'border-primary bg-primary-soft'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-1">{mood.emoji}</span>
                      <span className="font-pretendard text-sm text-foreground">{mood.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Caption */}
            <Card className="p-6">
              <h3 className="font-pretendard text-lg font-semibold text-foreground mb-4">
                오늘 하루 한 줄 일기
              </h3>
              <Textarea
                placeholder="오늘 하루 어떤 특별한 순간이 있었나요? 식물의 마음으로 자유롭게 적어보세요..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-24 font-pretendard"
              />
            </Card>

            {/* Hashtags */}
            <Card className="p-6">
              <h3 className="font-pretendard text-lg font-semibold text-foreground mb-4">
                해시태그 (선택사항)
              </h3>
              <Input
                placeholder="쉼표로 구분해서 입력해주세요 (예: 광합성, 성장, 감사)"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="font-pretendard"
              />
            </Card>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="font-pretendard flex-1"
              >
                이전 단계로
              </Button>
              <Button 
                onClick={generatePost}
                disabled={!selectedMood || !caption.trim()}
                className="font-pretendard flex-1"
              >
                식물 피드 만들기 🌸
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-pretendard text-2xl font-semibold text-foreground mb-4">
                식물의 하루가 완성되었어요! 🎉
              </h2>
            </div>

            {/* Generated Post */}
            <Card className="overflow-hidden shadow-natural">
              {/* Post Header */}
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-gradient-earth rounded-full flex items-center justify-center text-xl">
                  🌱
                </div>
                <div className="flex-1">
                  <h3 className="font-pretendard font-medium text-foreground">나의_식물일기</h3>
                  <p className="text-sm text-muted-foreground font-pretendard">방금 전</p>
                </div>
              </div>

              {/* Activities Summary */}
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.entries(selectedActivities).map(([timeSlot, activityId]) => {
                    const activity = getSelectedActivity(timeSlot, activityId);
                    const time = timeSlots.find(t => t.id === timeSlot);
                    return activity ? (
                      <div key={timeSlot} className="bg-muted/30 rounded-lg p-2 text-center">
                        <span className="text-lg block">{activity.emoji}</span>
                        <span className="font-pretendard text-xs text-muted-foreground">{activity.label}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-4 pb-2">
                <div className="flex items-center gap-4 mb-3">
                  <Heart className="w-6 h-6 text-muted-foreground" />
                  <span className="font-pretendard text-sm text-muted-foreground">좋아요</span>
                </div>
              </div>

              {/* Caption and mood */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{moods.find(m => m.id === selectedMood)?.emoji}</span>
                  <span className="font-pretendard font-medium text-foreground">나의_식물일기</span>
                </div>
                <p className="font-pretendard text-foreground mb-2">{caption}</p>
                {hashtags.trim() && (
                  <div className="flex flex-wrap gap-1">
                    {hashtags.split(',').map((tag, index) => (
                      <span key={index} className="text-primary font-pretendard text-sm">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <div className="flex gap-4 mt-8">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="font-pretendard flex-1"
              >
                다시 만들기
              </Button>
              <Link to="/" className="flex-1">
                <Button className="font-pretendard w-full">
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}